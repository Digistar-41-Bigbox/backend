const pool = require('../config/database');

const getAllStatus = async () => {
    const query = `
      SELECT s.id_status, s.name_status
      FROM status s`;
    const result = await pool.query(query);
    return result.rows;
};

module.exports = {
    getAllStatus
};