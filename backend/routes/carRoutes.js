const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createCar,
  getCars,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  searchCars,
} = require('../controllers/carController');

const router = express.Router();

router.post('/', protect, createCar);                // Create car
router.get('/', protect, getCars);               // get all cars for loggedin users
router.get('/all', getAllCars);
router.get('/search', protect, searchCars);          // Search cars by keyword
router.get('/:id', getCarById);             // Get car by ID
router.put('/:id', protect, updateCar);              // Update car by ID
router.delete('/:id', protect, deleteCar);           // Delete car by ID

module.exports = router;