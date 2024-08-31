require("dotenv").config();
const Sentry = require("./instrument.js");

require("./mongo");
const express = require("express");
const taskRoutes = require("./routes/tasks.js");
const usersRoutes = require("./routes/users.js")
const loginRoutes = require("./routes/login.js");
const handleErrors = require("./middleware/handleErrors.js");

Sentry.init();

const app = express();

Sentry.setupExpressErrorHandler(app);

app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/login", loginRoutes);
app.use(handleErrors);

// const PORT = process.env.PORT;
// const server = app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

module.exports = app;