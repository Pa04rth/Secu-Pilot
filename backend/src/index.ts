const express = require('express')
const cors = require('cors');
const app = express()
const apiRouter = require('./routes/api');

app.use(express.json());
 

app.use('/api', apiRouter);
app.use(cors())

app.listen(process.env.PORT || 3001, () => {
  console.log(`App listening on port 3001`)
})
