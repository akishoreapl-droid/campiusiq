import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { InterventionModal } from '../../components/interventions/InterventionModal';
import { Intervention, InterventionStatus, InterventionPriority } from '../../types';
import { 
  ClipboardList, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  User, 
  Calendar, 
  FileText,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export const InterventionCenter: React.FC = () => {
  const { interventions, updateInterventionStatus, navigate, addToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | InterventionStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | InterventionPriority>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');

  // Counts
  const counts = useMemo(() => {
    return {
      all: interventions.length,
      pending: interventions.filter(i => i.status === 'pending').length,
      assigned: interventions.filter(i => i.status === 'assigned').length,
      in_progress: interventions.filter(i => i.status === 'in_progress').length,
      completed: interventions.filter(i => i.status === 'completed').length,
    };
  }, [interventions]);

  // Filtered interventions
  const filteredList = useMemo(() => {
    return interventions.filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.studentName.toLowerCase().includes(q) ||
          item.studentId.toLowerCase().includes(q) ||
          item.action.toLowerCase().includes(q) ||
          item.mentorName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [interventions, statusFilter, priorityFilter, search]);

  const handleStatusChange = (id: string, nextStatus: InterventionStatus) => {
    updateInterventionStatus(id, nextStatus);
  };

  const handleCompleteWithOutcome = (id: string) => {
    updateInterventionStatus(
      id, 
      'completed', 
      'Intervention concluded with student counseling review session.',
      outcomeNotes || 'Remedial action plan successfully verified.'
    );
    setSelectedIntervention(null);
    setOutcomeNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              Intervention Command Center
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA]">
              Closing the Loop
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Operational tracking of academic, attendance, and placement recovery workflows.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-[#123D35] hover:bg-[#0B2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Deploy New Intervention</span>
        </button>
      </div>

      {/* Status Pipeline Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'border-[#123D35] bg-[#E8F5F1] ring-1 ring-[#123D35]'
              : 'border-[#E2E6E1] bg-white hover:border-[#16856B]'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-[#6D7975] block">Total Logged</span>
          <span className="text-xl font-bold font-display text-[#192A27]">{counts.all}</span>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'pending'
              ? 'border-[#C58A2A] bg-[#FBF4E8] ring-1 ring-[#C58A2A]'
              : 'border-[#E2E6E1] bg-white hover:border-[#16856B]'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-[#C58A2A] block">Pending Review</span>
          <span className="text-xl font-bold font-display text-[#192A27]">{counts.pending}</span>
        </button>

        <button
          onClick={() => setStatusFilter('assigned')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'assigned'
              ? 'border-[#123D35] bg-[#E8F5F1] ring-1 ring-[#123D35]'
              : 'border-[#E2E6E1] bg-white hover:border-[#16856B]'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-[#16856B] block">Assigned Mentor</span>
          <span className="text-xl font-bold font-display text-[#192A27]">{counts.assigned}</span>
        </button>

        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'in_progress'
              ? 'border-[#123D35] bg-[#E8F5F1] ring-1 ring-[#123D35]'
              : 'border-[#E2E6E1] bg-white hover:border-[#16856B]'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-[#123D35] block">In Remediation</span>
          <span className="text-xl font-bold font-display text-[#192A27]">{counts.in_progress}</span>
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'completed'
              ? 'border-[#27845B] bg-[#EBF7F1] ring-1 ring-[#27845B]'
              : 'border-[#E2E6E1] bg-white hover:border-[#16856B]'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-[#27845B] block">Resolved</span>
          <span className="text-xl font-bold font-display text-[#192A27]">{counts.completed}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D7975]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, mentor, or action title..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F7F6F1] border border-transparent rounded-lg text-[#192A27] placeholder-[#6D7975] focus:outline-none focus:bg-white focus:border-[#16856B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-[#F7F6F1] border border-transparent rounded-lg text-[#192A27] font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Intervention Cards List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E2E6E1] p-12 text-center">
            <ClipboardList className="w-10 h-10 text-[#6D7975] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#192A27]">No Interventions Found</h3>
            <p className="text-xs text-[#6D7975] mt-1">There are no interventions matching current filters.</p>
          </div>
        ) : (
          filteredList.map((inv) => {
            const isCompleted = inv.status === 'completed';
            const priorityBadge = {
              high: 'bg-[#FDF0F0] text-[#C44B4B] border-[#F8D2D2]',
              medium: 'bg-[#FBF4E8] text-[#C58A2A] border-[#F4DEC0]',
              low: 'bg-[#EBF7F1] text-[#27845B] border-[#CCE8DA]',
            }[inv.priority];

            return (
              <div
                key={inv.id}
                className="bg-white rounded-xl border border-[#E2E6E1] p-5 shadow-xs hover:border-[#16856B] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#123D35] bg-[#F7F6F1] px-2 py-0.5 rounded border border-[#E2E6E1]">
                        {inv.id}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${priorityBadge}`}>
                        {inv.priority} Priority
                      </span>
                      <span className="text-[11px] font-semibold text-[#192A27]">
                        Target: <strong 
                          onClick={() => navigate(`/admin/students/${inv.studentId}`)}
                          className="hover:text-[#16856B] cursor-pointer underline decoration-dotted"
                        >
                          {inv.studentName}
                        </strong> ({inv.studentDept} · {inv.studentId})
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#192A27]">{inv.action}</h3>

                    <p className="text-xs text-[#6D7975]">
                      <strong className="text-[#192A27]">Trigger Reason:</strong> {inv.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#6D7975] pt-1">
                      <span>Assigned to: <strong className="text-[#192A27]">{inv.mentorName}</strong></span>
                      <span>•</span>
                      <span>Target Due Date: <strong className="text-[#192A27]">{inv.dueDate}</strong></span>
                      <span>•</span>
                      <span>Created: {inv.createdAt}</span>
                    </div>

                    {inv.notes && (
                      <div className="p-2.5 rounded-lg bg-[#F7F6F1] text-[11px] text-[#192A27] border border-[#E2E6E1]">
                        <strong>Notes: </strong> {inv.notes}
                      </div>
                    )}

                    {inv.outcome && (
                      <div className="p-2.5 rounded-lg bg-[#EBF7F1] text-[11px] text-[#27845B] border border-[#CCE8DA]">
                        <strong>Outcome Recorded: </strong> {inv.outcome} (Completed {inv.completedAt})
                      </div>
                    )}
                  </div>

                  {/* Right Column: Workflow Status Controls */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0 pt-2 lg:pt-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#6D7975]">Status:</span>
                      <select
                        value={inv.status}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value as InterventionStatus)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          isCompleted
                            ? 'bg-[#EBF7F1] text-[#27845B] border-[#CCE8DA]'
                            : inv.status === 'in_progress'
                            ? 'bg-[#E8F5F1] text-[#123D35] border-[#16856B]'
                            : 'bg-[#FBF4E8] text-[#C58A2A] border-[#F4DEC0]'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {!isCompleted ? (
                      <button
                        onClick={() => setSelectedIntervention(inv)}
                        className="px-3 py-1.5 bg-[#123D35] hover:bg-[#0B2925] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#27845B] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Resolved
                      </span>
                    )}

                    <button
                      onClick={() => navigate(`/admin/students/${inv.studentId}`)}
                      className="text-[11px] text-[#16856B] hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Student 360° Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Complete with Outcome Modal */}
      {selectedIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2925]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E6E1] p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-[#192A27] mb-1">Conclude Intervention Workflow</h3>
            <p className="text-xs text-[#6D7975] mb-4">
              Recording resolution for {selectedIntervention.studentName} ({selectedIntervention.id})
            </p>

            <label className="block text-xs font-semibold text-[#6D7975] uppercase tracking-wider mb-1.5">
              Verified Outcome & Student Progress
            </label>
            <textarea
              rows={3}
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              placeholder="e.g. Student passed DSA remedial benchmark exam with 78% and verified full lecture attendance."
              className="w-full p-3 text-xs border border-[#E2E6E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16856B]/20 focus:border-[#16856B] mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedIntervention(null)}
                className="px-3 py-1.5 text-xs text-[#6D7975] hover:text-[#192A27]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCompleteWithOutcome(selectedIntervention.id)}
                className="px-4 py-2 bg-[#27845B] hover:bg-[#1f6b49] text-white text-xs font-semibold rounded-lg"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for creating new */}
      <InterventionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
