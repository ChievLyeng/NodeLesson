const fs = require('fs');
const Tour = require('../models/tourModel')

class APIFeatures {
  constructor(query,queryString){
    this.query = query;
    this.queryStr = queryString;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page','sort','limit','fields']
    excludedFields.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); 
    
    this.query.find(JSON.parse(queryStr));
  }

  sort() {
    if(this.query.sort) {
      const sortBy = this.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy)
     }else{
      this.query = this.query.sort('-cretedAt');
     }

     return this;
  }

  limitFields() {
    if(this.query.fields){
      const fields = this.query.fields.split(',').join(' ');
      this.query = this.query.select(fields)
      
     }else{
      this.query = this.query.select('-__V');
     }

     return this;
  }

  paginate() {
    const page = this.query.page * 1 || 1;
     const limit = this.query.limit * 1 || 100;
     const skip = (page - 1) * limit; // we have to skip 10 for a page

    // page=3&limit=10, 1-10 ,page=1, 11-20, page2, 21-30, page3
    this.query = this.query.skip(skip).limit(limit);

   return this;
  }

}

exports.aliasTopTours = (req,res,next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// get allTours
exports.getAllTours = async (req, res) => {

  try{

    // build query
    // 1A) Filtering
    // const queryObj = {...req.query}
    // const excludedFields = ['page','sort','limit','fields']
    // excludedFields.forEach(el => delete queryObj[el]); // loop to delete the excludedFields
    
    // 1B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // finding in database
    // let query = Tour.find(JSON.parse(queryStr))

     // 2) Sorting
    //  if(req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy)
    //  }else{
    //   query = query.sort('-cretedAt');
    //  }
     
     // 3) Field limiting
    //  if(req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields)
      
    //  }else{
    //   query = query.select('-__V');
    //  }

     // 4) pagination
    //  const page = req.query.page * 1 || 1;
    //  const limit = req.query.limit * 1 || 100;
    //  const skip = (page - 1) * limit; // we have to skip 10 for a page

    // page=3&limit=10, 1-10 ,page=1, 11-20, page2, 21-30, page3
    // query = query.skip(skip).limit(limit);

    // if (req.query.page){
    //   const numTours = await Tour.countDocuments();
    // }
  
    // execute query
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query;
    // console.log(req.query);

    // first solution of filter
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // });

    // second solution of filter
    // const tours = await Tour.find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy')

    
    // send response
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });

  }catch(err){
      res.status(400).json({
        status : "fail",
        message : "error fetching data"
      })
  }

};

// get single Tour
exports.getTour = async (req, res) => {
  
  try{
    const tour = await Tour.findById(req.params.id);
    // const tour = Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tour.length,
      data: {
        tour
      }
    });

  }catch(err){
    res.status(400).json({
        status : "fail",
        message : "error fetching data"
      })
  }
};

// create Tour
exports.createTour = async (req, res) => {
  try{
    // console.log(req.body);
  
      const newTour = await Tour.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
  }catch(err){
    res.status(400).json({
      status : 'fail',
      message : err
    })
  }
};

// update single tour
exports.updateTour = async (req, res) => {
  try{
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
        new : true,
        runValidators: true
      });

      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
  }
  catch(err){
    res.status(400).json({
        status : "fail",
        message : "error fetching data"
      })
  }
};

//delete
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour // Return the deleted tour data
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Error deleting data',
    });
  }
};

