import mongoose from "mongoose";


const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    topics: [{
        type: Schema.Types.ObjectId,
        ref:"Topic"
    }]
})


const ChannelModel = mongoose.model("Channel",ChannelSchema);

export default ChannelModel;