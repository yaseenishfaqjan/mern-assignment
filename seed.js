require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Course = require('./models/Course');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing collections
    await Student.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing students and courses.');

    // Insert sample courses
    const courses = await Course.insertMany([
      {
        title: 'Full-Stack Web Development',
        description: 'Master the MERN stack and build production-ready applications from scratch.',
        instructor: 'Dr. John Doe',
        duration: 40
      },
      {
        title: 'Data Science with Python',
        description: 'A comprehensive journey through data manipulation, visualization, and machine learning.',
        instructor: 'Prof. Jane Smith',
        duration: 55
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn the principles of design, wireframing, and creating beautiful user interfaces.',
        instructor: 'Alice Johnson',
        duration: 25
      }
    ]);
    console.log(`Inserted ${courses.length} courses.`);

    // Insert sample students
    const students = await Student.insertMany([
      {
        name: 'Michael Scott',
        email: 'michael.scott@dundermifflin.com',
        age: 45
      },
      {
        name: 'Jim Halpert',
        email: 'jim.halpert@dundermifflin.com',
        age: 30
      },
      {
        name: 'Pam Beesly',
        email: 'pam.beesly@dundermifflin.com',
        age: 28
      }
    ]);
    console.log(`Inserted ${students.length} students.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
