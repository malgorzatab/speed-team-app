import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userProjects: [{
        ref: 'Project',
        type: Schema.Types.ObjectId
    }],
    userTasks: [{
        ref: 'Task',
        type: Schema.Types.ObjectId
    }]

});

export default mongoose.model('User', UserSchema);