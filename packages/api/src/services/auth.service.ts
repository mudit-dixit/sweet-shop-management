import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// We define the shape of the data we expect
interface RegisterUserBody {
  email: string;
  password: string;
}
interface LoginUserBody {
  email: string;
  password: string;
}

export const loginUserService = async (userData: LoginUserBody) => {
  const { email, password } = userData;

  // 1. Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. Create a JWT payload
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // 4. Sign the token
  // We need a JWT_SECRET from our .env file
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1h', // Token expires in 1 hour
  });

  return token;
};
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