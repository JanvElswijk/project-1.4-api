const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/user.routes');

const bodyParser = require('body-parser');

// set a limit of 50mb for the body-parser
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    return res.status(200).json({message: 'Dit is niet de goeie route, gebruik /api/user of /about'});
});

app.get('/about', (req, res) => {
    return res.status(200).json({ message: 'Dit is de backend van MijnWoongenoot, gebruik /api/user voor alle functionaliteiten' });
});

app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`MijnWoongenoot app listening on port ${port}`);
});

module.exports = app;
