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
exports.getAllTours = async (req, res) => {
  
  try{
    const tours = await Tour.find();

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
      message : 'Invalid data sent!'
    })
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
