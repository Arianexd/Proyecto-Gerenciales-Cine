const mongoose = require('mongoose');

const REQUIRED_MONGODB_URI =
  'mongodb+srv://grupogerenciales:wXm5j5BR@cluster0.ebkcypd.mongodb.net/CinemaDB?retryWrites=true&w=majority&appName=cluster0';
const REQUIRED_DB_TARGET = 'cluster0.ebkcypd.mongodb.net/CinemaDB';
const REQUIRED_DB_NAME = 'CinemaDB';

function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      'Missing MONGODB_URI. Create backend/.env based on backend/env.example before starting the server.',
    );
  }

  if (!mongoUri.includes('cluster0.ebkcypd.mongodb.net')) {
    throw new Error(
      `Invalid MONGODB_URI. This project is configured to use only ${REQUIRED_DB_TARGET}.`,
    );
  }

  return mongoUri;
}

async function connectToDatabase() {
  const mongoUri = getMongoUri();
  const connection = await mongoose.connect(mongoUri, { dbName: REQUIRED_DB_NAME });

  if (connection.connection.name !== REQUIRED_DB_NAME) {
    throw new Error(
      `Unexpected MongoDB database "${connection.connection.name}". Expected "${REQUIRED_DB_NAME}".`,
    );
  }

  return connection;
}

module.exports = {
  connectToDatabase,
  REQUIRED_DB_NAME,
  REQUIRED_DB_TARGET,
};
