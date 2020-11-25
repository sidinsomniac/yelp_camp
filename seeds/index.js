const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors, secondaryDescriptors } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let newIndex = randomNumber(1000);
        const price = randomNumber(25) + 5;
        let newCity = new Campground(
            {
                title: randomName(),
                location: `${cities[newIndex].city}, ${cities[newIndex].state}`,
                image: 'https://source.unsplash.com/collection/190727/1600x900',
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit natus rem, aliquid commodi sequi unde!',
                price: price
            });
        await newCity.save();
    }
};

const randomNumber = (limit) => {
    return Math.floor(Math.random() * limit);
};

const randomName = () => {
    return descriptors[randomNumber(19)] + ' ' + secondaryDescriptors[randomNumber(14)] + places[randomNumber(21)];
};

seedDB().then(() => {
    mongoose.connection.close();
});