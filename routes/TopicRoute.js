import express from "express";
import { NewTopicController,GetTopicController,GetHotTopicsController,GetTopicDataController } from "../controllers/TopicController.js";


const route = express.Router();


route.post("/new-topic",NewTopicController);
route.post("/get-topic",GetTopicController);
route.get("/get-hot-topics",GetHotTopicsController);
route.post("/get-topic-data", GetTopicDataController);

export default route;