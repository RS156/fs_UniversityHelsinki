/* eslint-disable no-undef */
const mongoose= require('mongoose')

if(process.argv.length < 3){
	console.log('Please enter password as argument')
	process.exit()
}


const password = process.argv[2]
const url = `mongodb+srv://notesDb:${password}@cluster0.aaghbyg.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)



const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})



const Person = mongoose.model('Person', personSchema)

if(process.argv.length < 4){
	console.log('phonebook:')
	Person.find({}).then(res => {
		res.forEach( p => {
			console.log(p.name, p.number)
		})
		mongoose.connection.close()   
		process.exit(0)     
	})
       
}
else {
	const person = new Person({
		name : process.argv[3],
		number : process.argv[4],
	})
    
	person.save().then(response => {
		const msg = `added ${response.name} number ${response.number} to phonebook`
		console.log(msg)
		mongoose.connection.close()
	})

}

