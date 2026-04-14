const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { company, role, recruiter, industry, context } = req.body;

  if (!company || !role) {
    return res.status(400).json({ error: 'Company and role are required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in Vercel environment variables.' });
  }

  const salutation = recruiter ? `Dear ${recruiter},` : 'Dear Hiring Team,';

  const RAVI_BIO = `
Name: Ravi Kiran
Contact: ravikiran96@gmail.com | +91 9384899912
Open to: Relocate or work remotely anywhere globally.

Experience:
1. VP Special Projects | Shree Anandhaas (A91 Partners) | Sep 2025-Present
   - Doubled online contribution 5% to 10% in 3 months. Business grew 30% MoM.

2. CEO Tamil Nadu | Zomato | May-Sep 2025
   - Rs.100Cr+ P&L, 12 cities, 50+ team. 15% MoM GMV growth. 20% EBITDA improvement in 2
