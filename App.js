import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ filterName, handleFilterInput }) => {
  return (
    <div>
      filter shown with <input value={filterName} onChange={handleFilterInput} />
    </div>
  )
}

const PersonForm = ({ handleSubmit, newName, handleNameInput, newNumber, handleNumberInput }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameInput} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberInput} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({personsFiltered}) => {
  return (
    <ul>
      {personsFiltered.map((person) => {
        return <li key={person.id}>{person.name} {person.number}</li>
      })}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => {
        setPersons(response.data)
      })
  }
  useEffect(hook, [])

  persons.forEach((person) => {
    if (person.name === newName) {
      alert(`${newName} is already added to the phonebook`)
    }
  })

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterInput = (event) => {
    setFilterName(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const personsFiltered = persons.filter((person) => {
    return filterName.toLowerCase() === person.name.slice(0, filterName.length).toLowerCase()
  })

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filterName={filterName} handleFilterInput={handleFilterInput} />
      <h2>Add a new</h2>
      <PersonForm handleSubmit={handleSubmit} handleNameInput={handleNameInput} handleNumberInput={handleNumberInput} newName={newName} newNumber={newNumber} />
      <h2>Numbers</h2>
      <Persons personsFiltered={personsFiltered} />
    </div>
  )
}

export default App