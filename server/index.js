const express = require('express');
const cors = require('cors')
const Morgan = require('morgan');

const app = express();
//const port = 6000;
const path = require("path")
require('dotenv').config({ path: path.join(__dirname, '.env') })
const port = process.env.SERVER_APP_PORT;

require('./configs/db.connection.js')
const fs = require('fs');
if (!fs.existsSync('./temporary')) {
  fs.mkdirSync('./temporary');
}

// Middleware to parse JSON in request body
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json({ limit: '100mb' }))
app.use(cors());
app.use(Morgan('dev')); // Use 'dev' for concise colored output

app.use('/api/auth', require('./routes/authenticate.js'));
// app.use("/common", require("./routes/common.js"))
console.log("hello server ");


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
