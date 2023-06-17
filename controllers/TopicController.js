import Topic from "../models/TopicModel.js";
import mongoose from "mongoose"
import User from "../models/UserModel.js";


export const NewTopicController = async (req, res) => {

  const { title, channel } = req.body;

  const titleCheck = await Topic.findOne({ title });

  if (titleCheck) {
    return res.status(500).json({ message: "Zaten böyle bir başlık mevcut!" });
  }

  const createdTopic = await Topic.create({
    title,
    entries: [],
    channel
  })

  return res.status(201).json({ message: "Başlık oluşturuldu.", topic: createdTopic })


}


export const GetTopicController = async (req, res) => {

  const { id } = req.body;

  const topic = await Topic.findById(id).populate({
    path: "entries", populate: [
      { path: "likes", populate: "members" },
      { path: "unlikes", populate: "members" },
      { path: "favorites", populate: "members" },
    ]
  }).populate("channel");


  return res.status(200).json(topic);

}

export const RecentlyUpdatedController = async (req,res) => {

  const topics = await Topic.find().sort({updatedAt:-1}).limit(50);

  return res.status(200).json(topics);
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

export const GetTopicDataController = async (req, res) => {
  const { title } = req.body; // Id'yi alın

  let {page} = req.body ;

  if(page === 0 || !page){
    page = 1;
  }

  const limit = 5;

  const skip = (page - 1) * limit;


  const decodedTitle = decodeURIComponent(title);
  // const id = new mongoose.Types.ObjectId(topicId);


  const topic = await Topic.findOne({title:decodedTitle}).populate({
    path: 'entries',
    select: '-__v',
    options: {
      skip: skip,
      limit: limit
  },
    populate: {
      path: 'owner',
      select: 'username avatar -_id'
    }
  })

  if(topic === null){
    const emtptyTopic = {
      title:decodedTitle,
      entries:[]
    }
    return res.status(200).json(emtptyTopic);
  }

  const topicAll = await Topic.findOne({title:decodedTitle});

  const totalCount = topicAll.entries.length;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json({...topic._doc,totalCount,totalPages});
};


export const SearchTopicController = async (req, res) => {
  const { searchIndex } = req.body;

  const topicList = await Topic.find({ title: { $regex: new RegExp(searchIndex) } }).limit(5);

  return res.status(200).json(topicList);
}

export const RandomTopic = async (req,res) => {

  const count = await Topic.countDocuments();
  const random =  Math.floor(Math.random()*count);
  const topic = await Topic.findOne().skip(random).populate({
    path: 'entries',
    select: '-__v',
    populate: {
      path: 'owner',
      select: 'username avatar -_id'
    }
  })

  return res.status(200).json(topic);
}