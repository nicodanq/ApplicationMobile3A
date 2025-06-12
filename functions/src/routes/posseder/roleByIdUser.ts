import { Request, Response } from 'express';
import { pool } from '../../utils/db';

export async function roleByIdUser(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT r.role 
       FROM Posseder p
       JOIN Role r ON p.ID_role = r.ID_role
       WHERE p.ID_user = ?`,
      [userId]
    ) as [any[], any];

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No roles found for this user' });
    }

    return res.status(200).json(rows[0]); // Return the first role found
  } catch (err) {
    console.error('Erreur MySQL :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
