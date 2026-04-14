export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { company, role, recruiter, industry, context } = req.body;

  if (!company || !role) {
    return res.status(400).json({ error: 'Company and role are required' });
  }

  const salutation = recruiter ? `Dear ${recruiter},` : 'Dear Hiring Team,';

  const RAVI_BIO = `
Name: Ravi Kiran
Contact: ravikiran96@gmail.com | +91 9384899912
Open to: Relocate or work remotely anywhere globally.

Summary: Growth operator with strong P&L ownership. Combines product thinking, commercial instinct, and people leadership.

Experience:
1. VP Special Projects | Shree Anandhaas (A91 Partners) | Sep 2025–Present
   - Doubled online contribution 5%→10% in 3 months. Business grew 30% MoM. Launched RFID quick checkout.

2. CEO Tamil Nadu | Zomato | May–Sep 2025
   - ₹100Cr+ P&L, 12 cities, 50+ team. 15% MoM GMV growth. 20% EBITDA improvement in 2 months. 10% logistics cost cut.

3. City Growth Lead | Zomato | Oct 2024–May 2025
   - 30% GOV growth. Highest-ever EBITDA. Record market share. 20% MoM for 3 quarters. 5-min delivery time reduction.

4. Product Manager Gen AI | Zomato | Jul–Oct 2024
   - 30% search-to-order lift. 30% checkout improvement. 75% merchant rejection drop. Led 5 engineers + 3 analysts.

5. Program Manager Growth | Zomato | Jul 2023–Jul 2024
   - 40% lapsed user resurrection. 30% new user acquisition. 30% GOV uplift from coupon engine.
  `.trim();

  const prompt = `Write a professional cover letter for Ravi Kiran applying to ${company} for the role of ${role}.

His background:
${RAVI_BIO}
${industry ? `Company industry: ${industry}` : ''}
${context ? `What the recruiter is looking for: ${context}` : ''}

Start with: "${salutation}"

Write 3 paragraphs:
1. Hook — connect his specific results to this company's likely priorities
2. Evidence — 2-3 concrete numbers from his background that fit this role
3. Confident close — mention he is open to anywhere (remote or relocation)

End with: "Best regards,\\nRavi Kiran\\nravikiran96@gmail.com | +91 9384899912"

Rules: No clichés. No "I am writing to express my interest." Be direct and human.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = (data.content || []).map(b => b.text || '').join('');
    return res.status(200).json({ letter: text });

  } catch (err) {
    return res.status(500).json({ error: 'Generation failed. Try again.' });
  }
}
