import { Request, Response } from 'express';
import { pool } from '../../utils/db';

export async function deleteEvent(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM Evenement WHERE id = ?', [id]);

    // Vérifie si une ligne a été supprimée
    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    return res.status(200).json({ message: 'Événement supprimé avec succès' });
  } catch (err) {
    console.error('Erreur MySQL :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
