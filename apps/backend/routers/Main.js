import express from "express";
import MainController from "../controllers/MainController.js";

const router = express.Router();

router.post('/api/startGame', MainController.api_startGame)

router.post('/api/test', MainController.test)



export default router;

