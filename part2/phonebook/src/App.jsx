import { useState, useEffect } from 'react'
import noteServices from './services/notes'

const Filter = ({ text, onChange, searchWord }) => {
	return (
      <div>
		{text}<input value={searchWord} onChange={onChange}/>
	  </div>
	);
}

const PersonForm = ({ newName, newNumber, onSubmit, nameOnChange, numberOnChange, buttonText}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={nameOnChange}/>
      </div>

      <div>
        number: <input value={newNumber} onChange={numberOnChange}/>
      </div>

      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  );
}

const Person = ({ id, name, number, onDelete}) => {
  return (
    <>
	  <p>{name} {number} <Delete id={id} name={name} onDelete={onDelete} /></p>
	</>
  );
}

const Persons = ({ persons, searchWord, onDelete }) => {
  return (
    <>
    
	  {
        searchWord
		  ? persons.filter(person => person.name.toLowerCase().includes(searchWord.toLowerCase()))
		      .map(person => <Person key={person.id} id={person.id} name={person.name} number={person.number} onDelete={onDelete} />)
		  : persons.map(person => <Person key={person.id} id={person.id} name={person.name} number={person.number} onDelete={onDelete} />)
	  }
	</>
  );
}

const Delete = ({ id, name, onDelete }) => {
	return <button onClick={() => onDelete(id, name)}>delete</button>
}

const Notification = ({ message }) => {
	const notificationStyle = {
	  color: 'green',
	  border: '1px solid green',
	  padding: '2px',
    margin: '3px',
    visibility: message ? 'visible' : 'hidden'
	}

	return (
	  <div style={notificationStyle} >
		{message}
	  </div>
	);
}

const ErrorMessage = ({ message }) => {
 const errorMessageStyle = {
   color: 'red',
   border: '1px solid red',
   padding: '2px',
   margin: '3px',
   visibility: message ? 'visible' : 'hidden'
 }

 return (
   <div style={errorMessageStyle} >
	 {message}
   </div>
 );
}

const App = () => {
  const [persons, setPersons] = useState([])
 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [notifyAdded, setNotifyAdded] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = (e) => {
	  e.preventDefault();
	  const person = persons.find(person => person.name === newName);
	  if (person) {
		  const confirm = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);
		  if (confirm) {
			const updatedPerson = {...person, number: newNumber};
		    noteServices
			  .update(person.id, updatedPerson)
			  .then(data => setPersons(persons.map(person => person.id === data.id ? data : person)))
		  }
	  } else {
		  const data = {name: newName, number: newNumber};
		  noteServices
		    .create(data)
		    .then(data => {
				setPersons(persons.concat(data))
				setNotifyAdded(`Added ${data.name}`)
				setTimeout(() => setNotifyAdded(null), 10000)
			})
      .catch(err => {
        setErrorMessage(err.response.data.error);
        setTimeout(() => setErrorMessage(null), 10000);
      })
	  }

	  setNewName('');
	  setNewNumber('');
  }

  const searchWordOnChange = (e) => setSearchWord(e.target.value);
  const nameOnChange = (e) => setNewName(e.target.value);
  const numberOnChange = (e) => setNewNumber(e.target.value);
  const onDelete = (id, name) => {
	const confirmDelete = window.confirm(`Delete ${name}`);
	if (confirmDelete) {
      noteServices
		.deletePerson(id)
		.then(() => setPersons(persons.filter(person => person.id !== id)))
		.catch(() => {
			setErrorMessage(`Information of ${name} has been already been removed from server`)
			setTimeout(() => setErrorMessage(null), 10000)
		})
	}
  }

  useEffect(() => {
    noteServices
	  .getAll()
	  .then(data => {
		  setPersons(data);
	  })
  }, []);

  return (
    <div>

      <h2>Phonebook</h2>
	  <Notification message={notifyAdded} />
	  <ErrorMessage message={errorMessage} />
	  <Filter text="filter showen with" searchWord={searchWord} onChange={searchWordOnChange} />

	  <h2>add a new</h2>
      <PersonForm
	    newName={newName}
	    newNumber={newNumber}
	    onSubmit={onSubmit}
	    nameOnChange={nameOnChange}
	    numberOnChange={numberOnChange}
	    buttonText="add"
	  />

      <h2>Numbers</h2>
	  <Persons persons={persons} searchWord={searchWord} onDelete={onDelete} />

    </div>
  )
}

export default App
