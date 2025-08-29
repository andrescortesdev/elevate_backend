import * as usersModel from '../app/models/services/UserServices.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const allUsers = await usersModel.getAllUsers();
      res.status(200).json(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  } else if (req.method === 'POST') {
    try {
      const userData = req.body;
      const { user, created } = await usersModel.createUserUpsert(userData);
      if (created) {
        res.status(201).json({ user_id: user.user_id });
      } else {
        res.status(200).json({ user_id: user.user_id });
      }
    } catch (error) {
      console.error('Error creating or updating user:', error);
      res.status(500).json({ error: 'Error creating or updating user' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const deletedCount = await usersModel.deleteUser(id);
      if (deletedCount > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Error deleting user' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
