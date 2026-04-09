import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // PayU Hash Generation API
  app.post("/api/payu/hash", (req, res) => {
    const { txnid, amount, productinfo, firstname, email } = req.body;
    
    const key = process.env.PAYU_MERCHANT_KEY || "TEST_KEY";
    const salt = process.env.PAYU_MERCHANT_SALT || "TEST_SALT";

    // Hash Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    res.json({ hash });
  });

  // PayU Success Callback
  app.post("/api/payu/success", (req, res) => {
    // PayU sends data in req.body
    const { txnid, status, hash, orderId } = req.body;
    // In a real app, you should verify the hash here again
    res.redirect(`/payment-success?orderId=${req.query.orderId || txnid}`);
  });

  // PayU Failure Callback
  app.post("/api/payu/failure", (req, res) => {
    const { txnid } = req.body;
    res.redirect(`/payment-failure?orderId=${req.query.orderId || txnid}`);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
