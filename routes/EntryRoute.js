import express from "express";
import { NewEntryController } from "../controllers/EntryController.js";

const route = express.Router();

route.post("/new-entry",NewEntryController);

export default route;