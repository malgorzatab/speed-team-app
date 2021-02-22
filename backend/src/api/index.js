import express from 'express';
import {projectRouter} from "./resources/project";
import {taskRouter} from "./resources/task";
import {retroRouter} from "./resources/retro/retro.router";
import {userRouter} from "./resources/user/user.router";

export const restRouter = express.Router();
restRouter.use('/projects', projectRouter);
restRouter.use('/tasks', taskRouter);
restRouter.use('/retros', retroRouter);
restRouter.use('/users', userRouter);