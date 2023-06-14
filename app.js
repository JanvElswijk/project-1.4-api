const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/user.routes');

const bodyParser = require('body-parser');

// set a limit of 50mb for the body-parser
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    //TODO: Add home page
    return res.send('Hello World!');
});

app.get('/about', (req, res) => {
    //TODO: Add about page
    return res.send('About page');
});

app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
