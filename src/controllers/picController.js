const  picModels  = require('../models/picModels');
const moment = require('moment-timezone');


const getAllPic = async (req, res) => {
    try {
      let { page = 1, limit = 10, search = '', asc = true, latest = true} = req.query;
  
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      asc = asc === 'true'; 
      latest = latest === 'true'; 
  
      const result_data = await picModels.getAllPic(page, limit, search, asc, latest);
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

const getPicById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate the ID
      if (!id) {
        return res.status(400).json({ message: 'Server Error', status: 400 });
      }
  
      const result_data = await picModels.getPicById(id);
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

const getAllPicForFilter = async (req, res) => {
  try {
    const result_data = await picModels.getAllPicForFilter();
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

const updatePicById = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, no_hp } = req.body;
      // Validate the ID
      if (!id) {
        return res.status(400).json({ message: 'Server Error', status: 400 });
      }
      // Validate the request body
      if (!name || !no_hp || !email) {
        return res.status(400).json({ message: 'Missing required fields', status: 400 });
      }
      const result_data = await picModels.getPicById(id);
      if (!result_data || result_data.length === 0) {
          return res.status(404).json({ message: 'No data found', status: 404 });
      }
      const updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
      // Perform the update operation using the model function
      const result = await picModels.updatePicById(id, {
        name,
        email,
        no_hp,
        updated_at
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

const deletePicById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate the ID
        if (!id) {
            return res.status(400).json({ message: 'Server Error', status: 400 });
        }
        const result_data = await picModels.getPicById(id);
        if (!result_data || result_data.length === 0) {
            return res.status(404).json({ message: 'No data found', status: 404 });
        }
        const result = await picModels.deletePicById(id);
        res.status(200).json({ 
        message : "Data successfully deleted",
        status : 200
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
}
};

module.exports = {
    getAllPic,
    getPicById,
    updatePicById,
    deletePicById,
    getAllPicForFilter
  };