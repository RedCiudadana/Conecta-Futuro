const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { to, firstName, courseTitle, courseSlug } = await req.json();

    if (!to || !courseTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, courseTitle" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const name = firstName || "Participante";

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1a56db;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Conecta Futuro</h1>
              <p style="margin:4px 0 0;color:#c3d9ff;font-size:13px;">Red Ciudadana - Plataforma de Formacion</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Registro exitoso</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Hola <strong style="color:#111827;">${name}</strong>, te has inscrito correctamente al curso:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f5ff;border-radius:8px;border:1px solid #dbeafe;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;color:#1a56db;font-size:17px;font-weight:700;">${courseTitle}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:#6b7280;font-size:14px;line-height:1.6;">
                Pronto recibiras informacion sobre las fechas, sesiones y materiales del curso. Mientras tanto, puedes explorar el contenido del curso en nuestra plataforma.
              </p>
              ${courseSlug ? `
              <table cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                <tr>
                  <td style="background-color:#1a56db;border-radius:8px;">
                    <a href="https://conectafuturo.redciudadana.org/course/${courseSlug}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                      Ver el curso
                    </a>
                  </td>
                </tr>
              </table>` : ""}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;line-height:1.5;">
                Este correo fue enviado automaticamente por Conecta Futuro, la plataforma de formacion de Red Ciudadana.<br>
                Si tienes preguntas, contactanos en info@redciudadana.org
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Conecta Futuro <info@redciudadana.org.gt>",
        to: [to],
        subject: `Registro confirmado: ${courseTitle}`,
        html: htmlContent,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error("Resend API error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await resendRes.json();

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
