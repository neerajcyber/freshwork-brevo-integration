require('dotenv').config();
const express = require('express');
const app = express();
const port = 8080
const cors = require("cors");
const api = require('./api');
const freshworksApi = require('./Routes/freshwork.brevo.routes');
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(api)
app.use('/api/v1', freshworksApi)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})