import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, to, subject } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In a production environment, you would use a service like:
    // - SendGrid
    // - Mailgun
    // - Resend
    // - AWS SES
    // - NodeMailer with SMTP

    // For now, we'll simulate a successful response
    // Replace this with actual email service integration

    const emailData = {
      to: to || 'Sara_987654@walla.com',
      subject: subject || `פנייה חדשה מאתר - ${name}`,
      from: email,
      name,
      phone,
      message,
      timestamp: new Date().toISOString(),
    };

    // Log the email data (in production, send actual email)
    console.log('Email would be sent:', emailData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, you would send the actual email here
    // Example with a service like Resend:
    /*
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com',
        to: emailData.to,
        subject: emailData.subject,
        html: `
          <h2>פנייה חדשה מאתר</h2>
          <p><strong>שם:</strong> ${emailData.name}</p>
          <p><strong>דוא״ל:</strong> ${emailData.from}</p>
          <p><strong>טלפון:</strong> ${emailData.phone || 'לא צוין'}</p>
          <p><strong>הודעה:</strong></p>
          <p>${emailData.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>נשלח ב: ${emailData.timestamp}</small></p>
        `,
      }),
    });
    */

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        data: {
          name: emailData.name,
          email: emailData.from,
          timestamp: emailData.timestamp
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

