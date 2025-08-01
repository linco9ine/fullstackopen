import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const StatisticLine = ({ text, value }) => {
	if (text === "positive") {
		return (
			<tr>
			  <td>{text}</td>
			  <td>{value}%</td>
			</tr>
		);
	}
	
	return (
		<tr>
		  <td>{text}</td>
		  <td>{value}</td>
		</tr>
	);
}

const Statistics = ({ good, neutral, bad }) => {

  const all = (good + neutral + bad);
  const average = ((good * 1) + (neutral * 0) + (bad * -1)) / all;
  const positive = (good / all) * 100;

  if (good === 0 && neutral === 0 && bad === 0) return <p>No feedback given</p>;

  return (
    <table>
	  <tbody>
	    <StatisticLine text="good" value={good}/>
	    <StatisticLine text="neutral" value={neutral}/>
	    <StatisticLine text="bad" value={bad}/>
	    <StatisticLine text="all" value={all}/>
	    <StatisticLine text="average" value={average}/>
	    <StatisticLine text="positive" value={positive}/>
	  </tbody>
    </table>
  );
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>

      <h1>give feedback</h1>

	  <Button onClick={() => setGood(good + 1)} text="good"/>
	  <Button onClick={() => setNeutral(neutral + 1)} text="neutral"/>
	  <Button onClick={() => setBad(bad + 1)} text="bad"/>

	  <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}


export default App
