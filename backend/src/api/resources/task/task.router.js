import express from 'express';
import taskController from "./task.controller";
import {router} from "../../../config/routes";

export const taskRouter = express.Router();

taskRouter
    .route('/')
    .post(taskController.create)
    .get(taskController.findAll);

taskRouter
    .route('/:id')
    .put(taskController.update)
    .delete(taskController.delete)
    .get(taskController.findOne);
