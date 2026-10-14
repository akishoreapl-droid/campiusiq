import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { InterventionModal } from '../../components/interventions/InterventionModal';
import { Student } from '../../types';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  PlusCircle, 
  ShieldAlert, 
  Sparkles,
  User,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const StudentDirectory: React.FC = () => {
  const { 
    filteredStudents, 
    navigate, 
    searchQuery, 
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedYear,
    setSelectedYear,
    selectedRiskFilter,
    setSelectedRiskFilter,
    interventions
  } = useApp();

  const [sortField, setSortField] = useState<keyof Student>('studentSuccessScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // default ascending so lowest scores show first for review
  const [placementFilter, setPlacementFilter] = useState<'all' | 'high' | 'low'>('all');
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [studentForIntervention, setStudentForIntervention] = useState<Student | null>(null);

  // Sorting
  const sortedStudents = useMemo(() => {
    let list = [...filteredStudents];

    if (placementFilter === 'high') {
      list = list.filter(s => s.placementReadinessScore >= 65);
    } else if (placementFilter === 'low') {
      list = list.filter(s => s.placementReadinessScore < 55);
    }

    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      if (typeof aVal === 'number') {
        return sortDirection === 'asc' 
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      }

      return 0;
    });

    return list;
  }, [filteredStudents, sortField, sortDirection, placementFilter]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, page, pageSize]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getInterventionStatus = (studentId: string) => {
    const inv = interventions.find(i => i.studentId === studentId);
    if (!inv) return null;
    return inv.status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
            Student Intelligence Directory
          </h1>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Searchable institution registry with multi-indicator scoring, risk tiering, and intervention status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6D7975] font-semibold bg-white px-3 py-1.5 rounded-lg border border-[#E2E6E1]">
            Showing <strong className="text-[#192A27]">{sortedStudents.length}</strong> Students
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D7975]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, ID (e.g. STU-2024-042), or email..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#F7F6F1] border border-transparent rounded-lg text-[#192A27] placeholder-[#6D7975] focus:outline-none focus:bg-white focus:border-[#16856B]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6D7975] hover:text-[#192A27]"
              >
                ×
              </button>
            )}
          </div>

          {/* Department */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-transparent rounded-lg text-[#192A27] font-medium focus:outline-none focus:bg-white focus:border-[#16856B]"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Data Science">Data Science</option>
              <option value="Electronics & Comm.">Electronics & Comm.</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={selectedRiskFilter}
              onChange={(e) => {
                setSelectedRiskFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-transparent rounded-lg text-[#192A27] font-medium focus:outline-none focus:bg-white focus:border-[#16856B]"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk (Priority)</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk (On Track)</option>
            </select>
          </div>

          {/* Placement Filter */}
          <div>
            <select
              value={placementFilter}
              onChange={(e) => {
                setPlacementFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F7F6F1] border border-transparent rounded-lg text-[#192A27] font-medium focus:outline-none focus:bg-white focus:border-[#16856B]"
            >
              <option value="all">All Placement Readiness</option>
              <option value="high">Placement Ready (≥ 65)</option>
              <option value="low">Placement Deficit (&lt; 55)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(selectedDepartment !== 'All' || selectedRiskFilter !== 'all' || placementFilter !== 'all' || selectedYear !== 'All' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E6E1]/60 text-xs">
            <span className="text-[11px] text-[#6D7975] font-semibold">Active filters:</span>
            {selectedDepartment !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-[#E8F5F1] text-[#123D35] px-2 py-0.5 rounded text-[11px]">
                Dept: {selectedDepartment}
                <button onClick={() => setSelectedDepartment('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedRiskFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#E8F5F1] text-[#123D35] px-2 py-0.5 rounded text-[11px]">
                Risk: {selectedRiskFilter}
                <button onClick={() => setSelectedRiskFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {placementFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#E8F5F1] text-[#123D35] px-2 py-0.5 rounded text-[11px]">
                Placement: {placementFilter}
                <button onClick={() => setPlacementFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedDepartment('All');
                setSelectedRiskFilter('all');
                setPlacementFilter('all');
                setSelectedYear('All');
                setSearchQuery('');
              }}
              className="text-[11px] text-[#C44B4B] hover:underline ml-auto"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Student Data Table */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] overflow-hidden">
        {paginatedStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F7F6F1] flex items-center justify-center mx-auto text-[#6D7975]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#192A27]">No Students Match Current Filters</h3>
            <p className="text-xs text-[#6D7975] max-w-sm mx-auto">
              Try adjusting your search criteria, clearing risk filters, or resetting department parameters.
            </p>
            <button
              onClick={() => {
                setSelectedDepartment('All');
                setSelectedRiskFilter('all');
                setPlacementFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#123D35] text-white text-xs font-semibold rounded-lg hover:bg-[#0B2925]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E6E1] bg-[#F7F6F1] text-[#6D7975] font-semibold uppercase tracking-wider text-[11px]">
                  <th 
                    onClick={() => handleSort('name')}
                    className="py-3 px-3.5 cursor-pointer hover:text-[#192A27]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Student</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Department & Year</th>
                  <th 
                    onClick={() => handleSort('cgpa')}
                    className="py-3 px-3 cursor-pointer hover:text-[#192A27]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>CGPA</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('attendancePercentage')}
                    className="py-3 px-3 cursor-pointer hover:text-[#192A27]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Attendance</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('studentSuccessScore')}
                    className="py-3 px-3 cursor-pointer hover:text-[#192A27]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Success Score</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('placementReadinessScore')}
                    className="py-3 px-3 cursor-pointer hover:text-[#192A27]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Placement</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Risk Tier</th>
                  <th className="py-3 px-3">Assigned Mentor</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E6E1]/60">
                {paginatedStudents.map((student) => {
                  const invStatus = getInterventionStatus(student.studentId);
                  return (
                    <tr
                      key={student.studentId}
                      className="hover:bg-[#F7F6F1]/80 transition-colors group"
                    >
                      <td className="py-3 px-3.5">
                        <div 
                          onClick={() => navigate(`/admin/students/${student.studentId}`)}
                          className="flex items-center gap-2.5 cursor-pointer"
                        >
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#E2E6E1]"
                          />
                          <div>
                            <span className="font-bold text-[#192A27] group-hover:text-[#16856B] transition-colors block">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-[#6D7975] font-mono">{student.studentId}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-[#192A27] block">{student.department}</span>
                        <span className="text-[11px] text-[#6D7975]">Year {student.year} · Sem {student.semester}</span>
                      </td>

                      <td className="py-3 px-3 tabular-nums font-semibold text-[#192A27]">
                        {student.cgpa.toFixed(2)}
                        {student.backlogs > 0 && (
                          <span className="ml-1 text-[10px] text-[#C44B4B] font-bold">
                            ({student.backlogs} BL)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 tabular-nums">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold ${
                            student.attendancePercentage < 65 ? 'text-[#C44B4B]' : student.attendancePercentage < 75 ? 'text-[#C58A2A]' : 'text-[#27845B]'
                          }`}>
                            {student.attendancePercentage}%
                          </span>
                        </div>
                        <div className="w-16 h-1.5 bg-[#E2E6E1] rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full ${student.attendancePercentage < 65 ? 'bg-[#C44B4B]' : student.attendancePercentage < 75 ? 'bg-[#C58A2A]' : 'bg-[#27845B]'}`}
                            style={{ width: `${student.attendancePercentage}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3 tabular-nums">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-sm text-[#192A27]">{student.studentSuccessScore}</span>
                          <span className="text-[10px] text-[#6D7975]">/100</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 tabular-nums">
                        <div className="flex items-baseline gap-1">
                          <span className={`font-bold text-sm ${
                            student.placementReadinessScore < 55 ? 'text-[#C58A2A]' : 'text-[#192A27]'
                          }`}>
                            {student.placementReadinessScore}
                          </span>
                          <span className="text-[10px] text-[#6D7975]">/100</span>
                        </div>
                        <span className="text-[10px] text-[#6D7975]">Coding: {student.codingScore}</span>
                      </td>

                      <td className="py-3 px-3">
                        <RiskBadge level={student.riskLevel} size="sm" />
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[#192A27] font-medium block">{student.mentorName}</span>
                        {invStatus && (
                          <span className="text-[10px] uppercase font-semibold text-[#16856B]">
                            ● {invStatus.replace('_', ' ')}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setStudentForIntervention(student);
                              setInterventionModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#123D35] hover:bg-[#E8F5F1] hover:text-[#0B2925] transition-colors"
                            title="Assign Intervention"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/students/${student.studentId}`)}
                            className="p-1.5 rounded-lg text-[#6D7975] hover:bg-[#E2E6E1] hover:text-[#192A27] transition-colors"
                            title="Inspect 360° Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {sortedStudents.length > 0 && (
          <div className="p-3.5 border-t border-[#E2E6E1] bg-[#F7F6F1] flex items-center justify-between text-xs">
            <span className="text-[#6D7975]">
              Showing <strong className="text-[#192A27]">{(page - 1) * pageSize + 1}</strong> to{' '}
              <strong className="text-[#192A27]">{Math.min(page * pageSize, sortedStudents.length)}</strong> of{' '}
              <strong className="text-[#192A27]">{sortedStudents.length}</strong> students
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#E2E6E1] bg-white text-[#192A27] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F6F1]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-semibold text-[#192A27]">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-[#E2E6E1] bg-white text-[#192A27] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F6F1]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <InterventionModal
        isOpen={interventionModalOpen}
        onClose={() => setInterventionModalOpen(false)}
        preselectedStudent={studentForIntervention}
      />
    </div>
  );
};
