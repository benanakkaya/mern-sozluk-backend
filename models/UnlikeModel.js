import mongoose from "mongoose";


const Schema = mongoose.Schema;


const UnlikeSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Entry",
        required: true
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ]
})


const UnlikeModel = mongoose.model("Unlike", UnlikeSchema);

export default UnlikeModel;