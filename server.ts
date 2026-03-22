import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import admin from "firebase-admin";

// Initialize Firebase Admin
// In Cloud Run, it will use the default service account.
// We need to provide the databaseId from our config.
import firebaseConfig from "./firebase-applet-config.json";

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const firestore = admin.firestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API to serve the OG image from base64
  app.get("/api/og-image", (req, res) => {
    const flower = req.query.flower as string;
    if (!flower) {
      return res.status(400).send("No flower data provided");
    }

    try {
      // Handle both raw base64 and data URI
      let base64Data = flower;
      let mimeType = "image/png";

      if (flower.startsWith("data:")) {
        const match = flower.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          base64Data = match[2];
        }
      }

      const img = Buffer.from(base64Data, "base64");
      res.writeHead(200, {
        "Content-Type": mimeType,
        "Content-Length": img.length,
        "Cache-Control": "public, max-age=31536000, immutable"
      });
      res.end(img);
    } catch (e) {
      res.status(500).send("Failed to process image");
    }
  });

  // Helper to inject OG tags
  const injectOGTags = async (template: string, req: express.Request) => {
    const letterId = req.query.id as string;
    let flower = req.query.flower as string;
    let recipient = req.query.to as string;

    // If we have an ID, fetch from Firestore
    if (letterId) {
      try {
        const doc = await firestore.collection("letters").doc(letterId).get();
        if (doc.exists) {
          const data = doc.data();
          if (data) {
            flower = data.flower || flower;
            recipient = data.recipient || recipient;
          }
        }
      } catch (e) {
        console.error("Failed to fetch letter from Firestore for OG tags", e);
      }
    }

    let modifiedTemplate = template;
    
    if (flower) {
      const ogImageUrl = `${req.protocol}://${req.get("host")}/api/og-image?flower=${encodeURIComponent(flower)}`;
      modifiedTemplate = modifiedTemplate.replace(
        /<meta property="og:image" content="[^"]+" \/>/,
        `<meta property="og:image" content="${ogImageUrl}" />`
      );
    }
    
    if (recipient) {
      modifiedTemplate = modifiedTemplate.replace(
        /<meta property="og:title" content="[^"]+" \/>/,
        `<meta property="og:title" content="A Royal Letter for ${decodeURIComponent(recipient)}" />`
      );
    }

    return modifiedTemplate;
  };

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(async (req, res, next) => {
      if (req.url === "/" || req.url.startsWith("/?")) {
        try {
          let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
          template = await vite.transformIndexHtml(req.url, template);
          template = await injectOGTags(template, req);

          res.status(200).set({ "Content-Type": "text/html" }).end(template);
          return;
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
          return;
        }
      }
      vite.middlewares(req, res, next);
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    app.get("*", async (req, res) => {
      let template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
      template = await injectOGTags(template, req);
      res.send(template);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
