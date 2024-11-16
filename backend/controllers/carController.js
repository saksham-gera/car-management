const Car = require('../models/Car');
const cloudinary = require('../config/cloudinary');

// Function to upload images to Cloudinary from buffer
const uploadToCloudinary = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, 
        (error, result) => {
          if (error) {
            reject(new Error('Cloudinary upload failed'));
          } else {
            resolve(result); // Resolve the result when upload is successful
          }
        }
      );
      uploadStream.end(buffer); // Make sure to call .end(buffer) on the stream
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    throw new Error('Failed to upload images to Cloudinary');
  }
};

const deleteImages = async (imageUrls) => {
  try {
    const deletionPromises = imageUrls.map((url) => {
      const parts = url.split('/'); // Split the URL into parts
      const publicIdWithExtension = parts[parts.length - 1]; // Get the last part (e.g., ewfv6yua6bdfjbkctr5f.webp)
      const publicId = publicIdWithExtension.split('.')[0]; // Remove the file extension
      return cloudinary.uploader.destroy(publicId); // Delete the image by public ID
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
    const imagePromises = req.files.map((file) => uploadToCloudinary(file.buffer));
    const uploadedImages = await Promise.all(imagePromises);
    const imageUrls = uploadedImages.map((image) => image.secure_url);

    // Create new car object with image URLs
    const car = new Car({
      user: req.user.id,
      title,
      description,
      tags: tags.split(',').map((tag) => tag.trim()),
      images: imageUrls,
    });

    // Save the car to the database
    await car.save();
    res.status(201).json(car); // Send response with the created car
  } catch (err) {
    console.error('Error creating car:', err);
    res.status(500).json({ message: 'Error creating car', error: err.message });
  }
};

// Other CRUD operations (update, delete, get, etc.)
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user.id });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cars', error: err.message });
  }
};

// Fetch all cars for the logged-in user
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user.id });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cars', error: err.message });
  }
};

// Fetch all cars (no user filtering)
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cars', error: err.message });
  }
};

// Fetch a single car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id });
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

    const car = await Car.findOne({ _id: req.params.id, user: req.user.id });
    if (!car) return res.status(404).json({ message: 'Car not found or unauthorized' });

    // Update fields
    const updatedData = {
      title,
      description,
      tags: tags ? tags.split(',').map((tag) => tag.trim()) : car.tags,
    };

    // Handle image updates if new files are uploaded
    if (req.files && req.files.length > 0) {
      if (car.images && car.images.length > 0) {
        await deleteImages(car.images); // Delete old images
      }

      const imagePromises = req.files.map((file) => uploadToCloudinary(file.buffer));
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

    // Delete associated images
    if (car.images && car.images.length > 0) {
      await deleteImages(car.images);
    }

    res.json({ message: 'Car and associated images deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting car', error: err.message });
  }
};

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