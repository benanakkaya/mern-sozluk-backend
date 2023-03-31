import Topic from "../models/TopicModel.js";
import Entry from "../models/EntryModel.js";
import User from "../models/UserModel.js";


export const NewEntryController = async (req, res) => {
    const { topic, owner, text } = req.body;

    const targetTopic = await Topic.findById(topic).populate("entries");
    const targetUser = await User.findById(owner);


    //Kullanıcının daha önce bu başlığa entry girip girmediğini kontrol ediyoruz
    const entryControl = (targetTopic.entries.some((entry) => entry.owner.toString() === owner));

    if (entryControl) {
        return res.status(500).json({ message: "Zaten daha önce bu başlığa entry girmişsin." })
    }

    const createdEntry = await Entry.create({
        topic,
        owner,
        text
    });

    await Topic.findByIdAndUpdate(topic, { entries: [...targetTopic.entries, createdEntry._id] });
    await User.findByIdAndUpdate(owner, { entries: [...targetUser.entries, createdEntry._id] });

    return res.status(201).json({ message: "Entry başarıyla girildi", entry: createdEntry })

}

export const DeleteEntryController = async (req, res) => {
    const { topicId, ownerId, entryId } = req.body;

    await Entry.findByIdAndRemove(entryId);

    const targetTopic = await Topic.findById(topicId)
    const targetUser = await User.findById(ownerId)

    const newTopicEntries = targetTopic.entries.filter((entry) => entry.toString() !== entryId);
    const newUserEntries = targetUser.entries.filter((entry) => entry.toString() !== entryId);

    const updatedTopic = await Topic.findByIdAndUpdate(topicId, { entries: newTopicEntries },{new:true});
    const updatedUser = await User.findByIdAndUpdate(ownerId, { entries: newUserEntries },{new:true});

    return res.status(200).json({message:"Entry başarıyla silindi!",topic:updatedTopic,user:updatedUser});

}

export const LikeController = async (req, res) => {
    const { entryId, userId } = req.body;

    const entry = await Entry.findById(entryId);

    if (entry.dislikes.includes(userId)) {
        await Entry.findByIdAndUpdate(entryId, { $pull: { dislikes: userId } })
    }

    if (entry.likes.includes(userId)) {
        const updatedEntry = await Entry.findByIdAndUpdate(entryId, { $pull: { likes: userId } }, { new: true });

        return res.status(500).json({ message: "Like kaldırıldı!", entry: updatedEntry })
    }
    else {
        const updatedEntry = await Entry.findByIdAndUpdate(entryId, { $push: { likes: userId } }, { new: true });
        return res.status(500).json({ message: "Like verildi!", entry: updatedEntry })
    }

}

export const DislikeController = async (req, res) => {
    const { entryId, userId } = req.body;

    const entry = await Entry.findById(entryId);

    if (entry.likes.includes(userId)) {
        await Entry.findByIdAndUpdate(entryId, { $pull: { likes: userId } })
    }

    if (entry.dislikes.includes(userId)) {
        const updatedEntry = await Entry.findByIdAndUpdate(entryId, { $pull: { dislikes: userId } }, { new: true });

        return res.status(500).json({ message: "Dislike kaldırıldı!", entry: updatedEntry })
    }
    else {
        const updatedEntry = await Entry.findByIdAndUpdate(entryId, { $push: { dislikes: userId } }, { new: true });
        return res.status(500).json({ message: "Dislike verildi!", entry: updatedEntry })
    }

}
export const FavoriteController = async (req, res) => {
    const { entryId, userId } = req.body;

    const entry = await Entry.findById(entryId);

    if (entry.favorites.includes(userId)) {
        const updatedEntry = await Entry.findByIdAndUpdate(entryId, { $pull: { favorites: userId } }, { new: true });
        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { favorites: entryId } }, { new: true });
        return res.status(200).json({ message: "Favorilerden kaldırıldı!", entry: updatedEntry, user: updatedUser })
    }
    else {
        const updatedEntry = await Entry.findByIdAndUpdate(entryId, { $push: { favorites: userId } }, { new: true });
        const updatedUser = await User.findByIdAndUpdate(userId, { $push: { favorites: entryId } }, { new: true });
        return res.status(200).json({ message: "Favorilere eklendi!", entry: updatedEntry, user: updatedUser })
    }

}