const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // Load environment variables
dotenv.config(); // Load environment variables from .env file



const PORT = process.env.PORT;
const connectDb = require('./database/db.js');




const userRoutes = require('./routes/userRoute.js'); // Adjust the path as needed
    

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



// Connect to the database
connectDb();

// Routes
app.use('/user',userRoutes );

// Start the server
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));