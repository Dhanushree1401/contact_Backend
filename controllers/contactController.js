import Contact from '../models/contact.js';
import mongoose from 'mongoose';
const getContacts = async (req, res) => {
    const { sortType } = req.query; // Get sort type from query parameters
    let sortQuery = {};

    // Determine sorting behavior based on sortType
    if (sortType === 'latest') {
        sortQuery.last_modified = -1; // descending order (newest first)
    } else if (sortType === 'oldest') {
        sortQuery.last_modified = 1;  // ascending order (oldest first)
    } else if (sortType === 'a-z') {
        sortQuery.name = 1;           // ascending order (A-Z)
    } else if (sortType === 'z-a') {
        sortQuery.name = -1;          // descending order (Z-A)
    }

    try {
        // Fetch contacts from the database with sorting
        const contacts = await Contact.find().sort(sortQuery);
        res.json(contacts); // Return sorted contacts
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateContact = async (req, res) => {
    const { id } = req.params; // Get the contact ID from the request parameters
    const updateData = req.body; // Get the update data from the request body

    console.log('Received ID for update:', id); // Log the ID to verify

    try {
        // Find the contact by ID
        const contact = await Contact.findOne({ _id: id });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        // Update the fields of the contact
        console.log(contact);
        Object.assign(contact, updateData);

        // Save the updated contact back to the database
        const updatedContact = await contact.save();

        res.json(updatedContact); // Send the updated contact as the response
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle any errors
    }
};



const deleteContact = async (req, res) => {
    const { id } = req.params; // Extract ID from request parameters

    console.log('Received ID:', id); // Log the actual ID value

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        // Find the contact using `findOne` and delete
        const contact = await Contact.findOne({ _id: id });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        // Delete the contact
        await contact.deleteOne();

        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error('Error deleting contact:', error.message);
        res.status(500).json({
            message: "Error deleting contact",
            error: error.message || "Unknown error",
        });
    }
};


export { getContacts, addContact, updateContact, deleteContact };
