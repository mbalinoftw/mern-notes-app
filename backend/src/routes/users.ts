import express from "express";
import { signUp } from "../controllers/users";

const router = express.Router();

router.post("/signup", signUp);

export default router;
