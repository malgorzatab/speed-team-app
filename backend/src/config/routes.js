import express from 'express';
import projectController from '../api/resources/project/project.controller';
import userController from '../api/resources/user/user.controller';
import taskController from '../api/resources/task/task.controller';
import retroController from '../api/resources/retro/retro.controller';

export const router = express.Router();

//Projects
router.get('/projects', projectController.findAll);
router.get('/projects/:id', projectController.findOne);
router.delete('/projects/:id', projectController.delete);
router.put('/projects/:id', projectController.update);
router.post('/projects', projectController.create);

//Tasks
router.get('/tasks', taskController.findAll);
router.get('/tasks/:id', taskController.findOne);
router.delete('/tasks/:id', taskController.delete);
router.put('/tasks/:id', taskController.update);
router.post('/tasks', taskController.create);


//Users
router.get('/users', userController.findAll);
router.get('/users/:id', userController.findOne);
router.delete('/users/:id', userController.delete);
router.put('/users/:id', userController.update);
router.post('/users', userController.create);

//Retro
router.get('/retros', retroController.findAll);
router.get('/retros/:id', retroController.findOne);
router.delete('/retros/:id', retroController.delete);
router.put('/retro/:id', retroController.update);
router.post('/retros', retroController.create);