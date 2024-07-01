import User from "../models/User.js";

export const addContact = async (req, res) => {
  try {
    const { userId } = req.params;
    const { contactNum } = req.body;

    // Find the user who is adding the contact
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Find the contact user by email
    const contactUser = await User.findOne({ contact: contactNum });
    if (!contactUser) {
      return res
        .status(404)
        .json({ status: false, message: "Contact user not found" });
    }

    // Create a contact object with the contact's ID and username
    const contact = {
      contactId: contactUser._id,
      username: contactUser.username,
      email: contactUser.email,
      contact: contactUser.contact,
      member: contactUser._id,
    };

    // Add the contact to the user's contact list if not already added
    const isContactAlreadyAdded = user.contactList.some((c) =>
      c._id.equals(contactUser._id)
    );
    if (isContactAlreadyAdded) {
      return res
        .status(400)
        .json({ status: false, message: "Contact already added" });
    }

    // Add the contact to the user's contact list
    user.contactList.push(contact);
    user.chats.push({ member: contactUser._id });
    await user.save();
    res
      .status(201)
      .json({ status: true, message: "Contact added", contact: contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by their ID
    const user = await User.findById(userId).select("contactList");
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Return the user's contact list
    res.status(200).json({ status: true, contacts: user.contactList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
