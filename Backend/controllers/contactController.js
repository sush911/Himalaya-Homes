import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
      submittedBy: req.user._id,
    });

    res.status(201).json({ message: "Contact message submitted successfully", contact });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to submit contact message" });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    
    const contacts = await Contact.find(filter)
      .populate("submittedBy", "firstName lastName email")
      .sort({ createdAt: -1 });
    
    res.json(contacts);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to fetch contact messages" });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("submittedBy", "firstName lastName email");

    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json({ message: "Status updated", contact });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to update status" });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json({ message: "Contact message deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to delete contact message" });
  }
};

