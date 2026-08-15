/**
 * Cloudflare Worker — the only server-side code in this project.
 *
 * Almost every request is a static file and goes straight to env.ASSETS.
 * The two exceptions are the contact form endpoint and a legacy sitemap
 * redirect left over from the WordPress site.
 *
 * LEAD_TO, LEAD_FROM and VOICEMAIL_TOKEN live in wrangler.jsonc so that every
 * build carries them. RESEND_KEY is a dashboard secret and must never be
 * committed — see the note in wrangler.jsonc.
 */

interface Env {
  ASSETS: Fetcher;
  LEAD_TO?: string;
  LEAD_FROM?: string;
  RESEND_KEY?: string;
  VOICEMAIL_TOKEN?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
      return handleLead(request, env, url);
    }

    if (url.pathname === '/api/voicemail') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
      return handleVoicemail(request, env, url);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleLead(request: Request, env: Env, url: URL): Promise<Response> {
  try {
    const form    = await request.formData();
    const name    = String(form.get('name') ?? '').trim();
    const phone   = String(form.get('phone') ?? '').trim();
    const email   = String(form.get('email') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const honey   = String(form.get('website') ?? '').trim(); // spam trap; real users leave it empty

    const done = () => Response.redirect(new URL('/contact/?sent=1', url).href, 303);

    if (honey) return done();
    if (!name || (!phone && !email)) {
      return new Response('Please give a name and either a phone number or an email address.', { status: 400 });
    }

    if (!env.RESEND_KEY || !env.LEAD_TO || !env.LEAD_FROM) {
      console.error('lead received but delivery is not configured', { name, phone, email });
      return new Response(
        'The form is not connected yet. Please call us instead — we will not have received this.',
        { status: 503 },
      );
    }

    const body = [
      `Name:    ${name}`,
      `Phone:   ${phone || '—'}`,
      `Email:   ${email || '—'}`,
      '',
      message || '(no message)',
      '',
      `Page:    ${request.headers.get('referer') ?? 'unknown'}`,
    ].join('\n');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.LEAD_FROM,
        to: [env.LEAD_TO],
        reply_to: email || undefined,
        subject: `New website lead — ${name}`,
        text: body,
      }),
    });

    if (!res.ok) {
      console.error('lead delivery failed', res.status, await res.text());
      return new Response('Could not send right now. Please call us instead.', { status: 502 });
    }
    return done();
  } catch (err) {
    console.error(err);
    return new Response('Unexpected error.', { status: 500 });
  }
}

/**
 * Voicemail notification, called by the Twilio Studio flow when someone
 * leaves a message. Twilio holds the recording; all we do is tell the owner about
 * it straight away, because a voicemail sitting unread in the Twilio console
 * is a lost job.
 *
 * Authenticated by a shared token in the query string. That is deliberately
 * modest security: the worst a leaked token buys an attacker is the ability
 * to send the owner an email. It is NOT a secret worth protecting like the API key,
 * which is why it can live in wrangler.jsonc.
 */
async function handleVoicemail(request: Request, env: Env, url: URL): Promise<Response> {
  try {
    if (!env.VOICEMAIL_TOKEN || url.searchParams.get('k') !== env.VOICEMAIL_TOKEN) {
      return new Response('Forbidden', { status: 403 });
    }
    if (!env.RESEND_KEY || !env.LEAD_TO || !env.LEAD_FROM) {
      console.error('voicemail received but delivery is not configured');
      return new Response('Not configured', { status: 503 });
    }

    // Studio can post either form-encoded or JSON depending on how the widget
    // is set up, so accept both rather than depending on one being chosen.
    const type = request.headers.get('content-type') ?? '';
    let data: Record<string, string> = {};
    if (type.includes('application/json')) {
      data = (await request.json()) as Record<string, string>;
    } else {
      const form = await request.formData();
      for (const [k, v] of form.entries()) data[k] = String(v);
    }

    const from       = (data.from ?? '').trim() || 'unknown number';
    const recording  = (data.recording ?? '').trim();
    const transcript = (data.transcript ?? '').trim();
    const duration   = (data.duration ?? '').trim();

    // Twilio serves the audio as .mp3 if you ask for it; the bare URL returns XML.
    const audio = recording ? (recording.endsWith('.mp3') ? recording : `${recording}.mp3`) : '';

    // null means "drop this line"; empty string means "blank line", so the
    // conditional rows can vanish without collapsing the spacing.
    const body = ([
      `Someone left a voicemail on the website number.`,
      ``,
      `From:     ${from}`,
      duration ? `Length:   ${duration} seconds` : null,
      ``,
      transcript
        ? `What they said (auto-transcribed, so treat it loosely):`
        : `Twilio had not finished transcribing when this was sent — play the recording.`,
      transcript ? transcript : null,
      ``,
      audio ? `Listen: ${audio}` : null,
      ``,
      `Call them back on ${from}.`,
    ].filter((line) => line !== null) as string[]).join('\n');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.LEAD_FROM,
        to: [env.LEAD_TO],
        subject: `Voicemail from ${from}`,
        text: body,
      }),
    });

    if (!res.ok) {
      console.error('voicemail delivery failed', res.status, await res.text());
      return new Response('Could not send', { status: 502 });
    }
    return new Response('ok');
  } catch (err) {
    console.error(err);
    return new Response('Unexpected error.', { status: 500 });
  }
}
