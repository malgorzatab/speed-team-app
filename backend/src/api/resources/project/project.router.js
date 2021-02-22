import express from 'express';
import projectController from "./project.controller";
import {router} from "../../../config/routes";

export const projectRouter = express.Router();

projectRouter
    .route('/')
    .post(projectController.create)
    .get(projectController.findAll)

projectRouter
    .route('/:id')
     .put(projectController.update)
     .delete(projectController.delete)
     .get(projectController.findOne);

