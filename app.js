const express = require('express');
const app = express();
const port = 3000;

const userRoutes = require('./routes/user.routes');

app.get('/', (req, res) => {
    //TODO: Add home page
    res.send('Hello World!');
});

app.get('/about', (req, res) => {
    //TODO: Add about page
    res.send('About page');
});

app.use('/api/user', userRoutes);

app.listen(port, () => {
    //TODO: User logger
    console.log(`Example app listening at http://localhost:${port}`);
});
