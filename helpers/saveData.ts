import { Request, Response } from "express";
import { users } from "../database";
import dotenv from "dotenv";
dotenv.config();
import getOsuUser from "./getOsuUser";

export default async (req: Request, res: Response) => {
	const { osu_token, twitch_token, twitch_data } = req.body;

	if (!osu_token || !twitch_data || !twitch_token)
		return res
			.status(401)
			.send("<centre><h1>Invalid tokens! Try again.</h1></centre>");

	const osu_user = await getOsuUser(osu_token, res);

	const user = await users.findById(osu_user.id);

	if (user == null)
		return res
			.status(402)
			.send("<centre><h1>This user does not exist!</h1></centre>");

	user.twitch.token = twitch_data.token;
	user.twitch.id = twitch_data.id;
	user.twitch.channel = twitch_data.login;

	await users.findByIdAndUpdate(osu_user.id, user);

	return res
		.status(200)
		.send("<centre><h1>Done! You can close this window.</h1></centre>");
};
