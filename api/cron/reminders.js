import prisma from '../_lib/prisma.js';
import { sendWhatsAppMessage } from '../_lib/fonnte.js';

export default async function handler(req, res) {
  // Allow GET for Vercel Cron and POST for manual trigger
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const results = {
      taskAlertsSent: 0,
      nightlyDigestSent: false,
      logs: [],
    };

    // Fetch user profile for WhatsApp number
    const userProfile = await prisma.userProfile.findFirst();
    const waNumber = userProfile?.whatsappNumber || process.env.TARGET_WHATSAPP_NUMBER || '';

    // ----------------------------------------------------
    // 1. TASK DEADLINE REMINDERS CHECK (10h, 5h, 3h, 1h)
    // ----------------------------------------------------
    const pendingTasks = await prisma.task.findMany({
      where: {
        status: 'belum',
      },
    });

    const now = new Date();

    for (const task of pendingTasks) {
      if (!task.dueDate) continue;

      // Parse Task Due Date & Time (Default 23:59 if no due time specified)
      const dueTimeStr = task.dueTime || '23:59';
      const dueDateTimeStr = `${task.dueDate}T${dueTimeStr}:00`;
      const dueDateObj = new Date(dueDateTimeStr);

      if (isNaN(dueDateObj.getTime())) continue;

      // Calculate difference in hours
      const diffMs = dueDateObj.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Skip past deadlines
      if (diffHours <= 0) continue;

      const notifiedTiers = Array.isArray(task.notifiedTiers) ? task.notifiedTiers : [];
      let triggeredTier = null;
      let reminderMessage = '';

      if (diffHours <= 1 && !notifiedTiers.includes('1h')) {
        triggeredTier = '1h';
        reminderMessage = `*DARURAT (1 JAM SEBELUM DEADLINE)*\n\n📝 *Tugas:* ${task.title}\n📂 *Kategori:* ${task.category}\n⏰ *Tenggat Waktu:* Hari ini jam ${dueTimeStr}\n\nSegera kumpulkan tugas Anda sebelum terlambat! ⚡\n@myschedule`;
      } else if (diffHours <= 3 && !notifiedTiers.includes('3h')) {
        triggeredTier = '3h';
        reminderMessage = `*PENGINGAT 3 JAM SEBELUM DEADLINE*\n\n📝 *Tugas:* ${task.title}\n📂 *Kategori:* ${task.category}\n⏰ *Tenggat Waktu:* Hari ini jam ${dueTimeStr}\n\nWaktu tersisa kurang dari 3 jam. Tetap fokus! 💪\n@myschedule`;
      } else if (diffHours <= 5 && !notifiedTiers.includes('5h')) {
        triggeredTier = '5h';
        reminderMessage = `*PENGINGAT 5 JAM SEBELUM DEADLINE*\n\n📝 *Tugas:* ${task.title}\n📂 *Kategori:* ${task.category}\n⏰ *Tenggat Waktu:* Hari ini jam ${dueTimeStr}\n\nPastikan pengerjaan tugas sudah hampir selesai ya! ✨\n@myschedule`;
      } else if (diffHours <= 10 && !notifiedTiers.includes('10h')) {
        triggeredTier = '10h';
        reminderMessage = `*PENGINGAT 10 JAM SEBELUM DEADLINE*\n\n📝 *Tugas:* ${task.title}\n📂 *Kategori:* ${task.category}\n⏰ *Tenggat Waktu:* Jam ${dueTimeStr}\n\nJangan lupa ada tugas yang perlu diselesaikan hari ini! 🚀\n@myschedule`;
      }

      if (triggeredTier && reminderMessage) {
        if (waNumber) {
          const sendRes = await sendWhatsAppMessage(waNumber, reminderMessage);
          results.logs.push(`Sent ${triggeredTier} reminder for task "${task.title}": ${sendRes.success}`);
          results.taskAlertsSent++;
        } else {
          results.logs.push(`Skipped ${triggeredTier} reminder for "${task.title}" (No WA number configured)`);
        }

        // Update task notifiedTiers in PostgreSQL
        await prisma.task.update({
          where: { id: task.id },
          data: {
            notifiedTiers: {
              set: [...notifiedTiers, triggeredTier],
            },
          },
        });
      }
    }

    // ----------------------------------------------------
    // 2. NIGHTLY SCHEDULE DIGEST FOR TOMORROW
    // ----------------------------------------------------
    // Get current hour in WIB (UTC+7)
    const currentUTCHour = now.getUTCHours();
    const currentWIBHour = (currentUTCHour + 7) % 24;

    const userAgent = String(req.headers['user-agent'] || '');
    const isVercelCron = userAgent.includes('vercel-cron') || req.headers['x-vercel-cron'] === '1';
    const forceNightly = req.query.testNightly === 'true' || req.body?.testNightly === true || isVercelCron;

    if (currentWIBHour === 20 || currentWIBHour === 21 || forceNightly) {
      // Calculate Tomorrow's Date
      const tomorrowObj = new Date(now);
      tomorrowObj.setDate(tomorrowObj.getDate() + 1);

      const tomorrowDateStr = tomorrowObj.toISOString().split('T')[0];
      const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const tomorrowDayName = daysMap[tomorrowObj.getDay()];

      // 1. Fetch Tomorrow's Courses
      const tomorrowCourses = await prisma.course.findMany({
        where: { day: tomorrowDayName },
      });

      // 2. Fetch Tomorrow's Events
      const tomorrowEvents = await prisma.scheduleEvent.findMany({
        where: {
          OR: [{ date: tomorrowDateStr }, { day: tomorrowDayName }],
        },
      });

      // 3. Fetch Tomorrow's Due Tasks
      const tomorrowTasks = await prisma.task.findMany({
        where: {
          dueDate: tomorrowDateStr,
          status: 'belum',
        },
      });

      // Format Message Digest exactly as requested by user
      let digestMsg = `*JADWAL & AGENDA BESOK*\n📅 *${tomorrowDayName}, ${tomorrowDateStr}*\n\n`;

      if (tomorrowCourses.length === 0 && tomorrowEvents.length === 0) {
        digestMsg += `*Tidak ada jadwal kuliah atau kegiatan kustom besok.* Nikmati waktu istirahat Anda!\n\n`;
      } else {
        digestMsg += `📚 *Mata Kuliah & Kegiatan:* \n`;
        let count = 1;
        tomorrowCourses.forEach((c) => {
          digestMsg += `${count++}. *${c.name}*\n   ⏰ ${c.time} | 📍 ${c.room}\n`;
        });
        tomorrowEvents.forEach((e) => {
          digestMsg += `${count++}. *${e.title}*\n   ⏰ ${e.time || 'Fleksibel'} | 📍 ${e.location || 'Fleksibel / Daring'}\n`;
        });
        digestMsg += `\n`;
      }

      if (tomorrowTasks.length > 0) {
        digestMsg += `📝 *Tugas Tenggat Besok:* \n`;
        tomorrowTasks.forEach((t) => {
          digestMsg += `• *${t.title}* (Tenggat: ${t.dueTime || '23:59'})\n`;
        });
        digestMsg += `\n`;
      }

      digestMsg += `Semangat untuk esok hari! 🚀\n@myschedule`;

      if (waNumber) {
        const sendDigestRes = await sendWhatsAppMessage(waNumber, digestMsg);
        results.nightlyDigestSent = sendDigestRes.success;
        results.logs.push(`Nightly 20:00 WIB digest sent: ${sendDigestRes.success}`);
      } else {
        results.logs.push('Nightly digest skipped (No WA number configured)');
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Cron reminders check completed successfully.',
      results: results,
    });
  } catch (error) {
    console.error('[Cron Reminders Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Cron reminders processing failed.',
    });
  }
}
