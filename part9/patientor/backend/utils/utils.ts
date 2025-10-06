import { NewPatient, Gender } from "../type/types";
import { z } from "zod";

export const patientSchema = z.object({
	name: z.string(),
	gender: z.nativeEnum(Gender),
	occupation: z.string(),
	ssn: z.string(),
	dateOfBirth: z.string().refine((d) => /^\d{4}-\d{2}-\d{2}$/.test(d), {
		message: "Invalid date format, expected YYYY-MM-DD",
	}),
});

export const toNewPatientEntry = (object: unknown): NewPatient => {
	return patientSchema.parse(object);
};
