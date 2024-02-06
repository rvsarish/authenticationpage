const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb+srv://sari:sari@cluster0.pgymmnx.mongodb.net/?retryWrites=true&w=majority");

connect.then((db) => {
    console.log("Connected to the server");
}, (err) => { 
    console.log(err); 
});

const LoginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const collection = mongoose.model('users', LoginSchema);

module.exports = collection;
