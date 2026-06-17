const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes =
  require("./routes/authRoutes");

const boardRoutes =
require("./routes/boardRoutes"); 

const taskRoutes =
require("./routes/taskRoutes");

const app = express();

app.use(
  cors({
    origin:
      "https://project-management-dashboard-woad-tau.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/boards",
  boardRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);


mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log(
      "MongoDB Connected"
    );

    app.listen(
      process.env.PORT,
      () => {
        console.log(
          `Server running on port ${process.env.PORT}`
        );
      }
    );
  })
  .catch(console.log);