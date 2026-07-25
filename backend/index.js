const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const { connectDB } = require("./lib/db");
const auth_router = require("./routes/auth_routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const chat_router = require("./routes/chat_routes");
const path = require("path");


app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/generated", express.static(path.join(__dirname, "public/generated")));
app.use("/api/auth", auth_router);
app.use("/api/chat", chat_router);


app.listen(8080, () => {
    console.log("Server Started!");
    connectDB();
})