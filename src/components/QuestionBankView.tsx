import React, { useState, useMemo } from 'react';
import { Question, Topic, UserProgress, CognitiveLevel, QuestionType } from '../types';
import {
  Search,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  BookOpen,
} from 'lucide-react';

interface QuestionBankViewProps {
  questions: Question[];
  topics: Topic[];
  progress: UserProgress;
  onPracticeQuestion: (questionId: string) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  topics,
  progress,
  onPracticeQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'done' | 'undone'>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const topicMap = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Keyword
      const matchesSearch =
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Topic
      if (selectedTopic !== 'all' && q.topicId !== selectedTopic) return false;

      // Difficulty
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;

      // Type
      if (selectedType !== 'all' && q.type !== selectedType) return false;

      // Done status
      const isDone = Boolean(progress.questionHistory[q.id]);
      if (selectedStatus === 'done' && !isDone) return false;
      if (selectedStatus === 'undone' && isDone) return false;

      return true;
    });
  }, [questions, searchQuery, selectedTopic, selectedDifficulty, selectedType, selectedStatus, progress.questionHistory]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    filteredQuestions.forEach((q) => {
      all[q.id] = true;
    });
    setExpandedItems(all);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">
              <Database className="w-3.5 h-3.5" />
              <span>Ngân hàng câu hỏi chuẩn hóa</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Tra cứu Ngân hàng Câu hỏi ({questions.length} câu)
            </h1>
            <p className="text-xs sm:text-sm text-slate-700">
              Phân loại đa chiều theo chuyên đề, bài học, độ khó và dạng câu hỏi tốt nghiệp THPT.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Mở rộng tất cả
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Thu gọn tất cả
            </button>
          </div>
        </div>

        {/* Multi-filter row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search text */}
          <div className="lg:col-span-1">
            <label className="block text-2xs font-bold text-slate-700 mb-1">TỪ KHÓA</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nội dung, mã câu..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">CHUYÊN ĐỀ</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tất cả chuyên đề</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} - {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">MỨC ĐỘ</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
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

          {/* Type */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">DẠNG CÂU HỎI</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tất cả dạng câu hỏi</option>
              <option value="multiple_choice">4 lựa chọn</option>
              <option value="true_false">Đúng / Sai</option>
              <option value="short_answer">Trả lời ngắn</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">TRẠNG THÁI LÀM</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="done">Đã từng luyện</option>
              <option value="undone">Chưa làm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-800">Không tìm thấy câu hỏi nào</h3>
          <p className="text-xs text-slate-700">Hãy thử nới lỏng các tiêu chí lọc bên trên.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-700 font-semibold px-1">
            Hiển thị <strong>{filteredQuestions.length}</strong> câu hỏi phù hợp
          </div>

          {filteredQuestions.map((q) => {
            const topic = topicMap.get(q.topicId);
            const isDone = Boolean(progress.questionHistory[q.id]);
            const isExpanded = Boolean(expandedItems[q.id]);

            return (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-xs space-y-3 transition"
              >
                {/* Meta header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                      #{q.id}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                      {topic?.code || 'CD'}: {topic?.title || 'Chuyên đề'}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                      {q.difficulty}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium">
                      {q.type === 'multiple_choice'
                        ? '4 lựa chọn'
                        : q.type === 'true_false'
                        ? 'Đúng/Sai 4 ý'
                        : 'Trả lời ngắn'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.isVerified && (
                      <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Đã kiểm duyệt
                      </span>
                    )}
                    {isDone && (
                      <span className="text-2xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Đã làm
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                  {q.content}
                </p>

                {/* Options preview */}
                {q.type === 'multiple_choice' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2 rounded-lg border ${
                          isExpanded && opt.id === q.correctAnswer
                            ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-bold mr-1.5">{opt.id}.</span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* True/False subquestions preview */}
                {q.type === 'true_false' && q.subQuestions && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs divide-y divide-slate-100">
                    {q.subQuestions.map((sub) => (
                      <div key={sub.id} className="p-2 flex items-center justify-between bg-slate-50">
                        <span>
                          <strong>{sub.id})</strong> {sub.text}
                        </span>
                        {isExpanded && (
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-2xs ${
                              sub.correct
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {sub.correct ? 'ĐÚNG' : 'SAI'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Toggle details */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(q.id)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Ẩn đáp án & giải thích' : 'Xem đáp án & giải thích'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onPracticeQuestion(q.id)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Luyện câu này
                  </button>
                </div>

                {/* Expanded answer & explanation */}
                {isExpanded && (
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-xs sm:text-sm text-slate-800 space-y-2 mt-2">
                    <div>
                      <span className="font-bold text-slate-900">Đáp án chuẩn: </span>
                      <strong className="text-emerald-700">
                        {q.type === 'true_false' && q.subQuestions
                          ? q.subQuestions.map((s) => `${s.id}: ${s.correct ? 'Đúng' : 'Sai'}`).join(' | ')
                          : String(q.correctAnswer)}
                      </strong>
                    </div>

                    <p className="leading-relaxed text-slate-700">{q.explanation}</p>

                    {q.keyTakeaway && (
                      <div className="pt-2 border-t border-blue-200/50 text-blue-900 font-medium">
                        💡 <strong>Kiến thức ghi nhớ:</strong> {q.keyTakeaway}
                      </div>
                    )}

                    <div className="pt-1 text-2xs text-slate-600 flex items-center gap-2">
                      <Tag className="w-3 h-3" />
                      <span>Nguồn tham chiếu: {q.reference} ({q.source || 'Bộ GD&ĐT'})</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
