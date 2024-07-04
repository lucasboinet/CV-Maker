import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    preview: {
        type: String,
        default: null
    },
    body: {
        type: String,
        required: false,
        default: "[]"
    }
});
const Project = mongoose.model('Project', ProjectSchema);
export default Project;