// /api/candidates.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'GET candidatos (aquí va la lógica real)' });
  } else if (req.method === 'POST') {
    res.status(201).json({ message: 'POST candidato (aquí va la lógica real)' });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
