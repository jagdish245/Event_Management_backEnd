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

module.exports = { createEvent, displayEvent, getEventById, registerForEvent };
