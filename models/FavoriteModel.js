import mongoose from "mongoose";


const Schema = mongoose.Schema;


const FavoriteSchema = new Schema({
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


const FavoriteModel = mongoose.model("Favorite",FavoriteSchema);

export default FavoriteModel;