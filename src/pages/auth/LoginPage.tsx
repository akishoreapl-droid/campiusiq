import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  ShieldAlert, 
  Search, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare
} from 'lucide-react';
import { InquiryModal } from '../../components/inquiry/InquiryModal';

export const LoginPage: React.FC = () => {
  const { 
    signIn, 
    isInquiryModalOpen, 
    inquiryDefaultType, 
    openInquiryModal, 
    closeInquiryModal 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await signIn(email.trim(), password);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F6F1] text-[#192A27]">
      {/* ================= LEFT PANEL: EDITORIAL BRAND IDENTITY ================= */}
      <div className="lg:w-1/2 bg-[#0B2925] text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Architectural lines pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Brand header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#16856B] flex items-center justify-center text-white shadow-lg border border-white/10">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">CampusIQ</span>
              <p className="text-xs text-[#A9B5AC] font-medium tracking-wide">University Success Intelligence</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-emerald-300 font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>University Intelligence Production Portal</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            See the signal. <br />
            <span className="text-[#16856B]">Support the student.</span>
          </h1>

          <p className="text-[#D1D8D2] text-sm sm:text-base leading-relaxed max-w-lg mb-8">
            CampusIQ unifies fragmented academic grades, attendance registries, LMS engagement, and placement assessments into explainable student intelligence for proactive faculty action.
          </p>

          {/* Model Metrics Preview */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 max-w-lg backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs text-[#A9B5AC] mb-3">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Explainable Model Architecture</span>
              <span className="text-emerald-400 font-mono">100% Deterministic</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                <span className="block text-xl font-bold font-display text-white">30%</span>
                <span className="text-[10px] text-[#A9B5AC]">Academic Index</span>
              </div>
              <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                <span className="block text-xl font-bold font-display text-white">20%</span>
                <span className="text-[10px] text-[#A9B5AC]">Attendance Log</span>
              </div>
              <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                <span className="block text-xl font-bold font-display text-white">50%</span>
                <span className="text-[10px] text-[#A9B5AC]">LMS & Placement</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Value Propositions */}
        <div className="relative z-10 pt-10 border-t border-white/10 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#16856B]/20 text-emerald-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Identify Risk</h4>
              <p className="text-[11px] text-[#A9B5AC] leading-snug">Multi-vector continuous early detection.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#16856B]/20 text-emerald-400 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Understand Causes</h4>
              <p className="text-[11px] text-[#A9B5AC] leading-snug">Explainable, factual indicator breakdowns.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#16856B]/20 text-emerald-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Improve Outcomes</h4>
              <p className="text-[11px] text-[#A9B5AC] leading-snug">Trackable faculty mentor interventions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT PANEL: AUTHENTICATION ================= */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Lock className="w-2.5 h-2.5 text-emerald-600" />
                Secure Access
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              Institutional Sign-In
            </h2>
            <p className="text-xs text-[#6D7975] mt-1">
              Authenticate securely using your campus credentials.
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 text-xs bg-[#FDF0F0] text-[#C44B4B] border border-[#F8D2D2] rounded-lg animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {/* ================= SIGN IN FORM ================= */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975] mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D7975]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@campusiq.edu"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/20 focus:border-[#16856B]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D7975]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/20 focus:border-[#16856B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D7975] hover:text-[#192A27]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#192A27]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E2E6E1] text-[#123D35] focus:ring-[#123D35]"
                />
                <span>Remember session token</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#123D35] hover:bg-[#0B2925] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Footer */}
          <div className="p-3 bg-white border border-[#E2E6E1] rounded-xl flex items-center justify-between text-[11px] text-[#6D7975]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16856B] shrink-0" />
              <span>Enterprise-Grade Authentication</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              JWT Secured
            </span>
          </div>

          {/* Public Inquiries & Support Card */}
          <div className="pt-2 border-t border-[#E2E6E1]">
            <button
              type="button"
              onClick={() => openInquiryModal('general')}
              className="w-full p-3 rounded-xl border border-emerald-600/30 bg-emerald-50/70 hover:bg-emerald-100/80 transition-all flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-emerald-950">Have Inquiries or Need Guidance?</span>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-white text-emerald-800 border border-emerald-300">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80">Submit your queries directly to our admissions & faculty team</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={closeInquiryModal}
        defaultType={inquiryDefaultType}
      />
    </div>
  );
};
