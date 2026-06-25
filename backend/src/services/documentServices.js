import { Document } from "../models/documentSchema.js";
import { DocumentVersion } from "../models/documentVersionSchema.js";
import { Comment } from "../models/commentSchema.js";
import { AuditLog } from "../models/auditLogSchema.js";


class DocumentService {

  async createsDocument(body, currentUser){
    try{
    const apiBody = {owner: currentUser._doc.name, ownerId: currentUser._doc.userId, ...body}
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

    if(body.status === "submitted"){
       const auditLogBody = {
        action: 'SUBMIT_DOCUMENT',
        userId: document.ownerId,
        documentId: document._id,
        metadata: `Document submitted with title: ${document.title}`
      };

      await AuditLog.create(auditLogBody);
      console.info('Audit logs added for submit document.');
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
        delegated,
        statusCounts
      ] = await Promise.all([

        // 1. Total Documents
        Document.countDocuments({ ...dateFilter }),

        // 2. Recently Added
        Document.countDocuments({
          createdAt: { $gte: startOfWeek }
        }),

        // 3. Approved
        Document.countDocuments({
          status: "approved",
          ...dateFilter
        }),

        // 4. Rejected
        Document.countDocuments({
          status: "rejected",
          ...dateFilter
        }),

        // 5. Pending Reviews
        Document.countDocuments({
          status: "submitted",
          ...dateFilter
        }),

        // 6. Assigned Drafts
        Document.countDocuments({
          reviewer: currentUser._doc.userId,
          status: "submitted",
          ...dateFilter
        }),

        // 7. Reviewed Documents
        Document.countDocuments({
          reviewer: currentUser._doc.userId,
          status: { $in: ["approved", "rejected", "archived"] },
          ...dateFilter
        }),

        // 8. Delegated to Admin
        Document.countDocuments({
          reviewerRole: "admin",
          previousReviewer: currentUser._doc.userId,
          ...dateFilter
        }),    
        Document.aggregate([
              { $match: { ...dateFilter } },
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

        if (diffDays > 30) {
          groupFormat = "%Y-%m"; // month
          labelFormat = "month";
        } else if (diffDays > 7) {
          groupFormat = "%Y-%U"; // week number
          labelFormat = "week";
        }
      }

      const [createdData, approvedData, rejectedData] = await Promise.all([

        // CREATED
        Document.aggregate([
          { $match: { ...dateFilter } },
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
              status: "approved",
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
          delegated,
          statusChart,
          documentsTimeGraph
        }
      };
    }

    const documents = await Document.find(dateFilter).sort({ createdAt: -1 }).skip((page-1) * limit).limit(limit);
    const count = await Document.countDocuments(dateFilter);

    let filter = {};

    // Date filter
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Reviewer filter
    if (reviewer) {
      filter.reviewer = reviewer;
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
      Document.find(filter)
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
    const oldDocument = await Document.findById(documentId).select('title content');
    let content = {};
    if(body.title && oldDocument.title !== body.title) content.title = body.title;
    if(body.content && oldDocument.content !== body.content) content.content = body.content;
    
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
    const auditLogs = await AuditLog.find({ documentId }).sort({ createdAt: -1 });

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
};
export default DocumentService;