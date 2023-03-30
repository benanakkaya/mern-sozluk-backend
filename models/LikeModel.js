import mongoose from "mongoose";


const Schema = mongoose.Schema;


const LikeSchema = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"Entry",
        required:true
    },
    members:[
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    ]
})


const LikeModel = mongoose.model("Like",LikeSchema);

export default LikeModel;