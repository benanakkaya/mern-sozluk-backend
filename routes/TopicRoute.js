import express from "express";
import { NewTopicController,GetTopicController } from "../controllers/TopicController.js";


const route = express.Router();


route.post("/new-topic",NewTopicController);
route.post("/get-topic",GetTopicController);

export default route;