import express from "express";
import { NewEntryController, LikeController, DislikeController, FavoriteController, DeleteEntryController } from "../controllers/EntryController.js";

const route = express.Router();

route.post("/new-entry", NewEntryController);
route.post("/delete-entry", DeleteEntryController);
route.post("/like-control", LikeController);
route.post("/dislike-control", DislikeController);
route.post("/favorite-control", FavoriteController);



export default route;