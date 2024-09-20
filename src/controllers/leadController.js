const  leadModels  = require('../models/leadModels');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const getLatestLead = async (req, res) => {
    try {
      const latestLead = await leadModels.getLatestLeads();
      if (!latestLead) {
        return res.status(400).json({ message: 'Data does not exist' });
      }
      res.status(201).json({ 
        message : "Data is available",
        data : latestLead,
        status : 201
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTotalLeadByStatus = async (req, res) => {
    try {
      const totalLead = await leadModels.getTotalLeadsByStatus();
      if (!totalLead) {
        return res.status(400).json({ message: 'Data does not exist' });
      }

      const restructuredData = totalLead.reduce((acc, curr) => {
        acc[curr.name_status] = parseInt(curr.status_count);  // Convert status_count to integer
        return acc;
      }, {});      
      res.status(201).json({ 
        message : "Data is available",
        data : restructuredData,
        status : 201
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllLeads = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '', asc = true, latest = true, id_pic = ""} = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    asc = asc === 'true'; 
    latest = latest === 'true'; 

    const result_data = await leadModels.getAllLeads(page, limit, search, asc, latest, id_pic);
    if (!result_data || result_data.length === 0) {
      return res.status(404).json({ message: 'No data found', status: 404 });
    }
    
    res.status(200).json({ 
      message : "Data is available",
      data : result_data,
      status : 201
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createdLead = async (req, res) => {
  try {
    const { nama_instansi, nama_pribadi, no_hp, email, id_users, status, notes, category_company } = req.body;
    const id_leads = uuidv4();
    const created_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    // Validate the request body
    if (!nama_instansi || !nama_pribadi || !no_hp || !email || !id_users || !status) {
      return res.status(400).json({ message: 'Missing required fields', status: 400 });
    }
    const result = await leadModels.createLead({
      id_leads,
      nama_instansi,
      nama_pribadi,
      no_hp,
      email,
      id_users,
      status,
      created_at, 
      notes, 
      category_company
    });
    
    res.status(200).json({ 
      message : "Data created successfully",
      data : result.rows[0],
      status : 201
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!id) {
      return res.status(400).json({ message: 'Server Error', status: 400 });
    }

    const result_data = await leadModels.getLeadById(id);
    if (!result_data || result_data.length === 0) {
      return res.status(404).json({ message: 'No data found', status: 404 });
    }
    
    res.status(200).json({ 
      message : "Data is available",
      data : result_data,
      status : 201
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_instansi, nama_pribadi, no_hp, email, id_users, status, notes, category_company } = req.body;
    // Validate the ID
    if (!id) {
      return res.status(400).json({ message: 'Server Error', status: 400 });
    }
    // Validate the request body
    if (!nama_instansi || !nama_pribadi || !no_hp || !email || !id_users || !status) {
      return res.status(400).json({ message: 'Missing required fields', status: 400 });
    }
    const updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    // Perform the update operation using the model function
    const result = await leadModels.updateLeadById(id, {
      nama_instansi,
      nama_pribadi,
      no_hp,
      email,
      id_users,
      status,
      updated_at, 
      notes, 
      category_company
    });

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No data found to update', status: 404 });
    }
    res.status(200).json({ 
      message : "Data successfully updated",
      status : 200
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate the ID
    if (!id) {
      return res.status(400).json({ message: 'Server Error', status: 400 });
    }
    const result_data = await leadModels.getLeadById(id);
    if (!result_data || result_data.length === 0) {
      return res.status(404).json({ message: 'No data found', status: 404 });
    }
    const result = await leadModels.deleteLeadById(id);
    res.status(200).json({ 
      message : "Data successfully deleted",
      status : 200
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createPicByExcel = async (req, res) => {
  try {
    if (!req.file.buffer) {
      return res.status(404).json({ message: 'No data found', status: 404 });
    }
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const columnNames = data[0];
    
    const column = [
      'nama_instansi',
      'nama_pribadi',
      'no_hp',
      'email',
      'id_users',
      'status',
      'notes',
      'category_company'
    ]

    if (!(columnNames.sort().toString() === column.sort().toString())) {
      return res.status(400).json({
        message: 'Column names do not match the expected format',
        data: {expected:column,received:columnNames},
        status: 400
      });      
    } 

    const jsonData = xlsx.utils.sheet_to_json(sheet);
    const jakartaTimestamp = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    await leadModels.insertLeads(jsonData,jakartaTimestamp);
    
    res.status(200).json({ 
      message : "Data inserted successfully",
      status : 200
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while inserting users", status: 500 });
  }
};

const exportByExcel = async (req, res) => {
  try {
    const result_data = await leadModels.getAllLeadsExcel();
    if (!result_data || result_data.length === 0) {
      return res.status(404).json({ message: 'No data found', status: 404 });
    }

    // Create a new workbook
    const workbook = xlsx.utils.book_new();
    
    // Convert JSON data to a worksheet
    const worksheet = xlsx.utils.json_to_sheet(result_data);
    
    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Leads Data');
    
    // Write the workbook to a buffer
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set response headers for download
    res.setHeader('Content-Disposition', 'attachment; filename="leads_data.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    // Send the buffer as a response
    res.status(200).send(excelBuffer);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
    getLatestLead,
    getTotalLeadByStatus,
    getAllLeads,
    getLeadById,
    deleteLeadById,
    updateLeadById,
    createdLead,
    createPicByExcel,
    exportByExcel
};