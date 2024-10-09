const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const prompt = require('prompt-sync')();

const User = require('./models/username');

const connect = async () => {

    // Connect to MongoDB using the MONGODB_URI specified in our .env file.
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  
    // Call the runQueries function, which will eventually hold functions to work
    // with data in our db.
    await runQueries()
  
    // Disconnect our app from MongoDB after our queries run.
    await mongoose.disconnect();
    console.log('exiting...');
  
    // Close our app, bringing us back to the command line.
    process.exit();
  };

  const runQueries = async () =>{

    let quit = false;

    while(!quit){
        console.log(`
Welcome to the CRM

What would you like to do?

    1. Create a customer
    2. View all customers
    3. Update a customer
    4. Delete a customer
    5. Quit
      `);
      const option = prompt('Number of action to run: ');
    
      switch(option){
        case '1':
            await createCustomer();
            break;
        case '2':
            await viewAllCustomers();
            break;
        case '3':
            await updateACustomer();
            break;
        case '4':
            await deleteACustomer();
            break;
        case '5':
            quit = true;
            break;
        default:
            console.log(`
                Invalid input
                `);
      };

      if (quit === false) { 
        const timeToLeave = prompt(`
Press "Y" if you would like to continue: `);
        if (timeToLeave !== 'y' && timeToLeave !== 'Y') {
            quit = true;
        }
    }
    }
  
  };


  const createCustomer = async () => {

    const nameData = prompt('Customer name: ');
    const ageData = prompt('Customer age: ');

    console.log(`
        Customer name: ${nameData}
        Customer age: ${ageData}
        `)
    const correct = prompt(`
Press Y to add this customer: `);

    if(correct === 'y' || correct === 'Y'){
        const userData = {
            name: nameData,
            age: ageData,
        };

        const user = await User.create(userData);

        console.log(`New customer added:
            ${user}`);
    } else {
        console.log('User not added');
    }

  };

  const viewAllCustomers = async () => {

    const users = await User.find({});
    console.log(users);
  };

  const updateACustomer = async () => {
    const users = await User.find({});

    console.log(`
        Below is a list of customers:
        `)
    users.forEach((user) => {
        console.log(`id: ${user._id} -- Name: ${user.name} Age: ${user.age}`);
    });

    const userToDeleteID = prompt('Copy and paste the id of the customer you would like to update here: ');

    const nameData = prompt("What is the user's new name: ");
    const ageData = prompt("What is the user's new age: ");

    const userToEdit = await User.findById(userToDeleteID);

    userToEdit.name = nameData;
    userToEdit.age = ageData;

    console.log(`
        Customer name: ${userToEdit.name}
        Customer age: ${userToEdit.age}
        `)
    
    const correct = prompt('Press Y to save these changes: ');

    if(correct === 'y' || connect === 'Y'){
        await userToEdit.save();
        console.log(`User ID: ${userToDeleteID} -- Name: ${userToEdit.name} Age: ${userToEdit.age}`);
    }else{
        console.log('No changes were made');
    }


  };

  const deleteACustomer = async () => {

    const users = await User.find({});

    console.log(`
        Below is a list of customers:
        `)
    users.forEach((user) => {
        console.log(`id: ${user._id} -- Name: ${user.name} Age: ${user.age}`);
    });

    const userToDeleteID = prompt('Copy and paste the id of the customer you would like to delete here: ');

    const userToDelete = await User.findById(userToDeleteID);

    console.log(`
        Customer name: ${userToDelete.name}
        Customer age: ${userToDelete.age}
        `)

    const correct = prompt('Press Y to delete this customer: ');

    if(correct === 'y' || correct === 'Y'){
        await User.findByIdAndDelete(userToDeleteID);
        console.log(`User ID: ${userToDeleteID} deleted`);
    } else {
        console.log('Customer not deleted');
    }
  };




  connect();