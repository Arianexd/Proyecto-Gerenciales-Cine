const bcrypt = require('bcryptjs');
require('dotenv').config();
const { connectToDatabase } = require('./config/database');
const User = require('./models/User');

const updateAdminCredentials = async () => {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    const newPasswordHash = await bcrypt.hash('admin', 10);

    // Rename demo -> admin and set password to admin
    const result = await User.findOneAndUpdate(
      { Username: 'demo', Role: 'ADMIN' },
      { $set: { Username: 'admin', Email: 'admin@cinebook.local', PasswordHash: newPasswordHash } },
      { new: true }
    );

    if (result) {
      console.log('✅ Admin credentials updated:');
      console.log('   Username: admin');
      console.log('   Password: admin');
      console.log('   Email:   ', result.Email);
    } else {
      // Maybe username is already 'admin', just update password
      const result2 = await User.findOneAndUpdate(
        { Role: 'ADMIN' },
        { $set: { Username: 'admin', PasswordHash: newPasswordHash } },
        { new: true }
      );
      if (result2) {
        console.log('✅ Admin password updated (user was already admin):');
        console.log('   Username:', result2.Username);
        console.log('   Password: admin');
      } else {
        console.log('❌ No admin user found');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateAdminCredentials();
