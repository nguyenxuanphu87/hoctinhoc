import React, { useState } from 'react';
import { Topic, Lesson, Question, UserProgress } from '../types';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Edit3,
  HelpCircle,
  Sparkles,
  Bot,
  Circle,
  Check,
  X,
} from 'lucide-react';

interface TheoryViewProps {
  topics: Topic[];
  selectedTopicId: string;
  selectedLessonId: string;
  questions: Question[];
  progress: UserProgress;
  onSelectTopic: (topicId: string) => void;
  onSelectLesson: (topicId: string, lessonId: string) => void;
  onToggleLessonComplete: (lessonId: string) => void;
  onStartPracticeTopic: (topicId: string) => void;
  onOpenAIWithContext: (context: string) => void;
}

export const TheoryView: React.FC<TheoryViewProps> = ({
  topics,
  selectedTopicId,
  selectedLessonId,
  questions,
  progress,
  onSelectTopic,
  onSelectLesson,
  onToggleLessonComplete,
  onStartPracticeTopic,
  onOpenAIWithContext,
}) => {
  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];
  const currentLesson: Lesson | undefined =
    currentTopic?.lessons.find((l) => l.id === selectedLessonId) || currentTopic?.lessons[0];

  // Quick self-check state
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showCheckResults, setShowCheckResults] = useState(false);

  if (!currentTopic || !currentLesson) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-700">Chưa chọn bài học lý thuyết.</p>
      </div>
    );
  }

  const isLessonCompleted = progress.completedLessonIds.includes(currentLesson.id);

  // Find previous and next lessons
  const allLessonsInTopic = currentTopic.lessons;
  const currentIndex = allLessonsInTopic.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessonsInTopic[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessonsInTopic.length - 1 ? allLessonsInTopic[currentIndex + 1] : null;

  // Quick check questions
  const quickQuestions: Question[] = (currentLesson.quickCheckQuestionIds || [])
    .map((qId) => questions.find((q) => q.id === qId))
    .filter((q): q is Question => q !== undefined);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
      {/* Left Sidebar: Lessons Tree */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs sticky top-20">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-2xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
              {currentTopic.code}
            </span>
            <h3 className="font-bold text-slate-900 text-sm mt-1">{currentTopic.title}</h3>
            <p className="text-xs text-slate-700 mt-1">Danh mục bài học ({currentTopic.lessons.length} bài)</p>
          </div>

          <div className="mt-3 space-y-1">
            {currentTopic.lessons.map((lesson) => {
              const isSelected = lesson.id === currentLesson.id;
              const isDone = progress.completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    onSelectLesson(currentTopic.id, lesson.id);
                    setUserAnswers({});
                    setShowCheckResults(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 line-clamp-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0"></span>
                    <span className="truncate">{lesson.title}</span>
                  </div>
                  {isDone ? (
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-500'}`}
                    />
                  ) : (
                    <Circle className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white/60' : 'text-slate-300'}`} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onStartPracticeTopic(currentTopic.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Luyện tập chuyên đề này</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Lesson Header Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-md">
                {currentTopic.code}
              </span>
              <span className="text-xs text-slate-700">Chương trình GDPT 2018</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleLessonComplete(currentLesson.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isLessonCompleted
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLessonCompleted ? 'Đã hoàn thành' : 'Đánh dấu đã học'}</span>
              </button>

              <button
                onClick={() =>
                  onOpenAIWithContext(
                    `Em đang học bài: ${currentLesson.title} thuộc chuyên đề: ${currentTopic.title}. Hãy giải thích thêm giúp em nhé!`
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition cursor-pointer"
                title="Hỏi Trợ lý AI về bài này"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Hỏi Trợ lý AI</span>
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {currentLesson.title}
          </h1>

          <div className="bg-blue-50/70 border-l-4 border-blue-600 p-3.5 rounded-r-lg">
            <p className="text-xs sm:text-sm text-blue-900 leading-relaxed font-medium">
              <strong>Tóm tắt cốt lõi:</strong> {currentLesson.summary}
            </p>
          </div>
        </div>

        {/* Full Theory Render */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-xs prose prose-slate max-w-none prose-headings:font-bold prose-h3:text-base prose-h3:text-blue-900 prose-p:text-sm prose-p:leading-relaxed prose-p:text-slate-700 prose-li:text-sm prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono">
          <div className="whitespace-pre-line text-sm text-slate-700 leading-relaxed space-y-4">
            {currentLesson.fullTheory}
          </div>
        </div>

        {/* Practical Examples */}
        {currentLesson.examples.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Ví dụ thực tế & Minh họa ứng dụng</span>
            </h2>

            <div className="grid grid-cols-1 gap-3.5">
              {currentLesson.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/70 space-y-1.5"
                >
                  <h3 className="font-bold text-slate-900 text-sm">{ex.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {ex.description}
                  </p>
                  {ex.codeOrDetails && (
                    <pre className="mt-2 p-2.5 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
                      <code>{ex.codeOrDetails}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Pitfalls & Traps to Avoid */}
        {currentLesson.commonPitfalls.length > 0 && (
          <div className="bg-rose-50/70 rounded-xl border border-rose-200/80 p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Lỗi học sinh thường gặp trong kỳ thi</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-rose-800">
              {currentLesson.commonPitfalls.map((pitfall, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">⚠️</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Takeaways Box */}
        {currentLesson.keyTakeaways.length > 0 && (
          <div className="bg-emerald-50/70 rounded-xl border border-emerald-200/80 p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Kiến thức trọng tâm cần ghi nhớ</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-800">
              {currentLesson.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Self-Check Interactive Quiz */}
        {quickQuestions.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span>Câu hỏi tự kiểm tra nhanh ({quickQuestions.length} câu)</span>
              </h2>
              <span className="text-xs text-slate-700">Kiểm tra mức độ hiểu bài ngay</span>
            </div>

            <div className="space-y-6">
              {quickQuestions.map((q, idx) => {
                const isSelected = userAnswers[q.id];
                const isCorrect =
                  isSelected !== undefined &&
                  String(isSelected).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();

                return (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Câu {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        {q.content}
                      </p>
                    </div>

                    {/* Multiple choice options */}
                    {q.type === 'multiple_choice' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt) => {
                          const chosen = userAnswers[q.id] === opt.id;
                          let optStyle = 'bg-white border-slate-200 text-slate-700 hover:border-blue-400';

                          if (showCheckResults) {
                            if (opt.id === q.correctAnswer) {
                              optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                            } else if (chosen && !isCorrect) {
                              optStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                            }
                          } else if (chosen) {
                            optStyle = 'bg-blue-50 border-blue-600 text-blue-900 font-bold';
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (!showCheckResults) {
                                  setUserAnswers({ ...userAnswers, [q.id]: opt.id });
                                }
                              }}
                              className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer flex items-center gap-2 ${optStyle}`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-2xs shrink-0">
                                {opt.id}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Short answer input */}
                    {q.type === 'short_answer' && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={userAnswers[q.id] || ''}
                          disabled={showCheckResults}
                          onChange={(e) =>
                            setUserAnswers({ ...userAnswers, [q.id]: e.target.value })
                          }
                          placeholder="Nhập câu trả lời ngắn..."
                          className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    )}

                    {/* Results explanation */}
                    {showCheckResults && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center gap-1 font-bold">
                          {isCorrect ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <Check className="w-4 h-4" /> Chính xác!
                            </span>
                          ) : (
                            <span className="text-rose-600 flex items-center gap-1">
                              <X className="w-4 h-4" /> Chưa chính xác. Đáp án đúng là:{' '}
                              <strong>{String(q.correctAnswer)}</strong>
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {showCheckResults ? (
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setShowCheckResults(false);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                >
                  Làm lại kiểm tra
                </button>
              ) : (
                <button
                  onClick={() => setShowCheckResults(true)}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer shadow-2xs"
                >
                  Kiểm tra đáp án
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div>
            {prevLesson ? (
              <button
                onClick={() => {
                  onSelectLesson(currentTopic.id, prevLesson.id);
                  setUserAnswers({});
                  setShowCheckResults(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Bài trước: {prevLesson.title}</span>
              </button>
            ) : (
              <span className="text-xs text-slate-600">Đây là bài đầu tiên của chuyên đề</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartPracticeTopic(currentTopic.id)}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition cursor-pointer shadow-xs"
            >
              Luyện tập chuyên đề này
            </button>

            {nextLesson && (
              <button
                onClick={() => {
                  onSelectLesson(currentTopic.id, nextLesson.id);
                  setUserAnswers({});
                  setShowCheckResults(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition cursor-pointer"
              >
                <span>Bài tiếp theo: {nextLesson.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
