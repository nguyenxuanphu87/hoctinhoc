import { Topic, Question, ExamConfig, UserProgress, ExamResult, QuestionResultDetail } from '../types';
import { INITIAL_TOPICS, INITIAL_QUESTIONS, INITIAL_EXAMS } from '../data/initialData';

const STORAGE_KEYS = {
  TOPICS: 'tinhoc12_topics_v1',
  QUESTIONS: 'tinhoc12_questions_v1',
  EXAMS: 'tinhoc12_exams_v1',
  PROGRESS: 'tinhoc12_user_progress_v1',
  TEACHER_PIN: 'tinhoc12_teacher_pin_v1',
  TEACHER_AUTH: 'tinhoc12_teacher_auth_session',
  TEACHER_NOTES: 'tinhoc12_teacher_ai_notes_v1',
};

const DEFAULT_PIN = '123456';

export function getStoredTopics(): Topic[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOPICS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading topics from localStorage:', e);
  }
  return INITIAL_TOPICS;
}

export function saveStoredTopics(topics: Topic[]) {
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
}

export function getStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading questions from localStorage:', e);
  }
  return INITIAL_QUESTIONS;
}

export function saveStoredQuestions(questions: Question[]) {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

export function getStoredExams(): ExamConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading exams from localStorage:', e);
  }
  return INITIAL_EXAMS;
}

export function saveStoredExams(exams: ExamConfig[]) {
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
}

const DEFAULT_PROGRESS: UserProgress = {
  completedLessonIds: [],
  questionHistory: {},
  bookmarkedQuestionIds: [],
  examResults: [],
  studyNotes: [],
};

export function getStoredProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading progress from localStorage:', e);
  }
  return DEFAULT_PROGRESS;
}

export function saveStoredProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

// Teacher Authentication helpers
export function getTeacherPin(): string {
  return localStorage.getItem(STORAGE_KEYS.TEACHER_PIN) || DEFAULT_PIN;
}

export function setTeacherPin(newPin: string): void {
  localStorage.setItem(STORAGE_KEYS.TEACHER_PIN, newPin);
}

export function isTeacherAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.TEACHER_AUTH) === 'true';
}

export function setTeacherAuthenticated(auth: boolean): void {
  if (auth) {
    sessionStorage.setItem(STORAGE_KEYS.TEACHER_AUTH, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.TEACHER_AUTH);
  }
}

export function getTeacherNotes(): string {
  return localStorage.getItem(STORAGE_KEYS.TEACHER_NOTES) || '';
}

export function saveTeacherNotes(notes: string): void {
  localStorage.setItem(STORAGE_KEYS.TEACHER_NOTES, notes);
}

// Exam & Practice Grading Engine
export function gradeExamSubmission(
  exam: ExamConfig,
  questions: Question[],
  userAnswers: Record<string, any>,
  durationTakenSeconds: number,
  topics: Topic[]
): ExamResult {
  const details: QuestionResultDetail[] = [];
  let totalScoreAchieved = 0;
  let maxPossibleScore = 0;
  let correctCount = 0;
  let partialCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  const topicBreakdown: Record<
    string,
    {
      topicTitle: string;
      total: number;
      correct: number;
      scoreAchieved: number;
      maxScore: number;
      percentage: number;
    }
  > = {};

  const topicMap = new Map(topics.map((t) => [t.id, t.title]));

  exam.questionIds.forEach((qId) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;

    const topicTitle = topicMap.get(q.topicId) || 'Chuyên đề chung';
    if (!topicBreakdown[q.topicId]) {
      topicBreakdown[q.topicId] = {
        topicTitle,
        total: 0,
        correct: 0,
        scoreAchieved: 0,
        maxScore: 0,
        percentage: 0,
      };
    }
    topicBreakdown[q.topicId].total += 1;

    const uAnswer = userAnswers[q.id];

    if (q.type === 'multiple_choice') {
      const questionMaxScore = exam.rules.multipleChoiceScore || 0.25;
      maxPossibleScore += questionMaxScore;
      topicBreakdown[q.topicId].maxScore += questionMaxScore;

      const isUnanswered = uAnswer === undefined || uAnswer === null || uAnswer === '';
      const isCorrect = !isUnanswered && String(uAnswer).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();
      const score = isCorrect ? questionMaxScore : 0;

      totalScoreAchieved += score;
      topicBreakdown[q.topicId].scoreAchieved += score;

      if (isUnanswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
        topicBreakdown[q.topicId].correct += 1;
      } else {
        wrongCount++;
      }

      details.push({
        questionId: q.id,
        topicId: q.topicId,
        type: 'multiple_choice',
        userAnswer: uAnswer ?? null,
        correctAnswer: q.correctAnswer,
        isFullyCorrect: isCorrect,
        scoreAchieved: score,
        maxScore: questionMaxScore,
      });
    } else if (q.type === 'true_false') {
      // True/False cluster of 4 statements (a, b, c, d)
      const questionMaxScore = 1.0; // Điểm tối đa chuẩn theo quy chế Bộ GD&ĐT cho 1 câu đúng/sai 4 ý là 1.0đ
      maxPossibleScore += questionMaxScore;
      topicBreakdown[q.topicId].maxScore += questionMaxScore;

      const subQuestions = q.subQuestions || [];
      const userChoices: boolean[] = Array.isArray(uAnswer) ? uAnswer : [null, null, null, null];
      const correctAnswers: boolean[] = Array.isArray(q.correctAnswer)
        ? q.correctAnswer
        : subQuestions.map((s) => s.correct);

      let matchedCount = 0;
      let subUnanswered = 0;
      const subResults = subQuestions.map((sub, idx) => {
        const userVal = userChoices[idx];
        const correctVal = correctAnswers[idx];
        const isMatch = userVal === correctVal;
        if (userVal === null || userVal === undefined) {
          subUnanswered++;
        } else if (isMatch) {
          matchedCount++;
        }
        return {
          id: sub.id,
          userChoice: userVal,
          correctChoice: correctVal,
          isMatch,
        };
      });

      let score = 0;
      if (exam.rules.trueFalseRule === 'moet') {
        // Quy tắc chấm Bộ GD&ĐT cho câu đúng/sai:
        // 1 ý đúng: 0.1 điểm
        // 2 ý đúng: 0.25 điểm
        // 3 ý đúng: 0.5 điểm
        // 4 ý đúng: 1.0 điểm
        if (matchedCount === 4) score = 1.0;
        else if (matchedCount === 3) score = 0.5;
        else if (matchedCount === 2) score = 0.25;
        else if (matchedCount === 1) score = 0.1;
        else score = 0;
      } else {
        score = (matchedCount / 4) * questionMaxScore;
      }

      totalScoreAchieved += score;
      topicBreakdown[q.topicId].scoreAchieved += score;

      const isFullyCorrect = matchedCount === 4;
      if (subUnanswered === 4) {
        unansweredCount++;
      } else if (isFullyCorrect) {
        correctCount++;
        topicBreakdown[q.topicId].correct += 1;
      } else if (matchedCount > 0) {
        partialCount++;
      } else {
        wrongCount++;
      }

      details.push({
        questionId: q.id,
        topicId: q.topicId,
        type: 'true_false',
        userAnswer: userChoices,
        correctAnswer: correctAnswers,
        isFullyCorrect,
        scoreAchieved: score,
        maxScore: questionMaxScore,
        subResults,
      });
    } else if (q.type === 'short_answer') {
      const questionMaxScore = exam.rules.shortAnswerScore || 0.25;
      maxPossibleScore += questionMaxScore;
      topicBreakdown[q.topicId].maxScore += questionMaxScore;

      const isUnanswered = !uAnswer || String(uAnswer).trim() === '';
      const cleanUser = String(uAnswer || '').trim().toLowerCase();
      const cleanCorrect = String(q.correctAnswer).trim().toLowerCase();

      // Check exact string or numeric equivalence
      let isCorrect = cleanUser === cleanCorrect;
      if (!isCorrect && !isNaN(Number(cleanUser)) && !isNaN(Number(cleanCorrect))) {
        isCorrect = Number(cleanUser) === Number(cleanCorrect);
      }

      const score = isCorrect ? questionMaxScore : 0;
      totalScoreAchieved += score;
      topicBreakdown[q.topicId].scoreAchieved += score;

      if (isUnanswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
        topicBreakdown[q.topicId].correct += 1;
      } else {
        wrongCount++;
      }

      details.push({
        questionId: q.id,
        topicId: q.topicId,
        type: 'short_answer',
        userAnswer: uAnswer ?? '',
        correctAnswer: q.correctAnswer,
        isFullyCorrect: isCorrect,
        scoreAchieved: score,
        maxScore: questionMaxScore,
      });
    }
  });

  // Calculate final score normalized to scale 10
  const normalizedScore =
    maxPossibleScore > 0
      ? Number(((totalScoreAchieved / maxPossibleScore) * 10).toFixed(2))
      : 0;

  // Calculate topic percentages
  Object.keys(topicBreakdown).forEach((tId) => {
    const item = topicBreakdown[tId];
    item.percentage = item.maxScore > 0 ? Math.round((item.scoreAchieved / item.maxScore) * 100) : 0;
  });

  return {
    id: 'res-' + Date.now(),
    examId: exam.id,
    examTitle: exam.title,
    timestamp: Date.now(),
    durationTakenSeconds,
    totalQuestions: exam.questionIds.length,
    totalScore: normalizedScore,
    maxPossibleScore: 10,
    correctCount,
    partialCount,
    wrongCount,
    unansweredCount,
    details,
    topicBreakdown,
  };
}

export function resetAllDataToDefault() {
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(INITIAL_TOPICS));
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.TEACHER_NOTES);
}
