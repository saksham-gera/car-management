const Car = require('../models/Car.js');
const cloudinary = require('../config/cloudinary.js');


const deleteImages = async (imageUrls) => {
  try {
    const deletionPromises = imageUrls.map((url) => {
      const publicId = url.split('/').pop().split('.')[0]; // Extract the public ID from the URL
      return cloudinary.uploader.destroy(publicId);       // Delete the image by public ID
    });

    return await Promise.all(deletionPromises); // Wait for all deletions
  } catch (err) {
    console.error('Error deleting images from Cloudinary:', err);
    throw new Error('Failed to delete images');
  }
};

// Create a new car
exports.createCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    // Upload images to Cloudinary
    const imagePromises = req.files.map((file) => cloudinary.uploader.upload(file.path));
    const uploadedImages = await Promise.all(imagePromises);
    const imageUrls = uploadedImages.map((image) => image.secure_url);

    const car = new Car({
      user: req.user.id,
      title,
      description,
      tags: tags.split(',').map((tag) => tag.trim()),
      images: imageUrls,
    });

    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: 'Error creating car', error: err.message });
  }
};

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

    const car = await Car.findOne({ _id: req.params.id, user: req.user.id });
    if (!car) return res.status(404).json({ message: 'Car not found or unauthorized' });

    // If new images are uploaded, delete existing images and upload new ones
    if (req.files && req.files.length > 0) {
      if (car.images && car.images.length > 0) {
        await deleteImages(car.images);
      }
      const imagePromises = req.files.map((file) => cloudinary.uploader.upload(file.path));
      const uploadedImages = await Promise.all(imagePromises);
      updatedData.images = uploadedImages.map((image) => image.secure_url);
    }

    const updatedCar = await Car.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updatedData,
      { new: true }
    );

    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ message: 'Error updating car', error: err.message });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!car) return res.status(404).json({ message: 'Car not found or unauthorized' });
    if (car.images && car.images.length > 0) {
      await deleteImages(car.images);
    }

    res.json({ message: 'Car and associated images deleted successfully' });
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