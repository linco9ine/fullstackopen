import { Card, CardContent } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { Entry } from "../../types";

const PatientEntry = ({ entry }: { entry: Entry }) => {
	const style = { marginBottom: 3 };

	const assertNever = (value: never): never => {
		throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
	};

	switch (entry.type) {
		case "OccupationalHealthcare":
			return (
				<Card sx={style}>
					<CardContent>
						<p>{entry.date} <WorkIcon /> {entry.employerName}</p>
						<p>{entry.description}</p>
						<p>{entry.specialist}</p>
					</CardContent>
				</Card>
			);
		case "Hospital":
			return (
				<Card sx={style}>
					<CardContent>
						<p>{entry.date}</p>
						<p>{entry.description}</p>
					</CardContent>
				</Card>
			);
		case "HealthCheck": {
			const riskLevel = {
				color: entry.healthCheckRating === 0
				? "green"
				: entry.healthCheckRating === 1
				? "yellow"
				: entry.healthCheckRating === 2
				? "#e93d1fff"
				: "red"
			};
			return (
				<Card sx={style}>
					<CardContent>
						<p>{entry.date} <MedicalInformationIcon /> </p>
						<p>{entry.description}</p>
						<FavoriteIcon sx={riskLevel}/>
						<p>{entry.specialist}</p>
					</CardContent>
				</Card>
			);
		}
		default:
			return assertNever(entry);
	}
};

export default PatientEntry;