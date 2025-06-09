// src/index.ts
export { getUserPasswordByEmailLogin } from './routes/auth/login';
export { getRoles } from './routes/user/getRole';
export { getUsers } from './routes/user/getUser';
export { getUserByEmail } from './routes/user/getUserByEmail';
export { getUserById } from './routes/user/getUserById';
export { getUserPasswordByEmail } from './routes/user/getUserPasswordByEmail';
// Tu ajouteras ici : export { loginUser } from './routes/auth/loginUser';






// export const createUser = functions.https.onRequest(async (req, res) => {
//   const { email, password, name } = req.body;
//   if (!email || !password || !name) {
//     res.status(400).send("Email, mot de passe ou nom manquant");
//     return;
//   }
//   try {
//     const [result] = await pool.query("INSERT INTO User (email_user, mdp_user, name_user) VALUES (?, ?, ?)", [email, password, name]);
//     res.status(201).json({ id: result.insertId, email, name });
//   } catch (err) {
//     console.error("Erreur MySQL :", err);
//     res.status(500).send("Erreur serveur");
//   }
// }
// );
// export const updateUser = functions.https.onRequest(async (req, res) => {
//   const userId = req.query.id;
//   const { email, password, name } = req.body;
//   if (!userId || !email || !password || !name) {
//     res.status(400).send("ID utilisateur, email, mot de passe ou nom manquant");
//     return;
//   }
//   try {
//     const [result] = await pool.query("UPDATE User SET email_user = ?, mdp_user = ?, name_user = ? WHERE ID_user = ?", [email, password, name, userId]);
//     if (result.affectedRows === 0) {
//       res.status(404).send("Utilisateur non trouvé");
//       return;
//     }
//     res.status(200).json({ id: userId, email, name });
//   } catch (err) {
//     console.error("Erreur MySQL :", err);
//     res.status(500).send("Erreur serveur");
//   }
// });
// export const deleteUser = functions.https.onRequest(async (req, res) => {
//   const userId = req.query.id;
//   if (!userId) {
//     res.status(400).send("ID utilisateur manquant");
//     return;
//   }
//   try {
//     const [result] = await pool.query("DELETE FROM User WHERE ID_user = ?", [userId]);
//     if (result.affectedRows === 0) {
//       res.status(404).send("Utilisateur non trouvé");
//       return;
//     }
//     res.status(200).send("Utilisateur supprimé avec succès");
//   } catch (err) {
//     console.error("Erreur MySQL :", err);
//     res.status(500).send("Erreur serveur");
//   }
// });
// // Note: The above code is a basic implementation and does not include password hashing or security measures.