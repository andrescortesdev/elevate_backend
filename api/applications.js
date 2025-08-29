// /api/applications.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'GET aplicaciones (aquí va la lógica real)' });
  } else if (req.method === 'POST') {
    res.status(201).json({ message: 'POST aplicación (aquí va la lógica real)' });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
