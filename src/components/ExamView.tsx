import React, { useState, useEffect, useRef } from 'react';
import { ExamConfig, Question, Topic, ExamResult, UserProgress } from '../types';
import { gradeExamSubmission } from '../utils/storage';
import {
  Clock,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Send,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Play,
  RotateCcw,
} from 'lucide-react';

interface ExamViewProps {
  exams: ExamConfig[];
  questions: Question[];
  topics: Topic[];
  progress: UserProgress;
  onFinishExam: (result: ExamResult) => void;
  onCancelExam: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  exams,
  questions,
  topics,
  progress,
  onFinishExam,
  onCancelExam,
}) => {
  // If exam has not started yet, show selection screen
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);

  // Active exam states
  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const examQuestions = activeExam
    ? activeExam.questionIds
        .map((id) => questions.find((q) => q.id === id))
        .filter((q): q is Question => q !== undefined)
    : [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    (activeExam?.durationMinutes || 45) * 60
  );
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Timer ref to prevent interval recreation and resets
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Start exam timer
  useEffect(() => {
    if (isExamStarted) {
      startTimeRef.current = Date.now();
      const initialSeconds = (activeExam?.durationMinutes || 45) * 60;
      setSecondsRemaining(initialSeconds);

      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            // Auto submit when time runs out
            handleExecuteSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamStarted]);

  const handleStartExam = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setIsExamStarted(true);
  };

  const handleExecuteSubmit = (isTimeOut = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const result = gradeExamSubmission(
      activeExam,
      questions,
      userAnswers,
      timeSpentSeconds,
      topics
    );

    setShowSubmitModal(false);
    onFinishExam(result);
  };

  // Helper formatting mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isExamStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              Phòng thi trực tuyến
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kỳ thi Thử Tốt nghiệp THPT môn Tin học
            </h1>
            <p className="text-xs sm:text-sm text-slate-700">
              Mô phỏng chân thực quy chế thi và cấu trúc đề thi tốt nghiệp THPT theo định hướng Tin học ứng dụng.
            </p>
          </div>

          {/* Exam selection list */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Chọn đề thi thử:
            </label>
            <div className="grid grid-cols-1 gap-3">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedExamId === exam.id
                      ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{exam.title}</span>
                      {exam.targetYear && (
                        <span className="text-2xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                          Năm học {exam.targetYear}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700">{exam.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-700 pt-1">
                      <span>Thời gian: <strong>{exam.durationMinutes} phút</strong></span>
                      <span>•</span>
                      <span>Số lượng: <strong>{exam.questionIds.length} câu</strong></span>
                      <span>•</span>
                      <span>Thang điểm: <strong>10.0 điểm</strong></span>
                    </div>
                  </div>

                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    {selectedExamId === exam.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules & Guidelines */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <h3 className="font-bold text-amber-950 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Quy chế phòng thi thử:</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-amber-800">
              <li>Đồng hồ sẽ đếm ngược liên tục khi bạn bắt đầu làm bài thi.</li>
              <li>Hệ thống áp dụng đúng cấu trúc chấm điểm của Bộ GD&ĐT (bao gồm cả dạng thức trắc nghiệm Đúng/Sai 4 ý).</li>
              <li>Bạn có thể đánh dấu lại các câu phân vân để rà soát trước khi nộp.</li>
              <li>Khi hết thời gian quy định, hệ thống sẽ tự động thu bài và chấm điểm.</li>
            </ul>
          </div>

          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleStartExam}
              className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-500/25 hover:scale-102 transition cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>BẮT ĐẦU LÀM BÀI THI</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Current active question
  const currentQ = examQuestions[currentQuestionIndex];
  if (!currentQ) {
    return <div>Không có câu hỏi trong đề thi này.</div>;
  }

  const isFlagged = Boolean(flaggedQuestions[currentQ.id]);

  // Count answered questions
  const answeredTotal = examQuestions.filter((q) => {
    const val = userAnswers[q.id];
    if (q.type === 'multiple_choice') return val !== undefined && val !== null;
    if (q.type === 'short_answer') return val && String(val).trim() !== '';
    if (q.type === 'true_false') return Array.isArray(val) && val.some((v) => v !== null && v !== undefined);
    return false;
  }).length;

  const unansweredTotal = examQuestions.length - answeredTotal;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Exam Header Topbar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-2xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
            Đề thi thử chính thức
          </span>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
            {activeExam.title}
          </h2>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-sm ${
              secondsRemaining < 300
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-current" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>NỘP BÀI THI</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Question Card (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Question Info Bar */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-xs font-extrabold">
                  Câu {currentQuestionIndex + 1}
                </span>
                <span className="text-xs text-slate-700">/ {examQuestions.length} câu</span>
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                  {currentQ.difficulty}
                </span>
              </div>

              <button
                onClick={() =>
                  setFlaggedQuestions((prev) => ({
                    ...prev,
                    [currentQ.id]: !prev[currentQ.id],
                  }))
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isFlagged
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isFlagged ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-700" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span>{isFlagged ? 'Đã gắn cờ xem lại' : 'Gắn cờ xem lại'}</span>
              </button>
            </div>

            {/* Question text */}
            <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              {currentQ.content}
            </div>

            {/* Question Inputs */}
            <div className="pt-2">
              {/* Type 1: Multiple choice */}
              {currentQ.type === 'multiple_choice' && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt) => {
                    const isSelected = userAnswers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() =>
                          setUserAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }))
                        }
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-600'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="flex-1 leading-normal">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type 2: True / False Cluster */}
              {currentQ.type === 'true_false' && currentQ.subQuestions && (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 bg-white">
                  <div className="grid grid-cols-12 bg-slate-50 p-2.5 text-2xs font-bold text-slate-700 uppercase">
                    <div className="col-span-8 sm:col-span-9">Ý mệnh đề</div>
                    <div className="col-span-4 sm:col-span-3 text-center">Đáp án của bạn</div>
                  </div>
                  {currentQ.subQuestions.map((sub, idx) => {
                    const currentChoices = userAnswers[currentQ.id] || [];
                    const val = currentChoices[idx];

                    return (
                      <div key={sub.id} className="grid grid-cols-12 p-3 items-center gap-2">
                        <div className="col-span-8 sm:col-span-9 text-xs sm:text-sm text-slate-800">
                          <strong className="text-blue-700 mr-1.5">{sub.id})</strong>
                          {sub.text}
                        </div>
                        <div className="col-span-4 sm:col-span-3 flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              const updated = Array.isArray(userAnswers[currentQ.id])
                                ? [...userAnswers[currentQ.id]]
                                : [null, null, null, null];
                              updated[idx] = true;
                              setUserAnswers((prev) => ({ ...prev, [currentQ.id]: updated }));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              val === true
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Đúng
                          </button>
                          <button
                            onClick={() => {
                              const updated = Array.isArray(userAnswers[currentQ.id])
                                ? [...userAnswers[currentQ.id]]
                                : [null, null, null, null];
                              updated[idx] = false;
                              setUserAnswers((prev) => ({ ...prev, [currentQ.id]: updated }));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              val === false
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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

              {/* Type 3: Short Answer */}
              {currentQ.type === 'short_answer' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Điền câu trả lời:
                  </label>
                  <input
                    type="text"
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) =>
                      setUserAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                    }
                    placeholder="Nhập kết quả..."
                    className="w-full max-w-md p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}
            </div>

            {/* Bottom Nav inside Question Card */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              {currentQuestionIndex < examQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition cursor-pointer shadow-xs"
                >
                  <span>Câu tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Xem lại & Nộp bài</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Palette Navigation Grid (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs sticky top-36 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Danh sách câu hỏi</h3>
              <span className="text-xs text-slate-700 font-medium">
                {answeredTotal}/{examQuestions.length} câu
              </span>
            </div>

            {/* Question matrix button grid */}
            <div className="grid grid-cols-5 gap-2">
              {examQuestions.map((q, idx) => {
                const isSelected = idx === currentQuestionIndex;
                const isFlag = Boolean(flaggedQuestions[q.id]);

                // Check answered
                let isAnswered = false;
                const ans = userAnswers[q.id];
                if (q.type === 'multiple_choice') isAnswered = ans !== undefined && ans !== null;
                else if (q.type === 'short_answer') isAnswered = Boolean(ans && String(ans).trim() !== '');
                else if (q.type === 'true_false')
                  isAnswered = Array.isArray(ans) && ans.some((v) => v !== null && v !== undefined);

                let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                if (isSelected) {
                  btnStyle = 'ring-2 ring-blue-600 ring-offset-1 font-bold';
                }
                if (isFlag) {
                  btnStyle += ' bg-amber-100 text-amber-900 border-amber-300';
                } else if (isAnswered) {
                  btnStyle += ' bg-blue-600 text-white border-blue-600';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer relative border ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlag && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 absolute top-1 right-1"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-2xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-blue-600"></span>
                <span>Đã trả lời ({answeredTotal})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200"></span>
                <span>Chưa làm ({unansweredTotal})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300"></span>
                <span>Đã gắn cờ xem lại</span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Nộp bài thi ngay
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Xác nhận nộp bài thi</h3>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <p>Bạn đang hoàn thành bài thi: <strong>{activeExam.title}</strong>.</p>
              {unansweredTotal > 0 ? (
                <div className="p-3 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 font-medium">
                  ⚠️ Lưu ý: Bạn còn <strong>{unansweredTotal} câu hỏi chưa trả lời</strong>. Các câu chưa trả lời sẽ nhận 0 điểm.
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 font-medium">
                  ✓ Bạn đã hoàn thành tất cả {examQuestions.length} câu hỏi trong đề thi!
                </div>
              )}
              <p>Thời gian làm bài còn lại: <strong>{formatTime(secondsRemaining)}</strong>.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={() => handleExecuteSubmit(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition cursor-pointer shadow-xs"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
