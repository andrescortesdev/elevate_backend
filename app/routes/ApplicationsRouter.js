import { Router } from "express";
import * as applicationsController from '../controllers/ApplicationsController.js';
/**
 * Express router instance for handling application-related routes.
 * This router manages endpoints for application operations such as
 * creating, reading, updating, and deleting application records.
 * 
 * @type {import('express').Router}
 */
const router = Router();

router.get('/', applicationsController.getAllApplications);
router.get('/column', applicationsController.getAllApplicationsColumn);
router.get('/:id', applicationsController.getApplicationsForVacancyId); 
router.get('/:id/:status', applicationsController.getApplicationsForVacancyIdAndStatus);
router.put("/:id", applicationsController.updateApplicationController);

export default router;