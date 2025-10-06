import { v1 as uuid } from "uuid";
import {
	Patient,
	NewPatient,
	NonSensitivePatient,
	Entry,
	NewEntry,
} from "../type/types";
import patients from "../data/patients";

let data = [...patients];

const getAll = (): Patient[] => {
	return data;
};

const addPatient = (patient: NewPatient): NonSensitivePatient => {
	const newPatient: Patient = { id: uuid(), ...patient, entries: [] };
	data.concat(newPatient);

	return {
		id: newPatient.id,
		name: newPatient.name,
		dateOfBirth: newPatient.dateOfBirth,
		gender: newPatient.gender,
		occupation: newPatient.occupation,
	};
};

const getOne = (id: string): Patient | undefined => {
	const patient = data.find((d) => d.id === id);
	if (patient) {
		return patient;
	}

	return undefined;
};

const addEntry = (id: string, entry: NewEntry): Entry | undefined => {
	const patient: Patient = data.find((p) => p.id === id)!;
	const newEntry: Entry = { id: uuid(), ...entry };
	const updatedPatient: Patient = {
		...patient,
		entries: patient.entries.concat(newEntry),
	};
	data = data.map((d) => (d.id === id ? updatedPatient : d));

	return newEntry;
};

export default { getAll, addPatient, getOne, addEntry };
