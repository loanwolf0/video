
const mongoose = require('mongoose');
const mongoURL = `${process.env.MONGO_URL}${process.env.DB_NAME}`;
mongoose.set('debug', Boolean(process.env.DB_LOG));

mongoose.connect(mongoURL).then(() => {
  console.log('DB connection established');
}).catch(error => {
  console.error(error, 'could not establish mongoose connection');
});
