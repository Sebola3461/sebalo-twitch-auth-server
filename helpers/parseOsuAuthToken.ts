import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import getOsuUser from "./getOsuUser";
import { users } from "../database";
import createNewUser from "../database/utils/createNewUser";

export default async (req: Request, res: Response) => {
	const code = req.query.code || "banana";

	const token = await axios("https://osu.ppy.sh/oauth/token", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			client_id: process.env.OSU_CLIENT_ID,
			client_secret: process.env.OSU_CLIENT_SECRET,
			grant_type: "authorization_code",
			code: code,
			redirect_uri: process.env.OSU_REDIRECT_URI,
		},
	});

	if (token.status != 200) return res.status(token.status).send(token.data);

	const user = await getOsuUser(token.data.access_token, res);

	let db_user = await users.findById(user.id);

	if (db_user == null) db_user = await createNewUser(user);

	db_user.osu.access_token = token.data.access_token;
	db_user.osu.refresh_token = token.data.refresh_token;

	await users.findByIdAndUpdate(user.id, db_user);

	let tokens = JSON.stringify(token.data);

	res.status(200).send(`<center><h1>Redirecting to Twitch...</h1></center>
	<script>
		localStorage["osu_token"] = JSON.stringify(${tokens})

		window.location.replace("https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.TWITCH_REDIRECT_URI}&scope=chat:read")
	</script>`);
};
