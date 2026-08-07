import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        tracking_no,
        sender_name,
        receiver_name,
        receiver_area,
        region_type,
        item_name,
        weight_kg,
        width_cm,
        height_cm,
        depth_cm,
        billed_weight_kg,
        size_grade,
        price,
        eta_date,
      } = req.body;

      const { data, error } = await supabase
        .from('shipments')
        .insert([
          {
            tracking_no,
            sender_name,
            receiver_name,
            receiver_area,
            region_type,
            item_name,
            weight_kg,
            width_cm,
            height_cm,
            depth_cm,
            billed_weight_kg,
            size_grade,
            price,
            eta_date,
          },
        ]);

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(201).json({ success: true, data });
    } catch (err) {
      console.error('API error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase select error:', error);
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, data });
    } catch (err) {
      console.error('API error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
