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
    console.log("Datebase connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.route('/')
    .get((req, res) => {
        res.render("home");
    });

app.route('/campgrounds')
    .get(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds", { campgrounds });
    });

app.route('/campgrounds/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        const groundDetails = await Campground.findById(id);
        res.render('campgrounds/show', { groundDetails });
    });


app.route('/campgroundCreate')
    .get(async (req, res) => {
        const camp = new Campground({
            title: "New Camp",
            description: "Cheap Campground"
        });
        await camp.save();
        res.send(camp);
    });

app.listen(port, () => {
    console.log('Server started at ', port);
});