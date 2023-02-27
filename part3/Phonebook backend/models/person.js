const mongoose= require("mongoose");

// if(process.argv.length < 3){
//     console.log("Please enter password as argument");
//     process.exit()
// }
const phoneValidator = n=> {
    return /^(?=.{8,})\d{2,3}-\d+$/.test(n);
}
//const password = process.argv[2]
const url = process.env.MONGO_DB_URI
mongoose.set('strictQuery', false)

mongoose.connect(url).then(res =>{
    console.log('Connected to URL');
}).catch(error => {
    console.log('error while connecting to url', error.message);
})


const personSchema = new mongoose.Schema({
    name: {
        type : String,
        minlength : 3,
    },
    number: {
        type: String,
        validate: phoneValidator,
    }
})

personSchema.set('toJSON', {
    transform:  (doc, receivedObj) => {
        receivedObj.id =receivedObj._id.toString()
        delete receivedObj._id
        delete receivedObj.__v
    }
})

module.exports= mongoose.model('Person', personSchema)

// if(process.argv.length < 4){
//     console.log('phonebook:');
//     Person.find({}).then(res => {
//         res.forEach( p => {
//             console.log(p.name, p.number);
//         })
//         mongoose.connection.close()   
//         process.exit(0)     
//     })
       
// }
// else {
//     const person = new Person({
//         name : process.argv[3],
//         number : process.argv[4],
//     })
    
//     person.save().then(response => {
//         const msg = `added ${response.name} number ${response.number} to phonebook`
//         console.log(msg);
//         mongoose.connection.close()
//     })

// }

