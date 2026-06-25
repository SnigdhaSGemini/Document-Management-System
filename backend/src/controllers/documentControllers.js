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