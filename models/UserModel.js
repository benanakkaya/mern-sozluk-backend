import mongoose from "mongoose";


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Kadın", "Erkek", "Başka", "Boşver"],
        default: "Boşver"
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    }
});


const UserModel = mongoose.model("User", UserSchema);

export default UserModel;

