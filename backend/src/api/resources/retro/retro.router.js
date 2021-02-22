import express from 'express';
import retroController from "./retro.controller";
import {router} from "../../../config/routes";

export const retroRouter = express.Router();

retroRouter
    .route('/')
    .post(retroController.create)
    .get(retroController.findAll);

retroRouter
    .route('/:id')
    .put(retroController.update)
    .delete(retroController.delete)
    .get(retroController.findOne);
