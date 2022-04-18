import { Request, Response } from "express";
import path from "path";

export default async (req: Request, res: Response) => {
	res.status(200).sendFile(
		path.resolve(__dirname.concat("/../static/twitch.html"))
	);
};
