const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");
const doordash = require('./routes/api/portal');

const PORT = 4000;
const app = express();


app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(helmet());

connectDB();
app.use("/v1/portal", doordash);
app.listen(PORT, console.log(`API is listening on port ${PORT}`));