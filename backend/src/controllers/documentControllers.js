import DocumentService from "../services/documentServices.js";

export const createDocument = async (req , res) => {
    try{

         const body = {currentVersion: 1, ...req.body}

         const documentService = new DocumentService();
         const response = await documentService.createsDocument(body, req.user);

         const {success, ...data} = response;

        if(success){
         console.log(`Document created with title : ${response.title}`);
         res.status(201).json({success: true, message: `Document created successfully!`, ...data});
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const getDocument = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.getsDocument(req.params.id);

         const {success} = response;

        if(success){
         console.log(`Fetched document : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const getAllDocuments = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.getsAllDocuments(req.query, req.user);

         const {success} = response;

        if(success){
         console.log(`Fetched all documents : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const updateDocument = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.updatesDocument(req.params.id, req.body);

         const {success} = response;

        if(success){
         console.log(`Updated document : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const documentComment = async (req , res) => {
    try{
         const documentService = new DocumentService();
         console.log("body inside controller:: ", req.body);
         const response = await documentService.documentsComment({documentId: req.params.id, ...req.body});

         const {success} = response;

        if(success){
         console.log(`Comment added for document : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const getAllComments = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.getsAllComments(req.params.id);

         const {success} = response;

        if(success){
         console.log(`Fetched All Comments for document : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const getAuditLogs = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.getsAuditLogs(req.params.id);

         const {success} = response;

        if(success){
         console.log(`Fetched All audit logs for document : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const deleteDocument = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.deletesDocument(req.params.id, req.user);

         const {success} = response;

        if(success){
         console.log(`Deleted document : ${response.data.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const getDocumentVersions = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.getDocumentsVersions(req.params.id);

         const {success} = response;

        if(success){
         console.log(`Get all document versions successfully!`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const changeReviewers = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.changeReviewer(req.body);

         const {success} = response;

        if(success){
         console.log(`Reviewer changed successfully!`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const submitsDocument = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.submitDocument(req.params.id, req.body);

         const {success} = response;

        if(success){
         console.log(`Document submitted successfully!`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const getTimeline = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.getsTimeline(req.params.id);

         const {success} = response;

        if(success){
         console.log(`Fetched All timeline for document : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const getNotification = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.getsNotifications(req.user);

         const {success} = response;

        if(success){
         console.log(`Fetched All notifications for document : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const setReadNotification = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.setReadNotifications(req.user);

         const {success} = response;

        if(success){
         console.log(`Set All notifications read for document : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const getAssignedOwners = async (req , res) => {
    try{
         const documentService = new DocumentService();
         const response = await documentService.getAssignedDocumentOwners(req.user);

         const {success} = response;

        if(success){
         console.log(`Gett All assigned owners for document : ${response.title}`);
         res.status(201).json(response);
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

