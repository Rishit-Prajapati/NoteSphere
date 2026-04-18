const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = 'prajapatiarshit11@gmail.com';
    const adminUser = await User.findOne({ email: adminEmail }).select('+password');

    if (!adminUser) {
      await User.create({
        name: 'RISHIT PRAJAPATI',
        email: adminEmail,
        password: 'NoteSphere@26#College',
        role: 'admin'
      });
      console.log('✅ Admin user created successfully');
    } else {
      // Sync admin details if they exist
      let updated = false;
      if (adminUser.role !== 'admin') { adminUser.role = 'admin'; updated = true; }
      if (adminUser.name !== 'RISHIT PRAJAPATI') { adminUser.name = 'RISHIT PRAJAPATI'; updated = true; }
      
      // We only update password if explicitly needed or if synchronization is requested
      // For now, let's keep it simple to avoid multiple hashing runs
      adminUser.password = 'NoteSphere@26#College';
      updated = true;

      if (updated) {
        await adminUser.save();
        console.log('✅ Admin account synchronized');
      } else {
        console.log('ℹ️ Admin user already exists and is synchronized');
      }
    }
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
  }
};

module.exports = seedAdmin;
