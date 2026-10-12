import React, { useState } from 'react';
import { Topic, Question, ExamConfig, UserProgress, CognitiveLevel, QuestionType } from '../types';
import {
  getTeacherPin,
  setTeacherPin,
  isTeacherAuthenticated,
  setTeacherAuthenticated,
  getTeacherNotes,
  saveTeacherNotes,
  resetAllDataToDefault,
} from '../utils/storage';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  BookOpen,
  Database,
  Award,
  BarChart,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  KeyRound,
  X,
} from 'lucide-react';

interface TeacherAdminViewProps {
  topics: Topic[];
  questions: Question[];
  exams: ExamConfig[];
  progress: UserProgress;
  onSaveTopics: (topics: Topic[]) => void;
  onSaveQuestions: (questions: Question[]) => void;
  onSaveExams: (exams: ExamConfig[]) => void;
}

export const TeacherAdminView: React.FC<TeacherAdminViewProps> = ({
  topics,
  questions,
  exams,
  progress,
  onSaveTopics,
  onSaveQuestions,
  onSaveExams,
}) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isTeacherAuthenticated());
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'questions' | 'topics' | 'import_export' | 'exams' | 'stats' | 'ai_notes'
  >('questions');

  // Change PIN modal state
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [pinChangeMsg, setPinChangeMsg] = useState<string>('');

  // Question Form modal / state
  const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
  const [questionFormData, setQuestionFormData] = useState<Partial<Question>>({
    id: '',
    topicId: topics[0]?.id || 'topic-1',
    content: '',
    type: 'multiple_choice',
    difficulty: 'Thông hiểu',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ],
    subQuestions: [
      { id: 'a', text: '', correct: true },
      { id: 'b', text: '', correct: false },
      { id: 'c', text: '', correct: true },
      { id: 'd', text: '', correct: false },
    ],
    correctAnswer: 'A',
    explanation: '',
    keyTakeaway: '',
    reference: 'SGK Tin học 12',
    isVerified: true,
  });

  // Topic Form state
  const [isEditingTopic, setIsEditingTopic] = useState<boolean>(false);
  const [topicFormData, setTopicFormData] = useState<Partial<Topic>>({
    id: '',
    code: 'CD8',
    title: '',
    description: '',
    iconName: 'BookOpen',
    objectives: [''],
    lessons: [],
  });

  // Exam Form state
  const [isEditingExam, setIsEditingExam] = useState<boolean>(false);
  const [examFormData, setExamFormData] = useState<Partial<ExamConfig>>({
    id: '',
    title: '',
    description: '',
    durationMinutes: 45,
    questionIds: [],
    rules: {
      multipleChoiceScore: 0.25,
      trueFalseRule: 'moet',
      shortAnswerScore: 0.25,
    },
  });

  // AI Notes state
  const [teacherNotes, setTeacherNotes] = useState<string>(getTeacherNotes());
  const [notesSaveMsg, setNotesSaveMsg] = useState<string>('');

  // Handle PIN login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getTeacherPin();
    if (pinInput === correctPin) {
      setTeacherAuthenticated(true);
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Mã PIN không chính xác. Mã mặc định là 123456');
    }
  };

  const handleLogout = () => {
    setTeacherAuthenticated(false);
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length < 4) {
      setPinChangeMsg('Mã PIN cần có ít nhất 4 ký tự');
      return;
    }
    setTeacherPin(newPinInput);
    setPinChangeMsg('Đổi mã PIN thành công!');
    setTimeout(() => {
      setShowPinModal(false);
      setPinChangeMsg('');
      setNewPinInput('');
    }, 1200);
  };

  // Question CRUD
  const handleOpenAddQuestion = () => {
    setQuestionFormData({
      id: 'q-' + Date.now(),
      topicId: topics[0]?.id || 'topic-1',
      content: '',
      type: 'multiple_choice',
      difficulty: 'Thông hiểu',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
      ],
      subQuestions: [
        { id: 'a', text: '', correct: true },
        { id: 'b', text: '', correct: false },
        { id: 'c', text: '', correct: true },
        { id: 'd', text: '', correct: false },
      ],
      correctAnswer: 'A',
      explanation: '',
      keyTakeaway: '',
      reference: 'SGK Tin học 12',
      isVerified: true,
    });
    setIsEditingQuestion(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setQuestionFormData({ ...q });
    setIsEditingQuestion(true);
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng không?')) {
      const updated = questions.filter((q) => q.id !== id);
      onSaveQuestions(updated);
    }
  };

  const handleToggleVerify = (id: string) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, isVerified: !q.isVerified } : q
    );
    onSaveQuestions(updated);
  };

  const handleSaveQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFormData.content?.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi!');
      return;
    }

    const newQuestion = questionFormData as Question;
    const exists = questions.some((q) => q.id === newQuestion.id);

    let updated: Question[];
    if (exists) {
      updated = questions.map((q) => (q.id === newQuestion.id ? newQuestion : q));
    } else {
      updated = [newQuestion, ...questions];
    }

    onSaveQuestions(updated);
    setIsEditingQuestion(false);
  };

  // Export Question Bank to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ngan_hang_cau_hoi_tinhoc12_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON handler
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge or replace
          const merged = [...parsed, ...questions.filter((q) => !parsed.some((p) => p.id === q.id))];
          onSaveQuestions(merged);
          alert(`Đã nhập thành công ${parsed.length} câu hỏi vào ngân hàng!`);
        } else {
          alert('Tệp JSON không chứa mảng câu hỏi hợp lệ.');
        }
      } catch (err) {
        alert('Lỗi định dạng tệp JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  // Download sample template
  const handleDownloadSampleTemplate = () => {
    const sample = [
      {
        id: 'q-sample-01',
        topicId: 'topic-1',
        content: 'Ví dụ câu hỏi mẫu trắc nghiệm 4 lựa chọn?',
        type: 'multiple_choice',
        difficulty: 'Thông hiểu',
        options: [
          { id: 'A', text: 'Phương án A đúng' },
          { id: 'B', text: 'Phương án B sai' },
          { id: 'C', text: 'Phương án C sai' },
          { id: 'D', text: 'Phương án D sai' },
        ],
        correctAnswer: 'A',
        explanation: 'Giải thích tại sao phương án A đúng...',
        keyTakeaway: 'Kiến thức cốt lõi cần nhớ...',
        reference: 'SGK Tin học 12',
        isVerified: true,
      },
    ];
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sample, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'mau_nhap_cau_hoi.json';
    a.click();
  };

  // Save AI Teacher Reference Notes
  const handleSaveNotes = () => {
    saveTeacherNotes(teacherNotes);
    setNotesSaveMsg('Đã lưu tài liệu ghi chú thành công!');
    setTimeout(() => setNotesSaveMsg(''), 2500);
  };

  // Reset to initial curriculum
  const handleResetAll = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ đặt lại toàn bộ chuyên đề, bài học và ngân hàng câu hỏi về dữ liệu ban đầu của hệ thống. Bạn có chắc chắn muốn thực hiện?')) {
      resetAllDataToDefault();
      window.location.reload();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Khu vực Quản trị Giáo viên</h1>
          <p className="text-xs text-slate-700">
            Chức năng quản lý chuyên đề, ngân hàng câu hỏi và cấu hình đề thi.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              MẬT KHẨU / MÃ PIN XÁC THỰC:
            </label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Nhập mã PIN (Mặc định: 123456)"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoFocus
            />
            {authError && <p className="text-xs text-rose-600 font-medium mt-1.5">{authError}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Đăng nhập quản trị
          </button>
        </form>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-2xs text-slate-700 space-y-1">
          <div>
            🔒 <strong>Bảo mật:</strong> Phân quyền độc lập, học sinh không thể tùy ý sửa đáp án chuẩn hoặc nội dung đề thi.
          </div>
          <div>Mã PIN mẫu mặc định của hệ thống: <code className="font-bold text-blue-700">123456</code></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Admin Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Bảng điều khiển Quản trị Giáo viên
            </h1>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Quản lý ngân hàng câu hỏi, soạn đề thi thử và cập nhật kiến thức chuyên môn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPinModal(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Đổi PIN</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'questions', label: `Câu hỏi (${questions.length})`, icon: <Database className="w-4 h-4" /> },
          { id: 'topics', label: `Chuyên đề (${topics.length})`, icon: <BookOpen className="w-4 h-4" /> },
          { id: 'import_export', label: 'Nhập / Xuất dữ liệu', icon: <Upload className="w-4 h-4" /> },
          { id: 'exams', label: `Cấu hình đề thi (${exams.length})`, icon: <Award className="w-4 h-4" /> },
          { id: 'stats', label: 'Thống kê kết quả', icon: <BarChart className="w-4 h-4" /> },
          { id: 'ai_notes', label: 'Tài liệu nguồn AI', icon: <FileText className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white border-t border-x border-slate-200 text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: QUESTIONS MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              Tổng số {questions.length} câu hỏi trong hệ thống
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddQuestion}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Soạn câu hỏi mới</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Mã</th>
                    <th className="p-3">Nội dung câu hỏi</th>
                    <th className="p-3">Dạng</th>
                    <th className="p-3">Mức độ</th>
                    <th className="p-3">Kiểm duyệt</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-600">{q.id}</td>
                      <td className="p-3 font-medium text-slate-900 max-w-md truncate">
                        {q.content}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-slate-100 text-slate-700">
                          {q.type}
                        </span>
                      </td>
                      <td className="p-3">{q.difficulty}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleVerify(q.id)}
                          className={`px-2 py-0.5 rounded text-2xs font-bold cursor-pointer ${
                            q.isVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {q.isVerified ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                        </button>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEditQuestion(q)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPICS MANAGEMENT */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              Tổng số {topics.length} chuyên đề
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    {t.code}
                  </span>
                  <span className="text-xs text-slate-700">{t.lessons.length} bài học</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{t.title}</h3>
                <p className="text-xs text-slate-700">{t.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
                  <span>Mục tiêu: {t.objectives.length} ý</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: IMPORT & EXPORT */}
      {activeTab === 'import_export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">Xuất ngân hàng câu hỏi</h3>
            </div>
            <p className="text-xs text-slate-700">
              Xuất toàn bộ {questions.length} câu hỏi chuẩn trong hệ thống ra tệp JSON để lưu trữ hoặc chia sẻ với các giáo viên khác.
            </p>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải về tệp JSON ({questions.length} câu)</span>
            </button>
          </div>

          {/* Import Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Nhập câu hỏi từ tệp JSON</h3>
            </div>
            <p className="text-xs text-slate-700">
              Nhập danh sách câu hỏi theo đúng định dạng. Hệ thống sẽ tự động ghép nối vào ngân hàng mà không làm mất câu hỏi cũ.
            </p>
            <div className="space-y-3">
              <label className="block w-full p-4 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer hover:border-blue-500 bg-slate-50 transition">
                <span className="text-xs font-bold text-blue-700">Chọn tệp JSON từ máy tính</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleDownloadSampleTemplate}
                className="text-xs text-slate-700 hover:text-blue-600 underline font-semibold block cursor-pointer"
              >
                Tải tệp mẫu cấu trúc câu hỏi JSON chuẩn
              </button>
            </div>
          </div>

          {/* Reset System Danger Box */}
          <div className="md:col-span-2 bg-rose-50/80 border border-rose-200 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-sm">Khôi phục dữ liệu gốc</h3>
            </div>
            <p className="text-xs text-rose-800">
              Nếu bạn muốn xóa các câu hỏi thử nghiệm và nạp lại toàn bộ chương trình Tin học 12 mặc định ban đầu:
            </p>
            <button
              onClick={handleResetAll}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Đặt lại toàn bộ dữ liệu gốc
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: EXAM BUILDER */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              Danh sách đề thi thử đã cấu hình ({exams.length} đề)
            </span>
          </div>

          <div className="space-y-3">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{exam.title}</h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                    {exam.durationMinutes} phút
                  </span>
                </div>
                <p className="text-xs text-slate-700">{exam.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <span>Số câu: <strong>{exam.questionIds.length}</strong></span>
                  <span>•</span>
                  <span>Quy tắc chấm Đúng/Sai: <strong>{exam.rules.trueFalseRule === 'moet' ? 'Chuẩn Bộ GD&ĐT (1-4 ý)' : 'Chia đều'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STUDENT STATS */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Thống kê kết quả học sinh</h3>
            <p className="text-xs text-slate-700">
              Tổng hợp dữ liệu từ các lượt thi thử trên thiết bị này.
            </p>
          </div>

          {progress.examResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-700 bg-slate-50 rounded-xl">
              Chưa có dữ liệu bài thi nào được thực hiện.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-700">Tổng số lượt thi</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {progress.examResults.length}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-700">Điểm trung bình</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    {(
                      progress.examResults.reduce((acc, r) => acc + r.totalScore, 0) /
                      progress.examResults.length
                    ).toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-700">Điểm cao nhất</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {Math.max(...progress.examResults.map((r) => r.totalScore)).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* History list */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {progress.examResults.map((res, i) => (
                  <div key={res.id || i} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{res.examTitle}</span>
                      <div className="text-2xs text-slate-700">
                        {new Date(res.timestamp).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-blue-700 text-sm">
                        {res.totalScore.toFixed(2)} / 10đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: AI TEACHER NOTES */}
      {activeTab === 'ai_notes' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Tài liệu tham chiếu sư phạm cho Trợ lý AI</h3>
            <p className="text-xs text-slate-700">
              Nhập các ghi chú chuyên môn, quy định điểm số hoặc mẹo giải bài để Trợ lý Tin học ưu tiên tham chiếu khi giải thích cho học sinh.
            </p>
          </div>

          <textarea
            rows={8}
            value={teacherNotes}
            onChange={(e) => setTeacherNotes(e.target.value)}
            placeholder="Ví dụ: Lưu ý nhấn mạnh hàm SUMIFS luôn đặt vùng tính tổng ở tham số đầu tiên; IPv4 gồm 32 bit và IPv6 gồm 128 bit; quy chế chấm Đúng/Sai 4 ý theo chuẩn Bộ GD&ĐT 2025..."
            className="w-full p-3.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          ></textarea>

          <div className="flex items-center justify-between">
            {notesSaveMsg && <span className="text-xs font-bold text-emerald-600">{notesSaveMsg}</span>}
            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ml-auto"
            >
              <Save className="w-4 h-4" />
              <span>Lưu tài liệu tham chiếu</span>
            </button>
          </div>
        </div>
      )}

      {/* QUESTION EDIT / ADD MODAL */}
      {isEditingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {questions.some((q) => q.id === questionFormData.id) ? 'Chỉnh sửa câu hỏi' : 'Soạn câu hỏi mới'}
              </h3>
              <button
                onClick={() => setIsEditingQuestion(false)}
                className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CHUYÊN ĐỀ</label>
                  <select
                    value={questionFormData.topicId}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, topicId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} - {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">DẠNG CÂU HỎI</label>
                  <select
                    value={questionFormData.type}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, type: e.target.value as QuestionType })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="multiple_choice">Trắc nghiệm 4 lựa chọn</option>
                    <option value="true_false">Đúng / Sai 4 ý</option>
                    <option value="short_answer">Trả lời ngắn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">MỨC ĐỘ NHẬN THỨC</label>
                <select
                  value={questionFormData.difficulty}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, difficulty: e.target.value as CognitiveLevel })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Nhận biết">Nhận biết</option>
                  <option value="Thông hiểu">Thông hiểu</option>
                  <option value="Vận dụng">Vận dụng</option>
                  <option value="Vận dụng cao">Vận dụng cao</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NỘI DUNG CÂU HỎI</label>
                <textarea
                  rows={3}
                  value={questionFormData.content}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, content: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  required
                ></textarea>
              </div>

              {/* Form fields for Multiple Choice */}
              {questionFormData.type === 'multiple_choice' && (
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">4 PHƯƠNG ÁN LỰA CHỌN</label>
                  {questionFormData.options?.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="w-6 font-bold text-center text-slate-700">{opt.id}.</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...(questionFormData.options || [])];
                          updated[idx].text = e.target.value;
                          setQuestionFormData({ ...questionFormData, options: updated });
                        }}
                        placeholder={`Nội dung phương án ${opt.id}...`}
                        className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="block font-bold text-slate-700 mb-1">ĐÁP ÁN CHÍNH XÁC</label>
                    <select
                      value={questionFormData.correctAnswer as string}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, correctAnswer: e.target.value })}
                      className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="A">Phương án A</option>
                      <option value="B">Phương án B</option>
                      <option value="C">Phương án C</option>
                      <option value="D">Phương án D</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form fields for True / False */}
              {questionFormData.type === 'true_false' && (
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">4 Ý MỆNH ĐỀ (a, b, c, d)</label>
                  {questionFormData.subQuestions?.map((sub, idx) => (
                    <div key={sub.id} className="flex items-center gap-2">
                      <span className="w-5 font-bold text-center text-blue-700">{sub.id})</span>
                      <input
                        type="text"
                        value={sub.text}
                        onChange={(e) => {
                          const updated = [...(questionFormData.subQuestions || [])];
                          updated[idx].text = e.target.value;
                          setQuestionFormData({ ...questionFormData, subQuestions: updated });
                        }}
                        placeholder={`Mệnh đề ${sub.id}...`}
                        className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        required
                      />
                      <select
                        value={sub.correct ? 'true' : 'false'}
                        onChange={(e) => {
                          const updated = [...(questionFormData.subQuestions || [])];
                          updated[idx].correct = e.target.value === 'true';
                          setQuestionFormData({
                            ...questionFormData,
                            subQuestions: updated,
                            correctAnswer: updated.map((s) => s.correct),
                          });
                        }}
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      >
                        <option value="true">ĐÚNG</option>
                        <option value="false">SAI</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Form fields for Short Answer */}
              {questionFormData.type === 'short_answer' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ĐÁP ÁN CHUẨN (CHUỖI / SỐ)</label>
                  <input
                    type="text"
                    value={questionFormData.correctAnswer as string}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, correctAnswer: e.target.value })}
                    placeholder="Ví dụ: 32 hoặc MATCH"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">LỜI GIẢI CHI TIẾT</label>
                <textarea
                  rows={3}
                  value={questionFormData.explanation}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
                  placeholder="Giải thích cặn kẽ tại sao đáp án đó đúng và phân tích các phương án sai..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">KIẾN THỨC GHI NHỚ</label>
                  <input
                    type="text"
                    value={questionFormData.keyTakeaway || ''}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, keyTakeaway: e.target.value })}
                    placeholder="Tóm tắt 1 mẹo ghi nhớ cốt lõi..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TÀI LIỆU THAM CHIẾU</label>
                  <input
                    type="text"
                    value={questionFormData.reference || ''}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, reference: e.target.value })}
                    placeholder="SGK Tin học 12, Bộ GD&ĐT..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingQuestion(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold cursor-pointer"
                >
                  Lưu câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PIN MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base">Đổi mã PIN Giáo viên</h3>
            <form onSubmit={handleChangePin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  MÃ PIN MỚI (Tối thiểu 4 ký tự):
                </label>
                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Nhập mã PIN mới..."
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  autoFocus
                />
                {pinChangeMsg && (
                  <p className="text-xs font-bold text-emerald-600 mt-1">{pinChangeMsg}</p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Cập nhật mã PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
