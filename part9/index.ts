import express from "express";
import bmiCalculator from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

interface ReqBody {
	daily_exercises: number[];
	target: number;
};

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
	res.send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
	const weight = req.query.weight;
	const height = req.query.height;

	if (!weight || !height || Number.isNaN(Number(weight)) || Number.isNaN(Number(height))) {
		return res.status(400).json({ error: "malformatted parameter" });
	}

	const bmi = bmiCalculator(Number(height), Number(weight));

	return res.json(bmi);
});

app.post("/exercises", (req, res) => {
	const { daily_exercises, target } = req.body as ReqBody;
	
	if (!daily_exercises || (target !== 0 && !target)) {
		return res.status(400).json({ error: "parameters missing" });
	};

	if (Number.isNaN(Number(target)) || daily_exercises.length < 2) {
		return res.status(400).json({ error: "malformatted parameters" });
	}

	const isThereInvalidArg = daily_exercises.some((h) => !h || Number.isNaN(Number(h)));

	if (isThereInvalidArg) {
		return res.status(400).json({ error: "malformatted parameters" });
	}

	const summary = calculateExercises(daily_exercises, target);

	return res.json(summary);
});

app.listen(3000, () => console.log("Server listing on http://localhost:3000"));
