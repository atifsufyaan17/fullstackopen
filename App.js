import axios from 'axios'
import React, { useEffect, useState } from 'react'
import comm from './services/comm'

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

const Person = ({personsFiltered, handleDelete}) => {
  return (    
    <ul>
      {personsFiltered.map((person) => {
        return <li key={person.id}>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button> </li>
      })}
    </ul>
  )
}

const Notification = ({notification, notificationColor}) => {
  if(notification === null){
    return null
  }
  const notificationStyle = {
    color: notificationColor,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    padding: 10,
    marginBottom: 10,
  }
  return (
    <div style={notificationStyle}>
      {notification}
    </div>
  )
} 

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationColor, setNotificationColor] = useState('green')

  const hook = () => {
    comm
      .retrieve()
      .then((response) => {
        setPersons(response)
      })
  }
  useEffect(hook, [])

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterInput = (event) => {
    setFilterName(event.target.value)
  }

  const createPerson = (newPerson) => {    
    comm
    .create(newPerson)
    .then((response) => {
      setNewName('')
      setPersons(persons.concat(response))
      setNewNumber('')
      setNotification(`Added ${response.name}`)
      setNotificationColor('green')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
  }

  const updatePerson = (id, newPerson) => {
    comm
      .update(id, newPerson)
      .then((response) => {
        setPersons(persons.map(person => person.id === id ? response : person))
        setNotification(`Added ${response.name}`)
        setNotificationColor('green')
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(() => {
        setNotification(`The entry ${newPerson.name} is already deleted from server`)
        setNotificationColor('red')
        setPersons(persons.filter(person => person.id !== id))
      })
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    const per = persons.find(person => person.name === newName)
    if(per !== undefined){
      if(window.confirm(`${newName} is already added to the phonebook, replace old number with new one?`)){
        updatePerson(per.id, newPerson)
      }
    }
    else{
      createPerson(newPerson)
    }
  }

  const personsFiltered = persons.filter((person) => {
    return filterName.toLowerCase() === person.name.slice(0, filterName.length).toLowerCase()
  })

  const handleDelete = (id) => {
    const p = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${p.name}`)) {
      comm
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(() => {
          setNotification(`The entry ${p.name} is already deleted from server`)
          setNotificationColor('red')
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} notificationColor={notificationColor}/>
      <Filter filterName={filterName} handleFilterInput={handleFilterInput} />
      <h2>Add a new</h2>
      <PersonForm handleSubmit={handleSubmit} handleNameInput={handleNameInput} handleNumberInput={handleNumberInput} newName={newName} newNumber={newNumber} />
      <h2>Numbers</h2>
      <Person personsFiltered={personsFiltered} handleDelete={handleDelete}/>
    </div>
  )
}

export default App