import mongoose from "mongoose";
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
    },
    user_id: {
        type: String,
        require: true
    },
    created_by: {
        type: String,
        require: true
    },  
    last_msg_date:Date
})

const Contact = mongoose.models.contacts || mongoose.model('contacts', contactSchema);
module.exports = Contact;