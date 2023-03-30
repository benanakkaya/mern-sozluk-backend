import Target from "../models/TopicModel.js";
import Entry from "../models/EntryModel.js";

export const NewEntryController = async (req,res) => {
    const {topic,owner,text} = req.body;

    const targetTopic = await Target.findById(topic);

    const matchingEntry = targetTopic.entries.find(entry => entry.owner === owner);

    if(matchingEntry){
        return res.status(500).json({message:"Zaten bu başlıkta bir entry'e sahipsiniz!"})
    }

    const createdEntry = await Entry.create({
        topic,
        owner,
        text
    })

    return res.status(201).json({message:"Entry başarıyla girildi",entry:createdEntry})

}