import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API
  // We use lazy initialization to avoid crashing on startup if the key is missing
  let ai: GoogleGenAI | null = null;
  function getAi() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      ai = new GoogleGenAI({ apiKey });
    }
    return ai;
  }

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/test-gemini", async (req, res) => {
    try {
      const aiClient = getAi();
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Hello",
      });
      res.json({ text: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const aiClient = getAi();
      
      // Format history for Gemini
      const formattedHistory = history ? history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })) : [];

      const chat = aiClient.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `Bạn là trợ lý ảo AI của Công Ty TNHH TM-DV Quảng Cáo Gò Nổi. 
Tên công ty: Quảng Cáo Gò Nổi (Gò Nổi Advertising).
Slogan: Vững tâm - Vươn tầm.
Dịch vụ chính: Tư vấn, thiết kế và thi công bảng hiệu, hộp đèn chuyên nghiệp.
Thông tin liên hệ:
- Hotline: 0909 276 588 (Mr. Tiếng)
- Email: quangcaogonoi@gmail.com
- Địa chỉ: 6/2 Đặng Thúc Vịnh, Xã Đông Thạnh, Huyện Hóc Môn, TP. HCM
- Giờ làm việc: Thứ 2 - Thứ 7: 08:00 - 17:30
Nhiệm vụ của bạn là tư vấn nhiệt tình, chuyên nghiệp, lịch sự cho khách hàng về các dịch vụ làm bảng hiệu, hộp đèn, báo giá cơ bản (khuyên khách liên hệ hotline để có giá chính xác nhất), và hướng dẫn khách hàng cách liên hệ.
Luôn trả lời bằng tiếng Việt, ngắn gọn, súc tích và thân thiện.`,
        },
      });

      // If there's history, we need to send it. The @google/genai SDK chat doesn't easily accept history in `create` in the same way as older SDKs, wait.
      // Let's check the SDK docs for history. 
      // Actually, the new SDK `ai.chats.create` takes `history` in the config? Or we can just use `generateContent` with the full conversation history.
      // Let's use `generateContent` with full history for simplicity.
      
      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: `Bạn là trợ lý ảo AI của Công Ty TNHH TM-DV Quảng Cáo Gò Nổi. 
Tên công ty: Quảng Cáo Gò Nổi (Gò Nổi Advertising).
Slogan: Vững tâm - Vươn tầm.
Dịch vụ chính: Tư vấn, thiết kế và thi công bảng hiệu, hộp đèn chuyên nghiệp.
Thông tin liên hệ:
- Hotline: 0909 276 588 (Mr. Tiếng)
- Email: quangcaogonoi@gmail.com
- Địa chỉ: 6/2 Đặng Thúc Vịnh, Xã Đông Thạnh, Huyện Hóc Môn, TP. HCM
- Giờ làm việc: Thứ 2 - Thứ 7: 08:00 - 17:30
Nhiệm vụ của bạn là tư vấn nhiệt tình, chuyên nghiệp, lịch sự cho khách hàng về các dịch vụ làm bảng hiệu, hộp đèn, báo giá cơ bản (khuyên khách liên hệ hotline để có giá chính xác nhất), và hướng dẫn khách hàng cách liên hệ.
Luôn trả lời bằng tiếng Việt, ngắn gọn, súc tích và thân thiện.`,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Admin API routes & Auth
  const adminDataDir = path.join(process.cwd(), "QUAN_TRI_WEBSITE");
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  const ADMIN_TOKEN = "admin-secret-token";

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true, token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ error: "Mật khẩu không chính xác" });
    }
  });

  // Middleware for checking token
  const requireAdminAuth = (req: express.Request, res: express.Response, skip: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
      skip();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };
  
  app.get("/api/admin/:id", requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const filePath = path.join(adminDataDir, `${id}.json`);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(data));
      } else {
        res.status(404).json({ error: "File not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/:id", requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const filePath = path.join(adminDataDir, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf8');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
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
