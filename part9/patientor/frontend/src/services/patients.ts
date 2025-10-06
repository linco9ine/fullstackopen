import axios from "axios";
import { Patient, PatientFormValues, NewEntry, Entry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (id: string | undefined, entry: NewEntry) => {
  const { data } = await axios.post<Entry>(`${apiBaseUrl}/patients/${id}/entries`, entry);
  return data;
};
export default {
  getAll, create, addEntry
};

