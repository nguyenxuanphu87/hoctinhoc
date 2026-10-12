import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI instance server-side securely
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// AI Chat Assistant endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Danh sách tin nhắn không hợp lệ' });
    }

    if (!ai) {
      return res.json({
        reply:
          'Trợ lý Tin học đang hoạt động ở chế độ ngoại tuyến (chưa phát hiện khóa API Gemini). Bạn vẫn có thể học lý thuyết, làm đề thi, xem giải thích chi tiết có sẵn trong ngân hàng câu hỏi chuẩn!',
      });
    }

    const systemInstruction = `Bạn là "Trợ lý Tin học", trợ lý học tập môn Tin học THPT chuyên phục vụ học sinh lớp 12 tại Việt Nam ôn thi tốt nghiệp THPT theo Chương trình Giáo dục Phổ thông 2018 (đặc biệt là định hướng Tin học ứng dụng - ICT).
Nhiệm vụ của bạn:
1. Giải thích các kiến thức Tin học 12 dễ hiểu, chính xác, bám sát SGK (Hệ điều hành, Mạng máy tính & Internet, Bảng tính Excel/Sheets, Xử lý dữ liệu, An toàn thông tin số, HTML/CSS Web cơ bản).
2. Phân tích chi tiết tại sao một phương án đúng hoặc sai.
3. Đưa ra các ví dụ thực tiễn gần gũi với học sinh THPT.
4. Giữ phong thái chuẩn mực của một giáo viên tâm huyết, tích cực, không gây áp lực cho học sinh.
${context ? `Ngữ cảnh học sinh đang xem: ${context}` : ''}`;

    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Xin lỗi em, thầy/cô chưa xử lý được câu hỏi này. Em hãy thử đặt câu hỏi cụ thể hơn nhé!';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Lỗi API /api/ai/chat:', error);
    return res.status(500).json({
      error: 'Không thể kết nối đến Trợ lý Tin học lúc này.',
      details: error?.message,
    });
  }
});

// AI Explain Question endpoint
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { question, userSelected, topicTitle } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Thiếu thông tin câu hỏi' });
    }

    if (!ai) {
      return res.json({
        explanation: question.explanation || 'Đáp án đúng dựa trên kiến thức chuẩn SGK Tin học 12.',
      });
    }

    const prompt = `Phân tích sư phạm câu hỏi trắc nghiệm Tin học 12:
Chuyên đề: ${topicTitle || question.topicId || 'Tin học ứng dụng'}
Nội dung câu hỏi: ${question.content}
Dạng câu hỏi: ${question.type || 'multiple_choice'}
Các phương án: ${JSON.stringify(question.options || question.subQuestions || [])}
Đáp án chuẩn: ${JSON.stringify(question.correctAnswer)}
Học sinh đã chọn: ${JSON.stringify(userSelected ?? 'Chưa chọn')}
Giải thích có sẵn: ${question.explanation || 'Chưa có'}

Hãy đóng vai trò giáo viên Tin học THPT:
1. Giải thích chi tiết tại sao đáp án chuẩn là chính xác.
2. Nếu học sinh chọn sai, phân tích lỗi tư duy hoặc bẫy thường gặp dẫn đến lựa chọn đó.
3. Tóm tắt 1 "Mẹo ghi nhớ cốt lõi" cho kỳ thi tốt nghiệp THPT.
Trình bày bằng Markdown rõ ràng, ngắn gọn, súc tích.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là giáo viên Tin học THPT chuyên luyện thi tốt nghiệp THPT tại Việt Nam.',
        temperature: 0.5,
      },
    });

    return res.json({ explanation: response.text || question.explanation });
  } catch (error: any) {
    console.error('Lỗi API /api/ai/explain:', error);
    return res.json({
      explanation: req.body?.question?.explanation || 'Không thể tải thêm phân tích từ AI lúc này.',
    });
  }
});

// AI Generate Practice Question endpoint
app.post('/api/ai/generate-question', async (req, res) => {
  try {
    const { topicTitle, difficulty, type } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'Tính năng cần khóa API Gemini đang hoạt động' });
    }

    const prompt = `Hãy soạn 01 câu hỏi trắc nghiệm môn Tin học 12 (định hướng Tin học ứng dụng theo chương trình GDPT 2018):
- Chuyên đề: ${topicTitle || 'Sử dụng máy tính và các công cụ số'}
- Mức độ nhận thức: ${difficulty || 'Thông hiểu'} (các mức: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
- Dạng câu hỏi: ${type || 'multiple_choice'} (chọn 1 trong 3 dạng: 'multiple_choice', 'true_false', 'short_answer')

Yêu cầu trả về đúng định dạng JSON có cấu trúc như sau:
{
  "content": "Nội dung câu hỏi...",
  "type": "${type || 'multiple_choice'}",
  "difficulty": "${difficulty || 'Thông hiểu'}",
  "options": [
    {"id": "A", "text": "Phương án A"},
    {"id": "B", "text": "Phương án B"},
    {"id": "C", "text": "Phương án C"},
    {"id": "D", "text": "Phương án D"}
  ],
  "subQuestions": [ // Chỉ dùng nếu type là 'true_false' (gồm 4 ý a, b, c, d)
    {"id": "a", "text": "Ý a...", "correct": true},
    {"id": "b", "text": "Ý b...", "correct": false},
    {"id": "c", "text": "Ý c...", "correct": true},
    {"id": "d", "text": "Ý d...", "correct": false}
  ],
  "correctAnswer": "A", // Nếu multiple_choice là 'A'/'B'/'C'/'D'; nếu short_answer là chuỗi kết quả; nếu true_false là mảng boolean [true, false, true, false]
  "explanation": "Lời giải thích cặn kẽ tại sao đúng...",
  "keyTakeaway": "Kiến thức cốt lõi cần nhớ...",
  "reference": "SGK Tin học 12 Định hướng Tin học ứng dụng"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ question: parsed });
  } catch (error: any) {
    console.error('Lỗi API /api/ai/generate-question:', error);
    return res.status(500).json({ error: 'Không thể tạo câu hỏi lúc này' });
  }
});

// AI Study Plan endpoint
app.post('/api/ai/study-plan', async (req, res) => {
  try {
    const { stats, weakTopics, score } = req.body;

    if (!ai) {
      return res.json({
        plan: `Kế hoạch đề xuất:
1. Ôn lại lý thuyết các chuyên đề còn dưới 70% chính xác: ${weakTopics?.join(', ') || 'các chuyên đề vừa luyện'}.
2. Luyện lại các câu làm sai trong phần Lịch sử bài làm.
3. Thực hành ít nhất 1 đề thi thử trọn vẹn mỗi 2 ngày.`,
      });
    }

    const prompt = `Dựa trên kết quả ôn tập thi tốt nghiệp môn Tin học 12 của học sinh:
- Điểm thi gần nhất: ${score !== undefined ? `${score}/10` : 'Chưa thi thử'}
- Số câu đã làm: ${stats?.totalAnswered || 0}
- Tỷ lệ đúng: ${stats?.accuracy || 0}%
- Các chuyên đề còn yếu hoặc cần củng cố: ${weakTopics?.length ? weakTopics.join(', ') : 'Chưa có dữ liệu yếu'}

Hãy lập một kế hoạch ôn tập cá nhân hóa 5 bước khoa học, thực tế, động viên học sinh và tập trung vào cải thiện điểm số tốt nghiệp THPT. Sử dụng định dạng Markdown thân thiện.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    return res.json({ plan: response.text });
  } catch (error: any) {
    console.error('Lỗi API /api/ai/study-plan:', error);
    return res.status(500).json({ error: 'Không thể tạo kế hoạch ôn tập lúc này' });
  }
});

// Vite Middleware for Development / Static serve for Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server chạy tại: http://localhost:${PORT}`);
  });
}

startServer();
