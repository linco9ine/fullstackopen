import React, { useState, useEffect } from "react";
import type { Diary } from "./types";
import { addDiary, getAllDiaries } from "./services/diary";
import axios from "axios";

function App () {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diary = {date, visibility, weather, comment};
    try {
    const addedDiary = await addDiary(diary);
    setDiaries(diaries.concat(addedDiary));

    setDate("");
    setVisibility("");
    setWeather("");
    setComment("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setErrorMessage(error.response.data);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        }
      } else {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    getAllDiaries().then(data => setDiaries(data));
  }, []);

  return (
    <>
      <h3>Add new entry</h3>
      <p style={{ color: "red"}}>{errorMessage || '\u00A0'}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        </div>
        <div>
          <label>visibility: </label>
          <label>great</label>
          <input type="radio" name="visibility" value="great" checked={ visibility === "great" } onChange={(e) => setVisibility(e.target.value)} />
          <label>good</label>
          <input type="radio" name="visibility" value="good" checked={ visibility === "good" } onChange={(e) => setVisibility(e.target.value)} />
          <label>ok</label>
          <input type="radio" name="visibility" value="ok" checked={ visibility === "ok" } onChange={(e) => setVisibility(e.target.value)} />
          <label>poor</label>
          <input type="radio" name="visibility" value="poor" checked={ visibility === "poor" } onChange={(e) => setVisibility(e.target.value)} />
        </div>
        <div>
          <label>weather: </label>
          <label>sunny</label>
          <input type="radio" name="weather" value="sunny" checked={ weather === "sunny" } onChange={(e) => setWeather(e.target.value)} />
          <label>rainy</label>
          <input type="radio" name="weather" value="rainy" checked={ weather === "rainy" } onChange={(e) => setWeather(e.target.value)} />
          <label>cloudy</label>
          <input type="radio" name="weather" value="cloudy" checked={ weather === "cloudy" } onChange={(e) => setWeather(e.target.value)} />
          <label>stormy</label>
          <input type="radio" name="weather" value="stromy" checked={ weather === "stormy" } onChange={(e) => setWeather(e.target.value)} />
          <label>windy</label>
          <input type="radio" name="weather" value="windy" checked={ weather === "windy" } onChange={(e) => setWeather(e.target.value)} />
        </div>
        <div>
          <label>comment<input value={comment} onChange={(e) => setComment(e.target.value)} /></label>
        </div>
        <button type="submit">add</button>
      </form>
      {diaries.length != 0 && (
        <>
        <h3>Diary entries</h3>
        {diaries.map(d => (
          <div key={d.id}>
            <h4>{d.date}</h4>
            <div>visibility: {d.visibility}</div>
            <div>weather: {d.weather}</div>
            <div>comment: {d.comment}</div>
          </div>
        ))}
        </>
      )}
    </>
  );
}

export default App;