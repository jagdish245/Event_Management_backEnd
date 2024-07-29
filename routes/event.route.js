const express = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware");
const {
  createEvent,
  displayEvent,
  getEventById,
  registerForEvent,
  getRegisteredEvents,
  ticket,
  cancelRegistration,
} = require("../controllers/event.controller");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

router.post("/postEvent", upload.single("image"), createEvent);
router.get("/getEvent", displayEvent);
router.get("/getEvent/:id", getEventById);
router.post("/registerForEvent/", verifyJWT, registerForEvent);
router.get("/getRegisteredEvents", verifyJWT, getRegisteredEvents);
router.get("/ticket/:eventId", verifyJWT, ticket);
router.delete("/cancelRegistration/:eventId", verifyJWT, cancelRegistration);

module.exports = router;
