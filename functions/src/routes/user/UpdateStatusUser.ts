import { Request, Response } from 'express';
import { pool } from '../../utils/db';

export async function updateStatusUser(req: Request, res: Response) {
  const userId = req.params.id;
  const {statut_user} = req.body;

  if (!userId || statut_user === undefined) {
    return res.status(400).json({message: 'ID utilisateur et statut requis.'});
  }

  try {
    // Vérifie si l'utilisateur existe
    const [existing] = await pool.query('SELECT ID_user FROM user WHERE ID_user = ?', [userId]);

    if ((existing as any[]).length === 0) {
      return res.status(404).json({message: 'Utilisateur non trouvé.'});
    }

    // Met à jour le statut de l'utilisateur
    await pool.query('UPDATE user SET statut_user = ? WHERE ID_user = ?', [statut_user, userId]);

    return res.status(200).json({message: 'Statut utilisateur mis à jour avec succès.'});
  } catch (err) {
    console.error('Erreur MySQL :', err);
    return res.status(500).json({message: 'Erreur lors de la mise à jour du statut de l\'utilisateur.'});
  }
}