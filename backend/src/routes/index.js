import express from 'express';
import userRoutes from './userRoutes.js';
import documentRoutes from './documentRoutes.js';
import authRoutes from './AuthRoutes.js';

const Router = express.Router();

Router.use('/auth', authRoutes);
Router.use('/user', userRoutes);
Router.use('/document', documentRoutes);

export default Router;