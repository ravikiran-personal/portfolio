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

  const salutation = recruiter ? 'Dear ' + recruiter + ',' : 'Dear Hiring Team,';

  const RAVI_BIO = 'Ravi Kiran. Email: ravikiran96@gmail.com. Phone: +91 9384899912. Open to relocate or work remotely anywhere globally. Experience: 1) VP Special Projects at Shree Anandhaas (A91 Partners), Sep 2025-Present: doubled online contribution from 5% to 10% in 3 months, business grew 30% MoM. 2) CEO Tamil Nadu at Zomato, May-Sep 2025: owned Rs.100Cr+ P&L across 12 cities with 50+ team, drove 15% MoM GMV growth and 20% EBITDA improvement in 2 months. 3) City Growth Lead at Zomato, Oct 2024-May 2025: 30% GOV growth, highest-ever EBITDA, record market share, consistent 20% MoM growth. 4) Product Manager Gen AI at Zomato, Jul-Oct 2024: 30% search-to-order lift, 30% checkout improvement, 75% merchant rejection drop. 5) Program Manager Growth at Zomato, Jul 2023-Jul 2024: 40% lapsed user resurrection, 30% new user acquisition, 30% GOV uplift from coupon engine.';

  const prompt = 'Write a professional cover letter for Ravi Kiran applying to ' + company + ' for the role of ' + role + '. His background: ' + RAVI_BIO + (industry ? ' Company industry: ' + industry + '.' : '') + (context ? ' What the recruiter is looking for: ' + context + '.' : '') + ' Start with: "' + salutation + '". Write 3 paragraphs: 1. Hook connecting his results to this company. 2. Evidence with 2-3 concrete numbers. 3. Confident close mentioning he is open to anywhere. End with: "Best regards,\nRavi Kiran\nravikiran96@gmail.com | +91 9384899912". No cliches. Be direct and human.';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Anthropic API error: ' + (data.error && data.error.message ? data.error.message : JSON.stringify(data)) });
    }

    var text = '';
    if (data.content && data.content.length > 0) {
      for (var i = 0; i < data.content.length; i++) {
        if (data.content[i].text) {
          text += data.content[i].text;
        }
      }
    }

    if (!text) {
      console.error('Empty Anthropic response:', JSON.stringify(data));
      return res.status(500).json({ error: 'Anthropic returned empty content.' });
    }

    return res.status(200).json({ letter: text });

  } catch (err) {
    console.error('Handler error:', err.message);
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
};
