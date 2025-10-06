import axios from "axios";
import { Diagnosis } from "../types";

const baseUrl = "http://localhost:3001/api";

const getAll = async () => {
    const allDiagnosisCodes = await axios.get<Diagnosis[]>(`${baseUrl}/diagnosis`);
    return allDiagnosisCodes;
};

export default { getAll };