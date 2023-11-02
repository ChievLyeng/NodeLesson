const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name : { 
        type : String,
        required : [true,'A tour must have a name'],
        unique : true,
        trim: true,
        maxlength: [40,'A tour name must have less or equal then 40 characters.'],
        minlength: [10, 'A tour name must have more or equal then 10 characters.']
        // validate: [validator.isAlpha,'Tour name must only contain character!']
    },
    slug: {
        type: String
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
        require : [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy','medium','difficulty'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type : Number,
        default : 4.5,
        min: [1,'Rating must be above 1.0'],
        max: [5,'Rating must be below 5.0'],
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
        type: Number,
        validate: {
            validator: function(val){
                // this only points to current doc on New document creation
                return val < this.price; // discount price must lower than regular price
            },
            message: 'Discount price (${VALUE}) should be below regular price' 
        }
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
        default: Date.now,
        select : false // when request not allow to see createdAt
    },
    startDates :{
        type: [Date],
    },
    secretTour:{
        type: Boolean,
        default: false
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// virtual properties
tourSchema.virtual('durationsWeeks').get(function(){
    return this.duration / 7
})

tourSchema.virtual('DoublePrice').get(function(){
    return this.price * 2
})

// mongo middleware

// document middleware: runs before .save() and .create() but not update
tourSchema.pre('save', function(next){
    // console.log(this); // current process document
    this.slug = slugify(this.name, { lower: true });
    next(); // call next middleware if we don't call this it will stuck here not call the below middleware
})  

// tourSchema.pre('save',function(next){
//     console.log(doc)
//     next();
// })

// tourSchema.post('save', function(doc,next){
//     console.log(doc);
//     next();
// })

//Query Middleware 
// this work before the execution of query in create function
// tourSchema.pre('find',function(next){ 
//     this.find({secretTour: { $ne: true }});
//     next();
// })

// if we write regular expression like this it will work with all find
// and this middleware is use for not showing the secret tour 
tourSchema.pre(/^find/,function(next){ 
    this.find({secretTour: { $ne: true }});

    this.start = Date.now();
    next();
})

// this run after the query done so it can access to docs
tourSchema.post(/^find/,function(docs,next){
    console.log(`Query tood ${Date.now() - this.start} milliseconds!`)
    console.log(docs);
    next();
})

//Aggregation middleware
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({ $match: {secretTour: { $ne: true } } })
    console.log(this.pipeline()); // it point to current aggregation object
    next();
})

module.exports = mongoose.model('Tour',tourSchema);