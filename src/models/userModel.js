import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        maxlength: [20, 'Name must be less than or equal to 20 characters.']
    },
    email: { 
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
    },
    password: { 
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
},
{
    timestamps: true
})

const User = mongoose.models.Users || mongoose.model('Users', userSchema);
module.exports = User;