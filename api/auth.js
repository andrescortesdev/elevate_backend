// /api/auth.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ message: 'POST login/auth (aquí va la lógica real)' });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
