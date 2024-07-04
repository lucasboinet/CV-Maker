import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
    
    Name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
});

const Module = mongoose.model('Module', ModuleSchema);
export default Module;