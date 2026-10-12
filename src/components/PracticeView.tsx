import React, { useState, useMemo } from 'react';
import { Topic, Question, UserProgress, CognitiveLevel, QuestionType } from '../types';
import {
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Bot,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';

interface PracticeViewProps {
  topics: Topic[];
  questions: Question[];
  progress: UserProgress;
  initialTopicId?: string;
  focusQuestionIds?: string[]; // E.g. when practicing only wrong questions
  onSaveProgress: (updated: UserProgress) => void;
  onOpenAIWithQuestion: (question: Question, userSelected: any) => void;
  onNavigateHome: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  topics,
  questions,
  progress,
  initialTopicId,
  focusQuestionIds,
  onSaveProgress,
  onOpenAIWithQuestion,
  onNavigateHome,
}) => {
  // Practice configuration
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [instantFeedback, setInstantFeedback] = useState<boolean>(true);

  // Filter questions list
  const activeQuestions = useMemo(() => {
    let list = questions;

    if (focusQuestionIds && focusQuestionIds.length > 0) {
      list = list.filter((q) => focusQuestionIds.includes(q.id));
    }

    if (selectedTopicId !== 'all') {
      list = list.filter((q) => q.topicId === selectedTopicId);
    }
    if (selectedDifficulty !== 'all') {
      list = list.filter((q) => q.difficulty === selectedDifficulty);
    }
    if (selectedType !== 'all') {
      list = list.filter((q) => q.type === selectedType);
    }

    return list;
  }, [questions, focusQuestionIds, selectedTopicId, selectedDifficulty, selectedType]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);

  // Guard if list is empty
  const currentQuestion: Question | undefined = activeQuestions[currentIndex];

  const handleSelectOption = (qId: string, optionId: string) => {
    if (submittedQuestions[qId] && instantFeedback) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const handleSelectTrueFalse = (qId: string, subIndex: number, val: boolean) => {
    if (submittedQuestions[qId] && instantFeedback) return;
    const current: boolean[] = Array.isArray(answers[qId])
      ? [...answers[qId]]
      : [null as any, null as any, null as any, null as any];
    current[subIndex] = val;
    setAnswers((prev) => ({ ...prev, [qId]: current }));
  };

  const handleShortAnswerChange = (qId: string, val: string) => {
    if (submittedQuestions[qId] && instantFeedback) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleToggleBookmark = (qId: string) => {
    const isBookmarked = progress.bookmarkedQuestionIds.includes(qId);
    const updated = isBookmarked
      ? progress.bookmarkedQuestionIds.filter((id) => id !== qId)
      : [...progress.bookmarkedQuestionIds, qId];

    onSaveProgress({
      ...progress,
      bookmarkedQuestionIds: updated,
    });
  };

  // Submit single question in instant feedback mode
  const handleSubmitSingleQuestion = (q: Question) => {
    const uAnswer = answers[q.id];
    let isCorrect = false;

    if (q.type === 'multiple_choice') {
      isCorrect =
        uAnswer !== undefined &&
        String(uAnswer).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();
    } else if (q.type === 'true_false') {
      const correctArr = Array.isArray(q.correctAnswer)
        ? q.correctAnswer
        : q.subQuestions?.map((s) => s.correct) || [];
      const userArr: boolean[] = Array.isArray(uAnswer) ? uAnswer : [];
      isCorrect =
        userArr.length === 4 &&
        userArr.every((val, idx) => val === correctArr[idx]);
    } else if (q.type === 'short_answer') {
      const cleanUser = String(uAnswer || '').trim().toLowerCase();
      const cleanCorrect = String(q.correctAnswer).trim().toLowerCase();
      isCorrect =
        cleanUser === cleanCorrect ||
        (!isNaN(Number(cleanUser)) && Number(cleanUser) === Number(cleanCorrect));
    }

    // Update submitted set
    setSubmittedQuestions((prev) => ({ ...prev, [q.id]: true }));

    // Update real question history
    const existing = progress.questionHistory[q.id] || {
      lastAnsweredAt: 0,
      isCorrect: false,
      wrongCount: 0,
      correctCount: 0,
    };

    const updatedHistory = {
      ...progress.questionHistory,
      [q.id]: {
        lastAnsweredAt: Date.now(),
        isCorrect,
        correctCount: existing.correctCount + (isCorrect ? 1 : 0),
        wrongCount: existing.wrongCount + (isCorrect ? 0 : 1),
      },
    };

    onSaveProgress({
      ...progress,
      questionHistory: updatedHistory,
    });
  };

  // Progress numbers
  const answeredCount = Object.keys(answers).length;
  const totalCount = activeQuestions.length;

  if (totalCount === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
        <HelpCircle className="w-12 h-12 text-slate-700 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Không có câu hỏi phù hợp bộ lọc</h3>
        <p className="text-xs sm:text-sm text-slate-700">
          Hãy thử chọn chuyên đề khác hoặc mở rộng mức độ nhận thức.
        </p>
        <button
          onClick={() => {
            setSelectedTopicId('all');
            setSelectedDifficulty('all');
            setSelectedType('all');
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
        >
          Đặt lại bộ lọc
        </button>
      </div>
    );
  }

  // Summary screen if finished
  if (isSessionFinished) {
    let sessionCorrect = 0;
    activeQuestions.forEach((q) => {
      const u = answers[q.id];
      if (q.type === 'multiple_choice' && u === q.correctAnswer) sessionCorrect++;
      else if (q.type === 'short_answer' && String(u || '').trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) sessionCorrect++;
      else if (q.type === 'true_false' && Array.isArray(u) && Array.isArray(q.correctAnswer) && u.every((val, i) => val === q.correctAnswer[i])) sessionCorrect++;
    });

    const sessionAccuracy = Math.round((sessionCorrect / totalCount) * 100);

    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6 shadow-md">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Hoàn thành phiên luyện tập!</h2>
          <p className="text-xs sm:text-sm text-slate-700 mt-1">
            Bạn đã giải xong toàn bộ {totalCount} câu hỏi trong nhóm này.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-700">Số câu đúng</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {sessionCorrect} / {totalCount}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-700">Độ chính xác</span>
            <div className="text-2xl font-black text-blue-600 mt-1">{sessionAccuracy}%</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setAnswers({});
              setSubmittedQuestions({});
              setCurrentIndex(0);
              setIsSessionFinished(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Luyện lại từ đầu</span>
          </button>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  const isCurrentSubmitted = Boolean(submittedQuestions[currentQuestion.id]);
  const isBookmarked = progress.bookmarkedQuestionIds.includes(currentQuestion.id);

  // Check correctness of current question
  let isCurrentCorrect = false;
  if (currentQuestion.type === 'multiple_choice') {
    isCurrentCorrect = answers[currentQuestion.id] === currentQuestion.correctAnswer;
  } else if (currentQuestion.type === 'short_answer') {
    const cleanU = String(answers[currentQuestion.id] || '').trim().toLowerCase();
    const cleanC = String(currentQuestion.correctAnswer).trim().toLowerCase();
    isCurrentCorrect = cleanU === cleanC || (!isNaN(Number(cleanU)) && Number(cleanU) === Number(cleanC));
  } else if (currentQuestion.type === 'true_false') {
    const uArr = answers[currentQuestion.id];
    const cArr = currentQuestion.correctAnswer;
    isCurrentCorrect = Array.isArray(uArr) && Array.isArray(cArr) && uArr.every((val, idx) => val === cArr[idx]);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Practice Header & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>Chế độ Luyện tập câu hỏi</span>
              {focusQuestionIds && focusQuestionIds.length > 0 && (
                <span className="text-xs px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-md font-bold">
                  Luyện câu làm sai
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-700">
              Chọn chuyên đề và mức độ để rèn luyện kỹ năng giải đề.
            </p>
          </div>

          {/* Instant feedback toggle */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-medium text-slate-700">Phản hồi tức thì:</span>
            <button
              onClick={() => setInstantFeedback(!instantFeedback)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                instantFeedback ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              title="Bật/Tắt hiện đáp án ngay sau khi trả lời"
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
            </button>
            <span className="text-2xs font-bold text-slate-700">
              {instantFeedback ? 'BẬT' : 'TẮT'}
            </span>
          </div>
        </div>

        {/* Filter selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">CHUYÊN ĐỀ</label>
            <select
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tất cả chuyên đề ({questions.length})</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} - {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">MỨC ĐỘ NHẬN THỨC</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tất cả mức độ</option>
              {(['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'] as CognitiveLevel[]).map(
                (lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">DẠNG CÂU HỎI</label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tất cả dạng câu hỏi</option>
              <option value="multiple_choice">Trắc nghiệm 4 lựa chọn</option>
              <option value="true_false">Trắc nghiệm Đúng / Sai</option>
              <option value="short_answer">Trả lời ngắn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Progress & Indicators */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md">
              Câu {currentIndex + 1} / {totalCount}
            </span>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
              {currentQuestion.difficulty}
            </span>
            <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium hidden sm:inline">
              {currentQuestion.type === 'multiple_choice'
                ? '4 lựa chọn'
                : currentQuestion.type === 'true_false'
                ? 'Đúng/Sai 4 ý'
                : 'Trả lời ngắn'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleBookmark(currentQuestion.id)}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Đánh dấu câu cần xem lại"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-amber-700" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isBookmarked ? 'Đã đánh dấu' : 'Đánh dấu'}
              </span>
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
            {currentQuestion.content}
          </p>
        </div>

        {/* Form Inputs based on Question Type */}
        <div className="space-y-3 pt-2">
          {/* 1. Multiple Choice */}
          {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
            <div className="space-y-2.5">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                let optionStyle =
                  'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-slate-50';

                if (isCurrentSubmitted && instantFeedback) {
                  if (option.id === currentQuestion.correctAnswer) {
                    optionStyle =
                      'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500';
                  } else if (isSelected && !isCurrentCorrect) {
                    optionStyle =
                      'bg-rose-50 border-rose-400 text-rose-900 font-medium line-through';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-600';
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition flex items-center gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {option.id}
                    </span>
                    <span className="flex-1 leading-normal">{option.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. True / False Cluster (4 statements a, b, c, d) */}
          {currentQuestion.type === 'true_false' && currentQuestion.subQuestions && (
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 bg-white">
              <div className="grid grid-cols-12 bg-slate-50 p-2.5 text-2xs font-bold text-slate-700 uppercase">
                <div className="col-span-8 sm:col-span-9">Ý mệnh đề (Khẳng định)</div>
                <div className="col-span-4 sm:col-span-3 text-center">Lựa chọn của bạn</div>
              </div>

              {currentQuestion.subQuestions.map((sub, idx) => {
                const userChoices = answers[currentQuestion.id] || [];
                const userVal = userChoices[idx];
                const correctVal = sub.correct;
                const isMatch = userVal === correctVal;

                return (
                  <div key={sub.id} className="grid grid-cols-12 p-3 items-center gap-2">
                    <div className="col-span-8 sm:col-span-9 text-xs sm:text-sm text-slate-800">
                      <strong className="text-blue-700 mr-1.5">{sub.id})</strong>
                      {sub.text}
                    </div>

                    <div className="col-span-4 sm:col-span-3 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleSelectTrueFalse(currentQuestion.id, idx, true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          userVal === true
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        } ${
                          isCurrentSubmitted && instantFeedback && correctVal === true
                            ? 'ring-2 ring-emerald-500'
                            : ''
                        }`}
                      >
                        Đúng
                      </button>
                      <button
                        onClick={() => handleSelectTrueFalse(currentQuestion.id, idx, false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          userVal === false
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        } ${
                          isCurrentSubmitted && instantFeedback && correctVal === false
                            ? 'ring-2 ring-emerald-500'
                            : ''
                        }`}
                      >
                        Sai
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. Short Answer */}
          {currentQuestion.type === 'short_answer' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Nhập câu trả lời của bạn:
              </label>
              <input
                type="text"
                disabled={isCurrentSubmitted && instantFeedback}
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleShortAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Ví dụ: 32, MATCH, VLOOKUP..."
                className="w-full max-w-md p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Action Button: Check Answer (if instant feedback on and not yet checked) */}
        {instantFeedback && !isCurrentSubmitted && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleSubmitSingleQuestion(currentQuestion)}
              disabled={answers[currentQuestion.id] === undefined}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Kiểm tra đáp án
            </button>
          </div>
        )}

        {/* Instant Feedback Result Explanation Box */}
        {instantFeedback && isCurrentSubmitted && (
          <div
            className={`rounded-xl p-5 border space-y-3 ${
              isCurrentCorrect
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/70 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-sm text-emerald-800">
                      Chính xác! Làm rất tốt.
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span className="font-extrabold text-sm text-rose-800">
                      Chưa chính xác! Hãy đọc kỹ giải thích bên dưới:
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  onOpenAIWithQuestion(currentQuestion, answers[currentQuestion.id])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-blue-700 rounded-lg text-xs font-bold border border-blue-200 shadow-2xs transition cursor-pointer"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Hỏi Trợ lý AI phân tích</span>
              </button>
            </div>

            <div className="bg-white/80 p-3.5 rounded-lg border border-slate-200/60 text-xs sm:text-sm text-slate-800 space-y-2">
              <div className="font-semibold text-slate-900">
                Đáp án chuẩn:{' '}
                <span className="text-emerald-700 font-extrabold">
                  {currentQuestion.type === 'true_false' && currentQuestion.subQuestions
                    ? currentQuestion.subQuestions
                        .map((s) => `${s.id}: ${s.correct ? 'Đúng' : 'Sai'}`)
                        .join(' | ')
                    : String(currentQuestion.correctAnswer)}
                </span>
              </div>
              <p className="leading-relaxed text-slate-700">{currentQuestion.explanation}</p>

              {currentQuestion.keyTakeaway && (
                <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-xs text-blue-900 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ghi nhớ:</strong> {currentQuestion.keyTakeaway}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Toolbar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Câu trước</span>
          </button>

          <div className="text-xs text-slate-700 font-medium hidden sm:block">
            Đã làm: <strong>{answeredCount}</strong> / {totalCount} câu
          </div>

          {currentIndex < totalCount - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition cursor-pointer shadow-xs"
            >
              <span>Câu tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsSessionFinished(true)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoàn thành phiên luyện tập</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
