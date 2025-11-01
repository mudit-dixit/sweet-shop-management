import User from '../models/user.model';
import bcrypt from 'bcryptjs';

// We define the shape of the data we expect
interface RegisterUserBody {
  email: string;
  password: string;
}

export const registerUserService = async (userData: RegisterUserBody) => {
  const { email, password } = userData;

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create the new user
  const user = new User({
    email,
    password: hashedPassword,
  });

  // 4. Save to the database
  await user.save();

  // If we get here, everything was successful
  return user;
};