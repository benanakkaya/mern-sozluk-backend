import mongoose from "mongoose";


const Schema = mongoose.Schema;

const TopicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref:"Entry"
    }],
    channel: {
        type:Schema.Types.ObjectId,
        ref:"Channel"
    }
}, { timestamps: true });


const TopicModel = mongoose.model("Topic", TopicSchema);

export default TopicModel;