import express from "express";
import { NewTopicController,GetTopicController,GetHotTopicsController } from "../controllers/TopicController.js";


const route = express.Router();


route.post("/new-topic",NewTopicController);
route.post("/get-topic",GetTopicController);
route.get("/get-hot-topics",GetHotTopicsController);

export default route;