const Car = require('../models/Car.js');

// Create a new car
exports.createCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files.map((file) => file.path);
    const car = new Car({
      user: req.user.id,
      title,
      description,
      tags: tags.split(',').map((tag) => tag.trim()),
      images,
    });
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: 'Error creating car', error: err.message });
  }
};

// Get all cars for the logged-in user
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user.id });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cars', error: err.message });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cars', error: err.message });
  }
};

// Get a single car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id});
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching car', error: err.message });
  }
};

// Update a car
exports.updateCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const updatedData = {
      title,
      description,
      tags: tags ? tags.split(',').map((tag) => tag.trim()) : undefined,
    };

    // If new images are uploaded, replace the existing images
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map((file) => file.path);
    }

    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updatedData,
      { new: true }
    );

    if (!car) return res.status(404).json({ message: 'Car not found or unauthorized' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: 'Error updating car', error: err.message });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!car) return res.status(404).json({ message: 'Car not found or unauthorized' });
    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting car', error: err.message });
  }
};

// Search cars by keyword (title, description, or tags)
exports.searchCars = async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i'); // Case-insensitive regex for partial matching

    const cars = await Car.find({
      user: req.user.id,
      $or: [
        { title: regex },
        { description: regex },
        { tags: { $in: [regex] } },
      ],
    });

    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error searching cars', error: err.message });
  }
};