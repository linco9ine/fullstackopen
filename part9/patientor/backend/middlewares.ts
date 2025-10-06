import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { patientSchema } from "./utils/utils";

export const validateNewPatient = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	try {
		patientSchema.parse(req.body);
		next();
	} catch (error: unknown) {
		next(error);
	}
};

export const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (error instanceof z.ZodError) {
		return res.status(400).json({ error: error.issues });
	}

	return res.status(500).json({ error: "Internal server error" });
};
