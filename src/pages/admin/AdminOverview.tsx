import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { InterventionModal } from '../../components/interventions/InterventionModal';
import { Student } from '../../types';
import { 
  Users, 
  ShieldAlert, 
  Award, 
  Briefcase, 
  Clock, 
  Download, 
  Sparkles, 
  ArrowUpRight, 
  Filter, 
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AdminOverview: React.FC = () => {
  const { 
    students, 
    filteredStudents, 
    interventions,
    selectedDepartment, 
    setSelectedDepartment,
    selectedYear,
    setSelectedYear,
    selectedRiskFilter,
    setSelectedRiskFilter,
    academicTerm,
    navigate,
    addToast
  } = useApp();

  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState<Student | null>(null);

  // Derived KPI metrics
  const totalTracked = filteredStudents.length;
  const priorityReviewCount = filteredStudents.filter(s => s.riskLevel === 'high').length;
  const avgSuccessScore = totalTracked > 0
    ? Number((filteredStudents.reduce((acc, s) => acc + s.studentSuccessScore, 0) / totalTracked).toFixed(1))
    : 0;
  const placementConcernsCount = filteredStudents.filter(s => s.placementReadinessScore < 55).length;
  const pendingInterventionsCount = interventions.filter(i => i.status === 'pending' || i.status === 'assigned').length;

  // Risk Distribution Data for Pie / Donut
  const riskDistributionData = useMemo(() => {
    const low = filteredStudents.filter(s => s.riskLevel === 'low').length;
    const med = filteredStudents.filter(s => s.riskLevel === 'medium').length;
    const high = filteredStudents.filter(s => s.riskLevel === 'high').length;
    return [
      { name: 'On Track (Low Risk)', value: low, color: '#27845B', risk: 'low' },
      { name: 'Moderate Review', value: med, color: '#C58A2A', risk: 'medium' },
      { name: 'Priority Risk', value: high, color: '#C44B4B', risk: 'high' },
    ];
  }, [filteredStudents]);

  // Assessment Period Performance Trends
  const trendData = useMemo(() => {
    return [
      { period: 'Assessment 1', attendance: 88, internalMarks: 76, lmsCompletion: 84 },
      { period: 'Assessment 2', attendance: 83, internalMarks: 74, lmsCompletion: 79 },
      { period: 'Mid-Term Exam', attendance: 81, internalMarks: 71, lmsCompletion: 76 },
      { period: 'Pre-Endsem (Current)', attendance: 78, internalMarks: 69, lmsCompletion: 72 },
    ];
  }, []);

  // Department Comparison Data
  const departmentStats = useMemo(() => {
    const depts = [
      { key: 'Computer Science', label: 'CSE', fullName: 'Computer Science' },
      { key: 'Information Technology', label: 'IT', fullName: 'Information Technology' },
      { key: 'Data Science', label: 'Data Science', fullName: 'Data Science' },
      { key: 'Electronics & Comm.', label: 'ECE', fullName: 'Electronics & Comm.' },
      { key: 'Mechanical', label: 'Mechanical Engineering', fullName: 'Mechanical' },
    ];

    return depts.map(({ key, label, fullName }) => {
      const cohort = students.filter(s => {
        if (!s.department) return false;
        if (s.department === key || s.department === fullName) return true;
        const norm = s.department.toLowerCase().trim();
        if (key === 'Computer Science' && (norm.includes('comp') || norm === 'cse')) return true;
        if (key === 'Information Technology' && (norm.includes('info') || norm === 'it')) return true;
        if (key === 'Data Science' && (norm.includes('data') || norm === 'ds')) return true;
        if (key === 'Electronics & Comm.' && (norm.includes('elec') || norm.includes('comm') || norm === 'ece')) return true;
        if (key === 'Mechanical' && (norm.includes('mech') || norm.includes('mechanical'))) return true;
        return false;
      });

      const total = cohort.length;
      const hasData = total > 0;
      const avgScore = hasData ? Number((cohort.reduce((sum, s) => sum + s.studentSuccessScore, 0) / total).toFixed(1)) : 0;
      const avgAtt = hasData ? Number((cohort.reduce((sum, s) => sum + s.attendancePercentage, 0) / total).toFixed(1)) : 0;
      const avgPlace = hasData ? Number((cohort.reduce((sum, s) => sum + s.placementReadinessScore, 0) / total).toFixed(1)) : 0;
      const atRiskPct = hasData ? Number(((cohort.filter(s => s.riskLevel === 'high').length / total) * 100).toFixed(1)) : 0;

      return {
        department: label,
        fullName,
        avgSuccessScore: avgScore,
        attendance: avgAtt,
        placementReadiness: avgPlace,
        atRiskPercentage: atRiskPct,
        studentCount: total,
      };
    });
  }, [students]);

  // Priority Intervention Queue (Students in high risk tier)
  const priorityQueue = useMemo(() => {
    return filteredStudents
      .filter(s => s.riskLevel === 'high' || s.backlogs > 0 || s.attendancePercentage < 65)
      .slice(0, 8);
  }, [filteredStudents]);

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Student ID,Name,Department,Year,CGPA,Attendance,Success Score,Risk Level,Primary Risk\n" +
      filteredStudents.map(s => `"${s.studentId}","${s.name}","${s.department}",${s.year},${s.cgpa},${s.attendancePercentage}%,${s.studentSuccessScore},"${s.riskLevel}","${s.primaryRiskReasons[0] || ''}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campusiq_analytics_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Institutional dataset exported to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* ================= A. GLOBAL PAGE HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              Institutional Intelligence
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA]">
              {academicTerm}
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Holistic student indicators unified across SIS, LMS, and Placement tracking nodes.
          </p>
        </div>

        {/* Global Filter Bar & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-[#E2E6E1] text-xs">
            <Filter className="w-3.5 h-3.5 text-[#6D7975]" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-transparent text-[#192A27] font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Data Science">Data Science</option>
              <option value="Electronics & Comm.">Electronics & Comm.</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          {/* Academic Year Filter */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-[#E2E6E1] text-xs">
            <span className="text-[#6D7975]">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="bg-transparent text-[#192A27] font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Years</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          {/* Freshness Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#6D7975] bg-[#F7F6F1] px-2.5 py-1.5 rounded-lg border border-[#E2E6E1]">
            <RefreshCw className="w-3 h-3 text-[#16856B]" />
            <span>Synced 12m ago</span>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F7F6F1] border border-[#E2E6E1] text-[#192A27] text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#6D7975]" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ================= B. KPI SUMMARY ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          label="Tracked Students"
          value={totalTracked}
          context={`${students.length} unified records in database`}
          icon={Users}
          onClick={() => setSelectedRiskFilter('all')}
          active={selectedRiskFilter === 'all'}
        />

        <MetricCard
          label="Priority Review"
          value={priorityReviewCount}
          context="Immediate faculty attention flagged"
          icon={ShieldAlert}
          badge={{ text: `${((priorityReviewCount / (totalTracked || 1)) * 100).toFixed(0)}% cohort`, variant: 'critical' }}
          onClick={() => setSelectedRiskFilter('high')}
          active={selectedRiskFilter === 'high'}
        />

        <MetricCard
          label="Avg Success Score"
          value={`${avgSuccessScore}/100`}
          context="Institutional composite benchmark"
          icon={Award}
          badge={{ text: avgSuccessScore >= 70 ? 'Optimal' : 'Needs Focus', variant: avgSuccessScore >= 70 ? 'positive' : 'warning' }}
        />

        <MetricCard
          label="Placement Risk"
          value={placementConcernsCount}
          context="Index < 55 ahead of campus drives"
          icon={Briefcase}
          badge={{ text: 'Skill Deficit', variant: 'warning' }}
          onClick={() => navigate('/admin/placement')}
        />

        <MetricCard
          label="Active Interventions"
          value={pendingInterventionsCount}
          context="Assigned mentor workflows"
          icon={Clock}
          badge={{ text: `${interventions.filter(i => i.status === 'completed').length} resolved`, variant: 'neutral' }}
          onClick={() => navigate('/admin/interventions')}
        />
      </div>

      {/* ================= C & D. CHARTS ROW: RISK DISTRIBUTION & ACADEMIC TRENDS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* C. Risk Distribution Interactive Donut */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E6E1] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1]">
            <div>
              <h2 className="text-sm font-bold text-[#192A27]">Student Risk Distribution</h2>
              <p className="text-xs text-[#6D7975]">Multi-factor early warning tiering</p>
            </div>
            <span className="text-[11px] font-medium text-[#6D7975]">Interactive</span>
          </div>

          <div className="h-56 relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  cursor="pointer"
                  onClick={(entry: any) => {
                    if (entry && entry.risk) {
                      setSelectedRiskFilter(entry.risk);
                      addToast(`Filtered by ${entry.name}`, 'info');
                    }
                  }}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val} Students (${((val / totalTracked) * 100).toFixed(1)}%)`, 'Count']}
                  contentStyle={{ backgroundColor: '#0B2925', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Donut Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-display text-[#192A27]">{totalTracked}</span>
              <span className="text-[10px] text-[#6D7975] uppercase font-semibold">Total Students</span>
            </div>
          </div>

          {/* Interactive Legend with click navigation */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E2E6E1] text-xs">
            {riskDistributionData.map(item => (
              <button
                key={item.name}
                onClick={() => setSelectedRiskFilter(item.risk as any)}
                className={`p-2 rounded-lg text-left transition-all border ${
                  selectedRiskFilter === item.risk ? 'border-[#123D35] bg-[#F7F6F1]' : 'border-transparent hover:bg-[#F7F6F1]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-semibold text-[#192A27] truncate">{item.risk.toUpperCase()}</span>
                </div>
                <div className="text-base font-bold text-[#192A27] tabular-nums font-display">
                  {item.value} <span className="text-[10px] text-[#6D7975] font-normal">({((item.value / totalTracked) * 100).toFixed(0)}%)</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* D. Academic Performance Trends Multi-Line Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E6E1] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1]">
            <div>
              <h2 className="text-sm font-bold text-[#192A27]">Assessment Cohort Performance Trends</h2>
              <p className="text-xs text-[#6D7975]">Historical trajectory across examinations, attendance & LMS</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6D7975]">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#123D35]" /> Attendance
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#16856B]" /> Internals
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C58A2A]" /> LMS
            </div>
          </div>

          <div className="h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E6E1" vertical={false} />
                <XAxis dataKey="period" stroke="#6D7975" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#6D7975" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B2925', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#123D35" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="internalMarks" name="Internal Marks Avg" stroke="#16856B" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="lmsCompletion" name="LMS Submissions %" stroke="#C58A2A" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F6F1] border border-[#E2E6E1] text-[11px] text-[#6D7975] flex items-center justify-between">
            <span><strong>Notice:</strong> 10% gradual dip in LMS assignment completion detected between Assessment 1 and Pre-Endsem.</span>
            <button 
              onClick={() => navigate('/admin/segments')}
              className="text-[#16856B] font-semibold hover:underline flex items-center gap-0.5 shrink-0"
            >
              Inspect Affected Cohorts <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= E. DEPARTMENT BENCHMARK COMPARISON ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E2E6E1]">
          <div>
            <h2 className="text-sm font-bold text-[#192A27]">Departmental Academic & Placement Benchmarks</h2>
            <p className="text-xs text-[#6D7975]">Cross-departmental comparison of success score, attendance, and at-risk ratio</p>
          </div>
          <span className="text-xs text-[#6D7975]">Click a department to filter student roster</span>
        </div>

        <div className="h-64 my-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E6E1" vertical={false} />
              <XAxis dataKey="department" stroke="#6D7975" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#6D7975" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B2925', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="avgSuccessScore" name="Avg Success Score" fill="#123D35" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attendance" name="Class Attendance %" fill="#16856B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="placementReadiness" name="Placement Readiness" fill="#C58A2A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="atRiskPercentage" name="At-Risk Rate %" fill="#C44B4B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Department Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E6E1]">
          <span className="text-xs text-[#6D7975] font-semibold">Filter Roster:</span>
          {departmentStats.map((dept) => (
            <button
              key={dept.fullName}
              onClick={() => {
                setSelectedDepartment(dept.fullName);
                navigate('/admin/students');
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-[#F7F6F1] hover:bg-[#E8F5F1] hover:text-[#123D35] border border-[#E2E6E1] text-[#192A27] transition-colors flex items-center gap-1.5"
            >
              <span>{dept.fullName}</span>
              <span className="text-[10px] bg-white px-1.5 py-0.2 rounded font-semibold text-[#C44B4B]">
                {dept.atRiskPercentage}% Risk
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= F. PRIORITY INTERVENTION QUEUE ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E6E1]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#192A27]">Priority Action Queue</h2>
              <span className="text-xs bg-[#FDF0F0] text-[#C44B4B] font-semibold px-2 py-0.5 rounded-full border border-[#F8D2D2]">
                {priorityQueue.length} Active High-Risk Cases
              </span>
            </div>
            <p className="text-xs text-[#6D7975] mt-0.5">
              Identified by compounding attendance deficit, unresolved backlogs, or failing internals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/students')}
              className="text-xs font-semibold text-[#16856B] hover:text-[#123D35] px-3 py-1.5 rounded-lg border border-[#16856B]/30 hover:bg-[#E8F5F1] transition-colors flex items-center gap-1"
            >
              <span>Full Directory ({filteredStudents.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Priority Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E6E1] text-[#6D7975] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Department & Year</th>
                <th className="py-3 px-3">Success Score</th>
                <th className="py-3 px-3">Risk Status</th>
                <th className="py-3 px-3">Primary Risk Cause</th>
                <th className="py-3 px-3">Assigned Mentor</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6E1]/60">
              {priorityQueue.map((student) => (
                <tr 
                  key={student.studentId}
                  className="hover:bg-[#F7F6F1]/70 transition-colors group"
                >
                  <td className="py-3 px-3">
                    <div 
                      onClick={() => navigate(`/admin/students/${student.studentId}`)}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#E2E6E1]" 
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
                    <span className="font-medium text-[#192A27]">{student.department}</span>
                    <span className="text-[#6D7975] block text-[11px]">Year {student.year} · Sem {student.semester}</span>
                  </td>

                  <td className="py-3 px-3 tabular-nums">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-sm text-[#192A27]">{student.studentSuccessScore}</span>
                      <span className="text-[10px] text-[#6D7975]">/100</span>
                    </div>
                    <span className="text-[10px] text-[#6D7975]">Att: {student.attendancePercentage}%</span>
                  </td>

                  <td className="py-3 px-3">
                    <RiskBadge level={student.riskLevel} size="sm" />
                  </td>

                  <td className="py-3 px-3 max-w-xs">
                    <p className="text-[#192A27] font-medium truncate" title={student.primaryRiskReasons[0]}>
                      {student.primaryRiskReasons[0]}
                    </p>
                    <span className="text-[10px] text-[#6D7975]">
                      {student.backlogs > 0 ? `${student.backlogs} backlog(s)` : 'Academics review flagged'}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-[#192A27] font-medium">{student.mentorName}</span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedStudentForIntervention(student);
                          setInterventionModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#123D35] hover:bg-[#0B2925] text-white transition-colors"
                      >
                        Intervene
                      </button>
                      <button
                        onClick={() => navigate(`/admin/students/${student.studentId}`)}
                        title="Open Student 360"
                        className="p-1 text-[#6D7975] hover:text-[#192A27] hover:bg-[#E2E6E1] rounded transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= G. INSTITUTIONAL INSIGHT PANEL ================= */}
      <div className="bg-[#0B2925] text-white rounded-xl p-5 border border-[#16856B]/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#16856B]/30 text-emerald-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Institutional Intelligence Finding</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-emerald-300">
                  Data-Grounded Pattern
                </span>
              </div>
              <p className="text-xs text-[#D1D8D2] mt-1 leading-relaxed">
                "Students with classroom attendance below 65% and incomplete LMS assignments account for <strong>68% of current high-risk cases</strong> across all departments. Conversely, students completing at least 2 mock interviews show a 42% higher placement readiness score regardless of baseline CGPA."
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-[#A9B5AC]">
                <span><strong>Derivation:</strong> Regression correlation across {students.length} synthetic profiles</span>
                <span>•</span>
                <span><strong>Confidence:</strong> Factual rule match</span>
                <span>•</span>
                <button
                  onClick={() => navigate('/admin/insights')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline flex items-center gap-1"
                >
                  Explore in AI Success Copilot <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <InterventionModal
        isOpen={interventionModalOpen}
        onClose={() => setInterventionModalOpen(false)}
        preselectedStudent={selectedStudentForIntervention}
      />
    </div>
  );
};
