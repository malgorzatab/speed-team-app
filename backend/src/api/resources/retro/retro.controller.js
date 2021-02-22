import Retro from './retro.model'
import Joi from 'joi';
import HttpStatus from 'http-status-codes';

Joi.objectId = require('joi-objectid')(Joi);

export default {
    findAll(req, res, next){
        Retro.find()
            .populate('project')
            .then(retros => res.json(retros))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    create(req, res){
        const schema = Joi.object().keys({
            goodTab: Joi.array().optional(),
            badTab: Joi.array().optional(),
            ideasTab: Joi.array().optional(),
            actionsTab: Joi.array().optional(),
            project: Joi.objectId().required()
        });

        const {error, value } = Joi.validate(req.body, schema);
        if(error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
        Retro.create(value)
            .then(retro => {res.json(retro); })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    findOne(req, res){
        let {id} = req.params;
        Retro.findById(id)
            .then(retro => {
                if(!retro){
                    return res.status(HttpStatus.NOT_FOUND).json({err: 'Could not find any task'});
                }
                return res.json(retro);
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    delete(req, res){
        let {id} = req.params;
        Retro.findByIdAndRemove(id)
            .then(retro => {
                if(!retro){
                    return res.status(HttpStatus.NOT_FOUND).json({err: 'Could not remove task'});
                }
                return res.json(retro);
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    update(req, res){
        let {id} = req.params;
        const schema = Joi.object().keys({
            goodTab: Joi.array().optional(),
            badTab: Joi.array().optional(),
            ideasTab: Joi.array().optional(),
            actionsTab: Joi.array().optional(),
            project: Joi.objectId().required()
        });

        const {error, value } = Joi.validate(req.body, schema);
        if(error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
        Retro.findOneAndUpdate({_id: id}, value, {new:true})
            .then(retro => {res.json(retro); })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    }
};