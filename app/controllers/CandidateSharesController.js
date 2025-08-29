import * as candidateSharesModel from '../models/services/CandidateSharesServices.js';

export const getCandidateSharesController = async (req, res) => {
    try {
        const senderId = req.params.senderId;
        const candidateShares = await candidateSharesModel.getCandidateSharesByUserId(senderId);
        return res.status(200).json(candidateShares);
    } catch (error) {
        console.error("Error fetching candidate shares:", error);
        return res.status(500).json({ error: "Error fetching candidate shares" });
    }
};

export const createCandidateSharesController = async (req, res) => {
    try {
        const newShare = req.body;
        const newCandidateShare = await candidateSharesModel.createCandidateShares(newShare);
        return res.status(201).json(newCandidateShare);
    } catch (error) {
        console.error("Error creating candidate share:", error);
        return res.status(500).json({ error: "Error creating candidate share" });
    }
};