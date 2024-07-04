import mongoose from 'mongoose';

const CvSchema = new mongoose.Schema({
    
    Name: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    style: {
        type: String,
        required: true
    },
});
const Cv = mongoose.model('Cv', CvSchema);
export default Cv;