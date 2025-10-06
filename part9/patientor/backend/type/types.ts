import { z } from "zod";
import { patientSchema } from "../utils/utils";

export type Diagnosis = {
	code: string;
	name: string;
	latin?: string;
};

export enum Gender {
	Other = "other",
	Male = "male",
	Female = "female",
}

interface Discharge {
	date: string;
	criteria: string;
}

interface SickLeave {
	startDate: string;
	endDate: string;
}

interface BaseEntry {
	id: string;
	description: string;
	date: string;
	specialist: string;
	diagnosisCodes?: Array<Diagnosis["code"]>;
}

interface OccupationalHealthcareEntry extends BaseEntry {
	type: "OccupationalHealthcare";
	employerName: string;
	sickLeave?: SickLeave;
}

interface HospitalEntry extends BaseEntry {
	type: "Hospital";
	discharge: Discharge;
}

export enum HealthCheckRating {
	Healthy = 0,
	LowRisk = 1,
	HighRisk = 2,
	CriticalRisk = 3,
}

interface HealthCheckEntry extends BaseEntry {
	type: "HealthCheck";
	healthCheckRating: HealthCheckRating;
}

export type Entry = OccupationalHealthcareEntry | HospitalEntry | HealthCheckEntry;

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
	? Omit<T, K>
	: never;

export type NewEntry = UnionOmit<Entry, "id">;

export interface Patient {
	id: string;
	name: string;
	dateOfBirth: string;
	ssn: string;
	gender: Gender;
	occupation: string;
	entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

export type NewPatient = z.infer<typeof patientSchema>;
