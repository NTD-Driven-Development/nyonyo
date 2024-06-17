import express from "express";
import MainController from "../controllers/MainController.js";

const router = express.Router();

router.post('/api/startGame', MainController.startGame)



export default router;

