import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    validate: /^[A-Za-z0-9 ]*$/
  },
  lname: {
    type: String,
    required: true,

  },
  phone: {
    type: String,

  },
  email: {
    type: String,
    required: true,

  }
});

const Contact = mongoose.model("Contact", contactSchema);


export default Contact;
