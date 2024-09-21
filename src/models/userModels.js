const pool = require('../config/database');

const findUserByEmail = async (email) => {
  const query = `
    SELECT u.*, r.role_name
    FROM users u
    LEFT JOIN users_role r ON u.id_role = r.id_role
    WHERE u.email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const createUser = async (id_users, name, email, passwordHash, roleId, created_at) => {
  const query = `
    INSERT INTO users (id_users, name, email, password, id_role, created_at)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const result = await pool.query(query, [id_users, name, email, passwordHash, roleId, created_at]);
  return result.rows[0];
};

const findRoleByName = async (roleName) => {
  const query = 'SELECT * FROM users_role WHERE id_role = $1';
  const result = await pool.query(query, [roleName]);
  return result.rows[0];
};

const updateRefreshToken = async (refreshToken, id_users) => {
  const query = 'UPDATE users SET refresh_token = $1 WHERE id_users = $2';
  const result = await pool.query(query, [refreshToken, id_users]);
  return result.rows[0];
};


const getUserByRefreshToken = async (refreshToken) => {
  const query = 'SELECT * FROM users WHERE refresh_token = $1';
  const result = await pool.query(query, [refreshToken]);
  return result.rows[0];
};

const getUserbyId = async (id_users) => {

  const query = `
    SELECT u.name, u.email
    FROM users u
    WHERE u.id_users = $1`;
  const result = await pool.query(query, [id_users]);
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
  findRoleByName,
  updateRefreshToken,
  getUserByRefreshToken,
  getUserbyId
};
