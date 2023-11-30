const fs = require('fs');
const Tour = require('../models/tourModel')
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/appError')
const APIFeatures = require('../Utils/apiFeatures')

// alias middleware
const aliasTopTours = (req,res,next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// get allTours
const getAllTours = catchAsync ( async (req,res,next) => {

    // execute query
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query;

    // send response
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });

});

// get single Tour
const getTour = catchAsync( async (req, res,next) => {
  
  const tour = await Tour.findById(req.params.id);
  // const tour = Tour.findOne({ _id: req.params.id })

  if(!tour){
    return next(new AppError('No tour found with that ID',404))
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tour.length,
    data: {
      tour
    }
  });


});

// create Tour
const createTour = catchAsync( async (req, res,next) => {

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });

});

// update single tour
const updateTour =  catchAsync ( async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
    new : true,
    runValidators: true
  });

  if(!tour){
    return next(new AppError('No tour found with that ID',404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });

});

//delete
const deleteTour = catchAsync( async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if(!tour){
    return next(new AppError('No tour found with that ID',404))
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Tour not found',
  });


  res.status(200).json({
    status: 'success',
    data: {
      tour // Return the deleted tour data
    },
  });

});

const getTourStats = catchAsync( async (req,res) => {

  // aggregation pipe line
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage : { $gte : 4.5 }}
    },
    {
      $group: {
        // _id: null, // not group
        _id: {$toUpper : '$difficulty'}, // we can use the toUpper to convert the request
        // _id: '$ratingsAverage', // this group by difficulty 
        numTours: {$sum : 1}, // add document one by one
        numRatings: { $sum: '$ratingsQuantity'},
        avgRating: { $avg: '$ratingsAverage'},
        avgPrice: { $avg: '$price'},
        minPrice: { $min: '$price'},
        maxPrice: { $max: '$price'},
        sumPrice: { $sum: '$price'},
      },
    },
    {
      $sort : { avgPrice: 1 }
    },
    // {
    //   $match: { _id: {$ne: 'EASY'}}
    // }
  ]) 

  res.status(200).json({
    status: 'success',
    data: {
      stats // Return the deleted tour data
    },
  });

});

const getMonthlyPlan = catchAsync( async (req,res) => {

  const year = req.params.year * 1 // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates' // use to distruct the startData array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        }
      },
    },
    {
      $group: {
        _id: { $month: '$startDates'},
        numTourStarts: { $sum: 1},
        tours: { $push: '$name' } // make array by name field
      }
    },
    {
      $addFields: { month: '$_id'} // add new field by id that grouped by month(so id is month)
    },
    {
      $project: { // to make id dissapear
        _id: 0
       }
    },
    {
      $sort: {numTourStarts: -1} // sort desending
    },
    {
      $limit: 12 // limit the output
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan 
    },
  });
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
}

