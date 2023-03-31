import Topic from "../models/TopicModel.js";


export const NewTopicController = async (req,res) => {

    const {title,channel} = req.body;

    const titleCheck = await Topic.findOne({title});

    if(titleCheck){
        return res.status(500).json({message:"Zaten böyle bir başlık mevcut!"});
    }

    const createdTopic = await Topic.create({
        title,
        entries : [],
        channel
    })

    return res.status(201).json({message:"Başlık oluşturuldu.",topic:createdTopic})


}


export const GetTopicController = async (req,res) => {

    const {id} = req.body;
    
    const topic = await Topic.findById(id).populate({path:"entries",populate: [
        {path:"likes", populate:"members"},
        {path:"unlikes", populate:"members"},
        {path:"favorites", populate:"members"},
    ]}).populate("channel");


    return res.status(200).json(topic);
    
}