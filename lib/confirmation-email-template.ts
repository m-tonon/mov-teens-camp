export const confirmationTemplate = `<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Inscrição Confirmada — 3º Acampa Teens</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: transparent;
      font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #e5e5e5;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; outline: none; text-decoration: none; display: block; }
    a { color: inherit; text-decoration: none; }

    .email-wrapper {
      background-color: transparent;
      padding: 40px 16px;
    }

    .email-container {
      max-width: 700px;
      margin: 0 auto;
      background-color: #0a0a0a;
      border-radius: 16px;
      overflow: hidden;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #0a0a0a 0%, #12082a 50%, #0a0a0a 100%);
      border: 1px solid #2a1a4a;
      border-radius: 16px 16px 0 0;
      padding: 48px 40px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .header-glow {
      background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(109, 40, 217, 0.25) 0%, transparent 70%);
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
    }

    .badge {
      display: inline-block;
      background: rgba(109, 40, 217, 0.2);
      border: 1px solid rgba(109, 40, 217, 0.4);
      color: #a78bfa;
      font-family: 'Oswald', 'Courier New', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 24px;
    }

    .title-acampa {
      font-family: 'Oswald', 'Arial Black', sans-serif;
      font-size: 52px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.02em;
      line-height: 1;
      text-transform: uppercase;
    }

    .title-teens {
      font-family: 'Oswald', 'Arial Black', sans-serif;
      font-size: 52px;
      font-weight: 700;
      background: linear-gradient(135deg, #7c3aed, #a78bfa, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.02em;
      line-height: 1;
      text-transform: uppercase;
    }

    .deepfake-tag {
      display: inline-block;
      background: #000;
      color: #fff;
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      padding: 6px 24px;
      margin-top: 12px;
      -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
      mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
    }

    /* Success banner */
    .success-banner {
      background: linear-gradient(135deg, #052e16, #14532d);
      border-left: 3px solid #22c55e;
      padding: 20px 32px;
      text-align: center;
    }

    .success-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .success-title {
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 600;
      color: #4ade80;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .success-subtitle {
      font-size: 13px;
      color: #86efac;
      margin-top: 4px;
    }

    /* Body */
    .body-section {
      background-color: #111111;
      border-left: 1px solid #1f1f1f;
      border-right: 1px solid #1f1f1f;
      padding: 40px;
    }

    .greeting {
      font-size: 16px;
      color: #d1d5db;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .greeting strong {
      color: #ffffff;
      font-weight: 600;
    }

    /* Info card */
    .info-card {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      overflow: hidden;
      margin: 28px 0;
    }

    .info-card-header {
      background: linear-gradient(135deg, #1e0a3c, #12082a);
      border-bottom: 1px solid #2a1a4a;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-card-header-title {
      font-family: 'Oswald', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #a78bfa;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .info-row {
      padding: 50px 54px;
      border-bottom: 1px solid #222;
      display: table;
      width: 100%;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      display: table-cell;
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      width: 40%;
      padding: 12px;
    }

    .info-value {
      display: table-cell;
      font-size: 14px;
      color: #e5e5e5;
      font-weight: 500;
      vertical-align: middle;
      padding: 12px;
    }

    .info-emoji {
      margin-right: 6px;
    }

    .confirmed-badge {
      display: inline-block;
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #4ade80;
      font-size: 12px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 999px;
    }

    /* Message */
    .message-text {
      font-size: 15px;
      color: #9ca3af;
      line-height: 1.7;
      margin-bottom: 16px;
    }

    .message-text strong {
      color: #e5e5e5;
    }

    /* Divider */
    .divider {
      border: none;
      border-top: 1px solid #1f1f1f;
      margin: 32px 0;
    }

    /* Contact section */
    .contact-section {
      background: #161616;
      border: 1px solid #222;
      border-radius: 10px;
      padding: 20px 24px;
      margin-top: 24px;
    }

    .contact-title {
      font-size: 12px;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 12px;
    }

    .contact-item {
      font-size: 14px;
      color: #d1d5db;
      padding: 4px 0;
    }

    .contact-item strong {
      color: #ffffff;
    }

    /* Footer */
    .footer {
      background: #0a0a0a;
      border: 1px solid #1f1f1f;
      border-top: none;
      border-radius: 0 0 16px 16px;
      padding: 28px 40px;
      text-align: center;
    }

    .footer-logo {
      width: 80px;
      height: auto;
      margin: 0 auto 16px;
      opacity: 0.8;
    }

    .footer-text {
      font-size: 12px;
      color: #4b5563;
      line-height: 1.6;
    }

    .footer-text a {
      color: #7c3aed;
    }

    /* Responsive */
    @media only screen and (max-width: 480px) {
      .header, .body-section, .footer { padding: 28px 20px !important; }
      .title-acampa, .title-teens { font-size: 38px !important; }
      .info-label { font-size: 11px !important; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">

      <!-- HEADER -->
      <div class="header">
        <div class="header-glow"></div>
        <div class="badge">⛺ 3ª Edição · 2026</div>
        <div class="title-acampa">ACAMPA</div>
        <div class="title-teens">TEENS</div>
        <div class="deepfake-tag">DEEP FAKE</div>
      </div>

      <!-- SUCCESS BANNER -->
      <div class="success-banner">
        <div class="success-icon">✅</div>
        <div class="success-title">Inscrição Confirmada!</div>
        <div class="success-subtitle">Seu pagamento foi processado com sucesso</div>
      </div>

      <!-- BODY -->
      <div class="body-section">

        <p class="greeting">
          Olá, <strong>{{nomeParticipante}}</strong>!<br><br>
          Temos uma ótima notícia: <strong><br/>sua inscrição no 3º Acampa Teens foi concluída com sucesso!</strong> 🎉<br><br>
          Prepare-se para dias que vão ficar na memória — cheios de alegria, comunhão e crescimento espiritual. 🙏🔥
        </p>

        <!-- Info card -->
        <table class="info-card" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td class="info-card-header">
              <span style="font-size:16px;">📍</span>
              <span class="info-card-header-title">Informações do Acampamento</span>
            </td>
          </tr>
          <tr>
            <td class="info-row">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="info-label">📅 Data</td>
                  <td class="info-value">05 a 07 de Junho de 2026</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="info-row">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="info-label">📍 Local</td>
                  <td class="info-value">Acampamento Evangélico Maanaim<br>
                    <span style="font-size:12px; color:#6b7280;">Estr. Arns, 1516 — Mandaguaçu, PR</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="info-row">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="info-label">🧒 Faixa etária</td>
                  <td class="info-value">12 a 16 anos</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="info-row">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="info-label">💵 Valor pago</td>
                  <td class="info-value">R$ 280,00</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="info-row">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="info-label">✅ Status</td>
                  <td class="info-value"><span class="confirmed-badge">Confirmado</span></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p class="message-text">
          Se você tiver qualquer dúvida ou precisar de mais informações, é só entrar em contato com a equipe do acampamento.
        </p>

        <p class="message-text">
          Nos vemos lá!<br>
          <strong>Equipe Acampa Teens</strong>
        </p>

        <hr class="divider">

        <!-- Contact -->
        <div class="contact-section">
          <div class="contact-title">📞 Dúvidas? Fale conosco</div>
          <div class="contact-item"><strong>Secretaria IPVO:</strong> (44) 3226-4473</div>
          <div class="contact-item"><strong>Anjinho:</strong> (44) 9 9846-0089</div>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="footer">
        <p class="footer-text">
          © 2026 MovTeens · IPVO<br>
          Este e-mail foi enviado automaticamente. Por favor, não responda.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;