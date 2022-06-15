import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [searchString, setSearchString] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
  }, [])

  const addContact = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    if (persons.every(p => p.name !== newName)) {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMsg(
            `When creating/updating a phonebook contact, the name must be at least 3 characters long and the number must be in format xx-xxxxx... or xxx-xxxx...`+
            `\n\nReceived the following error message: ${error.response.data.error}`
          )
          setTimeout(() => {
            setErrorMsg(null)
          }, 30000)
        })
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(n => n.name === newName)
        personService
          .update(person.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.number !== person.number ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification(`Number of ${person.name} changed successfully`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMsg(
              `When creating/updating a phonebook contact, the name must be at least 3 characters long and the number must be in format of xx-xxxxx... or xxx-xxxx...`+
              `\n\nReceived th following error message: ${error.response.data.error}`
            )
            setTimeout(() => {
              setErrorMsg(null)
            }, 30000)
          })
      }
    }
  }

  const deleteContact = x => {
    if (window.confirm(`Delete ${x.name}?`)) {
      personService
        .remove(x.id)
        .then(response => {
            delete persons[x.id - 1]
            personService.getAll().then(initialPersons => {
              setPersons(initialPersons)
            })
            setNotification(`Deleted ${x.name}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchStringChange = (event) => {
    console.log(event.target.value)
    setSearchString(event.target.value)
    setShowAll(false)
  }

  const contactsToShow = showAll
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(searchString))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Error message={errorMsg} />
      <Filter v={searchString} f={handleSearchStringChange}/>
      <h3>Add a new</h3>
      <PersonForm 
        v1={newName}
        v2={newNumber}
        f1={addContact}
        f2={handleNameChange}
        f3={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons arr={contactsToShow} f={deleteContact} />
    </div>
  )

}

export default App
