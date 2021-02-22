import HttpStatus from 'http-status-codes';
import Project from './project.model';
import Joi from 'joi';
import Task from "../task/task.model";

export default {
    findAll(req, res, next){
        const { page = 1, perPage = 10, filter, sortField, sortDir} = req.query;
        const options = {
          page: parseInt(page, 10),
          limit: parseInt(perPage, 10),
          populate: ['members', 'toDoTasks', 'inProgressTasks', 'doneTasks', 'backlog'],
        };
        const query = {};
        if(filter){
            query.name = {
                $regex: filter,
            };
        }
        if(sortField && sortDir){
            options.sort = {
                [sortField]: sortDir,
            };
        }
        Project.paginate(query, options)
            .then(projects => res.json(projects))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },


    create(req, res){
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            code: Joi.string().required(),
            description: Joi.string().required(),
            dueDate: Joi.date().required(),
            members: Joi.array().optional(),
            toDoTasks: Joi.array().optional(),
            inProgressTasks: Joi.array().optional(),
            doneTasks: Joi.array().optional(),
            backlog: Joi.array().optional()
        });

        const {error, value } = Joi.validate(req.body, schema);
        if(error && error.details){
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }

        Project.create(value)
            .then(project => {res.json(project); })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    findOne(req, res){
        let {id} = req.params;
        Project.findById(id)
            .populate(['members', 'toDoTasks', 'inProgressTasks', 'doneTasks', 'backlog'])
            .then(project => {
                if(!project){
                    return res.status(HttpStatus.NOT_FOUND).json({err: 'Could not find any project'});
                }
                return res.json(project);
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },
    delete(req, res){
        let {id} = req.params;
        Project.findByIdAndRemove(id)
            .then(project => {
                if(!project){
                    return res.status(HttpStatus.NOT_FOUND).json({err: 'Could not delete any project'});
                }
                return res.json(project);
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    update(req, res){
        let {id} = req.params;
        const schema = Joi.object().keys({
            name: Joi.string().optional(),
            code: Joi.string().required(),
            description: Joi.string().optional(),
            dueDate: Joi.date().optional(),
            members: Joi.array().optional(),
            toDoTasks: Joi.array().optional(),
            inProgressTasks: Joi.array().optional(),
            doneTasks: Joi.array().optional(),
            backlog: Joi.array().optional()
        });

        const {error, value } = Joi.validate(req.body, schema);
        if(error && error.details){
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
        Project.findOneAndUpdate({_id: id}, value, {new:true})
            .then(project => res.json(project))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    }
};