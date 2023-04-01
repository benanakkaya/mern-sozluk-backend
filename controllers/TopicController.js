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


export const GetHotTopicsController = async (req, res) => {
    try {
      const topics = await Topic.aggregate([
        {
          $match: { //24 saat içerisinde güncellenmiş topicleri seçiyoruz
            updatedAt: {
              $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $lookup: {
            from: "entries",
            localField: "entries",
            foreignField: "_id",
            as: "entries",
          },
        },
        {
          $addFields: {
            entryCountLast24Hours: {
              $size: {
                $filter: {
                  input: "$entries",
                  as: "entry",
                  cond: {
                    $gte: ["$$entry.updatedAt", new Date(Date.now() - 24 * 60 * 60 * 1000)],
                  },
                },
              },
            },
          },
        },
        {
          $addFields: {
            entries: {
              $filter: {
                input: "$entries",
                as: "entry",
                cond: {
                  $gte: ["$$entry.updatedAt", new Date(Date.now() - 24 * 60 * 60 * 1000)],
                },
              },
            },
          },
        },
        {
          $project: {
            entryCountLast24Hours: 1,
            entries: 1,
            title: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);
  
      return res.status(200).json(topics);
    } catch (error) {
      return res.status(500).json({ message: "An error occurred", error });
    }
  };