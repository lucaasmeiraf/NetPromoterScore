import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5013; // Usando sua porta 5013

// Middlewares
app.use(cors());
app.use(express.json());

// Verificação de credenciais carregadas
console.log('Credenciais Outlook:', {
  user: process.env.OUTLOOK_USER,
  pass: process.env.OUTLOOK_PASS ? '*****' : 'NÃO ENCONTRADA'
});

// Configuração SMTP Outlook
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASS 
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false // Apenas para desenvolvimento!
  }
});

// Rota de verificação de status
app.get('/', (req, res) => {
  res.status(200).json({
    status: "online",
    service: "NPS Email Service",
    version: "1.0.0"
  });
});

const emailTemplate = (surveyId) => `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta name="format-detection" content="telephone=no">
    <title>MEDWARE - Pesquisa de Satisfação</title>
    <!--[if mso]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>
<body style="margin:0;padding:0;min-width:100%;background-color:#f7f9fc;">
    <!--[if mso]>
    <style type="text/css">
        .outlook-fallback-font { font-family: Arial, sans-serif; }
    </style>
    <![endif]-->
    
    <!-- Layout baseado em tabelas para compatibilidade -->
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#f7f9fc;">
        <tr>
            <td align="center" style="padding:40px 20px;">
                <!--[if (gte mso 9)|(IE)]>
                <table cellpadding="0" cellspacing="0" width="600"><tr><td>
                <![endif]-->
                <table cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:16px;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                    <!-- Cabeçalho -->
                    <tr>
                        <td style="padding:40px 30px;background:#1a73e8;mso-line-height-rule:exactly;line-height:24px;">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" class="outlook-fallback-font" style="color:#ffffff;font-family:Arial,sans-serif;font-size:28px;font-weight:bold;">
                                        MEDWARE
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" class="outlook-fallback-font" style="color:rgba(255,255,255,0.9);font-family:Arial,sans-serif;font-size:16px;padding-top:10px;">
                                        Excelência em Soluções Hospitalares
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Conteúdo -->
                    <tr>
                        <td style="padding:40px 30px;mso-line-height-rule:exactly;line-height:24px;">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td class="outlook-fallback-font" style="color:#2d3748;font-family:Arial,sans-serif;font-size:22px;padding-bottom:20px;">
                                        Olá, Prezado(a) Colaborador(a),
                                    </td>
                                </tr>
                                <tr>
                                    <td class="outlook-fallback-font" style="color:#718096;font-family:Arial,sans-serif;font-size:16px;padding-bottom:25px;">
                                        Sua experiência é vital para aprimorarmos nossos sistemas hospitalares. Dedique 2 minutos para nossa pesquisa:
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:40px 0;text-align:center;">
                                        <!--[if mso]>
                                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="{{survey_link}}" 
                                            style="width:200px;height:48px;v-text-anchor:middle;"
                                            arcsize="8%" 
                                            strokecolor="#1a73e8" 
                                            fillcolor="#1a73e8">
                                            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">
                                            Responder Pesquisa
                                            </center>
                                        </v:roundrect>
                                        <![endif]-->
                                        <a href="http://localhost:5173/survey/${surveyId}" 
                                            style="background-color:#1a73e8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-family:Arial,sans-serif;font-size:16px;display:inline-block;mso-hide:all;">
                                            Responder Pesquisa
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Rodapé -->
                    <tr>
                        <td style="padding:30px;background:#f7f9fc;mso-line-height-rule:exactly;line-height:24px;">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <img src="https://via.placeholder.com/150x40.png?text=MEDWARE+HealthSystems" 
                                            width="150" 
                                            height="40" 
                                            alt="MEDWARE" 
                                            style="border:0;height:auto;line-height:100%;outline:none;text-decoration:none;display:block;margin-bottom:15px;">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="outlook-fallback-font" style="color:#718096;font-family:Arial,sans-serif;font-size:12px;text-align:center;">
                                        MEDWARE Health Systems LTDA<br>
                                        Rua dos Equipamentos Médicos, 456 - São Paulo/SP<br>
                                        CNPJ: 11.222.333/0001-44
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td></tr></table>
                <![endif]-->
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Rota de envio de e-mails
app.post('/send-email', async (req, res) => {
  const { to, surveyId } = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"Medware Sistemas Médicos" <${process.env.OUTLOOK_USER}>`,
      to,
      subject: '📊 Sua Opinião É Muito Importante',
      html: emailTemplate(surveyId)
    });

    res.status(200).json({
        success: true,
        message: 'E-mail enfileirado para envio',
        details: {
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected
        }
    });

    console.log('E-mail enviado:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
    
  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(500).json({ 
      error: 'Falha no envio',
      details: error.response || error.message 
    });
  }
});

app.use(cors({
    origin: 'http://localhost:5173', // URL exata do frontend
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
  }));

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});