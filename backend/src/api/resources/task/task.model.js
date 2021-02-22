import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate'

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    member: {
        ref: 'User',
        type: Schema.Types.ObjectId
    },
    state: {
        type: String,
        default: "To do",
        required: true
    },
    storyPoint: {
        type: Number
    },
    project: {
        ref: 'Project',
        type: Schema.Types.ObjectId,
        required: true
    }

});
TaskSchema.plugin(mongoosePaginate);
export default mongoose.model('Task', TaskSchema);