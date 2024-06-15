import express from "express";
import MainController from "../controllers/MainController.js";

const router = express.Router();

router.post('/start_game', MainController.startGame)



export default router;

