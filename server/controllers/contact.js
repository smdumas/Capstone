import { Router } from "express";
import Contact from "../models/contact.js";


const router = Router();

// Create contact route/Post
router.post("/", async (request, response) => {
  try {
    const newContact = new Contact(request.body);

    const data = await newContact.save();

    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    if ("name" in error && error.name === "ValidationError") return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

// Get all contact route /
router.get("/", async (request, response) => {
  try {
    // Store the query params into a JavaScript Object
    const query = request.query; // Defaults to an empty object {}

    const data = await Contact.find(query);

    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});


// Get a single contact by ID/contact/{id} Get which makes this unique
router.get("/:id", async (request, response) => {
  try {
    const data = await Contact.findById(request.params.id);

    // Get a single contact by ID /contact/{id} GET
    router.get("/:id", async (request, response) => {
      try {
        const data = await Contact.findById(request.params.id);

        if (data === null) response.status(404).json({ message: "Contact not found" });

        response.json(data);
      } catch (error) {
        // Output error to the console incase it fails to send in response
        console.log(error);

        return response.status(500).json(error.errors)
      }
    });


    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors)
  }
});



// Update a single contact by ID
router.put("/:id", async (request, response) => {
  try {
    const body = request.body;

    const data = await Contact.findByIdAndUpdate(
      request.params.id,
      {
        $set: {
          fname: body.fname,
          lname: body.lname,
          phone: body.phone,
          email: body.email
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});



// Delete a contact by ID/contact/{id} DELETE
router.delete("/:id", async (request, response) => {
  try {
    const data = await Contact.findByIdAndDelete(request.params.id);

    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});



export default router;
