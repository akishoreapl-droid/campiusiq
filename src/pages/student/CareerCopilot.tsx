import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  analyzeResumeForRole, 
  calculateSkillGaps, 
  getTargetRoleData, 
  INITIAL_MOCK_QUESTIONS, 
  evaluateInterviewResponse 
} from '../../utils/careerEngine';
import { APTITUDE_QUESTION_BANK } from '../../data/quizBank';
import { TargetJobRole } from '../../types';
import { 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  UserCheck, 
  Send, 
  Award, 
  HelpCircle,
  Lightbulb,
  Target
} from 'lucide-react';

export const CareerCopilot: React.FC = () => {
  const { students, currentUser, addToast } = useApp();

  const student = students.find(s => s.studentId === currentUser?.studentId) || students[0];

  const [activeSubTab, setActiveSubTab] = useState<'resume' | 'skill_gap' | 'mock_interview' | 'aptitude'>('resume');
  const [selectedRole, setSelectedRole] = useState<TargetJobRole>('sde_1');

  // Resume Review analysis
  const resumeReview = useMemo(() => {
    return analyzeResumeForRole(selectedRole, student);
  }, [selectedRole, student]);

  // Skill Gaps
  const skillGaps = useMemo(() => {
    return calculateSkillGaps(selectedRole, student);
  }, [selectedRole, student]);

  // Mock Interview State
  const [currentMockIndex, setCurrentMockIndex] = useState(0);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [evaluations, setEvaluations] = useState<Record<number, ReturnType<typeof evaluateInterviewResponse>>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Aptitude State
  const [selectedAptAnswers, setSelectedAptAnswers] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const activeQuestion = INITIAL_MOCK_QUESTIONS[currentMockIndex];

  const handleEvaluateMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateResponse.trim()) return;

    setIsEvaluating(true);
    setTimeout(() => {
      const result = evaluateInterviewResponse(currentMockIndex, candidateResponse);
      setEvaluations(prev => ({ ...prev, [currentMockIndex]: result }));
      setIsEvaluating(false);
      addToast('Answer evaluated with technical criteria feedback', 'info');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              AI Career & Placement Copilot
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Industry Readiness
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Targeted skill-gap audits, ATS resume improvements, and interactive mock interview coaching.
          </p>
        </div>

        {/* Target Job Role Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-bold text-[#6D7975] uppercase text-[10px]">Target Career Track:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as TargetJobRole)}
            className="text-xs px-3 py-1.5 rounded-xl border border-[#E2E6E1] bg-white font-semibold text-[#123D35] focus:outline-none focus:ring-2 focus:ring-[#16856B]/20"
          >
            <option value="sde_1">Software Dev Engineer (SDE-1)</option>
            <option value="data_engineer">Data & Analytics Engineer</option>
            <option value="frontend_specialist">Frontend Product Engineer</option>
            <option value="cloud_devops">Cloud & DevOps Engineer</option>
            <option value="system_engineer">Embedded & Core Systems</option>
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 bg-[#F7F6F1] p-1 rounded-xl border border-[#E2E6E1] text-xs">
        {[
          { id: 'resume', label: 'ATS Resume Review', icon: FileText },
          { id: 'skill_gap', label: 'Skill-Gap & Roadmap', icon: Target },
          { id: 'mock_interview', label: 'Interactive Mock Interview', icon: UserCheck },
          { id: 'aptitude', label: 'Aptitude Practice', icon: Award },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all ${
                isActive ? 'bg-white text-[#123D35] shadow-xs' : 'text-[#6D7975] hover:text-[#192A27]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: ATS RESUME REVIEW ================= */}
      {activeSubTab === 'resume' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-[#E2E6E1] shadow-xs text-center">
              <span className="text-[10px] font-bold text-[#6D7975] uppercase block mb-1">ATS Match Score</span>
              <div className="text-3xl font-bold font-display text-[#123D35] tabular-nums">
                {resumeReview.overallScore} <span className="text-xs text-[#6D7975]">/ 100</span>
              </div>
              <span className="text-[10px] font-semibold text-[#27845B] mt-1 inline-block">
                Top 20% in Campus Cohort
              </span>
            </div>

            <div className="p-5 bg-white rounded-xl border border-[#E2E6E1] shadow-xs text-center">
              <span className="text-[10px] font-bold text-[#6D7975] uppercase block mb-1">Formatting & Structure</span>
              <div className="text-3xl font-bold font-display text-[#27845B] tabular-nums">
                {resumeReview.atsCompatibility}%
              </div>
              <span className="text-[10px] text-[#6D7975] mt-1 inline-block">
                Clean single-column parsing
              </span>
            </div>

            <div className="p-5 bg-white rounded-xl border border-[#E2E6E1] shadow-xs text-center">
              <span className="text-[10px] font-bold text-[#6D7975] uppercase block mb-1">Keyword Coverage</span>
              <div className="text-3xl font-bold font-display text-[#C58A2A] tabular-nums">
                {resumeReview.missingKeywords.length} Missing
              </div>
              <span className="text-[10px] text-[#C58A2A] mt-1 inline-block">
                Recommended for {resumeReview.targetRole}
              </span>
            </div>
          </div>

          {/* Missing Keywords Ribbon */}
          <div className="p-4 bg-white rounded-xl border border-[#E2E6E1] space-y-2">
            <span className="text-xs font-bold text-[#192A27] uppercase text-[10px]">
              Missing High-Yield ATS Keywords for {resumeReview.targetRole}:
            </span>
            <div className="flex flex-wrap gap-2">
              {resumeReview.missingKeywords.map((kw, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#FBF4E8] text-[#C58A2A] border border-[#F4DEC0] font-medium">
                  + {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Bullet Point Enhancer (Quantified Impact) */}
          <div className="bg-white rounded-xl border border-[#E2E6E1] p-5 space-y-4 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-[#192A27]">AI Bullet-Point Impact Rewrites</h3>
              <p className="text-xs text-[#6D7975]">
                Transforming passive task descriptions into quantified technical achievements.
              </p>
            </div>

            <div className="space-y-4">
              {resumeReview.bulletPointFixes.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F7F6F1] border border-[#E2E6E1] space-y-2.5 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E6E1] text-[#6D7975]">
                    <span className="text-[10px] uppercase font-bold text-[#C44B4B] block mb-0.5">Original Passive Phrasing:</span>
                    <p className="italic">"{item.original}"</p>
                  </div>

                  <div className="p-2.5 bg-[#E8F5F1] rounded-lg border border-[#CCE8DA] text-[#123D35]">
                    <span className="text-[10px] uppercase font-bold text-[#16856B] block mb-0.5">Recommended Impact-Driven Bullet:</span>
                    <p className="font-semibold">"{item.improved}"</p>
                  </div>

                  <p className="text-[11px] text-[#6D7975]">
                    💡 <strong>Reason:</strong> {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SKILL-GAP & ROADMAP ================= */}
      {activeSubTab === 'skill_gap' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E2E6E1] p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#192A27]">Skill-Gap Benchmark Matrix</h3>
              <p className="text-xs text-[#6D7975]">
                Comparing verified student scores against hiring thresholds for <strong>{resumeReview.targetRole}</strong>.
              </p>
            </div>

            <div className="space-y-3">
              {skillGaps.map((item, idx) => {
                const gapBadge = {
                  mastered: 'bg-[#EBF7F1] text-[#27845B]',
                  moderate_gap: 'bg-[#FBF4E8] text-[#C58A2A]',
                  critical_gap: 'bg-[#FDF0F0] text-[#C44B4B]'
                }[item.gapStatus];

                return (
                  <div key={idx} className="p-4 rounded-xl border border-[#E2E6E1] bg-[#F7F6F1]/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-[#192A27]">{item.skill}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${gapBadge}`}>
                        {item.gapStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <span className="text-[10px] text-[#6D7975] block">Current Benchmark</span>
                        <span className="text-base font-bold text-[#192A27]">{item.studentScore}/100</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6D7975] block">Role Hiring Threshold</span>
                        <span className="text-base font-bold text-[#123D35]">{item.targetBenchmark}/100</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#123D35] bg-white p-2 rounded-lg border border-[#E2E6E1]">
                      🎯 <strong>Target Action: </strong> {item.recommendation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4-Week Milestone Roadmap */}
          <div className="bg-white rounded-xl border border-[#E2E6E1] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#192A27]">Personalized 4-Week Placement Acceleration Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {[
                { week: 'Week 1', title: 'DSA Core Drills', desc: 'Solve 15 Dynamic Programming and Tree traversal challenges.' },
                { week: 'Week 2', title: 'SQL & Indexing', desc: 'Master B+ Tree leaf structures, 2PL, and query execution plans.' },
                { week: 'Week 3', title: 'STAR Behavioral', desc: 'Prepare 4 structured STAR project stories for HR evaluation.' },
                { week: 'Week 4', title: 'Mock Panel Trial', desc: 'Complete 2 faculty mock interview panels with live scoring.' },
              ].map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F7F6F1] border border-[#E2E6E1] space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#16856B]">{step.week}</span>
                  <h4 className="font-bold text-[#192A27]">{step.title}</h4>
                  <p className="text-[11px] text-[#6D7975] leading-snug">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: INTERACTIVE MOCK INTERVIEW ================= */}
      {activeSubTab === 'mock_interview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E2E6E1] p-6 shadow-xs space-y-5">
            {/* Question selector */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16856B] block">
                  Question {currentMockIndex + 1} of {INITIAL_MOCK_QUESTIONS.length}
                </span>
                <span className="text-xs text-[#6D7975] uppercase font-semibold">
                  Category: {activeQuestion.category.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {INITIAL_MOCK_QUESTIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentMockIndex(i);
                      setCandidateResponse('');
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                      currentMockIndex === i ? 'bg-[#123D35] text-white' : 'bg-[#F7F6F1] hover:bg-[#E8F5F1]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Question */}
            <div className="p-4 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1]">
              <span className="text-[10px] font-bold uppercase text-[#123D35] block mb-1">Interviewer Prompt:</span>
              <p className="text-sm font-bold text-[#192A27] leading-relaxed">
                "{activeQuestion.question}"
              </p>
            </div>

            {/* Candidate Response Form */}
            <form onSubmit={handleEvaluateMock} className="space-y-3">
              <label className="block text-xs font-semibold text-[#6D7975] uppercase tracking-wider">
                Type Your Technical Answer:
              </label>
              <textarea
                rows={4}
                required
                value={candidateResponse}
                onChange={(e) => setCandidateResponse(e.target.value)}
                placeholder="Structure your answer clearly with foundational concepts, internal mechanics, and real-world trade-offs..."
                className="w-full p-3.5 text-xs border border-[#E2E6E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16856B]/20 focus:border-[#16856B]"
              />

              <button
                type="submit"
                disabled={!candidateResponse.trim() || isEvaluating}
                className="px-5 py-2.5 bg-[#123D35] hover:bg-[#0B2925] disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>{isEvaluating ? 'Evaluating...' : 'Submit & Analyze Response'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Evaluation Results Card */}
            {evaluations[currentMockIndex] && (
              <div className="p-5 rounded-2xl bg-[#E8F5F1] border border-[#CCE8DA] space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#123D35] uppercase tracking-wider">
                    AI Interview Evaluation Score
                  </span>
                  <span className="text-base font-bold font-display text-[#123D35]">
                    {evaluations[currentMockIndex].score} / 10
                  </span>
                </div>

                <p className="text-[#123D35] font-medium leading-relaxed">
                  {evaluations[currentMockIndex].feedback}
                </p>

                {/* Key Points expected */}
                <div className="pt-2 border-t border-[#CCE8DA] space-y-1">
                  <span className="text-[10px] font-bold text-[#16856B] uppercase block">Key Ideal Points:</span>
                  <ul className="space-y-1">
                    {activeQuestion.idealKeyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="text-[#123D35] flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#27845B] shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: APTITUDE PRACTICE ================= */}
      {activeSubTab === 'aptitude' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E6E1] p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#192A27]">Campus Recruitment Aptitude Booster</h3>
              <p className="text-xs text-[#6D7975]">
                Timed quantitative, logical reasoning, and verbal aptitude challenges typical of Tier-1 placement tests.
              </p>
            </div>

            <div className="space-y-4">
              {APTITUDE_QUESTION_BANK.map((q) => {
                const userChoice = selectedAptAnswers[q.id];
                const isRevealed = revealedSolutions[q.id];

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-[#E2E6E1] bg-[#F7F6F1]/50 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#16856B]">
                        {q.category} · {q.topic}
                      </span>
                    </div>

                    <p className="font-bold text-sm text-[#192A27]">{q.question}</p>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userChoice === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => setSelectedAptAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                            className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                              isSelected 
                                ? 'border-[#123D35] bg-[#E8F5F1] font-bold text-[#123D35]' 
                                : 'border-[#E2E6E1] bg-white hover:bg-[#F7F6F1]'
                            }`}
                          >
                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setRevealedSolutions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                        className="text-xs font-semibold text-[#16856B] hover:underline"
                      >
                        {isRevealed ? 'Hide Solution' : 'View Step-by-Step Solution'}
                      </button>
                      {userChoice !== undefined && (
                        <span className={`text-[11px] font-bold ${userChoice === q.correctIndex ? 'text-[#27845B]' : 'text-[#C44B4B]'}`}>
                          {userChoice === q.correctIndex ? 'Correct Choice' : 'Incorrect Choice'}
                        </span>
                      )}
                    </div>

                    {isRevealed && (
                      <div className="p-3 rounded-lg bg-white border border-[#E2E6E1] text-[11px] text-[#192A27]">
                        <strong>Solution: </strong> {q.solution}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
