import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jwtRefreshToken:{
        type: String,
        required: false
    },
    cvs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cv"
    }],
});

const User = mongoose.model('User', UserSchema);
export default User;
