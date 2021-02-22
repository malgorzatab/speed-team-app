import Task from './task.model'
import Joi from 'joi';
import HttpStatus from 'http-status-codes';

Joi.objectId = require('joi-objectid')(Joi);

export default {
    findAll(req, res, next){
        const { page=1, perPage=10} = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(perPage),
            populate: ['project','member']
        };
        Task.paginate({}, options)
            .then(tasks => res.json(tasks))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    create(req, res){

        const schema = Joi.object().keys({
            name: Joi.string().required(),
            member: Joi.objectId().optional(),
            state: Joi.string().required(),
            storyPoint: Joi.number().optional(),
            project: Joi.objectId().required()
        });

        const {error, value } = Joi.validate(req.body, schema);
        if(error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
        Task.create(value)
            .then(task => {res.json(task); })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    findOne(req, res){
        let {id} = req.params;
        Task.findById(id)
            .then(task => {
                if(!task){
                    return res.status(HttpStatus.NOT_FOUND).json({err: 'Could not find any task'});
                }
                return res.json(task);
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    delete(req, res){
        let {id} = req.params;
        Task.findByIdAndRemove(id)
            .then(task => {
                if(!task){
                    return res.status(HttpStatus.NOT_FOUND).json({err: 'Could not remove task'});
                }
                return res.json(task);
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    update(req, res){
        let {id} = req.params;
        const schema = Joi.object().keys({
            name: Joi.string().optional(),
            member: Joi.objectId().optional(),
            state: Joi.string().optional(),
            storyPoint: Joi.number().optional(),
            project: Joi.objectId().optional()
        });

        const {error, value } = Joi.validate(req.body, schema);
        if(error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
        Task.findOneAndUpdate({_id: id}, value, {new:true})
            .then(task => {res.json(task); })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    }
};