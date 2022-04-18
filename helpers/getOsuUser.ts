import axios from "axios";
import { Response } from "express";

export default async (token: string, res: Response) => {
	const user = await axios("https://osu.ppy.sh/api/v2/me", {
		headers: {
			authorization: `Bearer ${token}`,
		},
	});

	if (user.status != 200) return res.status(user.status).send(user.data);

	return user.data;
};
