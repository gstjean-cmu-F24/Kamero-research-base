const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

module.exports = app;

app.use(bodyParser.json());
app.use(cors());

// Import the routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const lecturerRoutes = require('./routes/lecturer');
const studentRoutes = require('./routes/student');

// Use the routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/lecturer', lecturerRoutes);
app.use('/student', studentRoutes);

//  remember to replace the below "app.listen" with this code, for production
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })
// app.listen(3000, ()=> {
//     console.log('server listening on port 3000');
//
// });

//  Start the server normally when not testing
if (require.main === module) {
    app.listen(PORT, () => {
        console.log('Server is running on port 3000');
    });
}

app.get('/', (req, res) => {

res.send("<h3>Welcome to Kamero research base, home for all your research needs</h3>");
});





