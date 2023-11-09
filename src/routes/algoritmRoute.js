import express from 'express';
import { startAlgoritm } from '../controllers/startAlgoritmController.js';

export const router = express.Router();

router.get('/', startAlgoritm);