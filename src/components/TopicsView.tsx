import React, { useState, useMemo } from 'react';
import { Topic, Question, UserProgress } from '../types';
import {
  Search,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Cpu,
  Cloud,
  FileSpreadsheet,
  Globe,
  BarChart3,
  ShieldCheck,
  Target,
} from 'lucide-react';

interface TopicsViewProps {
  topics: Topic[];
  questions: Question[];
  progress: UserProgress;
  onSelectTopic: (topicId: string) => void;
  onStartPracticeTopic: (topicId: string) => void;
}

export const TopicsView: React.FC<TopicsViewProps> = ({
  topics,
  questions,
  progress,
  onSelectTopic,
  onStartPracticeTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');

  const renderIcon = (iconName: string) => {
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

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      // Keyword filter
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.code.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      const totalLessons = topic.lessons.length;
      const completedCount = topic.lessons.filter((l) =>
        progress.completedLessonIds.includes(l.id)
      ).length;

      if (filterStatus === 'completed') {
        return totalLessons > 0 && completedCount === totalLessons;
      }
      if (filterStatus === 'in_progress') {
        return completedCount > 0 && completedCount < totalLessons;
      }
      if (filterStatus === 'not_started') {
        return completedCount === 0;
      }

      return true;
    });
  }, [topics, searchQuery, filterStatus, progress.completedLessonIds]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">
            <span>Chương trình Giáo dục Phổ thông 2018</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Chuyên đề Tin học 12 – Ôn thi tốt nghiệp
          </h1>
          <p className="text-sm text-slate-700 leading-relaxed">
            Hệ thống 7 chuyên đề Tin học ứng dụng cốt lõi. Học lý thuyết bài bản, nắm chắc ví dụ thực tế và luyện bài tập theo chuẩn ma trận đề thi.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm chuyên đề, bài học..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { id: 'all', label: 'Tất cả' },
                { id: 'in_progress', label: 'Đang học' },
                { id: 'completed', label: 'Đã hoàn thành' },
                { id: 'not_started', label: 'Chưa học' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                  filterStatus === f.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Topics */}
      {filteredTopics.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Target className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-800">Không tìm thấy chuyên đề phù hợp</h3>
          <p className="text-xs text-slate-700">
            Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc trạng thái.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
            }}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const topicQuestions = questions.filter((q) => q.topicId === topic.id);
            const totalLessons = topic.lessons.length;
            const completedLessons = topic.lessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;
            const completionPercent =
              totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            const isDone = totalLessons > 0 && completedLessons === totalLessons;

            return (
              <div
                key={topic.id}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-blue-50 transition-colors">
                      {renderIcon(topic.iconName)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isDone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-2xs font-bold bg-emerald-100 text-emerald-800 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Đã xong
                        </span>
                      )}
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {topic.code}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>

                  {/* Objectives summary preview */}
                  <div className="mt-3 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                    <div className="text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mục tiêu trọng tâm:
                    </div>
                    <ul className="text-2xs text-slate-700 space-y-1">
                      {topic.objectives.slice(0, 2).map((obj, i) => (
                        <li key={i} className="line-clamp-1 flex items-start gap-1">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-700">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <strong>{completedLessons}</strong>/{totalLessons} bài học
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      <strong>{topicQuestions.length}</strong> câu trắc nghiệm
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-2xs text-slate-700 mb-1">
                      <span>Tiến độ lý thuyết</span>
                      <span className="font-bold text-blue-700">{completionPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDone ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${completionPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
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
      )}
    </div>
  );
};
