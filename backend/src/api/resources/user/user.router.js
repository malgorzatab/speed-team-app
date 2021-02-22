import express from 'express';
import userController from "./user.controller";
import {router} from "../../../config/routes";

export const userRouter = express.Router();

userRouter
    .route('/')
    .post(userController.create)
    .get(userController.findAll);

userRouter
    .route('/:id')
    .put(userController.update)
    .delete(userController.delete)
    .get(userController.findOne);
