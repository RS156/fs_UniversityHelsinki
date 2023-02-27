

const DisplayContacts = ({ persons, filterName, onDeleteForPerson }) => {
  console.log("Display contacts",persons);
  const personsToDisplay = persons.filter((p) => {
    //console.log(p);
    return p.name.toLowerCase().includes(filterName.toLowerCase())
  })
  return (
    <div>
      {personsToDisplay.map((person) => {
        //console.log('Display Contacts', person.name);
        return <Person key={person.id} person={person}
          onDelete={onDeleteForPerson(person)} />
      })}
    </div>
  )

}

const Person = ({person, onDelete}) => {
  return (
    <div>
        {person.name}  {person.number}      
      <button onClick={onDelete}> Delete </button>
    </div>
  )
}

export default DisplayContacts