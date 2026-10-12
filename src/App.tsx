import React, { useState, useEffect } from 'react';
import {
  Topic,
  Question,
  ExamConfig,
  UserProgress,
  ExamResult,
  ViewTab,
} from './types';
import {
  getStoredTopics,
  saveStoredTopics,
  getStoredQuestions,
  saveStoredQuestions,
  getStoredExams,
  saveStoredExams,
  getStoredProgress,
  saveStoredProgress,
  isTeacherAuthenticated,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { TopicsView } from './components/TopicsView';
import { TheoryView } from './components/TheoryView';
import { PracticeView } from './components/PracticeView';
import { ExamView } from './components/ExamView';
import { ResultsView } from './components/ResultsView';
import { QuestionBankView } from './components/QuestionBankView';
import { TeacherAdminView } from './components/TeacherAdminView';
import { AIAssistantModal } from './components/AIAssistantModal';
import { GraduationCap, Heart, Bot } from 'lucide-react';

export default function App() {
  // Persistent data state
  const [topics, setTopics] = useState<Topic[]>(() => getStoredTopics());
  const [questions, setQuestions] = useState<Question[]>(() => getStoredQuestions());
  const [exams, setExams] = useState<ExamConfig[]>(() => getStoredExams());
  const [progress, setProgress] = useState<UserProgress>(() => getStoredProgress());

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');

  // Theory view selection state
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => topics[0]?.id || 'topic-1');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    () => topics[0]?.lessons[0]?.id || 'lesson-1-1'
  );

  // Practice view initial state
  const [practiceTopicId, setPracticeTopicId] = useState<string>('all');
  const [practiceFocusIds, setPracticeFocusIds] = useState<string[]>([]);

  // Exam result state
  const [latestExamResult, setLatestExamResult] = useState<ExamResult | null>(() => {
    const history = progress.examResults;
    return history.length > 0 ? history[history.length - 1] : null;
  });

  // AI Modal state
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [aiModalContext, setAiModalContext] = useState<string>('');
  const [aiModalQuestion, setAiModalQuestion] = useState<Question | null>(null);
  const [aiModalUserChoice, setAiModalUserChoice] = useState<any>(null);

  // Sync state helpers
  const handleUpdateTopics = (newTopics: Topic[]) => {
    setTopics(newTopics);
    saveStoredTopics(newTopics);
  };

  const handleUpdateQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    saveStoredQuestions(newQuestions);
  };

  const handleUpdateExams = (newExams: ExamConfig[]) => {
    setExams(newExams);
    saveStoredExams(newExams);
  };

  const handleUpdateProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    saveStoredProgress(newProgress);
  };

  // Lesson completion toggle
  const handleToggleLessonComplete = (lessonId: string) => {
    const isCompleted = progress.completedLessonIds.includes(lessonId);
    const updated = isCompleted
      ? progress.completedLessonIds.filter((id) => id !== lessonId)
      : [...progress.completedLessonIds, lessonId];

    handleUpdateProgress({
      ...progress,
      completedLessonIds: updated,
    });
  };

  // Navigations
  const handleSelectTopicFromList = (topicId: string) => {
    setSelectedTopicId(topicId);
    const targetTopic = topics.find((t) => t.id === topicId);
    if (targetTopic && targetTopic.lessons.length > 0) {
      setSelectedLessonId(targetTopic.lessons[0].id);
    }
    setCurrentTab('theory');
  };

  const handleSelectLessonFromList = (topicId: string, lessonId: string) => {
    setSelectedTopicId(topicId);
    setSelectedLessonId(lessonId);
    setCurrentTab('theory');
  };

  const handleStartPracticeTopic = (topicId: string) => {
    setPracticeTopicId(topicId);
    setPracticeFocusIds([]);
    setCurrentTab('practice');
  };

  const handlePracticeSingleQuestion = (questionId: string) => {
    setPracticeTopicId('all');
    setPracticeFocusIds([questionId]);
    setCurrentTab('practice');
  };

  const handleRetryWrongQuestions = (wrongQuestionIds: string[]) => {
    setPracticeTopicId('all');
    setPracticeFocusIds(wrongQuestionIds);
    setCurrentTab('practice');
  };

  const handleReviewWeakTopic = (topicId: string) => {
    handleSelectTopicFromList(topicId);
  };

  // Handle Exam submission
  const handleFinishExam = (result: ExamResult) => {
    setLatestExamResult(result);

    // Update user history & question attempts
    const updatedQuestionHistory = { ...progress.questionHistory };
    result.details.forEach((d) => {
      const existing = updatedQuestionHistory[d.questionId] || {
        lastAnsweredAt: 0,
        isCorrect: false,
        wrongCount: 0,
        correctCount: 0,
      };
      updatedQuestionHistory[d.questionId] = {
        lastAnsweredAt: Date.now(),
        isCorrect: d.isFullyCorrect,
        correctCount: existing.correctCount + (d.isFullyCorrect ? 1 : 0),
        wrongCount: existing.wrongCount + (d.isFullyCorrect ? 0 : 1),
      };
    });

    const updatedExamResults = [...progress.examResults, result];

    handleUpdateProgress({
      ...progress,
      questionHistory: updatedQuestionHistory,
      examResults: updatedExamResults,
    });

    setCurrentTab('results');
  };

  // AI Modal triggers
  const handleOpenAIQuestion = (question: Question, userChoice: any) => {
    setAiModalQuestion(question);
    setAiModalUserChoice(userChoice);
    setAiModalContext('');
    setIsAIModalOpen(true);
  };

  const handleOpenAIContext = (context: string) => {
    setAiModalQuestion(null);
    setAiModalUserChoice(null);
    setAiModalContext(context);
    setIsAIModalOpen(true);
  };

  const handleOpenAIGeneralPlan = (score: number, weakTopicTitles: string[]) => {
    const prompt = `Em vừa làm đề thi thử được ${score.toFixed(2)}/10 điểm. Các chuyên đề em còn yếu là: ${weakTopicTitles.join(', ') || 'chưa rõ'}. Thầy/Cô hãy lập cho em một kế hoạch ôn tập hiệu quả trong 2 tuần tới nhé!`;
    handleOpenAIContext(prompt);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'practice') {
            setPracticeTopicId('all');
            setPracticeFocusIds([]);
          }
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAIModal={() => {
          setAiModalQuestion(null);
          setAiModalUserChoice(null);
          setAiModalContext('');
          setIsAIModalOpen(true);
        }}
        isTeacherAuth={isTeacherAuthenticated()}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'home' && (
          <HomeView
            topics={topics}
            questions={questions}
            progress={progress}
            onNavigate={(tab) => {
              if (tab === 'practice') {
                setPracticeTopicId('all');
                setPracticeFocusIds([]);
              }
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTopic={handleSelectTopicFromList}
            onSelectLesson={handleSelectLessonFromList}
            onStartPracticeTopic={handleStartPracticeTopic}
            onOpenAIModal={() => {
              setAiModalQuestion(null);
              setAiModalUserChoice(null);
              setAiModalContext('');
              setIsAIModalOpen(true);
            }}
          />
        )}

        {currentTab === 'topics' && (
          <TopicsView
            topics={topics}
            questions={questions}
            progress={progress}
            onSelectTopic={handleSelectTopicFromList}
            onStartPracticeTopic={handleStartPracticeTopic}
          />
        )}

        {currentTab === 'theory' && (
          <TheoryView
            topics={topics}
            selectedTopicId={selectedTopicId}
            selectedLessonId={selectedLessonId}
            questions={questions}
            progress={progress}
            onSelectTopic={(tId) => {
              setSelectedTopicId(tId);
              const t = topics.find((item) => item.id === tId);
              if (t && t.lessons.length > 0) setSelectedLessonId(t.lessons[0].id);
            }}
            onSelectLesson={(tId, lId) => {
              setSelectedTopicId(tId);
              setSelectedLessonId(lId);
            }}
            onToggleLessonComplete={handleToggleLessonComplete}
            onStartPracticeTopic={handleStartPracticeTopic}
            onOpenAIWithContext={handleOpenAIContext}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeView
            topics={topics}
            questions={questions}
            progress={progress}
            initialTopicId={practiceTopicId}
            focusQuestionIds={practiceFocusIds}
            onSaveProgress={handleUpdateProgress}
            onOpenAIWithQuestion={handleOpenAIQuestion}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'exam' && (
          <ExamView
            exams={exams}
            questions={questions}
            topics={topics}
            progress={progress}
            onFinishExam={handleFinishExam}
            onCancelExam={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'results' && (
          <ResultsView
            result={latestExamResult}
            questions={questions}
            topics={topics}
            onRetryWrongQuestions={handleRetryWrongQuestions}
            onReviewWeakTopic={handleReviewWeakTopic}
            onRetakeExam={() => setCurrentTab('exam')}
            onOpenAIWithQuestion={handleOpenAIQuestion}
            onOpenAIGeneralPlan={handleOpenAIGeneralPlan}
          />
        )}

        {currentTab === 'question_bank' && (
          <QuestionBankView
            questions={questions}
            topics={topics}
            progress={progress}
            onPracticeQuestion={handlePracticeSingleQuestion}
          />
        )}

        {currentTab === 'teacher_admin' && (
          <TeacherAdminView
            topics={topics}
            questions={questions}
            exams={exams}
            progress={progress}
            onSaveTopics={handleUpdateTopics}
            onSaveQuestions={handleUpdateQuestions}
            onSaveExams={handleUpdateExams}
          />
        )}
      </main>

      {/* Global AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        initialContext={aiModalContext}
        contextQuestion={aiModalQuestion}
        userSelectedAnswer={aiModalUserChoice}
      />

      {/* Floating AI Bubble for quick access */}
      <aside aria-label="Hỗ trợ học tập">
        <button
          onClick={() => {
            setAiModalQuestion(null);
            setAiModalUserChoice(null);
            setAiModalContext('');
            setIsAIModalOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-200 hover:scale-105 cursor-pointer group"
          title="Mở Trợ lý Tin học"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-2xs uppercase tracking-wider text-blue-200 font-bold">Trợ lý AI</div>
            <div className="text-xs font-extrabold text-white">Hỏi bài ngay</div>
          </div>
        </button>
      </aside>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 text-slate-600 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900">
                TIN HỌC THPT – LUYỆN THI TỐT NGHIỆP
              </span>
              <p className="text-2xs text-slate-700">
                Chương trình Giáo dục phổ thông 2018 • Định hướng Tin học ứng dụng
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-700">
            <button
              onClick={() => setCurrentTab('home')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Trang chủ
            </button>
            <button
              onClick={() => setCurrentTab('topics')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Chuyên đề
            </button>
            <button
              onClick={() => setCurrentTab('practice')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Luyện tập
            </button>
            <button
              onClick={() => setCurrentTab('exam')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Thi thử
            </button>
            <button
              onClick={() => setCurrentTab('teacher_admin')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Giáo viên
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
