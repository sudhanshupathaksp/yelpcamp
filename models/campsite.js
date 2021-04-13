const { json } = require('express');
const { func } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user');

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON : { virtuals: true}};

const CampsiteSchema = new Schema({
    title: String,
    Images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampsiteSchema.virtual('properties.popUp').get(function () {
    return `<strong><a href = "/campsites/${this._id}">${this.title}</a></strong>`
});

CampsiteSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campsite' , CampsiteSchema);

