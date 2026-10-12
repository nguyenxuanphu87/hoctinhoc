import React from 'react';
import { Topic, Question, UserProgress, ViewTab } from '../types';
import {
  Sparkles,
  BookOpen,
  Award,
  PlayCircle,
  TrendingUp,
  Target,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  FileSpreadsheet,
  Cpu,
  Cloud,
  Search,
  Globe,
  BarChart3,
  ShieldCheck,
  AlertCircle,
  Flame,
} from 'lucide-react';

interface HomeViewProps {
  topics: Topic[];
  questions: Question[];
  progress: UserProgress;
  onNavigate: (tab: ViewTab) => void;
  onSelectTopic: (topicId: string) => void;
  onSelectLesson: (topicId: string, lessonId: string) => void;
  onStartPracticeTopic: (topicId: string) => void;
  onOpenAIModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  topics,
  questions,
  progress,
  onNavigate,
  onSelectTopic,
  onSelectLesson,
  onStartPracticeTopic,
  onOpenAIModal,
}) => {
  // Compute real study statistics from user progress
  const answeredQuestionIds = Object.keys(progress.questionHistory);
  const totalAnswered = answeredQuestionIds.length;
  const totalCorrect = answeredQuestionIds.filter(
    (id) => progress.questionHistory[id]?.isCorrect
  ).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const totalLessonsCount = topics.reduce((acc, t) => acc + t.lessons.length, 0);
  const completedLessonsCount = progress.completedLessonIds.length;
  const lessonProgressPercent =
    totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  // Identify prioritized topics based on real performance
  const topicStats = topics.map((topic) => {
    const topicQuestions = questions.filter((q) => q.topicId === topic.id);
    const topicAnswered = topicQuestions.filter((q) => progress.questionHistory[q.id]);
    const topicCorrect = topicAnswered.filter((q) => progress.questionHistory[q.id]?.isCorrect);
    const topicAccuracy =
      topicAnswered.length > 0
        ? Math.round((topicCorrect.length / topicAnswered.length) * 100)
        : null;

    const topicCompletedLessons = topic.lessons.filter((l) =>
      progress.completedLessonIds.includes(l.id)
    ).length;

    return {
      topic,
      totalQuestions: topicQuestions.length,
      answeredCount: topicAnswered.length,
      accuracy: topicAccuracy,
      completedLessons: topicCompletedLessons,
      isWeak: topicAccuracy !== null && topicAccuracy < 70,
    };
  });

  const weakTopics = topicStats.filter((t) => t.isWeak);
  const priorityTopics =
    weakTopics.length > 0
      ? weakTopics.slice(0, 2)
      : topicStats.filter((t) => t.answeredCount === 0).slice(0, 2);

  // Helper to render icon by name
  const renderTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-indigo-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'Search':
        return <Search className="w-5 h-5 text-amber-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-cyan-600" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-violet-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-rose-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl shadow-blue-950/15 border border-blue-700/40 p-6 sm:p-10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kỳ thi Tốt nghiệp THPT 2025 – 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Chào mừng bạn đến với Cổng Ôn thi Tin học THPT!
          </h1>

          <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
            Hệ thống hóa kiến thức toàn diện theo chương trình GDPT 2018 (định hướng{' '}
            <strong className="text-white font-semibold">Tin học ứng dụng</strong>). Rèn luyện
            phản xạ với cấu trúc đề thi mới nhất: trắc nghiệm 4 lựa chọn, chùm đúng/sai và câu hỏi
            trả lời ngắn.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('topics')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-md shadow-blue-500/30 transition-all hover:scale-102 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Bắt đầu ôn tập</span>
            </button>

            <button
              onClick={() => onNavigate('exam')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-bold text-sm shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              <Award className="w-4 h-4 text-blue-700" />
              <span>Luyện đề ngay</span>
            </button>

            <button
              onClick={() => {
                // If there are lessons, open first or last completed
                if (topics.length > 0 && topics[0].lessons.length > 0) {
                  onSelectLesson(topics[0].id, topics[0].lessons[0].id);
                } else {
                  onNavigate('topics');
                }
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-800/80 hover:bg-blue-700/80 border border-blue-600/60 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-blue-300" />
              <span>Tiếp tục học</span>
            </button>
          </div>
        </div>
      </section>

      {/* Real Study Progress Tracker */}
      <section className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Tiến độ học tập thực tế</span>
            </h2>
            <p className="text-xs text-slate-700">
              Dữ liệu được lưu trữ tự động trên thiết bị của bạn. Không tạo thành tích ảo.
            </p>
          </div>

          {progress.examResults.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Đã hoàn thành {progress.examResults.length} lượt thi thử</span>
            </div>
          )}
        </div>

        {totalAnswered === 0 && completedLessonsCount === 0 ? (
          <div className="py-8 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              Bạn chưa bắt đầu luyện tập câu hỏi nào
            </h3>
            <p className="text-xs text-slate-700">
              Hãy chọn một chuyên đề bên dưới để đọc lý thuyết trọng tâm hoặc thử sức với các câu hỏi trắc nghiệm ngay nhé!
            </p>
            <button
              onClick={() => onNavigate('topics')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <span>Xem danh sách chuyên đề</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs font-medium text-slate-700">Số câu đã luyện</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {totalAnswered} <span className="text-xs font-normal text-slate-700">/ {questions.length} câu</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((totalAnswered / Math.max(1, questions.length)) * 100))}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs font-medium text-slate-700">Số câu trả lời đúng</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {totalCorrect} <span className="text-xs font-normal text-slate-700">câu</span>
              </div>
              <div className="text-xs text-slate-700 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tỷ lệ chính xác: <strong>{accuracy}%</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs font-medium text-slate-700">Bài lý thuyết đã học</div>
              <div className="text-2xl font-extrabold text-blue-600 mt-1">
                {completedLessonsCount} <span className="text-xs font-normal text-slate-700">/ {totalLessonsCount} bài</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${lessonProgressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-xs font-medium text-slate-700">Điểm thi thử gần nhất</div>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">
                {progress.examResults.length > 0
                  ? `${progress.examResults[progress.examResults.length - 1].totalScore}`
                  : '--'}
                <span className="text-xs font-normal text-slate-700"> / 10đ</span>
              </div>
              <div className="text-xs text-slate-700 mt-2">
                {progress.examResults.length > 0 ? (
                  <button
                    onClick={() => onNavigate('results')}
                    className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Xem lại kết quả</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <span>Chưa làm đề thi thử nào</span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Priority Topics Recommendation */}
      {priorityTopics.length > 0 && (
        <section className="bg-amber-50/60 rounded-xl border border-amber-200/80 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-amber-900">
                {weakTopics.length > 0 ? 'Chuyên đề cần ưu tiên củng cố' : 'Chuyên đề đề xuất ôn tập tiếp theo'}
              </h2>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-md">
              Gợi ý học tập
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priorityTopics.map(({ topic, accuracy, answeredCount }) => (
              <div
                key={topic.id}
                className="bg-white p-4 rounded-xl border border-amber-200/70 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {topic.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{topic.title}</h3>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2">{topic.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-700">
                    {accuracy !== null ? (
                      <span className="font-semibold text-amber-700">Độ chính xác: {accuracy}% ({answeredCount} câu)</span>
                    ) : (
                      <span className="text-slate-600">Chưa làm câu nào</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectTopic(topic.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer"
                    >
                      Học lý thuyết
                    </button>
                    <button
                      onClick={() => onStartPracticeTopic(topic.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer"
                    >
                      Luyện tập
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Topics Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Danh mục chuyên đề Tin học ứng dụng
            </h2>
            <p className="text-xs sm:text-sm text-slate-700">
              Bám sát ma trận kiến thức và mục tiêu cần đạt của chương trình THPT mới.
            </p>
          </div>
          <button
            onClick={() => onNavigate('topics')}
            className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả ({topics.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((topic) => {
            const topicQuestions = questions.filter((q) => q.topicId === topic.id);
            const topicLessons = topic.lessons;
            const completedCount = topicLessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;
            const topicPercent =
              topicLessons.length > 0
                ? Math.round((completedCount / topicLessons.length) * 100)
                : 0;

            return (
              <div
                key={topic.id}
                className="group bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-blue-50 transition-colors">
                      {renderTopicIcon(topic.iconName)}
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {topic.code}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-700 mt-1.5 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-700">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      {topicLessons.length} bài học
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      {topicQuestions.length} câu hỏi
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-2xs text-slate-600 mb-1">
                      <span>Hoàn thành lý thuyết</span>
                      <span>{topicPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${topicPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectTopic(topic.id)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition cursor-pointer"
                  >
                    Vào học
                  </button>
                  <button
                    onClick={() => onStartPracticeTopic(topic.id)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center transition cursor-pointer shadow-2xs"
                  >
                    Luyện tập
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating AI Assistant Promo card */}
      <section className="bg-gradient-to-r from-indigo-50 via-blue-50 to-white rounded-2xl border border-blue-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-indigo-700" />
            <span>Được hỗ trợ bởi Google Gemini</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Gặp khó khăn khi giải câu hỏi trắc nghiệm hoặc ghi nhớ hàm Excel?
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 max-w-xl">
            Hãy sử dụng &quot;Trợ lý Tin học&quot; để được phân tích từng phương án đúng/sai, tạo thêm câu hỏi tương tự và hướng dẫn mẹo làm bài chuẩn sư phạm.
          </p>
        </div>

        <button
          onClick={onOpenAIModal}
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <span>Trò chuyện với Trợ lý AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
