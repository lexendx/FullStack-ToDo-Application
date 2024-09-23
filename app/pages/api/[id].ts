import { NextApiRequest, NextApiResponse } from 'next';
import supabase  from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Todo ID is required' });
  }

  if (req.method === 'PUT') {
    const { title, completed } = req.body;

    const { data, error } = await supabase
      .from('todos')
      .update({ title, completed })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
