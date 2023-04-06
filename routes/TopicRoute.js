import express from "express";
import { NewTopicController, GetTopicController, GetHotTopicsController, GetTopicDataController, SearchTopicController, RecentlyUpdatedController, RandomTopic } from "../controllers/TopicController.js";


const route = express.Router();


route.post("/new-topic", NewTopicController);
route.post("/get-topic", GetTopicController);
route.get("/random-topic", RandomTopic);
route.post("/search-topic", SearchTopicController);
route.get("/get-hot-topics", GetHotTopicsController);
route.get("/get-recently-topics", RecentlyUpdatedController);
route.post("/get-topic-data", GetTopicDataController);

export default route;