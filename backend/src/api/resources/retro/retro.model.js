import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const RetroSchema = new Schema({
    goodTab: {
        type: Array
    },
    badTab: {
        type: Array
    },
    ideasTab: {
        type: Array
    },
    actionsTab: {
        type: Array
    },
    project: {
        ref: 'Project',
        type: Schema.Types.ObjectId
    }
});
export default mongoose.model('Retro', RetroSchema);


