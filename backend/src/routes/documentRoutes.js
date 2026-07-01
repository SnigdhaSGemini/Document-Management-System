import { Router } from 'express';
import { changeReviewers, createDocument, deleteDocument, documentComment, getAllComments, getAllDocuments, getAssignedOwners, getAuditLogs, getDocument, getDocumentVersions, getNotification, getTimeline, setReadNotification, submitsDocument, updateDocument } from '../controllers/documentControllers.js';
import { authUser } from '../middlewares/Auth.js';
import { changeReviewerValidation, commentValidation, createDocumentValidation, documentIdValidation, getAllDocumentsValidation, updateDocumentValidation } from '../middlewares/validations/documentValidations.js';
import { allowedRoles } from '../middlewares/roleMiddlewares.js';

const router = Router();

router.get('/', getAllDocumentsValidation, authUser, getAllDocuments);
router.post('/create', createDocumentValidation, authUser, allowedRoles("user"), createDocument);
router.get('/notifications',authUser, getNotification);
router.post('/read-notifications',authUser, setReadNotification);
router.post('/change-reviewer', changeReviewerValidation, authUser, allowedRoles("admin"), changeReviewers);
router.get('/owners', authUser, getAssignedOwners);

router.get('/:id', documentIdValidation,authUser, getDocument);
router.post('/update/:id', documentIdValidation, updateDocumentValidation, authUser, allowedRoles("user"), updateDocument);
router.delete('/delete/:id', documentIdValidation, authUser, allowedRoles("user"), deleteDocument);
router.get('/versions/:id', documentIdValidation, authUser, getDocumentVersions);
router.post('/submit/:id', documentIdValidation, authUser, submitsDocument);

router.post('/comment/:id',documentIdValidation, commentValidation, authUser, documentComment);
router.get('/comments/:id',authUser, documentIdValidation, getAllComments);

router.get('/audit-logs/:id',authUser, documentIdValidation, getAuditLogs);
router.get('/timeline/:id',authUser, documentIdValidation, getTimeline);


export default router;