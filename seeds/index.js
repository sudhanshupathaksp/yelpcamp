const mongoose = require('mongoose');
const Campsite = require('../models/campsite');
const cities = require('./cities');
const { places , descriptors} = require('./helpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campsite.deleteMany({});
    for(let i = 0; i<300; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 500) + 10;
       const camp = new Campsite({
           //author here is pathak
            author: '60714b35c6b89f2880e7c370',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi nihil atque error corporis neque adipisci, quos animi qui vero rerum? Iure eum nesciunt ullam repellat natus aliquid cupiditate! Omnis, culpa!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            Images:  [
                        {
                            url: 'https://res.cloudinary.com/dtrj6ryzw/image/upload/v1618130100/hvyegjuypiicpjpfkiey.jpg',
                            filename: 'YelpCloud/hvyegjuypiicpjpfkiey'
                        },
                        {
                         url: 'https://res.cloudinary.com/dtrj6ryzw/image/upload/v1618128802/gmvryhamjmsitxmudpfi.jpg',
                         filename: 'YelpCloud/gmvryhamjmsitxmudpfi'
                        }
                    ]
       })
        await camp.save();
    }
    
}

seedDB().then(() => {
    mongoose.connection.close();
})