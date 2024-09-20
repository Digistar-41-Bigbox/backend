const pool = require('../config/database');

const getAllPic = async (pageNumber, pageSize, search = '', asc = true, latest = true) => {
    const offset = (pageNumber - 1) * pageSize;
    // Sorting conditions
    let orderBy = 'u.created_at DESC';  // Default sort by latest created_at
  
    if (!latest) {
      orderBy = 'u.created_at ASC';  // Sort by oldest if latest is false
    }
  
    if (asc) {
      orderBy = 'u.name ASC';  // Sort by name ascending if asc is true
    } else {
      orderBy = 'u.name DESC'; // Sort by name descending if asc is false
    }
    const query = `
        SELECT
            u.id_users,
            u.name ,
            u.email ,
            u.no_hp,
            SUM(CASE WHEN s.name_status = 'Cold' THEN 1 ELSE 0 END) AS cold,
            SUM(CASE WHEN s.name_status = 'Warm' THEN 1 ELSE 0 END) AS warm,
            SUM(CASE WHEN s.name_status = 'Hot' THEN 1 ELSE 0 END) AS hot,
            SUM(CASE WHEN s.name_status IS NOT NULL THEN 1 ELSE 0 END) AS total_status
        FROM
            users u
        LEFT JOIN
            leads l ON u.id_users = l.id_users
        LEFT JOIN
            status s ON l.status = s.id_status
        WHERE u.name ILIKE $3            
        GROUP BY
            u.id_users
        ORDER BY ${orderBy}
        LIMIT $1 OFFSET $2;`;    
    const result = await pool.query(query, [pageSize, offset, `%${search}%`]);
    return result.rows;
};

const getPicById = async (id_leads) => {

    const query = `
      SELECT u.id_users, u.name, u.email, u.no_hp
      FROM users u
      WHERE u.id_users = $1`;
    const result = await pool.query(query, [id_leads]);
    return result.rows[0];
  };

const updatePicById = async (id_users, data) => {
    const { name, email, no_hp, updated_at } = data;
  
    const query = `
      UPDATE users
      SET 
        name = $1,
        email = $2,
        no_hp = $3,
        updated_at = $4 
      WHERE id_users = $5
    `;
    
    const values = [name, email, no_hp, updated_at, id_users];
    
    const result = await pool.query(query, values);
    return result;
};  

const deletePicById = async (id_users) => {
    const query = 'DELETE FROM users WHERE id_users = $1';
    const result = await pool.query(query, [id_users]);
    return result;
};

const getAllPicForFilter = async () => {
  const query = 'SELECT id_users, name FROM users;';
  const result = await pool.query(query);
  return result.rows;
};



module.exports = {
    getAllPic,
    getPicById,
    updatePicById,
    deletePicById,
    getAllPicForFilter
};