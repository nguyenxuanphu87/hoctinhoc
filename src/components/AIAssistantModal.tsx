import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import {
  Bot,
  Sparkles,
  Send,
  X,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Lightbulb,
  FileQuestion,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: string;
  contextQuestion?: Question | null;
  userSelectedAnswer?: any;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialContext,
  contextQuestion,
  userSelectedAnswer,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content:
        'Xin chào em! Thầy/Cô là **Trợ lý Tin học** đồng hành cùng em ôn thi tốt nghiệp THPT.\n\nEm có thể hỏi thầy/cô về:\n- Giải thích chi tiết một câu hỏi trắc nghiệm hoặc bài toán bảng tính Excel.\n- Phân biệt các khái niệm (IP vs MAC, Router vs Switch, VLOOKUP vs INDEX-MATCH).\n- Tạo câu hỏi luyện tập theo từng chuyên đề.\n- Lập kế hoạch ôn tập cá nhân hóa.',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle auto-trigger when opened with specific contextQuestion
  useEffect(() => {
    if (isOpen && contextQuestion) {
      handleExplainContextQuestion(contextQuestion, userSelectedAnswer);
    } else if (isOpen && initialContext) {
      handleSendMessage(initialContext);
    }
  }, [isOpen, contextQuestion]);

  const handleExplainContextQuestion = async (q: Question, uChoice: any) => {
    setIsLoading(true);
    const userPrompt = `Thầy/Cô hãy phân tích chi tiết câu hỏi này giúp em:\n"${q.content}"\nEm đã chọn: ${JSON.stringify(uChoice ?? 'Chưa chọn')}.`;
    
    setMessages((prev) => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        role: 'user',
        content: userPrompt,
        timestamp: Date.now(),
      },
    ]);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          userSelected: uChoice,
          topicTitle: q.topicId,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          role: 'assistant',
          content:
            data.explanation ||
            'Thầy/cô đã kiểm tra: Đáp án đúng dựa trên kiến thức chuẩn SGK Tin học 12. Em hãy chú ý đọc kỹ các từ khóa trong đề nhé!',
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          role: 'assistant',
          content: `Đáp án chuẩn của câu hỏi này là: **${JSON.stringify(q.correctAnswer)}**.\n\n${q.explanation}\n\n*Ghi nhớ:* ${q.keyTakeaway || 'Ôn tập kỹ lý thuyết chuyên đề tương ứng.'}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          role: 'assistant',
          content: data.reply || data.error || 'Thầy/cô chưa nhận được phản hồi lúc này.',
          timestamp: Date.now(),
        },
      ]);
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          role: 'assistant',
          content:
            'Hiện tại không thể kết nối đến máy chủ AI. Em hãy xem lý thuyết và giải thích chi tiết có sẵn trong bài học và ngân hàng câu hỏi nhé!',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick preset actions
  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[620px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base">Trợ lý Tin học THPT</h3>
                <span className="px-2 py-0.5 text-2xs bg-amber-400 text-amber-950 font-bold rounded">
                  AI Sư phạm
                </span>
              </div>
              <p className="text-2xs text-blue-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Bám sát chuẩn GDPT 2018 – Hỗ trợ ôn thi tốt nghiệp</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto shrink-0 text-2xs">
          <span className="font-bold text-slate-700 uppercase shrink-0">Gợi ý nhanh:</span>
          {[
            'Phân biệt VLOOKUP và INDEX-MATCH',
            'Giải thích nguyên lý 2FA an toàn',
            'Toán tử tìm kiếm Google nâng cao',
            'Gợi ý 3 mẹo tránh bẫy đề thi',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-md border border-slate-200 shrink-0 font-medium transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message history */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {m.role === 'user' ? (
                  <span className="font-bold text-2xs">Em</span>
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/70'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 text-slate-600 rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-200"></div>
                <span className="text-2xs font-medium text-slate-700 ml-1">
                  Trợ lý Tin học đang suy nghĩ câu trả lời...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Đặt câu hỏi về kiến thức Tin học 12 hoặc câu hỏi trắc nghiệm..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
          <p className="text-2xs text-slate-600 text-center mt-1.5">
            Trợ lý giáo dục hỗ trợ học tập môn Tin học THPT. Không thay thế tài liệu đề thi chính thức của Bộ GD&ĐT.
          </p>
        </div>
      </div>
    </div>
  );
};
