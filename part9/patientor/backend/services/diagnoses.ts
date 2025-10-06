import { Diagnosis } from "../type/types";
import data from "../data/diagnoses";

const getAll = (): Diagnosis[] => data;

export default { getAll };
