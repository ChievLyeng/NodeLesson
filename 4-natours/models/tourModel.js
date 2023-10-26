const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name : { 
        type : String,
        required : [true,'A tour must have a name'],
        unique : true,
        trim: true
    },
    duration : {
        type : Number,
        require : [true, 'A tour must have a duration']
    },
    maxGroupSize : {
        type: Number,
        require : [true, 'A tour must have a group size']
    },
    difficulty:{
        type: String,
        require : [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type : Number,
        default : 4.5
    },
    ratingsQuantity:{
        type: Number,
        default: 0
    },
    price : {
        type : Number,
        required : [true, 'A tour must have a price']
    },
    priceDiscount : {
        type: Number
    },
    summary : {
        type : String,
        trim: true, // it remove the white space from the beggining
        required: [true,'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images:{
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates :{
        type: [Date],
    }
});

module.exports = mongoose.model('Tour',tourSchema);