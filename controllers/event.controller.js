const mongoose = require("mongoose");
const Event = require("../models/event.model");
const User = require("../models/user.model");

const createEvent = async (req, res) => {
  try {
    const img = `localhost:3001/public/${req.file.filename}`;
    const data = {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      ticket: req.body.ticket,
      image: img,
    };

    const createdEvent = await Event.create(data);

    res.status(200).json({ Message: "Event Created Successfully" });
  } catch (error) {
    res.status(500).json({ Messge: error });
  }
};

const displayEvent = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ Message: error });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ Message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ Message: error });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user?._id;

    if (!eventId || !userId) {
      return res
        .status(400)
        .json({ Message: "Event ID and User ID are required" });
    }

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ Message: "User of Event not found" });
    }

    if (!Array.isArray(user.events)) {
      return res
        .status(500)
        .json({ Message: "User events data is not an array" });
    }
    const isRegistered = user.events.some(
      (e) => e.event.toString() === eventId
    );

    if (isRegistered) {
      return res
        .status(400)
        .json({ Message: "Already registered for the event" });
    }

    user.events.push({ event: eventId, registrationDate: new Date() });
    event.registeredUsers.push(userId);

    await user.save();
    await event.save();

    res
      .status(200)
      .json({ Message: "Successfully Registered for the Event", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Message: error });
  }
};

const getRegisteredEvents = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("events.event");

    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }
    res.status(200).json(user.events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ Message: error });
  }
};

const ticket = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.eventId;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const user = await User.findById(userId).populate({
      path: "events.event",
      match: { _id: eventId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!Array.isArray(user.events)) {
      return res.status(400).json({ message: "No events found for this user" });
    }

    const registeredEvent = user.events.find(
      (e) => e.event && e.event._id.toString() === eventId
    );

    if (!registeredEvent) {
      return res
        .status(400)
        .json({ message: "Registration not found for this event" });
    }

    const ticketDetails = {
      ticketNumber: registeredEvent._id,
      attendeeName: user.fullname,
      eventName: registeredEvent.event.name,
      eventDate: registeredEvent.event.date,
      location: registeredEvent.event.location,
      purchaseDate: registeredEvent.registrationDate,
    };

    res.status(200).json(ticketDetails);
  } catch (error) {
    console.error("Error in ticket handler:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.eventId;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.events = user.events.filter((e) => e.event.toString() !== eventId);

    await user.save();

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.registeredUsers = event.registeredUsers.filter(
      (userIdInArray) => userIdInArray.toString() !== userId.toString()
    );

    await event.save();

    res.status(200).json({ message: "Registration canceled successfully" });

  } catch (error) {
    console.error("Error canceling registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEvent,
  displayEvent,
  getEventById,
  registerForEvent,
  getRegisteredEvents,
  ticket,
  cancelRegistration,
};
