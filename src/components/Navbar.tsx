import React, { useState } from 'react';
import { ViewTab } from '../types';
import {
  GraduationCap,
  BookOpen,
  Edit3,
  Award,
  Database,
  ShieldCheck,
  Bot,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenAIModal: () => void;
  isTeacherAuth: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAIModal,
  isTeacherAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Trang chủ', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'topics', label: 'Chuyên đề & Lý thuyết', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'practice', label: 'Luyện tập', icon: <Edit3 className="w-4 h-4" /> },
    { id: 'exam', label: 'Thi thử THPT', icon: <Award className="w-4 h-4" /> },
    { id: 'question_bank', label: 'Ngân hàng câu hỏi', icon: <Database className="w-4 h-4" /> },
    {
      id: 'teacher_admin',
      label: isTeacherAuth ? 'Giáo viên (Đã đăng nhập)' : 'Khu vực Giáo viên',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div
            onClick={() => {
              onTabChange('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  TIN HỌC THPT
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-md">
                  GDPT 2018
                </span>
              </div>
              <p className="text-xs text-slate-700 hidden md:block">
                Học thông minh – Luyện tập hiệu quả – Tự tin vượt kỳ thi
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                currentTab === item.id ||
                (item.id === 'topics' && currentTab === 'theory') ||
                (item.id === 'exam' && currentTab === 'results');

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'teacher_admin' && isTeacherAuth && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Button: AI Learning Assistant */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenAIModal}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200 hover:shadow-md cursor-pointer group"
            >
              <Bot className="w-4 h-4 text-blue-100 group-hover:rotate-12 transition-transform" />
              <span>Trợ lý Tin học</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenAIModal}
              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"
              title="Mở Trợ lý AI"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const isActive =
              currentTab === item.id ||
              (item.id === 'topics' && currentTab === 'theory') ||
              (item.id === 'exam' && currentTab === 'results');

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.id === 'teacher_admin' && isTeacherAuth && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                    Đã đăng nhập
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenAIModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Trợ lý Tin học (AI)</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
