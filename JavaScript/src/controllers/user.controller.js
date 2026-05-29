import logger from '../middleware/logger.js'
import userService from '../services/user.service.js';


export const get = async (req, res) => {
    try {
        const result = await userService.getAll();
        return res.json(result);      
    } catch (error) {
        logger.error(`Error: ${error}`);
        return res.status(500).json({ message: "Error: " + error.message }); 
    }   
};

export const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await userService.getById(id);
        return res.json(result);      
    } catch (error) {
        logger.error(`Error: ${error}`);
        return res.status(500).json({ message: "Error: " + error.message }); 
    }

};

export const insert = async (req, res) => {
    try {
        const result = await userService.create(req.body);
        return res.json(result);      
    } catch (error) {
        logger.error(`Error: ${error}`);
        return res.status(500).json({ message: "Error: " + error.message }); 
    }
};

export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await userService.update(id, req.body);
        return res.json(result);      
    } catch (error) {
        logger.error(`Error: ${error}`);
        return res.status(500).json({ message: "Error: " +  error.message }); 
    }
};

export const eliminate = async (req, res) => {
    try {
        const id = req.params.id; 
        const result = await userService.eliminate(id);
        return res.status(204).json({ message: "Was Delete" });      
    } catch (error) {
        logger.error(`Error: ${error}`);
        return res.status(500).json({ message: "Error: " + error.message });  
    }
};