import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { processCopilotQuery } from '../../utils/copilotEngine';
import { CopilotMessage } from '../../types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'Which students require priority academic review?',
  'Which academically strong students need placement training?',
  'What are the most common reasons for low success scores?',
  'Which department has the highest proportion of low-attendance students?',
  'Recommend an intervention plan for Aarav Sharma.',
  'Summarize the main trends in the current dataset.',
];

export const AiInsights: React.FC = () => {
  const { students, navigate } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-initial',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Welcome to CampusIQ Student Success Intelligence Copilot. I analyze unified student records, calculate deterministic indicators, and recommend proactive faculty interventions.`,
      finding: `Currently monitoring ${students.length} unified student profiles across 5 academic departments.`,
      metrics: [
        { label: 'Active Roster', value: students.length },
        { label: 'Avg Success Index', value: `${(students.reduce((a, b) => a + b.studentSuccessScore, 0) / students.length).toFixed(1)}/100` },
        { label: 'Priority Alerts', value: students.filter(s => s.riskLevel === 'high').length },
      ],
      recommendedAction: 'Select a pre-built institutional query below or type your inquiry to inspect data-grounded insights.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAsk = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: queryText,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      const response = processCopilotQuery(queryText, students);
      const assistantMsg: CopilotMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        ...response,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setLoading(false);
    }, 400);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'msg-initial',
        sender: 'assistant',
        timestamp: 'Just now',
        text: `Conversation reset. Ready to analyze unified institutional records.`,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              AI Student Success Copilot
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Grounded Intelligence
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Query student data, uncover systemic patterns, and generate targeted intervention roadmaps.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6D7975] hover:text-[#192A27] bg-white border border-[#E2E6E1] rounded-lg hover:bg-[#F7F6F1] transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-[#6D7975] block uppercase tracking-wider text-[10px]">
          Suggested Institutional Inquiries
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="text-xs text-[#192A27] bg-white hover:bg-[#E8F5F1] hover:text-[#123D35] hover:border-[#16856B] border border-[#E2E6E1] px-3 py-1.5 rounded-lg transition-colors text-left font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ================= CHAT & RESPONSE WORKSPACE ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-[#123D35] text-white'
                    : 'bg-[#16856B] text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`space-y-3 rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#123D35] text-white rounded-tr-xs'
                    : 'bg-[#F7F6F1] text-[#192A27] border border-[#E2E6E1] rounded-tl-xs'
                }`}
              >
                <p className="font-medium text-[13px]">{msg.text}</p>

                {/* Structured Findings Card */}
                {msg.finding && (
                  <div className="p-3 bg-white rounded-xl border border-[#E2E6E1] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#16856B] tracking-wider block">
                      Data-Grounded Finding
                    </span>
                    <p className="font-semibold text-sm text-[#192A27]">{msg.finding}</p>

                    {/* Supporting Metrics Badges */}
                    {msg.metrics && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#E2E6E1]/60">
                        {msg.metrics.map((m, i) => (
                          <div key={i} className="p-2 bg-[#F7F6F1] rounded-lg">
                            <span className="text-[10px] text-[#6D7975] block truncate">{m.label}</span>
                            <span className="font-bold text-sm text-[#123D35] tabular-nums font-display">
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Affected Students list */}
                    {msg.affectedStudents && msg.affectedStudents.length > 0 && (
                      <div className="pt-2 border-t border-[#E2E6E1]/60 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#6D7975] block">
                          Top Impacted Students:
                        </span>
                        <div className="space-y-1">
                          {msg.affectedStudents.map(st => (
                            <div 
                              key={st.id}
                              onClick={() => navigate(`/admin/students/${st.id}`)}
                              className="flex items-center justify-between p-2 rounded-lg bg-[#F7F6F1] hover:bg-[#E8F5F1] cursor-pointer transition-colors"
                            >
                              <div>
                                <span className="font-bold text-[#192A27]">{st.name}</span>
                                <span className="text-[10px] text-[#6D7975] ml-2">({st.dept} · {st.id})</span>
                              </div>
                              <span className="text-xs font-semibold text-[#16856B] flex items-center gap-1">
                                Score: {st.score} <ExternalLink className="w-3 h-3" />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Action */}
                    {msg.recommendedAction && (
                      <div className="p-2.5 rounded-lg bg-[#E8F5F1] text-[#123D35] border border-[#CCE8DA]">
                        <span className="text-[10px] uppercase font-bold text-[#16856B] block mb-0.5">
                          Recommended Action:
                        </span>
                        <p className="font-medium text-xs">{msg.recommendedAction}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-[#6D7975]">
              <div className="w-8 h-8 rounded-full bg-[#16856B] text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1]">
                <span>Processing data queries against institutional database...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E2E6E1] bg-[#F7F6F1]/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Copilot about risk factors, cohorts, departments, or intervention plans..."
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-[#E2E6E1] rounded-xl text-[#192A27] placeholder-[#6D7975] focus:outline-none focus:ring-2 focus:ring-[#16856B]/20 focus:border-[#16856B]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="px-4 py-2.5 bg-[#123D35] hover:bg-[#0B2925] disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-[#6D7975] mt-2 text-center">
            CampusIQ Copilot uses deterministic statistical rules grounded in verified student records. No hallucinated metrics.
          </p>
        </div>
      </div>
    </div>
  );
};
