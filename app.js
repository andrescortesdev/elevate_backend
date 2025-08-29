import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import serverless from 'serverless-http'

import CvController from './app/routes/CandidatesRouter.js'
import vacanciesControllers from './app/routes/VacanciesRouter.js'
import applicationsController from './app/routes/ApplicationsRouter.js'
import candidatesController from './app/routes/CandidatesRouter.js'
import usersController from './app/routes/UsersRouter.js'
import candidateSharesController from './app/routes/CandidateSharesRouter.js'
import authController from './app/routes/AuthRouter.js'


// Load environment variables from .env file
dotenv.config();

// Create an Express instance

const app = express();

// The cors middleware configures HTTP headers so that the server allows other domains (origins) to make requests.
app.use(cors());

// Is a middleware that processes incoming requests with a JSON body so that req.body can be accessed as a JavaScript object.
app.use(express.json());

// Configure routes for the endpoint
app.use('/api/aicv', CvController);
app.use('/api/vacancies', vacanciesControllers);
app.use('/api/applications', applicationsController);
app.use('/api/candidates', candidatesController);
app.use('/api/users', usersController);
app.use('/api/shares', candidateSharesController);
app.use('/api/auth', authController);

// Configure the application port, taking the environment variable or the default value (3000)
export const handler = serverless(app);
export default app;