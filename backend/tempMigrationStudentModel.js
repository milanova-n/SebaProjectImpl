import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { Student } from './models/studentModel.js'; // Adjust the path to your Student model
import { Event } from './models/eventModel.js'; // Adjust the path to your Event model
const DB_URI = process.env.MONGODB_URI_ATLAS;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Connect to MongoDB
mongoose.connect(DB_URI, options);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('ERROR: Failed to connect to the database.');
  console.error(err);
});

//node .\tempMigrationStudentModel.js

db.once('open', async () => {
  console.log('Connected to the database successfully.');

  try {
      //Students without courses                                                        Change here if needed
    const result = await Event.updateMany(
      {
          //Change here if needed not necessary, can be empty
        tickets: { $exists: false }
      },
      {
        $set: {
            //Change here if needed
          tickets: []
        }
      }
    );

    console.log(`${result.nModified} documents updated successfully.`);
  } catch (err) {
    console.error('Error updating students:', err);
  } finally {
    console.log('Database connection closed.');
    mongoose.connection.close();
  }
});
