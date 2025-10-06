interface ExercisesSummary {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

export default function calculateExercises(
	exercise_hours: number[],
	target: number
): ExercisesSummary {
	const periodLength = exercise_hours.length;
	const trainingDays = exercise_hours.reduce(
		(days, h) => (h !== 0 ? days + 1 : days),
		0
	);
	const average =
		exercise_hours.reduce((sum, h) => sum + h, 0) / periodLength;
	const doneInPercentage = (average / target) * 100;
	let rating: number;
	let ratingDescription: string;

	if (doneInPercentage <= 50) {
		rating = 1;
		ratingDescription = "Not good you need to work hard";
	} else if (doneInPercentage < 100) {
		rating = 2;
		ratingDescription = "not too bad but could be better";
	} else {
		rating = 3;
		ratingDescription = "Great! good work";
	}

	const summary = {
		periodLength,
		trainingDays,
		success: average >= target,
		rating,
		ratingDescription,
		target,
		average,
	};
	
	return summary;}

if (require.main === module) {
const args = [...process.argv];

if (args.length < 4) {
	console.log(
		"Usage: npm run calculateExercises $TARGET $HOURS... (eg., 2 4 5 6 3 4 6)"
	);
	process.exit(1);
}

const isThereInvalidArg = args.slice(2).some((h) => Number.isNaN(Number(h)));

if (isThereInvalidArg) {
	console.log("Invalid arguments. hours must be numbers");
	process.exit(1);
}

const target = Number(args[2]);
const exercise_hours = args.slice(3).map((h) => Number(h));

console.log(calculateExercises(exercise_hours, target));
}