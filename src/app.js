const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const booksRoutes = require('./routes/booksRoutes');
const memberRoutes = require('./routes/memberRoutes');
const borrowingsRoutes = require('./routes/borrowingsRoutes');
const algoritmaRoutes = require('./algoritma/algoritma');
const swaggerSpec = require('./docs/swagger');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/books', booksRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/borrowings', borrowingsRoutes);
app.use('/api/algoritma', algoritmaRoutes);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Library API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
