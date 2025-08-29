import { Router } from "express";
import * as vacanciesControllers from '../controllers/VacanciesControllers.js';

/**
 * Express router instance for handling vacancy-related routes.
 * This router manages all HTTP endpoints related to job vacancies including
 * creating, reading, updating, and deleting vacancy records.
 * 
 * @type {import('express').Router}
 * @since 1.0.0
 */
const router = Router();

router.get('/', vacanciesControllers.getAllVacanciesController);
router.get('/count', vacanciesControllers.getAllVacanciesWithCount);
router.get('/find', vacanciesControllers.getAllVacanciesByNameController);
router.get('/:id', vacanciesControllers.getApplicationsByVacancyIdController);

router.post('/', vacanciesControllers.upsertVacancyController);
router.put('/:id', vacanciesControllers.updateVacancyController);

router.delete('/:id', vacanciesControllers.deleteVacancyController);

export default router;