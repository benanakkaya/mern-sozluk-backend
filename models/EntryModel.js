import mongoose from "mongoose";

const Schema = mongoose.Schema;

const EntrySchema = new Schema({
    topic: {
        type:Schema.Types.ObjectId,
        ref:"Topic",
        required:true
    },
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text: {
        type:String,
        required:true
    },
    likes: {
        type: Schema.Types.ObjectId,
        ref:"Like"
    },
    unlikes: {
        type: Schema.Types.ObjectId,
        ref:"Unlike"
    },
    favorites: {
        type: Schema.Types.ObjectId,
        ref:"Favorite"
    },
},{timeStamps:true})


const EntryModel = mongoose.model("Entry",EntrySchema);

export default EntryModel;