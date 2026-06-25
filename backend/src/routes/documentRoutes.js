import { Router } from 'express';
import { createDocument, documentComment, getAllComments, getAllDocuments, getAuditLogs, getDocument, updateDocument } from '../controllers/documentControllers.js';
import { authUser } from '../middlewares/Auth.js';
import { commentValidation, createDocumentValidation, documentIdValidation, getAllDocumentsValidation, updateDocumentValidation } from '../middlewares/validations/documentValidations.js';

const router = Router();

router.get('/', getAllDocumentsValidation, authUser, getAllDocuments);
router.post('/create', createDocumentValidation, authUser, createDocument);

router.get('/:id', documentIdValidation,authUser, getDocument);
router.post('/update/:id', documentIdValidation, updateDocumentValidation, authUser, updateDocument);

router.post('/comment/:id',documentIdValidation, commentValidation, authUser, documentComment);
router.get('/comments/:id',authUser, documentIdValidation, getAllComments);

router.get('/audit-logs/:id',authUser, documentIdValidation, getAuditLogs);


export default router;

// BE

// read document version*
//get all docs*
//create notifications*
//submit document for review - how?

//admin - manage users and roles - how?
// reassign reviewers

//reviewer - Approve or reject documents

// 1.
// Users must log in using secure credentials 
// JWT-based authentication
// Role-based route protection

// 2.
// automatic archived after 15 days of approval
// Allow reassignment by admin (by default assigned to Admin if not assigned in span of 3 working days)
// Draft loss: Autosave or manual save mechanism
// Unauthorized actions: Return 403 errors



// FE

