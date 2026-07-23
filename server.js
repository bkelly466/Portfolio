require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { appendContact } = require('./sheets');

const app = express();

app.use(morgan('dev'));
app.use('/Public', express.static('Public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/thanks', async (req, res) => {
    try {
        await appendContact(req.body);
    } catch (err) {
        console.error('Failed to save contact submission:', err.message);
    }
    res.render('thanks', { contact: req.body });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
