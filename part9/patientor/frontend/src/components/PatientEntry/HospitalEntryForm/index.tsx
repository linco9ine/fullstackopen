import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TextField, Button, Box, Alert, Select, MenuItem, InputLabel } from "@mui/material";
import { Patient, Diagnosis, HospitalEntry } from "../../../types";
import patients from "../../../services/patients";
import diagnosis from "../../../services/diagnosis";

interface Prop  {
    setPatient: React.Dispatch<React.SetStateAction<Patient | null>>
    onClick: React.Dispatch<React.SetStateAction<React.MouseEvent>>
}

const HospitalEntryForm = ({ setPatient, onClick }: Prop) => {
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);
    const [codes, setCodes] = useState<Array<Diagnosis['code']>>([]);
    const [dischargeDate, setDischargeDate] = useState("");
    const [dischargeCriteria, setDischargeCriteria] = useState("");
    const [message, setMessage] = useState("");

    const id = useParams<{id: string}>().id;
    
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const entry: Omit<HospitalEntry, "id">= {
            description,
            date,
            specialist,
            diagnosisCodes,
            discharge: { date: dischargeDate, criteria: dischargeCriteria},
            type: "Hospital"
        };
        try {
            const addedEntry = await patients.addEntry(id, entry);
            setPatient(prev => prev
                ? { ...prev, entries: prev?.entries.concat(addedEntry) }
                : prev
            );

            setDescription("");
            setDate("");
            setSpecialist("");
            setDiagnosisCodes([]);
            setDischargeDate("");
            setDischargeCriteria("");
        } catch (error: unknown) {
            if (error instanceof axios.AxiosError) {
                setMessage(error.response?.data.error);
                setTimeout(() => {
                  setMessage("");
                }, 4000);
            }
        }
    };

    useEffect(() => {
      diagnosis.getAll().then(res => setCodes(res.data.map(d => d.code)));
    }, []);

    return (
    <>
<Box component="form" onSubmit={handleSubmit} sx={{
    border: "2px dotted gray",
    padding: 2,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginTop: 5,
    margin: "auto"
}}>
        { message ? <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert> : "" }
        <h4>New Hospital Entry</h4>

        <TextField
          label="Description"
          variant="standard"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          label="Date"
          variant="standard"
          fullWidth
          value={date}
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setDate(e.target.value)}
        />

        <TextField
          label="Specialist"
          variant="standard"
          fullWidth
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
        />

        <InputLabel>Discharge</InputLabel>
        <Box>
        <TextField
          sx={{ ml: "10px" }}
          label="Date"
          variant="standard"
          fullWidth
          value={dischargeDate}
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setDischargeDate(e.target.value)}
        />

        <TextField
          sx={{ ml: "10px" }}
          label="Criteria"
          variant="standard"
          fullWidth
          value={dischargeCriteria}
          onChange={(e) => setDischargeCriteria(e.target.value)}
        />
        </Box>

        <InputLabel>Diagnosis codes</InputLabel>
        <Select
          multiple
          value={diagnosisCodes}
          onChange={(e) => {
            const value = e.target.value;
            setDiagnosisCodes(typeof value === "string" ? value.split(',') : value);
          }}
          >
            {
              codes.map(c => <MenuItem value={c} key={c}>{c}</MenuItem> )
            }
        </Select>

        <div style={{ display: "flex", justifyContent: "space-between"}}>
          <Button variant="contained" color="error" onClick={onClick}>Cancel</Button>
          <Button type="submit" variant="contained">Add</Button>
        </div>
    </Box>
    
    </>
    );
};

export default HospitalEntryForm;