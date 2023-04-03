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
  const { topicId } = req.body; // Id'yi alın
  const id = new mongoose.Types.ObjectId(topicId);
  const topic = await Topic.aggregate([
    {
      $match: {
        _id: id, // Sadece id'ye uyan topicleri seçin
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
        totalEntriesCount: {
          $size: "$entries",
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
        totalEntriesCount: 1,
        entryCountLast24Hours: {
          $subtract: ["$totalEntriesCount", "$entryCountLast24Hours"]
        },
        entries: 1,
        title: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  for (let i = 0; i < topic[0].entries.length; i++) {
    const ownerId = topic[0].entries[i].owner;
    const user = await User.findById(ownerId);
    topic[0].entries[i].owner = user;
  }


  return res.status(200).json(topic);
};