const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getLatestLeads = async () => {
    const query = `
    SELECT s.name_status , l.nama_instansi, l.email, l.no_hp 
    FROM leads l
    join status s ON l.status = s.id_status 
    ORDER BY l.created_at DESC
    LIMIT 5`;
    const result = await pool.query(query);
    return result.rows;
};

const getTotalLeadsByStatus = async () => {
  const query = `
  SELECT 
      s.name_status, 
      COUNT(l.status) AS status_count
  FROM leads l
  RIGHT JOIN status s ON l.status = s.id_status
  GROUP BY s.name_status

  UNION ALL

  SELECT 
      'Total' AS name_status, 
      COUNT(l.id_leads) AS status_count 
  FROM leads l`;
  const result = await pool.query(query);
  return result.rows;
};

const getAllLeads = async (pageNumber, pageSize, search = '', asc = true, latest = true, id_pic) => {
  const offset = (pageNumber - 1) * pageSize;
  // Sorting conditions
  let orderBy = 'created_at DESC';  // Default sort by latest created_at

  if (!latest) {
    orderBy = 'created_at ASC';  // Sort by oldest if latest is false
  }

  if (asc) {
    orderBy = 'nama_instansi ASC';  // Sort by name ascending if asc is true
  } else {
    orderBy = 'nama_instansi DESC'; // Sort by name descending if asc is false
  }
  let id_pic_que = "";
  if (id_pic){
    id_pic_que = `AND u.id_users = `;
  }else{
    id_pic_que = "";
  }
  const query = `
    SELECT l.id_leads, l.nama_instansi, l.nama_pribadi, l.no_hp, l.email, u.name, s.name_status, l.notes, l.category_company
    FROM leads l
    LEFT JOIN users u ON l.id_users = u.id_users
    JOIN status s ON l.status = s.id_status
    WHERE nama_instansi ILIKE $3 ${id_pic_que} $4
    ORDER BY ${orderBy}
    LIMIT $1 OFFSET $2;`;
  const result = await pool.query(query, [pageSize, offset, `%${search}%`,id_pic]);
  return result.rows;
};

const getAllLeadsExcel = async () => {

  const query = `
    SELECT u.name "PIC Leads", s.name_status "Leads", l.category_company "Jenis Perusahaan", l.nama_instansi "Nama Perusahaan", l.nama_pribadi "Nama Kontak", l.no_hp "Nomor Telepon", l.email "Email", l.notes "Catatan"
    FROM leads l
    LEFT JOIN users u ON l.id_users = u.id_users
    JOIN status s ON l.status = s.id_status;`;
  const result = await pool.query(query);
  return result.rows;
};

const createLead = async (data) => {
  const {id_leads, nama_instansi, nama_pribadi, no_hp, email, id_users, status, created_at, notes, category_company } = data;

  const query = `
    INSERT INTO leads (id_leads, nama_instansi, nama_pribadi, no_hp, email, id_users, status, created_at, notes, category_company)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *; 
  `;

  const values = [id_leads, nama_instansi, nama_pribadi, no_hp, email, id_users, status, created_at, notes, category_company];
  
  const result = await pool.query(query, values);
  return result;
};

const getLeadById = async (id_leads) => {

  const query = `
    SELECT l.id_leads, l.nama_instansi, l.nama_pribadi, l.no_hp, l.email, u.name, s.name_status, l.notes, l.category_company
    FROM leads l
    JOIN users u ON l.id_users = u.id_users
    JOIN status s ON l.status = s.id_status
    WHERE l.id_leads = $1`;
  const result = await pool.query(query, [id_leads]);
  return result.rows[0];
};

const updateLeadById = async (id_leads, data) => {
  const { nama_instansi, nama_pribadi, no_hp, email, id_users, status, updated_at, notes, category_company } = data;

  const query = `
    UPDATE leads
    SET 
      nama_instansi = $1,
      nama_pribadi = $2,
      no_hp = $3,
      email = $4,
      id_users = $5,
      status = $6,
      updated_at = $7, 
      notes= $8, 
      category_company = $9
    WHERE id_leads = $10
  `;
  
  const values = [nama_instansi, nama_pribadi, no_hp, email, id_users, status, updated_at, notes, category_company, id_leads];
  
  const result = await pool.query(query, values);
  return result;
};

const deleteLeadById = async (id_leads) => {
  const query = 'DELETE FROM leads WHERE id_leads = $1';
  const result = await pool.query(query, [id_leads]);
  return result;
};

const insertLeads = async (usersData, created_at) => {
  const query =
    `INSERT INTO leads (id_leads, nama_instansi, nama_pribadi, no_hp, email, id_users, status, created_at, notes, category_company)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert each row
    for (let user of usersData) {
      const values = [
        uuidv4(),
        user.nama_instansi,
        user.nama_pribadi,
        user.no_hp,
        user.email,
        user.id_users,
        user.status,
        created_at,
        user.notes,
        user.category_company
      ];
      await client.query(query, values);
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getLatestLeads,
  getTotalLeadsByStatus,
  getAllLeads,
  createLead,
  getLeadById,
  updateLeadById,
  deleteLeadById,
  insertLeads,
  getAllLeadsExcel
};