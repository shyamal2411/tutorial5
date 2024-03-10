const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let users = [];

function generateId() {
  let id;
  do {
    id = Math.random().toString(36).substr(2, 9);
  } while (users.some((user) => user.id === id));
  return id;
}

app.get("/users", (req, res) => {
  res.json({
    message: "Users retrieved",
    success: true,
    users: users,
  });
});

app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  const { email, firstName } = req.body;
  if (!email || !firstName) {
    return res.status(400).json({
      message: "Email and first name are required",
      success: false,
    });
  }

  users[userIndex] = { ...users[userIndex], email, firstName };

  res.json({
    message: "User updated",
    success: true,
  });
});

app.post("/add", (req, res) => {
  const { email, firstName } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({
      message: "Email and first name are required",
      success: false,
    });
  }

  const newUser = {
    id: generateId(),
    email,
    firstName,
  };

  users.push(newUser);

  res.json({
    message: "User added",
    success: true,
  });
});

app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  res.json({
    success: true,
    user: user,
  });
});

app.use((err, res) => {
  console.error(err.stack);
  res.status(500).json({
    message: "An unexpected error occurred",
    success: false,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
