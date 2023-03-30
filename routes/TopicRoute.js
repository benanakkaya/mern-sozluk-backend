import express from "express";
import { NewTopicController } from "../controllers/TopicController.js";


const route = express.Router();


route.post("/new-topic",NewTopicController)

export default route;