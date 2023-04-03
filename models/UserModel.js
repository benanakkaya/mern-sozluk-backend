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
        enum: ["kadın", "erkek", "başka", "boşver"],
        default: "boşver"
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref:"Entry"
    }],
    favorites: [{
        type: Schema.Types.ObjectId,
        ref:"Entry"
    }],
    avatar:{
        type:String
    }
},{timestamps:true});


const UserModel = mongoose.model("User", UserSchema);

export default UserModel;

