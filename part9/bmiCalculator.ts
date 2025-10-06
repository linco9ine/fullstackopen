interface Bmi {
	weight: number,
	height: number,
	bmi: string
}

export default function bmiCalculator(height: number, weight: number): string | Bmi {
	const heightM = height / 100;
	const BMI = weight / (heightM * heightM);
	let message = "";

	if (BMI < 18.5) {
		message = "Underweight range";
	} else if (BMI < 25) {
		message = "Normal range";
	} else if (BMI < 30) {
		message = "Overweight range";
	} else {
		message = "Obese range";
	}

	if (require.main === module) {
		return message;
	}

	return {
		weight,
		height,
		bmi: message
	};
}

if (require.main === module) {
	const args = [...process.argv];
	let weight: number;
	let height: number;

	if (args.length < 4) {
		console.log("Usage: npm run caculateBmi $WEIGHT $HEIGHT");
	} else if (Number.isNaN(Number(args[2])) || Number.isNaN(Number(args[3]))) {
		console.log("Invalid input. WEIGHT and HEIGHT must be a number");
	} else {
		weight = Number(args[2]);
		height = Number(args[3]);

		console.log(bmiCalculator(weight, height));
	}
}
