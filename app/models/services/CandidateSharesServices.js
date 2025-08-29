import CandidateShares from '../entities/CandidateSharesEntity.js';
import Candidate from '../entities/CandidateEntity.js';
import User from '../entities/UserEntity.js';
import Application from '../entities/ApplicationEntity.js';
import Vacancy from '../entities/VacanciesEntity.js';

export const getCandidateSharesByUserId = async (senderId) => {
    try {
        const candidateShares = await CandidateShares.findAll({
            where: { sender_id: senderId },
            include: [
                {
                    model: Candidate,
                    attributes: ['name', 'email', 'phone', 'occupation'],
                },
                {
                    model: Application,
                    attributes: ['application_id'],
                },
                {
                    model: User,
                    attributes: ['name']
                }
            ],
            order: [['created_at', 'DESC']],
        });
        return candidateShares;
    } catch (error) {
        console.error('Error fetching candidate shares:', error);
    }
};

export const createCandidateShares = async (newShare) => {
    const {
        candidate_id,
        sender_id,
        receiver_id,
        application_id,
    } = newShare
    try {
        const newCandidateShare = await CandidateShares.create({
            candidate_id,
            sender_id,
            receiver_id,
            application_id,
            status: 'pending',
        })
        return newCandidateShare;
    } catch (error) {
        console.error('Error creating candidate share:', error);
    }
};