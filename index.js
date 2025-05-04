const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const port = process.env.PORT;
const app = express();

// Configuración CORS segura para cualquier origen (o limita a localhost:3000 si prefieres)
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Acepta cualquier origen
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

// También agrega esto por si acaso, para asegurar el preflight
app.options("/", cors());

app.use(express.json({ limit: "50mb" }));

// Endpoint en la raíz
app.post("/", async (req, res) => {
  const { html } = req.body;
  console.log("HTML recibido:", html);
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    // Headers CORS explícitos en la respuesta
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=documento.pdf",
      "Access-Control-Allow-Origin": req.headers.origin || "*",
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error al generar PDF" });
  }
});

app.listen(port, () => console.log("Servidor listo en puerto 3001"));
