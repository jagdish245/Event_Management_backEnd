const express = require("express");
const {
  createEvent,
  displayEvent,
  getEventById,
  registerForEvent,
} = require("../controllers/event.controller");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

router.post("/postEvent", upload.single("image"), createEvent);
router.get("/getEvent", displayEvent);
router.get("/getEvent/:id", getEventById);
router.post("/registerForEvent/", registerForEvent);

module.exports = router;