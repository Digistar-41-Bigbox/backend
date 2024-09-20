const  statusModels  = require('../models/statusModels');

const getAllStatus = async (req, res) => {
    try {
      const result_data = await statusModels.getAllStatus();
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

module.exports = {
    getAllStatus
  };