import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPREHENSIVE_QUIZ_BANK } from '../../data/quizBank';
import { QuizQuestion, QuizAttempt, Flashcard } from '../../types';
import { 
  FileQuestion, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Check, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';

export const QuizPractice: React.FC = () => {
  const { 
    topicMasteries, 
    flashcards, 
    updateFlashcardStatus, 
    recordQuizAttempt, 
    quizAttempts,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'quizzes' | 'flashcards' | 'mastery'>('quizzes');

  // Quiz Configuration State
  const [selectedSubject, setSelectedSubject] = useState('DBMS');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [quizRunning, setQuizRunning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardFilter, setFlashcardFilter] = useState<'all' | 'needs_revision' | 'mastered'>('all');

  const subjects = ['All', 'DBMS', 'DSA', 'Operating Systems', 'Computer Networks', 'Mathematics', 'Java', 'Python'];

  // Filtered Quiz Questions
  const activeQuizQuestions = useMemo(() => {
    return COMPREHENSIVE_QUIZ_BANK.filter(q => {
      const matchSubj = selectedSubject === 'All' || q.subject === selectedSubject;
      const matchDiff = q.difficulty === selectedDifficulty;
      return matchSubj && matchDiff;
    });
  }, [selectedSubject, selectedDifficulty]);

  // Flashcards filtered
  const filteredFlashcards = useMemo(() => {
    return flashcards.filter(f => {
      if (flashcardFilter !== 'all' && f.mastery !== flashcardFilter) return false;
      return true;
    });
  }, [flashcards, flashcardFilter]);

  const activeCard = filteredFlashcards[currentCardIndex] || filteredFlashcards[0];

  const handleStartQuiz = () => {
    if (activeQuizQuestions.length === 0) {
      addToast('No questions currently available for this combination. Please select another subject or difficulty.', 'warning');
      return;
    }
    setQuizRunning(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (quizCompleted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    activeQuizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    const percentage = Math.round((score / activeQuizQuestions.length) * 100);

    const attempt: QuizAttempt = {
      id: `ATTEMPT-${Date.now()}`,
      studentId: 'STU-2024-042',
      subject: selectedSubject === 'All' ? 'Mixed CS' : selectedSubject,
      topic: activeQuizQuestions[0]?.topic || selectedSubject,
      difficulty: selectedDifficulty,
      totalQuestions: activeQuizQuestions.length,
      score,
      percentage,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answers: selectedAnswers
    };

    recordQuizAttempt(attempt);
    setQuizCompleted(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              AI Quizzes & Flashcard Mastery
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Practice Lab
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Test retention, identify weak topic vectors, and practice core university concepts.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#F7F6F1] p-1 rounded-xl border border-[#E2E6E1] self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'quizzes' ? 'bg-white text-[#123D35] shadow-xs' : 'text-[#6D7975] hover:text-[#192A27]'
            }`}
          >
            Diagnostic Quizzes
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'flashcards' ? 'bg-white text-[#123D35] shadow-xs' : 'text-[#6D7975] hover:text-[#192A27]'
            }`}
          >
            Smart Flashcards
          </button>
          <button
            onClick={() => setActiveTab('mastery')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'mastery' ? 'bg-white text-[#123D35] shadow-xs' : 'text-[#6D7975] hover:text-[#192A27]'
            }`}
          >
            Topic Mastery Board
          </button>
        </div>
      </div>

      {/* ================= TAB 1: INTERACTIVE QUIZZES ================= */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          {!quizRunning ? (
            /* Quiz Setup Card */
            <div className="bg-white rounded-2xl border border-[#E2E6E1] p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-[#192A27]">Configure Targeted Practice Quiz</h2>
                <p className="text-xs text-[#6D7975]">
                  Select your subject focus and challenge level. Practice scores update your learning profile without altering official transcript grades.
                </p>
              </div>

              {/* Subject selection */}
              <div>
                <label className="block text-xs font-semibold text-[#6D7975] uppercase tracking-wider mb-2">
                  Target Subject
                </label>
                <div className="flex flex-wrap gap-2">
                  {['DBMS', 'DSA', 'Operating Systems', 'Computer Networks'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSubject(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedSubject === s
                          ? 'border-[#123D35] bg-[#E8F5F1] text-[#123D35] ring-1 ring-[#123D35]'
                          : 'border-[#E2E6E1] bg-white text-[#192A27] hover:bg-[#F7F6F1]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty selection */}
              <div>
                <label className="block text-xs font-semibold text-[#6D7975] uppercase tracking-wider mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {(['beginner', 'intermediate', 'advanced'] as const).map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border capitalize text-center transition-all ${
                        selectedDifficulty === diff
                          ? 'border-[#123D35] bg-[#E8F5F1] text-[#123D35] ring-1 ring-[#123D35]'
                          : 'border-[#E2E6E1] bg-white text-[#192A27] hover:bg-[#F7F6F1]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1] text-xs text-[#6D7975] flex items-center justify-between">
                <span>
                  Found <strong>{activeQuizQuestions.length}</strong> standardized diagnostic questions matching selected filters.
                </span>
                <span className="text-[10px] uppercase font-bold text-[#16856B]">Standardized Bank</span>
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={activeQuizQuestions.length === 0}
                className="px-6 py-2.5 bg-[#123D35] hover:bg-[#0B2925] disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Start Practice Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Active Quiz Runner */
            <div className="bg-white rounded-2xl border border-[#E2E6E1] p-6 shadow-xs space-y-6">
              {/* Runner Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E6E1]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16856B] block">
                    {selectedSubject} Practice Session · {selectedDifficulty.toUpperCase()}
                  </span>
                  <h2 className="text-sm font-bold text-[#192A27]">
                    Question {currentQuestionIndex + 1} of {activeQuizQuestions.length}
                  </h2>
                </div>

                <button
                  onClick={() => setQuizRunning(false)}
                  className="text-xs text-[#6D7975] hover:text-[#C44B4B] underline"
                >
                  Exit Quiz
                </button>
              </div>

              {/* Current Question */}
              {!quizCompleted ? (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-[#192A27] leading-relaxed">
                    {activeQuizQuestions[currentQuestionIndex].question}
                  </p>

                  <div className="space-y-2.5">
                    {activeQuizQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(oIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#123D35] bg-[#E8F5F1] text-[#123D35] font-bold shadow-xs'
                              : 'border-[#E2E6E1] bg-white text-[#192A27] hover:bg-[#F7F6F1]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#F7F6F1] border border-[#E2E6E1] flex items-center justify-center font-bold text-[10px]">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#16856B]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E2E6E1]">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E2E6E1] disabled:opacity-40 hover:bg-[#F7F6F1]"
                    >
                      Previous
                    </button>

                    {currentQuestionIndex < activeQuizQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex(i => i + 1)}
                        className="px-4 py-1.5 bg-[#123D35] hover:bg-[#0B2925] text-white text-xs font-semibold rounded-lg"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className="px-5 py-2 bg-[#27845B] hover:bg-[#1f6b49] disabled:opacity-40 text-white text-xs font-semibold rounded-lg shadow-xs"
                      >
                        Submit Final Score
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Scorecard & Explanations */
                <div className="space-y-6">
                  <div className="p-6 bg-[#E8F5F1] rounded-2xl border border-[#CCE8DA] text-center space-y-2">
                    <Award className="w-10 h-10 text-[#16856B] mx-auto" />
                    <h3 className="text-xl font-bold font-display text-[#123D35]">Quiz Attempt Evaluation</h3>
                    <p className="text-3xl font-bold font-display text-[#123D35]">
                      {Object.values(selectedAnswers).filter((ans, idx) => ans === activeQuizQuestions[idx].correctIndex).length} / {activeQuizQuestions.length} Correct
                    </p>
                    <p className="text-xs text-[#27845B] font-semibold">
                      Your performance metric has updated your Topic Mastery indicator.
                    </p>
                  </div>

                  {/* Detailed Question Review */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#192A27] uppercase tracking-wider">
                      Detailed Answer Explanations:
                    </h4>
                    {activeQuizQuestions.map((q, idx) => {
                      const userChoice = selectedAnswers[idx];
                      const isCorrect = userChoice === q.correctIndex;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-xl border text-xs space-y-2 ${
                            isCorrect ? 'bg-[#EBF7F1]/30 border-[#CCE8DA]' : 'bg-[#FDF0F0]/30 border-[#F8D2D2]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[#192A27]">
                              {idx + 1}. {q.question}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isCorrect ? 'bg-[#EBF7F1] text-[#27845B]' : 'bg-[#FDF0F0] text-[#C44B4B]'
                            }`}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#6D7975] space-y-0.5">
                            <p>Your Answer: <strong>{q.options[userChoice] || 'Skipped'}</strong></p>
                            <p className="text-[#27845B]">Correct Answer: <strong>{q.options[q.correctIndex]}</strong></p>
                          </div>

                          <div className="p-2.5 rounded-lg bg-white border border-[#E2E6E1] text-[11px] text-[#192A27]">
                            <strong>Explanation: </strong> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E2E6E1]">
                    <button
                      onClick={handleStartQuiz}
                      className="px-4 py-2 border border-[#E2E6E1] hover:bg-[#F7F6F1] text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retry Quiz
                    </button>
                    <button
                      onClick={() => setQuizRunning(false)}
                      className="px-5 py-2 bg-[#123D35] hover:bg-[#0B2925] text-white text-xs font-semibold rounded-lg"
                    >
                      Return to Practice Center
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: SMART FLASHCARDS ================= */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E2E6E1]">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-xs font-bold text-[#6D7975] uppercase text-[10px]">Filter Cards:</span>
              {[
                { id: 'all', label: 'All Cards' },
                { id: 'needs_revision', label: 'Needs Revision' },
                { id: 'mastered', label: 'Mastered' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFlashcardFilter(f.id as any);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    flashcardFilter === f.id ? 'bg-[#123D35] text-white' : 'bg-[#F7F6F1] hover:bg-[#E8F5F1]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-[#6D7975]">
              Card <strong>{currentCardIndex + 1}</strong> of <strong>{filteredFlashcards.length}</strong>
            </span>
          </div>

          {/* Flashcard 3D Card Surface */}
          {activeCard ? (
            <div className="max-w-xl mx-auto space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full min-h-[260px] bg-white rounded-2xl border border-[#E2E6E1] hover:border-[#16856B] p-8 shadow-sm flex flex-col justify-between cursor-pointer transition-all select-none relative"
              >
                <div className="flex items-center justify-between text-xs text-[#6D7975]">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#16856B]">
                    {activeCard.subject} · {activeCard.topic}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    activeCard.mastery === 'mastered'
                      ? 'bg-[#EBF7F1] text-[#27845B]'
                      : activeCard.mastery === 'needs_revision'
                      ? 'bg-[#FDF0F0] text-[#C44B4B]'
                      : 'bg-[#FBF4E8] text-[#C58A2A]'
                  }`}>
                    {activeCard.mastery.replace('_', ' ')}
                  </span>
                </div>

                <div className="my-6 text-center">
                  {!isFlipped ? (
                    <div className="space-y-2">
                      <p className="text-base sm:text-lg font-bold text-[#192A27] leading-relaxed">
                        {activeCard.front}
                      </p>
                      <span className="text-[11px] text-[#6D7975] flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Tap card to reveal answer
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm text-[#123D35] leading-relaxed font-medium whitespace-pre-line">
                        {activeCard.back}
                      </p>
                      <span className="text-[11px] text-[#6D7975] flex items-center justify-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" /> Tap card to see question
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-[#6D7975] text-center">
                  Last Reviewed: {activeCard.lastReviewed || 'Today'}
                </div>
              </div>

              {/* Card Action Controls */}
              <div className="flex items-center justify-between gap-3">
                <button
                  disabled={currentCardIndex === 0}
                  onClick={() => {
                    setCurrentCardIndex(i => Math.max(0, i - 1));
                    setIsFlipped(false);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-[#E2E6E1] bg-white disabled:opacity-40 text-xs font-semibold hover:bg-[#F7F6F1] flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateFlashcardStatus(activeCard.id, 'needs_revision')}
                    className="px-3 py-2 bg-[#FDF0F0] hover:bg-[#fae2e2] text-[#C44B4B] text-xs font-semibold rounded-xl border border-[#F8D2D2]"
                  >
                    Needs Revision
                  </button>
                  <button
                    onClick={() => updateFlashcardStatus(activeCard.id, 'mastered')}
                    className="px-3 py-2 bg-[#EBF7F1] hover:bg-[#daf1e5] text-[#27845B] text-xs font-semibold rounded-xl border border-[#CCE8DA]"
                  >
                    Understood (Mastered)
                  </button>
                </div>

                <button
                  disabled={currentCardIndex === filteredFlashcards.length - 1}
                  onClick={() => {
                    setCurrentCardIndex(i => Math.min(filteredFlashcards.length - 1, i + 1));
                    setIsFlipped(false);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-[#E2E6E1] bg-white disabled:opacity-40 text-xs font-semibold hover:bg-[#F7F6F1] flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#6D7975] bg-white rounded-xl border border-[#E2E6E1]">
              No flashcards match the selected filter.
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: TOPIC MASTERY BOARD ================= */}
      {activeTab === 'mastery' && (
        <div className="bg-white rounded-2xl border border-[#E2E6E1] p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#192A27]">Subject & Topic Mastery Matrix</h2>
            <p className="text-xs text-[#6D7975]">
              Real-time mastery derived from diagnostic practice quizzes and flashcard revisions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E6E1] text-[#6D7975] uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Topic / Domain</th>
                  <th className="py-2.5 px-3">Mastery Level</th>
                  <th className="py-2.5 px-3">Quizzes Taken</th>
                  <th className="py-2.5 px-3">Last Practiced</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E6E1]/60">
                {topicMasteries.map((m, idx) => {
                  const statusBadge = {
                    mastered: 'bg-[#EBF7F1] text-[#27845B]',
                    proficient: 'bg-[#FBF4E8] text-[#C58A2A]',
                    needs_revision: 'bg-[#FDF0F0] text-[#C44B4B]'
                  }[m.status];

                  return (
                    <tr key={idx} className="hover:bg-[#F7F6F1]/50">
                      <td className="py-3 px-3 font-semibold text-[#192A27]">{m.subject}</td>
                      <td className="py-3 px-3 text-[#192A27]">{m.topic}</td>
                      <td className="py-3 px-3 tabular-nums">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{m.masteryPercentage}%</span>
                          <div className="w-20 bg-[#F0EFEA] rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full ${m.masteryPercentage >= 80 ? 'bg-[#27845B]' : m.masteryPercentage >= 60 ? 'bg-[#C58A2A]' : 'bg-[#C44B4B]'}`}
                              style={{ width: `${m.masteryPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 tabular-nums text-[#6D7975]">{m.quizzesTaken} attempts</td>
                      <td className="py-3 px-3 text-[#6D7975]">{m.lastPracticed}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusBadge}`}>
                          {m.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
