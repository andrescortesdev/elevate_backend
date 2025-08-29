import { Router } from "express";
import * as usersController from '../controllers/UsersController.js';

/**
 * Express router instance for handling user-related routes.
 * This router manages all HTTP requests related to user operations such as
 * authentication, user management, and user data retrieval.
 * 
 * @type {import('express').Router}
 */
const router = Router();

router.get("/", usersController.getAllUsersController);
router.post("/", usersController.createUserController);
router.delete("/:id", usersController.deleteUserController);

export default router;
