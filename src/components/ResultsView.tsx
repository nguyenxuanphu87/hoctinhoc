import React, { useState } from 'react';
import { ExamResult, Question, Topic } from '../types';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Bot,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ResultsViewProps {
  result: ExamResult | null;
  questions: Question[];
  topics: Topic[];
  onRetryWrongQuestions: (questionIds: string[]) => void;
  onReviewWeakTopic: (topicId: string) => void;
  onRetakeExam: () => void;
  onOpenAIWithQuestion: (question: Question, userSelected: any) => void;
  onOpenAIGeneralPlan: (score: number, weakTopics: string[]) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  questions,
  topics,
  onRetryWrongQuestions,
  onReviewWeakTopic,
  onRetakeExam,
  onOpenAIWithQuestion,
  onOpenAIGeneralPlan,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'wrong' | 'unanswered'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  if (!result) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
        <Award className="w-12 h-12 text-slate-700 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Chưa có kết quả bài thi nào</h2>
        <p className="text-xs text-slate-700">
          Hãy hoàn thành một đề thi thử trong phần &quot;Thi thử THPT&quot; để xem thống kê và phân tích chi tiết.
        </p>
        <button
          onClick={onRetakeExam}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          Đến phòng thi thử
        </button>
      </div>
    );
  }

  // Format time taken
  const minutes = Math.floor(result.durationTakenSeconds / 60);
  const seconds = result.durationTakenSeconds % 60;
  const timeFormatted = `${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây`;

  // Filter wrong questions IDs
  const wrongQuestionDetails = result.details.filter((d) => !d.isFullyCorrect);
  const wrongQuestionIds = wrongQuestionDetails.map((d) => d.questionId);

  // Identify weak topics (percentage < 70)
  const weakTopicEntries = Object.entries(result.topicBreakdown).filter(
    ([_, val]) => val.percentage < 70
  );
  const weakestTopicId =
    weakTopicEntries.length > 0
      ? weakTopicEntries.sort((a, b) => a[1].percentage - b[1].percentage)[0][0]
      : Object.keys(result.topicBreakdown)[0];

  // Evaluation status
  let scoreBadge = { label: 'Cần nỗ lực thêm', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  if (result.totalScore >= 9.0) {
    scoreBadge = { label: 'Xuất sắc!', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  } else if (result.totalScore >= 8.0) {
    scoreBadge = { label: 'Giỏi', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  } else if (result.totalScore >= 6.5) {
    scoreBadge = { label: 'Khá', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  } else if (result.totalScore >= 5.0) {
    scoreBadge = { label: 'Trung bình', color: 'bg-slate-100 text-slate-800 border-slate-300' };
  }

  const toggleExpand = (qId: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const filteredDetails = result.details.filter((detail) => {
    if (filterType === 'wrong') return !detail.isFullyCorrect;
    if (filterType === 'unanswered') {
      return (
        detail.userAnswer === null ||
        detail.userAnswer === undefined ||
        detail.userAnswer === '' ||
        (Array.isArray(detail.userAnswer) && detail.userAnswer.every((v) => v === null))
      );
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner with Score */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-2xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded uppercase">
              Báo cáo kết quả bài thi
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {result.examTitle}
            </h1>
            <p className="text-xs text-slate-700 flex items-center justify-center sm:justify-start gap-2 pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Thời gian làm bài: <strong>{timeFormatted}</strong></span>
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex flex-col items-center sm:items-end">
            <div className="flex items-baseline gap-1 text-slate-900">
              <span className="text-5xl font-black tracking-tight text-blue-600">
                {result.totalScore.toFixed(2)}
              </span>
              <span className="text-base font-bold text-slate-700">/ 10.0</span>
            </div>
            <span
              className={`mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${scoreBadge.color}`}
            >
              {scoreBadge.label}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center sm:text-left">
            <span className="text-xs text-slate-700 flex items-center justify-center sm:justify-start gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đúng hoàn toàn
            </span>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {result.correctCount} <span className="text-xs text-slate-700 font-normal">câu</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center sm:text-left">
            <span className="text-xs text-slate-700 flex items-center justify-center sm:justify-start gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" /> Đúng một phần
            </span>
            <div className="text-xl font-black text-amber-600 mt-1">
              {result.partialCount} <span className="text-xs text-slate-700 font-normal">câu</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center sm:text-left">
            <span className="text-xs text-slate-700 flex items-center justify-center sm:justify-start gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-600" /> Làm sai
            </span>
            <div className="text-xl font-black text-rose-600 mt-1">
              {result.wrongCount} <span className="text-xs text-slate-700 font-normal">câu</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center sm:text-left">
            <span className="text-xs text-slate-700 flex items-center justify-center sm:justify-start gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-slate-600" /> Chưa làm
            </span>
            <div className="text-xl font-black text-slate-600 mt-1">
              {result.unansweredCount} <span className="text-xs text-slate-700 font-normal">câu</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {wrongQuestionIds.length > 0 && (
              <button
                onClick={() => onRetryWrongQuestions(wrongQuestionIds)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Luyện lại {wrongQuestionIds.length} câu làm sai</span>
              </button>
            )}

            {weakestTopicId && (
              <button
                onClick={() => onReviewWeakTopic(weakestTopicId)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ôn tập chuyên đề còn yếu</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onOpenAIGeneralPlan(
                  result.totalScore,
                  weakTopicEntries.map(([_, v]) => v.topicTitle)
                )
              }
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Gợi ý lộ trình ôn từ AI</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>

            <button
              onClick={onRetakeExam}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Làm đề mới
            </button>
          </div>
        </div>
      </div>

      {/* Topic Analysis Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Phân tích kết quả theo từng chuyên đề</span>
        </h2>

        <div className="space-y-3.5">
          {Object.entries(result.topicBreakdown).map(([tId, info]) => {
            const isWeak = info.percentage < 70;
            return (
              <div key={tId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {info.topicTitle} ({info.correct}/{info.total} câu)
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        isWeak ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {info.percentage}% ({info.scoreAchieved.toFixed(2)}/{info.maxScore.toFixed(2)}đ)
                    </span>
                    {isWeak && (
                      <button
                        onClick={() => onReviewWeakTopic(tId)}
                        className="text-2xs text-blue-600 hover:underline font-semibold"
                      >
                        [Ôn lại]
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWeak ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${info.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Chi tiết từng câu hỏi trong đề</h2>
            <p className="text-xs text-slate-700">
              Đối chiếu câu trả lời của bạn với đáp án và lời giải chi tiết.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({result.details.length})
            </button>
            <button
              onClick={() => setFilterType('wrong')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'wrong'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Chỉ câu sai ({wrongQuestionDetails.length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredDetails.map((detail, idx) => {
            const q = questions.find((item) => item.id === detail.questionId);
            if (!q) return null;

            const isExpanded = Boolean(expandedQuestions[q.id]);

            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4.5 transition-all space-y-3 ${
                  detail.isFullyCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 mt-0.5 ${
                        detail.isFullyCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Câu {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                        {q.content}
                      </p>
                      <div className="flex items-center gap-2 text-2xs text-slate-700 mt-1">
                        <span>{q.difficulty}</span>
                        <span>•</span>
                        <span>
                          Điểm đạt:{' '}
                          <strong className="text-slate-800">
                            {detail.scoreAchieved.toFixed(2)} / {detail.maxScore.toFixed(2)}đ
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(q.id)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Sub-results for True/False */}
                {detail.type === 'true_false' && detail.subResults && (
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-xs space-y-1.5">
                    {detail.subResults.map((sub, sIdx) => (
                      <div key={sub.id} className="flex items-center justify-between">
                        <span>
                          <strong>{sub.id})</strong> {q.subQuestions?.[sIdx]?.text}
                        </span>
                        <span
                          className={`font-bold ${
                            sub.isMatch ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          Bạn chọn: {sub.userChoice === true ? 'Đúng' : sub.userChoice === false ? 'Sai' : 'Chưa chọn'}
                          {' '}(Chuẩn: {sub.correctChoice ? 'Đúng' : 'Sai'})
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Choice review for Multiple Choice */}
                {detail.type === 'multiple_choice' && (
                  <div className="flex items-center gap-4 text-xs">
                    <span>
                      Lựa chọn của bạn:{' '}
                      <strong className={detail.isFullyCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                        {detail.userAnswer || 'Chưa chọn'}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Đáp án chuẩn:{' '}
                      <strong className="text-emerald-700">{detail.correctAnswer}</strong>
                    </span>
                  </div>
                )}

                {/* Short answer review */}
                {detail.type === 'short_answer' && (
                  <div className="flex items-center gap-4 text-xs">
                    <span>
                      Câu trả lời của bạn:{' '}
                      <strong className={detail.isFullyCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                        &quot;{detail.userAnswer || 'Để trống'}&quot;
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Đáp án chuẩn: <strong className="text-emerald-700">&quot;{detail.correctAnswer}&quot;</strong>
                    </span>
                  </div>
                )}

                {/* Expandable Explanation & AI Helper */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs sm:text-sm text-slate-700 space-y-2 bg-white/70 p-3.5 rounded-lg">
                    <div className="font-bold text-slate-900">Lời giải chi tiết:</div>
                    <p className="leading-relaxed text-slate-700">{q.explanation}</p>
                    {q.keyTakeaway && (
                      <div className="pt-2 text-blue-900 font-medium">
                        💡 <strong>Ghi nhớ:</strong> {q.keyTakeaway}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onOpenAIWithQuestion(q, detail.userAnswer)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Hỏi Trợ lý AI giải thích sâu câu này</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
