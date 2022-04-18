import express, { json } from "express";
import dotenv from "dotenv";
dotenv.config();
import parseTwitchAuthToken from "./helpers/parseTwitchAuthToken";

import parseOsuAuthToken from "./helpers/parseOsuAuthToken";
import saveData from "./helpers/saveData";
const router = express();

router.get("/osu", parseOsuAuthToken);
router.get("/twitch", parseTwitchAuthToken);
router.get("/end", (req, res) => {
	res.sendFile(__dirname.concat("/static/end.html"));
});
router.post("/save", json(), saveData);

router.listen(process.env.PORT || 3000, () => {
	console.log("Auth server started");
});
