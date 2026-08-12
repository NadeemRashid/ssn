// api/send.js
// Vercel Serverless Function to securely send emails via Resend

export default async function handler(req, res) {
  // Set CORS headers so the client-side JavaScript can call this endpoint
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { name, email, phone, service, message, notes } = req.body;

    // Validate email environment configuration
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: RESEND_API_KEY environment variable is not configured.' });
    }

    // Build the email body HTML template
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #0f1f1c; padding: 25px; text-align: center; border-bottom: 3px solid #c5a880;">
          <h2 style="color: #ffffff; margin: 0; font-weight: normal; letter-spacing: 2px;">SSN CARE SOLUTIONS</h2>
          <p style="color: #c5a880; font-size: 11px; text-transform: uppercase; margin: 5px 0 0 0; letter-spacing: 1px;">New Service Query Received</p>
        </div>
        <div style="padding: 30px; background-color: #fcfcfb;">
          <p style="font-size: 16px; margin-top: 0;">You have received a new consultation request or inquiry from the website contact forms.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Full Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email Address:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #0f1f1c;">${email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Requested Service:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #0f1f1c;">${service || 'General Inquiry'}</td>
            </tr>
          </table>
    `;

    if (message) {
      htmlContent += `
        <div style="margin-top: 25px; padding: 20px; background-color: #f4f4f3; border-radius: 4px; border-left: 3px solid #c5a880;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #0f1f1c;">Message details:</h4>
          <p style="margin: 0; font-size: 14px; white-space: pre-wrap;">${message}</p>
        </div>
      `;
    }

    if (notes) {
      htmlContent += `
        <div style="margin-top: 25px; padding: 20px; background-color: #f4f4f3; border-radius: 4px; border-left: 3px solid #c5a880;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #0f1f1c;">Additional Assessment Notes:</h4>
          <p style="margin: 0; font-size: 14px; white-space: pre-wrap;">${notes}</p>
        </div>
      `;
    }

    htmlContent += `
          <p style="font-size: 12px; color: #666; margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            This email was automatically generated and securely forwarded via Resend from the SSN Care Solutions website.
          </p>
        </div>
      </div>
    `;

    // Send payload using Resend HTTP REST API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SSN Care Solutions <onboarding@resend.dev>',
        to: 'nadeemrashid87@gmail.com',
        subject: `SSN Care Query - ${name || 'New Client'}`,
        html: htmlContent
      })
    });

    const resendData = await resendResponse.json();

    if (resendResponse.ok) {
      return res.status(200).json({ success: true, data: resendData });
    } else {
      return res.status(resendResponse.status).json({ error: resendData });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
