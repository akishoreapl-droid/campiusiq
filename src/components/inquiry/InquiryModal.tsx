import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Database, 
  Sparkles, 
  AlertCircle,
  Building,
  Mail,
  User,
  Phone,
  MessageSquare
} from 'lucide-react';
import { submitInquiry, InquiryRecord } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: InquiryRecord['inquiry_type'];
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, defaultType = 'general' }) => {
  const { addToast } = useApp();

  const [formData, setFormData] = useState<InquiryRecord>({
    name: '',
    email: '',
    phone: '',
    inquiry_type: defaultType,
    role: 'student',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await submitInquiry(formData);
      if (result.success && result.data) {
        setSubmittedRecord(result.data);
        addToast('Your inquiry has been stored in Supabase backend!', 'success');
      } else {
        setErrorMessage(result.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRecord(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiry_type: 'general',
      role: 'student',
      subject: '',
      message: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E6E1] w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0B2925] text-white p-5 flex items-center justify-between border-b border-[#16856B]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16856B] flex items-center justify-center text-white shadow-md">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white">CampusIQ Inquiry & Support</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  <Database className="w-2.5 h-2.5" />
                  Supabase Live
                </span>
              </div>
              <p className="text-xs text-[#A9B5AC]">Direct inquiries routed to university faculty and administration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A9B5AC] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submittedRecord ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-[#192A27]">Inquiry Saved Successfully!</h4>
                <p className="text-xs text-[#6D7975] mt-1 max-w-md mx-auto">
                  Your inquiry has been committed to the Supabase backend database. Reference ID is provided below for tracking.
                </p>
              </div>

              {/* Record Summary Box */}
              <div className="bg-[#F7F6F1] rounded-xl p-4 border border-[#E2E6E1] text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-[#E2E6E1]">
                  <span className="text-[#6D7975] font-medium">Record ID:</span>
                  <span className="font-mono font-semibold text-[#123D35] truncate max-w-[200px]">
                    {submittedRecord.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6D7975]">Submitted By:</span>
                  <span className="font-medium text-[#192A27]">{submittedRecord.name} ({submittedRecord.email})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6D7975]">Inquiry Category:</span>
                  <span className="font-semibold capitalize text-[#16856B]">{submittedRecord.inquiry_type?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6D7975]">Sync Status:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Stored in Supabase
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-[#123D35] hover:bg-[#0B2925] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Done & Close
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedRecord(null)}
                  className="px-4 py-2.5 border border-[#E2E6E1] text-xs font-medium text-[#6D7975] hover:text-[#192A27] rounded-lg transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6D7975] mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D7975]" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priyanshu Sharma"
                      className="w-full pl-8.5 pr-3 py-2 text-xs bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:border-[#16856B] focus:ring-1 focus:ring-[#16856B]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6D7975] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D7975]" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. student@campusiq.edu"
                      className="w-full pl-8.5 pr-3 py-2 text-xs bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:border-[#16856B] focus:ring-1 focus:ring-[#16856B]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6D7975] mb-1">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D7975]" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-8.5 pr-3 py-2 text-xs bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:border-[#16856B] focus:ring-1 focus:ring-[#16856B]"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6D7975] mb-1">
                    Inquiry Category *
                  </label>
                  <select
                    value={formData.inquiry_type}
                    onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:border-[#16856B]"
                  >
                    <option value="admission">Admissions & Enrollment</option>
                    <option value="academic_support">Academic Support & Tutoring</option>
                    <option value="placement_help">Placement & Career Copilot</option>
                    <option value="system_feedback">CampusIQ Feedback</option>
                    <option value="general">General University Inquiry</option>
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6D7975] mb-1">
                    Your Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:border-[#16856B]"
                  >
                    <option value="student">Current Student</option>
                    <option value="faculty">Faculty / Instructor</option>
                    <option value="recruiter">Placement Recruiter</option>
                    <option value="parent">Parent / Guardian</option>
                    <option value="visitor">Prospective Visitor</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6D7975] mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Request for supplementary mentoring in Advanced Algorithms"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:border-[#16856B] focus:ring-1 focus:ring-[#16856B]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6D7975] mb-1">
                  Inquiry Details / Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide specific details about your query or support need..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:border-[#16856B] focus:ring-1 focus:ring-[#16856B] resize-none"
                />
              </div>

              {/* Backend indicator info */}
              <div className="p-3 bg-[#E8F5F1] border border-[#16856B]/20 rounded-xl flex items-center justify-between text-[11px] text-[#123D35]">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#16856B] shrink-0" />
                  <span>Syncs automatically into Supabase Organization: <strong>Ammu Org</strong></span>
                </div>
                <span className="font-mono text-[10px] text-emerald-800">table: inquiries</span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#E2E6E1] text-xs font-semibold text-[#6D7975] hover:text-[#192A27] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#123D35] hover:bg-[#0B2925] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
