const express = require('express');
const { protect } = require('../middleware/Auth.js');
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

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: APIs for car management
 */

/**
 * @swagger
 *  /api/cars:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data: # Indicate file upload
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Upload up to 10 image files
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Bad request (e.g., invalid file type or missing data)
 */
router.post('/', protect, createCar);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars for the logged-in user
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars
 */
router.get('/', protect, getCars);

/**
 * @swagger
 * /api/cars/all:
 *   get:
 *     summary: Get all cars (no user filtering)
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: List of all cars
 */
router.get('/all', getAllCars);

/**
 * @swagger
 * /api/cars/search:
 *   get:
 *     summary: Search cars by keyword
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Keyword to search
 *     responses:
 *       200:
 *         description: List of cars matching the keyword
 */
router.get('/search', protect, searchCars);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car details
 *       404:
 *         description: Car not found
 */
router.get('/:id', getCarById);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update car by ID
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *     responses:
 *       200:
 *         description: Updated car details
 */
router.put('/:id', protect, updateCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete car by ID
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car deleted successfully
 */
router.delete('/:id', protect, deleteCar);

module.exports = router;