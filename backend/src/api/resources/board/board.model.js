import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    project: {
        ref: 'Project',
        type: Schema.Types.ObjectId
    }
});
export default mongoose.model('Retro', BoardSchema);


