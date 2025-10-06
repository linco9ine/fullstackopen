import axios from "axios";
import type { Diary } from "../types";

const baseUrl = "http://localhost:3000/api/diaries"

export const getAllDiaries = async () => {
    const res = await axios.get<Diary[]>(baseUrl);
    return res.data;
}

export const addDiary = async (diary: Omit<Diary, "id">) => {
    const res = await axios.post(baseUrl, diary);
    return res.data;
}