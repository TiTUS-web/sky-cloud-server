const express = require('express');

const userRouter = require('./routes/user.routes');

const PORT = process.env.PORT || 9000;

const app = express();

app.use(express.json());

app.use('/api', userRouter);

app.get('/', (req, res) => {
  res.send('Working...');
});

app.listen(PORT, () => {
  console.log('Server started');
});
