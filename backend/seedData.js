// const mongoose = require('mongoose');
// const Employee = require('./models/Employee'); // Assuming you have an Employee model

// // MongoDB URI
// const uri = 'mongodb://localhost:27017/yourDatabaseName';

// const employees = [ /* The array of 30 employee objects from above */ ];

// mongoose.connect(uri)
//   .then(async () => {
//     await Employee.insertMany(employees); // Insert the data into the Employee collection
//     console.log('30 employees added to the database!');
//     mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error('Error inserting data:', err);
//     mongoose.disconnect();
//   });
