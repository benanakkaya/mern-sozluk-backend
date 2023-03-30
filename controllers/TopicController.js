import Topic from "../models/TopicModel.js";


export const NewTopicController = async (req,res) => {

    const {title} = req.body;

    const titleCheck = await Topic.findOne({title});

    if(titleCheck){
        return res.status(500).json({message:"Zaten böyle bir başlık mevcut!"});
    }

    const createdTopic = await Topic.create({
        title,
        entries : []
    })

    return res.status(201).json({message:"Başlık oluşturuldu.",topic:createdTopic})


}