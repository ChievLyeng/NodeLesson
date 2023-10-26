const fs = require('fs');
const Tour = require('../models/tourModel')

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// const testTour = new tour({
//   name : "ENGLAND",
//   price : 1900

// })


// testTour
// .save()
// .then((doc => {
//   console.log(doc);
// }))
// .catch((error) => {
//   console.log("Error",error);
// })



// get allTours
exports.getAllTours = async (req, res) => {

  // build query
  const queryObj = {...req.query}
  const excludedFields = ['page','sort','limit','fields']
  excludedFields.forEach(el => delete queryObj[el]); // loop to delete the excludedFields

  const query = Tour.find(queryObj)
  // console.log(req.query,queryObj);
  
  try{
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

    // execute query
    const tours = await query;
    
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

