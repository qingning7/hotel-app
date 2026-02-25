const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Subscription = require('./models/Subscription');
const connectDB = require('./db');

const dataFile = path.join(__dirname, 'data.json');

const importData = async () => {
  await connectDB();

  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    const data = JSON.parse(raw);

    // Import Users
    if (data.users && data.users.length > 0) {
      await User.deleteMany();
      await User.insertMany(data.users);
      console.log('Users Imported!');
    }

    // Import Hotels
    if (data.hotels && data.hotels.length > 0) {
      await Hotel.deleteMany();
      // Ensure numeric fields are numbers if they were strings in JSON
      const hotels = data.hotels.map(h => ({
        ...h,
        price: String(h.price), // schema expects String for price (based on previous file analysis)
        star: Number(h.star),
        location: {
            lat: Number(h.location?.lat || 0),
            lng: Number(h.location?.lng || 0),
            address: h.location?.address || h.address || ''
        }
      }));
      await Hotel.insertMany(hotels);
      console.log('Hotels Imported!');
    }

    // Import Subscriptions
    if (data.subscriptions && data.subscriptions.length > 0) {
      await Subscription.deleteMany();
      const subs = data.subscriptions.map(s => ({
        ...s,
        roomCount: Number(s.roomCount || 1),
        unitPrice: Number(s.unitPrice || 0),
        nights: Number(s.nights || 1),
        totalAmount: Number(s.totalAmount || 0)
      }));
      await Subscription.insertMany(subs);
      console.log('Subscriptions Imported!');
    }

    console.log('Data Migration Completed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
