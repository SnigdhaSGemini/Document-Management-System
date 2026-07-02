import { Document } from "../models/documentSchema.js";
import { DocumentVersion } from "../models/documentVersionSchema.js";
import { Comment } from "../models/commentSchema.js";
import { AuditLog } from "../models/auditLogSchema.js";
import { Counter } from "../models/counterSchema.js";
import mongoose from "mongoose";
import { Timeline } from "../models/timelineSchema.js";
import { Notifications } from "../models/notificationsSchema.js";
import { User } from "../models/userSchema.js";
class DocumentService {

  async createsDocument(body, currentUser){
    try{
    const counter = await Counter.findOneAndUpdate(
            { name: "documentId" },
            { $inc: { counter: 1 }, },
            { new: true, upsert: true }
          );
        console.log(counter, counter.counter, currentUser," : counter");
        const documentId= `DR-${counter.counter}`;
        const apiBody = {owner: currentUser._doc.name, ownerId: currentUser._doc.userId, draftNo: documentId, ...body}
    const document = await Document.create(apiBody);
    console.info('Document created successfully.', { title: document.title });

    const auditLogBody = {
      action: 'CREATE_DOCUMENT',
      userId: document.ownerId,
      documentId: document._id,
      metadata: `Document created with title: ${document.title}`
    };

    await AuditLog.create(auditLogBody);
    console.info('Audit logs added for create document.');

    const timelineBody = {
      status: "draft",
      user: document.owner,
      userId: document.ownerId,
      documentId: document._id,
      reviewer: null,
      reviewerId: null
    };

    await Timeline.create(timelineBody);
    console.info('Timeline added for create document.');

    const notificationsBody = {
      userId: currentUser._doc._id,
      message: `Document created as Draft with title: "${document.title}".`,
      read: false
    };

    await Notifications.create(notificationsBody);
    console.info('Notification added for create document.');

    if(body.status === "submitted"){
       const auditLogBody = {
        action: 'SUBMIT_DOCUMENT',
        userId: document.ownerId,
        documentId: document._id,
        metadata: `Document submitted with title: ${document.title}`
      };

      await AuditLog.create(auditLogBody);
      console.info('Audit logs added for submit document.');

    const timelineBody = {
      status: "submitted",
      user: document.owner,
      userId: document.ownerId,
      documentId: document._id,
      reviewer: null,
      reviewerId: null
    };

    await Timeline.create(timelineBody);
    console.info('Timeline added for submit document.');

    const notificationsBody = {
      userId: currentUser._doc._id,
      message: `Document with title: "${document.title}", submitted for review.`,
      read: false
    };

    await Notifications.create(notificationsBody);
    console.info('Notification added for submit document.');

    // send notification to all admins to assign reviewer
    const admins = await User.find({ role: "admin" }).select("_id");
    const notifications = admins.map((admin) => ({
      userId: admin._id,
      message: `Document "${document.title}" submitted for review. Please assign a reviewer.`,
      read: false
    }));

    await Notifications.insertMany(notifications);

    console.info("Notifications sent to all admins.");
    }

    return {success: true, ownerId: document.ownerId, owner: document.owner ,title: document.title };
  } 
  catch(err){
    console.log("Error while running document creation service", err);
    return {success: false, message: err.message || "Create Document Service Failed."};
  }
  }
  async getsDocument(documentId){
    try{
    const document = await Document.findById(documentId).select('-_id');

    if (!document) {
      return { success: false, message: "Document not found" };
    }

    console.info('Document fetched successfully.', { title: document.title });
    return {success: true, message: "Document fetched successfully.", data: document.toObject() };
  } 
  catch(err){
    console.log("Error while running get document service", err);
    return {success: false, message: err.message || "Get Document Service Failed."};
  }
  }

async getsAllDocuments(body, currentUser) {
  try {
    
const {
      startDate,
      endDate,
      search,
      status,
      reviewer,
      owner,
      sortField,
      sortOrder,
      page = 1,
      limit = 5,
      type
    } = body;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let roleFilter = {};

    if (currentUser._doc.role === "user") {
      roleFilter = {
        ownerId: currentUser._doc.userId,
      };
    }

    if (currentUser._doc.role === "reviewer") {
      roleFilter = {
        reviewerId: currentUser._doc.userId,
      };
    }

    if (type === "dashboard") {

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);

      const [
        totalDocuments,
        recentlyAdded,
        approved,
        rejected,
        pendingReviews,
        assignedDrafts,
        reviewedDocuments,
        statusCounts
      ] = await Promise.all([

        // 1. Total Documents
        Document.countDocuments({ ...dateFilter, ...roleFilter }),

        // 2. Recently Added
        Document.countDocuments({
          createdAt: { $gte: startOfWeek },
          ...roleFilter
        }),

        // 3. Approved
        Document.countDocuments({
            status: { $in: ["approved", "archived"] },
          ...dateFilter,
          ...roleFilter
        }),

        // 4. Rejected
        Document.countDocuments({
          status: "rejected",
          ...dateFilter,
          ...roleFilter
        }),

        // 5. Pending Reviews
        Document.countDocuments({
          status: "submitted",
          ...dateFilter,
          ...roleFilter
        }),

        // 6. Assigned Drafts
       Document.countDocuments({
          ...(currentUser._doc.role === "reviewer"
            ? { reviewerId: currentUser._doc.userId }
            : { reviewer: { $ne: null } }),
          status: "submitted",
          ...dateFilter
        }),

        // 7. Reviewed Documents
        Document.countDocuments({
          reviewerId: currentUser._doc.userId,
          status: { $in: ["approved", "rejected", "archived"] },
          ...dateFilter
        }), 
        Document.aggregate([
              { $match: { ...dateFilter, ...roleFilter } },
              {
                $group: {
                  _id: "$status",
                  count: { $sum: 1 }
                }
              }
            ])
                
      ]);

    // 9. Status Chart
    
    const statusChart = {
        approved: 0,
        archived: 0,
        draft: 0,
        submitted: 0,
        rejected: 0
      };

      statusCounts.forEach(item => {
        statusChart[item._id] = item.count;
      });

      let groupFormat = "%Y-%m-%d"; // default = day
      let labelFormat = "day";

      if (startDate && endDate) {
        const diffDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

        if (diffDays > 180) {
          groupFormat = "%Y-%m"; // month
          labelFormat = "month";
        } else if (diffDays > 95) {
          groupFormat = "%Y-%U"; // week number
          labelFormat = "week";
        }
      }

      const [createdData, approvedData, rejectedData] = await Promise.all([

        // CREATED
        Document.aggregate([
          { $match: { ...dateFilter, ...roleFilter } },
          {
            $group: {
              _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
              count: { $sum: 1 }
            }
          }
        ]),

        // APPROVED
        Document.aggregate([
          {
            $match: {
              status: { $in: ["approved", "archived"] },
              ...roleFilter,
              ...(startDate && endDate && {
                updatedAt: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate),
                }
              })
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: groupFormat, date: "$updatedAt" } },
              count: { $sum: 1 }
            }
          }
        ]),

        // REJECTED
        Document.aggregate([
          {
            $match: {
              status: "rejected",
              ...roleFilter,
              ...(startDate && endDate && {
                updatedAt: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate),
                }
              })
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: groupFormat, date: "$updatedAt" } },
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const graphMap = {};

      createdData.forEach(item => {
        if (!graphMap[item._id]) {
          graphMap[item._id] = { date: item._id, created: 0, approved: 0, rejected: 0 };
        }
        graphMap[item._id].created = item.count;
      });

      approvedData.forEach(item => {
        if (!graphMap[item._id]) {
          graphMap[item._id] = { date: item._id, created: 0, approved: 0, rejected: 0 };
        }
        graphMap[item._id].approved = item.count;
      });

      rejectedData.forEach(item => {
        if (!graphMap[item._id]) {
          graphMap[item._id] = { date: item._id, created: 0, approved: 0, rejected: 0 };
        }
        graphMap[item._id].rejected = item.count;
      });

      const documentsTimeGraph = Object.values(graphMap).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      return {
        success: true,
        message: "Dashboard data fetched successfully",
        data: {
          totalDocuments,
          recentlyAdded,
          approved,
          rejected,
          pendingReviews,
          assignedDrafts,
          reviewedDocuments,
          statusChart,
          documentsTimeGraph
        }
      };
    }

    let filter = {};

    // Date filter
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

   //status filter
    let statusArray = [];

    if (type === "submitted" || type === "assigned") {
      statusArray = ["submitted"];
    } else if (type === "reviewed" || type === "review") {
      statusArray = ["approved", "rejected", "archived"];
    }

    if (status) {
        statusArray = [status];
    }

    if (statusArray.length) {
      filter.status = { $in: statusArray };
    }


    // Reviewer filter
    if (reviewer) {
      filter.reviewer = reviewer;
    }

    if (owner) {
      filter.owner = owner;
    }

    // search filter (title OR draft number)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { draftNo: { $regex: search, $options: "i" } }
      ];
    }

    // Sorting
    let sort = { createdAt: -1 }; 

    if (sortField && sortOrder) {
      sort = {
        [sortField]: sortOrder === "asc" ? 1 : -1
      };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch data + count in parallel
    const [res, countRes] = await Promise.all([
      Document.find({...filter, ...roleFilter})
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),

      Document.countDocuments(filter)
    ]);

    return {
      success: true,
      message: "Documents fetched successfully",
      data: res,
      count: countRes
    };

  } catch (err) {
    console.log("Error while running get all documents service", err);
    return {
      success: false,
      message: err.message || "Get All Documents Service Failed."
    };
  }
}

  async updatesDocument(documentId, body){
    try{
    const oldDocument = await Document.findById(documentId);
    let content = {};
    if(body.title && oldDocument.title !== body.title) content.title = body.title;
    if(body.content && oldDocument.content !== body.content) content.content = body.content;

    if (oldDocument.status === "rejected") {content.status = "draft"; content.reviewer = null; content.reviewerId = null;
      const notificationsBody = {
      userId: oldDocument._id,
      message: `Document updated! Status changed from "Rejected" to "Draft".`,
      read: false
    };

    await Notifications.create(notificationsBody);
    console.info('Notification added for edit document.');
    }

      const auditBody = {
      action: 'UPDATE_DOCUMENT',
      userId: oldDocument.ownerId,
      documentId,
      metadata: `Document status changed from Rejected to Draft`
    };
    await AuditLog.create(auditBody);
    console.info('Audit logs added for update document.');

    
    
    if(Object.keys(content).length !== 0){

      const document = await Document.findByIdAndUpdate(documentId, {...content, $inc: { currentVersion: 1 }},{new: true}).select("-_id");

    if (!document) {
      return { success: false, message: "Document not found" };
    }

    console.info('Document updated successfully.', { title: document.title });

    const auditLogBody = {
      action: 'UPDATE_DOCUMENT',
      userId: document.ownerId,
      documentId,
      metadata: `${(content.title && `Title Changed from ${oldDocument.title} to ${content.title}. `) || (content.content && `Document Content Updated.`) }`
    };
    await AuditLog.create(auditLogBody);
    console.info('Audit logs added for update document.');

    const notificationsBody = {
      userId: oldDocument._id,
      message: `${(content.title && `Title of document with no. "${oldDocument.draftNo}" Changed from ${oldDocument.title} to ${content.title}. `) || (content.content && `Content of document with no. "${oldDocument.draftNo}" is updated.`) }`,
      read: false
    };

    await Notifications.create(notificationsBody);
    console.info('Notification added for edit document.');

    if(!content.title) content.title = oldDocument.title;
    if(!content.content) content.content = oldDocument.content;
    await DocumentVersion.create({...content, documentId, version: document.currentVersion});

    return {success: true, message: "Document updated successfully.", data: document.toObject() };
    }
    else return {success: false, message: "No data is changed from previous version, please make required updates."}
  } 
  catch(err){
    console.log("Error while running update document service", err);
    return {success: false, message: err.message || "Update Document Service Failed."};
  }
  }

  async documentsComment(body){
    try{

      console.log("inside add comment service: ", body);
      const comment = await Comment.create(body);
      const data = comment.toObject();
      delete data._id;
      console.info('Comment Added successfully by userId: ', { title: comment.userId });

      const documentDetails = await Document.findById(comment.documentId);

      const auditLogBody = {
      action: 'ADD_COMMENT',
      userId: comment.userId,
      documentId: comment.documentId,
      metadata: ` ${documentDetails.owner} added comment on document: ${documentDetails.title}`
    };

    await AuditLog.create(auditLogBody);
    console.info('Audit logs added for add comment.');

    const userId = await User.findOne({userId: documentDetails.ownerId}).select('_id');
    const creator = documentDetails.ownerId === comment.userId ? documentDetails.owner : documentDetails.reviewer;

    const notificationsBody = {
      userId: userId,
      message: `Comment added to document with title : "${documentDetails.title}" by ${creator}`,
      read: false
    };
    await Notifications.create(notificationsBody);

    if(documentDetails.reviewer) {
       const reviewerId =  await User.findOne({userId: documentDetails.reviewerId}).select('_id');

    const notificationBody = {
      userId: reviewerId,
      message: `Comment added to document with title : "${documentDetails.title}" by ${creator}`,
      read: false
    };
    await Notifications.create(notificationBody);
    }
    console.info('Notification added for add comment in document.');

    return {success: true, message: "Comment added successfully.", data };
  } 
  catch(err){
    console.log("Error while running add comment service", err);
    return {success: false, message: err.message || "Add Comment Service Failed."};
  }
  }

  async getsAllComments(documentId){
    try{
    const comments = await Comment.find({ documentId }).sort({ createdAt: -1 });

    if (!comments) {
      return { success: false, message: "No comments found for this document." };
    }

    console.info('All comments for document fetched successfully.');
    return {success: true, message: "All comments for document fetched successfully.", data: comments };
  } 
  catch(err){
    console.log("Error while running get all comments service", err);
    return {success: false, message: err.message || "Get All Comments Service Failed."};
  }
  }

  async getsAuditLogs(documentId){
    try{
    const auditLogs = await AuditLog.aggregate([{ $match: { documentId: new mongoose.Types.ObjectId(documentId)}},
                        {
                          $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "userId",
                            as: "user"
                          }
                        },
                        {$unwind: "$user"},
                        { $sort: { createdAt: -1 }}]);

    if (!auditLogs) {
      return { success: false, message: "No audit logs found for this document." };
    }

    console.info('All audit logs for document fetched successfully.');
    return {success: true, message: "All audit logs for document fetched successfully.", data: auditLogs };
  } 
  catch(err){
    console.log("Error while running get all audit logs service", err);
    return {success: false, message: err.message || "Get All Audit logs Service Failed."};
  }
  }

    async deletesDocument(documentId, currentUser){
    try{
    
    const document = await Document.findByIdAndDelete(documentId);

        if (!document) {
          return {
            success: false,
            message: "Document not found"
          };
        }


    const auditLogBody = {
      action: 'DELETE_DOCUMENT',
      userId: document.ownerId,
      documentId,
      metadata: `${`Document "${document.title}" deleted.`}`
    };
    await AuditLog.create(auditLogBody);
    console.info('Audit logs added for delete document.');

    const notificationsBody = {
      userId: currentUser._doc._id,
      message: `Document with title "${document.title}" is deleted.`,
      read: false
    };

    await Notifications.create(notificationsBody);
    console.info('Notification added for delete document.');

    return {success: true, message: "Document deleted successfully.", data: document.toObject() };
  } 
  catch(err){
    console.log("Error while running delete document service", err);
    return {success: false, message: err.message || "Delete Document Service Failed."};
  }
  }

    async getDocumentsVersions(documentId){
      try{
      
        const versions = await DocumentVersion.find({documentId: new mongoose.Types.ObjectId(documentId)}).sort({ version: -1 }); 

    return {
      success: true,
      message: "Versions fetched successfully",
      data: versions
    };
    } 
    catch(err){
      console.log("Error while running get document versions service", err);
      return {success: false, message: err.message || "Get Document Versions Service Failed."};
    }
  }

  async changeReviewer(body){
      try{
      const document = await Document.findById(body.id);

      if (!document) {
        return {
          success: false,
          message: "Document not found"
        };
      }

      const oldReviewer = document.reviewer;
      const payload = {...body, status: "submitted"};

      const response = await Document.findByIdAndUpdate({_id: body.id}, payload,{new: true });

      await AuditLog.create({
        action: oldReviewer !== null ? "REASSIGN_DOCUMENT" : "ASSIGN_DOCUMENT",
        userId: document.ownerId,
        documentId: document._id,
        metadata: `Reviewer changed from "${oldReviewer}" to "${body.reviewer}"`
      });

    const timelineBody = {
      status: oldReviewer !== null ? "reassigned" : "assigned",
      user: document.owner,
      userId: document.ownerId,
      documentId: document._id,
      reviewer: body.reviewer,
      reviewerId: body.reviewerId
    };

    await Timeline.create(timelineBody);
    console.info('Timeline added for change reviewer.');
    const userId = await User.findOne({userId: response.ownerId}).select('_id');
    const reviewerId =  await User.findOne({userId: response.reviewerId}).select('_id');

    const notificationsBody = {
      userId: userId,
      message: `Reviewer for document with title "${document.title}" is changed ${document.reviewer && `from ${document.reviewer}`} to ${response.reviewer}.`,
      read: false
    };

   if(reviewerId){
     const notificationBody = {
      userId: reviewerId,
      message: `Document with title: "${document.title}" is assigned to you.`,
      read: false
    };
    await Notifications.create(notificationBody);
   }

    await Notifications.create(notificationsBody);
    console.info('Notification added for submit document.');

    const admins = await User.find({ role: "admin" }).select("_id");
    const notifications = admins.map((admin) => ({
      userId: admin._id,
      message: `Document "${document.title}" is ${oldReviewer ? `re-assigned to "${response.reviewer}" from "${document.reviewer}".` : `assigned to reviewer : "${response.reviewer}".`}`,
      read: false
    }));

    await Notifications.insertMany(notifications);

    console.info("Notifications sent to all admins.");

    if(oldReviewer){
      const oldreviewerId =  await User.findOne({userId: document.reviewerId}).select('_id');

      const notiBody = {
      userId: oldreviewerId,
      message: `Document with title: "${document.title}" is re-assigned to "${response.reviewer}".`,
      read: false
    };

    await Notifications.create(notiBody);
    }


    return {
      success: true,
      message: "Reviewer changed successfully",
      data: response
    };
    } 
    catch(err){
      console.log("Error while running change reviewer service", err);
      return {success: false, message: err.message || "Change Reviewer Service Failed."};
    }
  }

    async submitDocument(id, body){
      try{
      const document = await Document.findById(id);

      if (!document) {
        return {
          success: false,
          message: "Document not found"
        };
      }
      const payload = {status: body.status};

      const response = await Document.findByIdAndUpdate({_id: id}, payload,{new: true });

      const auditLogBody = {
        action: body.status === "submitted" ? 'SUBMIT_DOCUMENT' : body.status === "archived" ? 'ARCHIVE_DOCUMENT': body.status === "approved" ? 'APPROVE_DOCUMENT' : body.status === "rejected" && 'REJECT_DOCUMENT',
        userId: response.ownerId,
        documentId: response._id,
        metadata: `Document ${body.status} with title: ${response.title}`
      };

      await AuditLog.create(auditLogBody);
      console.info('Audit logs added for submit document.');

    const timelineBody = {
      status: body.status,
      user: response.owner,
      userId: response.ownerId,
      documentId: response._id,
      reviewer: null,
      reviewerId: null
    };

    await Timeline.create(timelineBody);
    console.info('Timeline added for submit document.');

    const userId =  await User.findOne({userId: response.ownerId}).select('_id');

     const notificationBody = {
      userId: userId,
      message: `Document with title: "${document.title}", is ${body.status}.`,
      read: false
    };
    await Notifications.create(notificationBody);

    if(body.status === "submitted"){
    const admins = await User.find({ role: "admin" }).select("_id");
    const notifications = admins.map((admin) => ({
      userId: admin._id,
      message: `Document "${document.title}" submitted for review. Please assign a reviewer.`,
      read: false
    }));

    await Notifications.insertMany(notifications);

    console.info("Notifications sent to all admins.");
    }

    else if(body.status === "archived"){
      const reviewerId =  await User.findOne({userId: document.reviewerId}).select('_id');

      const notificationsBody = {
      userId: reviewerId,
      message: `Document with title: "${document.title}" is archived by admin.`,
      read: false
    };

    await Notifications.create(notificationsBody);
    }

    return {
      success: true,
      message: `document ${body.status} successfully`,
      data: response
    };
    } 
    catch(err){
      console.log("Error while running submit doc service", err);
      return {success: false, message: err.message || "Submit Doc Service Failed."};
    }
  }

    async getsTimeline(documentId){
      try{
      const timeline = await Timeline.find({ documentId }).sort({ createdAt: 1 });

      if (!timeline) {
        return { success: false, message: "No timeline found for this document." };
      }

      console.info('All timeline for document fetched successfully.');
      return {success: true, message: "All timeline for document fetched successfully.", data: timeline };
    } 
    catch(err){
      console.log("Error while running get all timeline service", err);
      return {success: false, message: err.message || "Get All Timeline Service Failed."};
    }
    }

    async getsNotifications(currentUser){
      try{
      const notifications = await Notifications.find({ userId: currentUser._doc._id }).sort({ createdAt: 1 });

      if (!notifications.length) {
        return { success: false, message: "No notifications found for this document." };
      }

      console.info('All notifications for document fetched successfully.');
      return {success: true, message: "All notifications for document fetched successfully.", data: notifications };
    } 
    catch(err){
      console.log("Error while running get all notifications service", err);
      return {success: false, message: err.message || "Get All Notifications Service Failed."};
    }
    }

    async setReadNotifications(currentUser){
      try{
      const notifications = await Notifications.updateMany({ userId: currentUser._doc._id }, {read: true}).sort({ createdAt: 1 });

      if (!notifications) {
        return { success: false, message: "No notifications found for this document." };
      }

      console.info('All notifications are marked read for document successfully.');
      return {success: true, message: "All notifications marked read for document successfully.", data: notifications };
    } 
    catch(err){
      console.log("Error while running set all notifications as read service", err);
      return {success: false, message: err.message || "Set All Notifications Read Service Failed."};
    }
    }

 async getAssignedDocumentOwners(currentUser){
  try {
    const documents = await Document.find({
      reviewerId: currentUser._id,
    }).select("owner"); 

    if (!documents.length) {
      return {
        success: true,
        message: "No assigned documents found.",
        data: [],
      };
    }
    const owners = documents.map((doc) => doc.owner);
    const uniqueOwners = [...new Set(owners)];

    return {
      success: true,
      message: "Owners fetched successfully.",
      data: uniqueOwners,
    };

  } catch (error) {
    console.error("Error fetching assigned document owners:", error);

    return {
      success: false,
      message: error.message || "Failed to fetch owners.",
    };
  }
};
};
export default DocumentService;