const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const { findUserByEmail, createUser, findRoleByName, updateRefreshToken, getUserByRefreshToken, getUserbyId } = require('../models/userModels.js');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id_users, role: user.role_name }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id_users, role: user.role_name }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    
    const roleData = await findRoleByName(role);
    if (!roleData) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user_uuid = uuidv4();
    const jakartaTimestamp = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const newUser = await createUser(user_uuid, name, email, passwordHash, roleData.id_role, jakartaTimestamp);
    
    res.status(201).json({ 
      message : "Registration Successful",
      data : {
        user_uuid,
        name,
        email,
        roles: roleData.role_name
      },
      status : 201
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await updateRefreshToken(refreshToken, user.id_users);
    // Send refresh token as an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,  // This prevents JavaScript from accessing the cookie
      maxAge: 1 * 24 * 60 * 60 * 1000, 
      secure: true, // Only secure in production
      sameSite: 'None' // Allows cookies to be sent cross-origin
    });    

    res.status(200).json({
      message : "Login Successfuly",
      status : 200, 
      data: {accessToken, refreshToken} });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(403).json({ message: 'Invalid refresh token' });
    const user = await getUserByRefreshToken(refreshToken);

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const accessToken = generateAccessToken(user);
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(403).json({ message: 'Invalid refresh token' });
    const user = await getUserByRefreshToken(refreshToken);

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    await updateRefreshToken(null, user.id_users);
    res.clearCookie('refreshToken');
    res.status(200).json({ message : "Logout Successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {

    const result_data = await getUserbyId(req.user.userId);
    if (!result_data || result_data.length === 0) {
      return res.status(404).json({ message: 'No data found', status: 404 });
    }
    
    res.status(200).json({ 
      message : "Data is available",
      data : result_data,
      status : 201
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while inserting users", status: 500});
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser
};
