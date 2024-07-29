const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_NAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.status(200).json({ Message: "Login successful" });
  } else {
    res.status(401).json({ Message: "Invalid Credentials" });
  }
};

module.exports = { adminLogin };
