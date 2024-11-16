require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const { SwaggerUIBundle, SwaggerUIStandalonePreset } = require('swagger-ui-dist');
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Management API',
      version: '1.0.0',
      description: 'API documentation for Car Management System',
    },
    servers: [{ url: `${process.env.SERVER_URL}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["/var/task/backend/routes/*.js"],
};
const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';
const options = {
customCssUrl: CSS_URL,
customCss: `
    .swagger-ui .opblock-summary-path {
      width: 50vw;
      display: inline-flex;
      white-space: nowrap;
      overflow-wrap: break-word;
      margin: 0;
      padding: 0;
    }
    .swagger-ui .opblock-summary {
      display: flex;
      align-items: center;
    }
  `,
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/docs', swaggerUi.serveFiles(swaggerDocs, options), swaggerUi.setup(swaggerDocs, options));
app.use('/api/cars', upload.array('images', 10), carRoutes);

// Root Route
app.get('/', (req, res) => res.send('Welcome to the Car Management API'));

// Start Server
const PORT = process.env.PORT || 6868;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));