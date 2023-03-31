import express from "express";
import { NewChannelController, GetChannelsController } from "../controllers/ChannelControllers.js";

const route = express.Router();

route.post("/new-channel", NewChannelController);
route.get("/get-channels", GetChannelsController);


export default route;
