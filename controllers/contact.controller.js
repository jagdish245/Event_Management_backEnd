const Contact = require("../models/contact.model");

const query = async (req, res) => {
  try {
    const { firstName, lastName, email, eventId, query } = req.body;
    const newQuery = await Contact.create({
      firstName,
      lastName,
      email,
      eventId,
      query,
    });

    res.status(200).json({ Message: "Query sent Successfully" });
  } catch (error) {
    res.status(500).json({ Message: error });
  }
};

const getQuery = async (req, res) => {
  try {
    const queries = await Contact.find({});
    res.json(queries);
  } catch (error) {
    res.status(500).json({ Message: error });
  }
};
const deleteQuery = async (req, res) => {
  try {
    const queryId = req.params.id;
    const deletedQuery = await Contact.findByIdAndDelete(queryId);

    if (!deleteQuery) {
      return res.status(404).json({ Message: "Query not found" });
    }
    res.status(200).json({ Message: "Query deleted successfully" });
  } catch (error) {
    res.status(500).json({ Message: error });
  }
};
module.exports = { query, getQuery, deleteQuery };
