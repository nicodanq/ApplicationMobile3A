import { Request, Response } from 'express';
import { pool } from '../../utils/db';

export async function deleteUser(req: Request, res: Response) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({message: 'ID utilisateur requis.'});
  }

  try {
    // Vérifie si l'utilisateur existe
    const [existing] = await pool.query('SELECT ID_user FROM user WHERE ID_user = ?', [userId]);

    if ((existing as any[]).length === 0) {
      return res.status(404).json({message: 'Utilisateur non trouvé.'});
    }

    // Supprime l'utilisateur
    await pool.query('DELETE FROM user WHERE ID_user = ?', [userId]);

    return res.status(200).json({message: 'Utilisateur supprimé avec succès.'});
  } catch (err) {
    console.error('Erreur MySQL :', err);
    return res.status(500).json({message: 'Erreur lors de la suppression de l\'utilisateur.'});
  }
}