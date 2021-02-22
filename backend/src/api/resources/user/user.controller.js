import User from './user.model'
import Joi from 'joi';
import HttpStatus from 'http-status-codes';

export default {
    findAll(req, res, next){
        User.find()
            .populate(['userProjects', 'userTasks'])
            .then(users => res.json(users))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    create(req, res){
        const schema = Joi.object().keys({
           username: Joi.string().required(),
           email: Joi.string().email().required(),
           password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
           userProjects: Joi.array().optional(),
           userTasks: Joi.array().optional()
        });

        const {error, value } = Joi.validate(req.body, schema);
        if(error && error.details){
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
        User.create(value)
            .then(user => {res.json(user);})
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    findOne(req, res){
        let {id} = req.params;
        User.findById(id)
            .then(user => {
                if(!user){
                    return res.status(HttpStatus.NOT_FOUND).json({err: 'Could not find any user'});
                }
                return res.json(user);
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    delete(req, res){
        let {id} = req.params;
        User.findByIdAndRemove(id)
            .then(user => {
                if(!user){
                    return res.status(HttpStatus.NOT_FOUND).json({err: 'Could not remove user'});
                }
                return res.json(user);
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    },

    update(req, res){
        const schema = Joi.object().keys({
            username: Joi.string().optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).optional(),
            userProjects: Joi.array().optional(),
            userTasks: Joi.array().optional()
        });

        const {error, value } = Joi.validate(req.body, schema);
        if(error && error.details){
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
        User.findOneAndUpdate({_id: id}, value, {new: true})
            .then(user => {res.json(user);})
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    }
}