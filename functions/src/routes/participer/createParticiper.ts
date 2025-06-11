import { Request, Response } from 'express';
import { pool } from '../../utils/db';

export async function createParticiper(req: Request, res: Response) {
  const { eventId, userId } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ message: 'Event ID and User ID are required' });
  }

  try {
    await pool.query(
      'INSERT INTO Participer (ID_user, ID_Event) VALUES (?, ?)',
      [userId, eventId]
    );

    return res.status(201).json({ message: 'Participation created' });
  } catch (err) {
    console.error('Erreur MySQL :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
