export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface TrueFalseSubQuestion {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  correct: boolean; // true = Đúng, false = Sai
}

export interface Question {
  id: string;
  topicId: string;
  lessonId?: string;
  content: string;
  type: QuestionType;
  difficulty: CognitiveLevel;
  options?: QuestionOption[]; // Dùng cho 'multiple_choice'
  subQuestions?: TrueFalseSubQuestion[]; // Dùng cho 'true_false' (chùm 4 ý a, b, c, d)
  correctAnswer: string | boolean[] | string; // 'A'/'B'/'C'/'D' HOẶC [true, false, true, false] HOẶC chuỗi ngắn
  explanation: string;
  keyTakeaway?: string;
  reference: string;
  isVerified: boolean;
  source?: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  order: number;
  summary: string;
  fullTheory: string;
  keyTakeaways: string[];
  commonPitfalls: string[];
  examples: {
    title: string;
    description: string;
    codeOrDetails?: string;
  }[];
  quickCheckQuestionIds?: string[];
}

export interface Topic {
  id: string;
  code: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  objectives: string[];
  lessons: Lesson[];
}

export interface ExamRuleConfig {
  multipleChoiceScore: number; // Điểm mỗi câu 4 lựa chọn (thường 0.25)
  trueFalseRule: 'moet' | 'equal'; // moet: 1 ý=0.1, 2 ý=0.25, 3 ý=0.5, 4 ý=1.0đ
  shortAnswerScore: number; // Điểm mỗi câu trả lời ngắn (thường 0.25 hoặc 0.5)
}

export interface ExamConfig {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questionIds: string[];
  rules: ExamRuleConfig;
  targetYear?: string;
}

export interface QuestionResultDetail {
  questionId: string;
  topicId: string;
  type: QuestionType;
  userAnswer: any;
  correctAnswer: any;
  isFullyCorrect: boolean;
  scoreAchieved: number;
  maxScore: number;
  subResults?: { id: string; userChoice: boolean | null; correctChoice: boolean; isMatch: boolean }[];
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  timestamp: number;
  durationTakenSeconds: number;
  totalQuestions: number;
  totalScore: number;
  maxPossibleScore: number;
  correctCount: number;
  partialCount: number;
  wrongCount: number;
  unansweredCount: number;
  details: QuestionResultDetail[];
  topicBreakdown: Record<
    string,
    {
      topicTitle: string;
      total: number;
      correct: number;
      scoreAchieved: number;
      maxScore: number;
      percentage: number;
    }
  >;
}

export interface UserProgress {
  completedLessonIds: string[];
  questionHistory: Record<
    string,
    {
      lastAnsweredAt: number;
      isCorrect: boolean;
      wrongCount: number;
      correctCount: number;
    }
  >;
  bookmarkedQuestionIds: string[];
  examResults: ExamResult[];
  studyNotes: string[];
}

export type ViewTab =
  | 'home'
  | 'topics'
  | 'theory'
  | 'practice'
  | 'exam'
  | 'results'
  | 'question_bank'
  | 'teacher_admin';
