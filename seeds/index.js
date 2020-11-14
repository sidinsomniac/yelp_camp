const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors, secondaryDescriptors } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once('open', () => {
    console.log("Datebase connected");
});

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let newIndex = randomIndex(1000);
        let newCity = new Campground({ title: randomName(), location: `${cities[newIndex].city}, ${cities[newIndex].state}` });
        await newCity.save();
    }
};

const randomIndex = (limit) => {
    return Math.floor(Math.random() * limit);
};

const randomName = () => {
    return descriptors[randomIndex(19)] + ' ' + secondaryDescriptors[randomIndex(14)] + places[randomIndex(21)];
};

seedDB().then(() => {
    mongoose.connection.close();
});