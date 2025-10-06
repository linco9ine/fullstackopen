import axios from "axios";
import { useState, useEffect } from "react";
import { Patient } from "../../types";
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import PatientEntry from "../PatientEntry";
import HealthCheckEntryForm from "../PatientEntry/HealthCheckEntryForm";
import HospitalEntryForm from "../PatientEntry/HospitalEntryForm";
import OccupationalHealthcareEntryForm from "../PatientEntry/OccupationalHealthcareEntryForm";

const OnePatient = () => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [showHealthCheckEntryForm, setShowHealthCheckEntryForm] = useState<boolean>(false);
    const [showHospitalEntryForm, setShowHospitalEntryForm] = useState<boolean>(false);
    const [showOccupationalHealthcareEntryForm, setShowOccupationalHealthcareEntryForm] = useState<boolean>(false);
    //const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
    const id = useParams<{ id: string }>().id;

    /*const getDiagnosisCodeDescription = (code: string): string | undefined => {
      for (const d of diagnosis) {
        if (code === d.code) {
          return d.name;
        }
      }
    };*/

    /*useEffect(() => {
        axios
          .get<Diagnosis[]>("http://localhost:3001/api/diagnosis")
          .then(res => setDiagnosis(res.data));
    }, []);*/

    const onClickForHealthCheckEntry = () => {
      setShowHealthCheckEntryForm(!showHealthCheckEntryForm);
      setShowHospitalEntryForm(false);
      setShowOccupationalHealthcareEntryForm(false);
    };
    const onClickForHospitalEntry = () => {
      setShowHospitalEntryForm(!showHospitalEntryForm);
      setShowHealthCheckEntryForm(false);
      setShowOccupationalHealthcareEntryForm(false);
    };
    const onClickForOccupationalHealthcareEntry= () => {
      setShowOccupationalHealthcareEntryForm(!showOccupationalHealthcareEntryForm);
      setShowHealthCheckEntryForm(false);
      setShowHospitalEntryForm(false);
    };

    useEffect(() => {
        if (!id) return;
        axios
          .get<Patient>(`http://localhost:3001/api/patients/${id}`)
          .then(res => setPatient(res.data));
    }, [id]);

    return (
        <>
          <Button variant="contained" color="secondary" sx={{ margin: '8px auto' }} onClick={onClickForHealthCheckEntry} fullWidth>Add HealthCheck Entry</Button>
          {showHealthCheckEntryForm && <HealthCheckEntryForm setPatient={setPatient} onClick={onClickForHealthCheckEntry} /> }
          <Button variant="contained" color="warning" sx={{ margin: '8px auto' }} onClick={onClickForHospitalEntry} fullWidth>Add Hospital Entry</Button>
          {showHospitalEntryForm && <HospitalEntryForm setPatient={setPatient} onClick={onClickForHospitalEntry} /> }
          <Button variant="contained" color="error" sx={{ margin: '8px auto' }} onClick={onClickForOccupationalHealthcareEntry} fullWidth>Add Occupational Healthcare Entry</Button>
          {showOccupationalHealthcareEntryForm && <OccupationalHealthcareEntryForm setPatient={setPatient} onClick={onClickForOccupationalHealthcareEntry} /> }

          {patient && (
            <>
              <h3>
                {patient.name} {
                  patient.gender === "male"
                   ? <MaleIcon />
                   : patient.gender === "female"
                     ? <FemaleIcon />
                     : <TransgenderIcon />
                  }
              </h3>
              <div>ssn: {patient.ssn}</div>
              <div>occupation: {patient.occupation}</div>
              <h2>entries</h2>
              {patient.entries.map(e => (
                <PatientEntry key={e.id} entry={e} />
              ))}
            </>
          )}

        </>
    );
};

export default OnePatient;