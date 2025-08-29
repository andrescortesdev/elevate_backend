import { Router } from "express";
import * as CvController from '../controllers/CandidatesController.js';
import * as CvAiController from '../controllers/UploadCandidate.js';

/**
 * Express router instance for handling candidate-related routes.
 * This router manages all HTTP endpoints related to candidate operations
 * such as creating, reading, updating, and deleting candidate records.
 * 
 * @type {import('express').Router}
 */
const router = Router();

router.post('/', CvAiController.uploadMiddleware, CvAiController.processUploadedCVsController);
router.get('/', CvController.getAllCandidatesController);
router.get('/:id/notes', CvController.getCandidateNotesController);
router.put('/:id/notes', CvController.updateCandidateNotesController);
router.put('/', CvController.updateCandidateController);

export default router;