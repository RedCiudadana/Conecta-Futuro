const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email requerido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Rate limit: check if a code was created in the last 60 seconds
    const recentCheck = await fetch(
      `${supabaseUrl}/rest/v1/passport_access_codes?email=eq.${encodeURIComponent(normalizedEmail)}&created_at=gt.${new Date(Date.now() - 60000).toISOString()}&select=id`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    );
    const recentData = await recentCheck.json();
    if (recentData.length > 0) {
      return new Response(JSON.stringify({ error: "Ya se envió un código recientemente. Espera 1 minuto." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up participant ( SECURITY DEFINER function, returns only safe fields)
    const partRes = await fetch(
      `${supabaseUrl}/rest/v1/rpc/lookup_participant_for_passport`,
      {
        method: "POST",
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ p_email: normalizedEmail }),
      }
    );
    const partData = await partRes.json();

    // Always return success even if not found (don't reveal if email exists)
    if (!partData || partData.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const participant = partData[0];
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Insert code
    await fetch(`${supabaseUrl}/rest/v1/passport_access_codes`, {
      method: "POST",
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizedEmail,
        code,
        participant_id: participant.id,
        expires_at: expiresAt,
      }),
    });

    // Send email via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Servicio de email no configurado" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = participant.first_name || "Participante";
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr><td style="background-color:#0ea5e9;padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Conecta Futuro</h1>
          <p style="margin:4px 0 0;color:#e0f2fe;font-size:13px;">Red Ciudadana - Plataforma de Formacion</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Tu codigo de acceso</h2>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
            Hola <strong style="color:#111827;">${name}</strong>, usa este codigo para acceder a tu Pasaporte Digital:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;">
            <tr><td style="padding:28px 24px;text-align:center;">
              <p style="margin:0;font-size:36px;font-weight:800;letter-spacing:8px;color:#0ea5e9;font-family:'Courier New',monospace;">${code}</p>
            </td></tr>
          </table>
          <p style="margin:24px 0 0;color:#6b7280;font-size:14px;line-height:1.6;">
            Este codigo expira en 10 minutos. Si no solicitaste este acceso, puedes ignorar este correo.
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;line-height:1.5;">
            Este correo fue enviado automaticamente por Conecta Futuro.<br>
            Si tienes preguntas, contactanos en info@redciudadana.org
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Conecta Futuro <info@redciudadana.org.gt>",
        to: [normalizedEmail],
        subject: "Tu codigo de acceso al Pasaporte Digital",
        html: htmlContent,
      }),
    });

    if (!resendRes.ok) {
      console.error("Resend error:", await resendRes.text());
      return new Response(JSON.stringify({ error: "No se pudo enviar el correo" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, sent: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
