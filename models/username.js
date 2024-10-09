const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

// 2.

const User = mongoose.model('Todo', userSchema);

// 3.

module.exports = User;