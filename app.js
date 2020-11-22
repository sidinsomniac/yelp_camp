const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Campground = require('./models/campground');

const path = require('path');
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.route('/')
    .get((req, res) => {
        res.render("home");
    });

app.route('/campgrounds')
    .get(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds", { campgrounds });
    })
    .post(async (req, res) => {
        const camp = new Campground(req.body.campground);
        await camp.save();
        res.redirect(`/campgrounds/${camp._id}`);
    });

app.route('/campgrounds/new')
    .get(async (req, res) => {
        res.render('campgrounds/new');
    });

app.route('/campgrounds/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        const groundDetails = await Campground.findById(id);
        res.render('campgrounds/show', { groundDetails });
    });

app.listen(port, () => {
    console.log('Server started at ', port);
});