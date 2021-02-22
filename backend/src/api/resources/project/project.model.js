import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate'

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    members: [{
        ref: 'User',
        type: Schema.Types.ObjectId
    }],
    toDoTasks: [{
        ref: 'Task',
        type: Schema.Types.ObjectId
    }],
    inProgressTasks: [{
        ref: 'Task',
        type: Schema.Types.ObjectId
    }],
    doneTasks: [{
        ref: 'Task',
        type: Schema.Types.ObjectId
    }],
    backlog: [{
        ref: 'Task',
        type: Schema.Types.ObjectId
    }]
});
ProjectSchema.plugin(mongoosePaginate);
export default mongoose.model('Project', ProjectSchema);