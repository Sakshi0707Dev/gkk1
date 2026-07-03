import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Step 1: Print process.env.ADMIN_EMAILS BEFORE dotenv
console.log('=== STEP 1: BEFORE dotenv loading ===');
console.log('process.env.ADMIN_EMAILS:', JSON.stringify(process.env.ADMIN_EMAILS));
console.log('process.env.NODE_ENV:', JSON.stringify(process.env.NODE_ENV));
console.log('process.cwd():', process.cwd());

// Step 2: Load dotenv (same as env.js does)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
console.log('\n=== STEP 2: Loading backend/.env ===');
console.log('envPath:', envPath);
console.log('file exists:', fs.existsSync(envPath));
if (fs.existsSync(envPath)) {
  config({ path: envPath });
  console.log('Loaded backend/.env');
}

// Step 3: Check process.env after loading
console.log('\n=== STEP 3: AFTER dotenv loading ===');
console.log('process.env.ADMIN_EMAILS:', JSON.stringify(process.env.ADMIN_EMAILS));

// Step 4: Compute ENV.ADMIN_EMAILS (same as env.js)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
console.log('\n=== STEP 4: Parsed ADMIN_EMAILS array ===');
console.log('ADMIN_EMAILS:', JSON.stringify(ADMIN_EMAILS));

// Step 5: Simulate isAdminEmail
const loginEmail = 'gawandekrushikendra@gmail.com';
console.log('\n=== STEP 5: isAdminEmail check ===');
console.log('loginEmail:', loginEmail);
console.log('normalized:', loginEmail.trim().toLowerCase());
const isAdmin = ADMIN_EMAILS.includes(loginEmail.trim().toLowerCase());
console.log('isAdminEmail result:', isAdmin);

// Step 6: Simulate login - test with existing user
console.log('\n=== STEP 6: Simulating login flow ===');

// Import MongoDB and models
import mongoose from 'mongoose';
import '../backend/config/env.js'; // This will set up ENV

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gkk';
console.log('Connecting to MongoDB:', MONGO_URI.substring(0, 30) + '...');

try {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  // Import user model
  const User = (await import('../backend/models/user.model.js')).default;

  // Find the user
  const user = await User.findOne({ email: loginEmail }).select('+password');
  
  if (!user) {
    console.log('\n*** USER NOT FOUND in database ***');
    console.log('Need to register first. Creating test user...');
    
    const bcrypt = await import('bcryptjs');
    
    const newUser = await User.create({
      name: 'Test Admin',
      email: loginEmail,
      password: 'test123456',
      role: 'user'  // Start as 'user' to see if ensureAdminRole promotes
    });
    
    console.log('Created user with role:', newUser.role);
    console.log('User email from DB:', newUser.email);
    
    // Now test ensureAdminRole
    console.log('\n=== STEP 7: ensureAdminRole on NEW user ===');
    const isAdminCheck = ADMIN_EMAILS.includes(newUser.email.trim().toLowerCase());
    console.log('isAdminEmail result:', isAdminCheck);
    console.log('user.role BEFORE:', newUser.role);
    
    if (isAdminCheck && newUser.role !== 'admin') {
      newUser.role = 'admin';
      await newUser.save();
      console.log('user.role AFTER:', newUser.role);
    } else if (isAdminCheck && newUser.role === 'admin') {
      console.log('Already admin, no change needed');
    } else {
      console.log('Not admin email, role stays:', newUser.role);
    }
    
    // Reload from DB
    const refreshed = await User.findOne({ email: loginEmail });
    console.log('Role in DB after save:', refreshed.role);
    
  } else {
    console.log('\nFound existing user:');
    console.log('email:', user.email);
    console.log('role BEFORE:', user.role);
    
    // Step 7: ensureAdminRole
    console.log('\n=== STEP 7: ensureAdminRole ===');
    const isAdminCheck = ADMIN_EMAILS.includes(user.email.trim().toLowerCase());
    console.log('isAdminEmail result:', isAdminCheck);
    console.log('ADMIN_EMAILS array:', JSON.stringify(ADMIN_EMAILS));
    console.log('user email lowercased:', user.email.trim().toLowerCase());
    
    if (isAdminCheck && user.role !== 'admin') {
      console.log('\n*** PROMOTING to admin ***');
      user.role = 'admin';
      await user.save();
      console.log('user.role AFTER:', user.role);
    } else if (isAdminCheck && user.role === 'admin') {
      console.log('Already admin, no change needed');
    } else {
      console.log('Not admin email, role stays:', user.role);
    }
    
    // Reload from DB
    const refreshed = await User.findOne({ email: loginEmail });
    console.log('Role in DB after ensureAdminRole:', refreshed.role);
  }
  
  // Step 8: JWT payload
  console.log('\n=== STEP 8: JWT payload ===');
  const finalUser = await User.findOne({ email: loginEmail });
  const jwtPayload = {
    id: finalUser._id,
    email: finalUser.email,
    role: finalUser.role,
  };
  console.log('JWT payload:', JSON.stringify(jwtPayload));
  
  // Step 9: toPublic output
  console.log('\n=== STEP 9: toPublic() output ===');
  const toPublic = finalUser.toPublic();
  console.log('toPublic().role:', toPublic.role);
  
  // Conclusion
  console.log('\n=== CONCLUSION ===');
  if (finalUser.role === 'admin') {
    console.log('ADMIN ROLE ASSIGNED SUCCESSFULLY');
  } else {
    console.log('FAILED: Role is', finalUser.role);
  }
  
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
  
} catch (err) {
  console.error('Error:', err.message);
  console.error(err.stack);
}
