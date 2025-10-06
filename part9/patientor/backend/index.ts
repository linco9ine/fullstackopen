import express, { Request, Response } from "express";
import cors from "cors";
import {
	Diagnosis,
	Patient,
	NewPatient,
	NonSensitivePatient,
	Entry,
	NewEntry,
} from "./type/types";
import diagnosis from "./services/diagnoses";
import patient from "./services/patient";
import { validateNewPatient, errorMiddleware } from "./middlewares";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/ping", (_req: Request, res: Response) => {
	res.send("pong");
});

app.get("/api/diagnosis", (_req: Request, res: Response<Diagnosis[]>) => {
	const allDiagnosisData: Diagnosis[] = diagnosis.getAll();
	res.json(allDiagnosisData);
});

app.get(
	"/api/patients",
	(_req: Request, res: Response<Omit<Patient, "ssn">[]>) => {
		const rawData: Patient[] = patient.getAll();
		const safePatients: Omit<Patient, "ssn">[] = rawData.map(
			({ ssn: _, ...rest }) => rest
		);
		res.json(safePatients);
	}
);

app.post(
	"/api/patients",
	validateNewPatient,
	(
		req: Request<unknown, unknown, NewPatient>,
		res: Response<NonSensitivePatient>
	) => {
		const newPatientAdded: NonSensitivePatient = patient.addPatient(
			req.body
		);
		res.json(newPatientAdded);
	}
);

app.get(
	"/api/patients/:id",
	(
		req: Request<{ id: string }>,
		res: Response<Patient | { error: string }>
	) => {
		const p = patient.getOne(req.params.id);
		if (p) {
			return res.json(p);
		}

		return res.status(404).json({ error: "patient not found" });
	}
);

app.post(
	"/api/patients/:id/entries",
	(
		req: Request<{ id: string }, unknown, NewEntry>,
		res: Response<Entry | { error: string }>
	) => {
		const id: string = req.params.id;
		const entry: NewEntry = req.body;

		const p = patient.getOne(id);
		if (!p) {
			return res.status(404).json({ error: "patient not found" });
		}

		switch (entry.type) {
			case "OccupationalHealthcare": {
				if (
					!entry.description ||
					!entry.date ||
					!entry.specialist ||
					(entry.diagnosisCodes &&
						!Array.isArray(entry.diagnosisCodes)) ||
					!entry.employerName ||
					(entry.sickLeave &&
						(!entry.sickLeave.startDate ||
							!entry.sickLeave.endDate))
				) {
					return res
						.status(400)
						.json({ error: "Invalid or missing field" });
				}

				const updatedPatient = patient.addEntry(id, entry);
				return res.json(updatedPatient);
			}
			case "Hospital": {
				if (
					!entry.description ||
					!entry.date ||
					!entry.specialist ||
					(entry.diagnosisCodes &&
						!Array.isArray(entry.diagnosisCodes)) ||
					!entry.discharge ||
					!entry.discharge.date ||
					!entry.discharge.criteria
				) {
					return res
						.status(400)
						.json({ error: "Invalid or missing field" });
				}

				const updatedPatient = patient.addEntry(id, entry);
				return res.json(updatedPatient);
			}
			case "HealthCheck": {
				if (
					!entry.description ||
					!entry.date ||
					!entry.specialist ||
					(entry.diagnosisCodes &&
						!Array.isArray(entry.diagnosisCodes)) ||
					!((entry.healthCheckRating !== undefined) && (typeof entry.healthCheckRating === "number"))
				) {
					console.log(entry);
					return res
						.status(400)
						.json({ error: "Invalid or missing field" });
				}

				const updatedPatient = patient.addEntry(id, entry);
				return res.json(updatedPatient);
			}
			default:
				return res
					.status(400)
					.json({ error: "Invalid or missing field" });
		}
	}
);

app.use(errorMiddleware);

app.listen(PORT, () =>
	console.log(`Server listing on http://localhost:${PORT}`)
);
