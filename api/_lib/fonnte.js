/**
 * Fonnte WhatsApp API Gateway Helper
 */
export async function sendWhatsAppMessage(targetNumber, message) {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.warn('[Fonnte Warning]: FONNTE_TOKEN environment variable is not set.');
    return { success: false, error: 'FONNTE_TOKEN environment variable is not set.' };
  }

  const rawTarget = targetNumber || process.env.TARGET_WHATSAPP_NUMBER || '';
  const formattedTarget = rawTarget ? String(rawTarget).replace(/^0/, '62').replace(/[^\d]/g, '') : '';

  if (!formattedTarget) {
    return { success: false, error: 'Target WhatsApp phone number is invalid or empty.' };
  }

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: formattedTarget,
        message: message,
        countryCode: '62',
      }),
    });

    const data = await res.json();
    return {
      success: data.status === true || data.status === 'true' || Boolean(data.status),
      data: data,
    };
  } catch (err) {
    console.error('[Fonnte Send API Error]:', err);
    return { success: false, error: err.message };
  }
}
