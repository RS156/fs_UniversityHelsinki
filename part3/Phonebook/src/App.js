import { useEffect, useState } from "react";
import contactService from './services/contacts'
import LabelInput from "./components/LabelInput";
import DisplayContacts from "./components/DisplayContacts";

const Notification = ({info, infoType}) =>{

  if(info ===null){
    return null
  }
  return(
    <div className={infoType}>{info}</div>
  )

}
const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilterName, setNewFilterName] = useState('')
  const [{info, infoType}, setInfo] = useState({info:null, infoType:null})

  const hook = () => {
    contactService
      .getAll()
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setPersons(response.data)
      })
  }

  const showInfo =  (text,type) => {
    console.log({info:text,
      infoType:type});
    setInfo({info:text,
      infoType:type})
    setTimeout(()=>{
      setInfo({info:null, infoType:null})},
      5000
    )
  }
  useEffect(hook, [])

  const updateExistingWithSamename = (person) => {
    
      const personInDb = persons.find(p => p.name === person.name)
      contactService
        .updatePerson(personInDb, person)
        .then(newPerson => {
          setPersons(persons.map(p => p.name ===person.name? newPerson.data : p)
              )
          console.log('update',persons);
        })
        .catch(error => {
          showInfo(error.response.data.error, 'error' )
        })
      setNewName('')
      setNewPhone('')
    
  } 

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPersonObj = {
      name: newName,      
      number: newPhone
    }
    if (persons.filter((p) => p.name === newName).length !== 0) {
      if( window.confirm(`${newName} is already added in the Phonebook, replace the old number with new one?`))
      {
        updateExistingWithSamename(newPersonObj)
        showInfo(`${newPersonObj.name} has been updated with new number`,'info')
      }    
      return
    }
    
    contactService
      .addPerson(newPersonObj)
      .then(res => {
        console.log(res);
        setPersons(persons.concat(res.data))
        setNewName('')
        setNewPhone('')
        showInfo(`${newPersonObj.name} has been added`,'info')
      })
      .catch(error => {
        showInfo(error.response.data.error,'error')
      })


  }

  const handleDeleteForPerson = (person) => () => {
    if(window.confirm(`Delete ${person.name}?`)){
      contactService
      .deletePerson(person)
      .then(response => {
        console.log(response);
        setPersons(persons.filter(p => p.id !== person.id))
      })
      showInfo(`${person.name} has been deleted`,'info')
    }
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification info={info} infoType={infoType} />
      <LabelInput label='Name Filter' val={newFilterName} setVal={setNewFilterName} />
      <h2>Add new</h2>
      <form>
        <LabelInput label='name' val={newName} setVal={setNewName} />
        <LabelInput label='phone' val={newPhone} setVal={setNewPhone} />
        <div>
          <button type="submit" onClick={handleSubmit}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <DisplayContacts persons={persons} filterName={newFilterName} onDeleteForPerson={handleDeleteForPerson} />
    </div>
  )
}

export default App;
