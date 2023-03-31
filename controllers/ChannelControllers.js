import Channel from "../models/ChannelModel.js"

export const NewChannelController = async (req,res) => {

    const {title} = req.body;

    const channelControl = await Channel.findOne({title});

    if(channelControl){
        return res.status(500).json({message:"Zaten böyle bir kanal mevcut!"})
    };

    const createdChannel = await Channel.create({
        title
    })

    return res.status(201).json({message:"Kanal başarıyla oluşturuldu",channel:createdChannel})
}

export const GetChannelsController = async (req,res) => {
    
    const channels = await Channel.find()

    return res.status(200).json(channels);

  
}