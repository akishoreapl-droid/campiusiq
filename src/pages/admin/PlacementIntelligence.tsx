import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { Student } from '../../types';
import { 
  Briefcase, 
  Code, 
  Award, 
  TrendingUp, 
  Search, 
  Filter, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

export const PlacementIntelligence: React.FC = () => {
  const { filteredStudents, navigate, setSelectedDepartment, selectedDepartment } = useApp();

  const [activeQuadrant, setActiveQuadrant] = useState<'all' | 'high_high' | 'high_low' | 'low_high' | 'low_low'>('high_low'); // default to highlighting the critical disconnect

  // Quadrant classification:
  // Academic threshold: CGPA >= 7.5 (or internal marks >= 70)
  // Placement threshold: Placement Score >= 60
  const categorized = useMemo(() => {
    const highHigh: Student[] = []; // Strong Academics, High Placement (Campus Stars)
    const highLow: Student[] = [];  // Strong Academics, Low Placement (The Disconnect)
    const lowHigh: Student[] = [];  // Low Academics, High Placement (Practical Experts)
    const lowLow: Student[] = [];   // Low Academics, Low Placement (Compound Support)

    filteredStudents.forEach(s => {
      const isHighAcad = s.cgpa >= 7.5;
      const isHighPlace = s.placementReadinessScore >= 60;

      if (isHighAcad && isHighPlace) highHigh.push(s);
      else if (isHighAcad && !isHighPlace) highLow.push(s);
      else if (!isHighAcad && isHighPlace) lowHigh.push(s);
      else lowLow.push(s);
    });

    return { highHigh, highLow, lowHigh, lowLow };
  }, [filteredStudents]);

  // Scatter chart data
  const scatterData = useMemo(() => {
    return filteredStudents.map(s => ({
      id: s.studentId,
      name: s.name,
      cgpa: s.cgpa,
      academicScaled: Number(((s.cgpa / 10) * 100).toFixed(1)),
      placementScore: s.placementReadinessScore,
      codingScore: s.codingScore,
      department: s.department,
      riskLevel: s.riskLevel,
    }));
  }, [filteredStudents]);

  const displayedCohort = useMemo(() => {
    if (activeQuadrant === 'high_high') return categorized.highHigh;
    if (activeQuadrant === 'high_low') return categorized.highLow;
    if (activeQuadrant === 'low_high') return categorized.lowHigh;
    if (activeQuadrant === 'low_low') return categorized.lowLow;
    return filteredStudents;
  }, [activeQuadrant, categorized, filteredStudents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              Placement Readiness & Employability Matrix
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA]">
              4-Quadrant Analysis
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Identify the Academic-to-Placement Disconnect and deploy focused coding & interview bootcamps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Data Science">Data Science</option>
            <option value="Electronics & Comm.">Electronics & Comm.</option>
            <option value="Mechanical">Mechanical</option>
          </select>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          label="Strong Academics, High Skills"
          value={categorized.highHigh.length}
          context="Tier-1 placement ready (CGPA ≥ 7.5, Place ≥ 60)"
          icon={CheckCircle2}
          badge={{ text: 'Core Ready', variant: 'positive' }}
          onClick={() => setActiveQuadrant('high_high')}
          active={activeQuadrant === 'high_high'}
        />

        <MetricCard
          label="Strong Academics, Low Skills"
          value={categorized.highLow.length}
          context="Urgent bootcamp target (High CGPA, Low Coding)"
          icon={AlertTriangle}
          badge={{ text: 'Skill Deficit', variant: 'warning' }}
          onClick={() => setActiveQuadrant('high_low')}
          active={activeQuadrant === 'high_low'}
        />

        <MetricCard
          label="Lower Academics, High Skills"
          value={categorized.lowHigh.length}
          context="Hands-on coders needing coursework support"
          icon={Code}
          badge={{ text: 'Practical', variant: 'neutral' }}
          onClick={() => setActiveQuadrant('low_high')}
          active={activeQuadrant === 'low_high'}
        />

        <MetricCard
          label="Compound Risk Cohort"
          value={categorized.lowLow.length}
          context="Dual deficit: Academic & Placement support"
          icon={Briefcase}
          badge={{ text: 'Critical', variant: 'critical' }}
          onClick={() => setActiveQuadrant('low_low')}
          active={activeQuadrant === 'low_low'}
        />
      </div>

      {/* ================= 4-QUADRANT SCATTER CHART & MATRIX ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scatter Plot */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E2E6E1] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1]">
            <div>
              <h2 className="text-sm font-bold text-[#192A27]">Academic CGPA vs Placement Readiness Matrix</h2>
              <p className="text-xs text-[#6D7975]">Thresholds: 7.5 CGPA (75%) and 60 Placement Index</p>
            </div>
            <span className="text-[11px] text-[#16856B] bg-[#E8F5F1] px-2 py-0.5 rounded font-medium">
              Click dots to view student
            </span>
          </div>

          <div className="h-72 my-3">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E6E1" />
                <XAxis 
                  type="number" 
                  dataKey="academicScaled" 
                  name="Academic Score (Scaled CGPA)" 
                  domain={[40, 100]} 
                  stroke="#6D7975"
                  fontSize={11}
                  label={{ value: 'Academic Performance (CGPA %)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#6D7975' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="placementScore" 
                  name="Placement Readiness" 
                  domain={[20, 100]} 
                  stroke="#6D7975"
                  fontSize={11}
                  label={{ value: 'Placement Readiness Index', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#6D7975' }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-[#0B2925] text-white rounded-lg text-xs shadow-lg space-y-1">
                        <p className="font-bold">{data.name} ({data.id})</p>
                        <p className="text-[#A9B5AC]">{data.department}</p>
                        <p>CGPA: <strong>{data.cgpa}/10.0</strong> ({data.academicScaled}%)</p>
                        <p>Placement Score: <strong>{data.placementScore}/100</strong></p>
                        <p>Coding Test: <strong>{data.codingScore}/100</strong></p>
                        <p className="text-[10px] text-emerald-300">Click dot to inspect 360° profile</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={75} stroke="#123D35" strokeDasharray="4 4" label={{ value: 'CGPA 7.5', fill: '#123D35', fontSize: 10, position: 'top' }} />
                <ReferenceLine y={60} stroke="#C58A2A" strokeDasharray="4 4" label={{ value: 'Placement 60', fill: '#C58A2A', fontSize: 10, position: 'right' }} />
                <Scatter 
                  name="Students" 
                  data={scatterData} 
                  fill="#16856B"
                  onClick={(node: any) => {
                    if (node && node.id) {
                      navigate(`/admin/students/${node.id}`);
                    }
                  }}
                  cursor="pointer"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#E2E6E1] text-[11px]">
            <div className="p-2 rounded bg-[#EBF7F1] text-[#27845B]">
              <strong>Top Right:</strong> Core Ready ({categorized.highHigh.length})
            </div>
            <div className="p-2 rounded bg-[#FBF4E8] text-[#C58A2A]">
              <strong>Bottom Right:</strong> High Acad, Low Place ({categorized.highLow.length})
            </div>
            <div className="p-2 rounded bg-[#F7F6F1] text-[#192A27]">
              <strong>Top Left:</strong> Practical Coders ({categorized.lowHigh.length})
            </div>
            <div className="p-2 rounded bg-[#FDF0F0] text-[#C44B4B]">
              <strong>Bottom Left:</strong> Compound Risk ({categorized.lowLow.length})
            </div>
          </div>
        </div>

        {/* Quadrant Action Strategy Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E2E6E1] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E6E1] mb-3">
              <Sparkles className="w-4 h-4 text-[#16856B]" />
              <h3 className="text-sm font-bold text-[#192A27]">Active Strategic Focus</h3>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => setActiveQuadrant('high_low')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeQuadrant === 'high_low' 
                    ? 'border-[#C58A2A] bg-[#FBF4E8] ring-1 ring-[#C58A2A]' 
                    : 'border-[#E2E6E1] hover:bg-[#F7F6F1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#192A27]">High Academics, Low Placement</span>
                  <span className="text-xs font-bold font-display text-[#C58A2A]">{categorized.highLow.length}</span>
                </div>
                <p className="text-[11px] text-[#6D7975] leading-relaxed">
                  Students excel in theory examinations but fail automated competitive coding test filters.
                </p>
                <span className="mt-2 inline-block text-[10px] font-semibold text-[#C58A2A]">
                  Strategy: DSA Bootcamp + 2 Mock Interviews
                </span>
              </div>

              <div 
                onClick={() => setActiveQuadrant('high_high')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeQuadrant === 'high_high' 
                    ? 'border-[#27845B] bg-[#EBF7F1] ring-1 ring-[#27845B]' 
                    : 'border-[#E2E6E1] hover:bg-[#F7F6F1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#192A27]">Campus Stars (Core Ready)</span>
                  <span className="text-xs font-bold font-display text-[#27845B]">{categorized.highHigh.length}</span>
                </div>
                <p className="text-[11px] text-[#6D7975] leading-relaxed">
                  Highest placement probability. Ready for Tier-1 dream company technical rounds.
                </p>
                <span className="mt-2 inline-block text-[10px] font-semibold text-[#27845B]">
                  Strategy: Fast-track to marquee recruiters
                </span>
              </div>

              <div 
                onClick={() => setActiveQuadrant('low_low')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeQuadrant === 'low_low' 
                    ? 'border-[#C44B4B] bg-[#FDF0F0] ring-1 ring-[#C44B4B]' 
                    : 'border-[#E2E6E1] hover:bg-[#F7F6F1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#192A27]">Compound Risk Tier</span>
                  <span className="text-xs font-bold font-display text-[#C44B4B]">{categorized.lowLow.length}</span>
                </div>
                <p className="text-[11px] text-[#6D7975] leading-relaxed">
                  Dual deficit in coursework tests and employability metrics. Requires comprehensive support.
                </p>
                <span className="mt-2 inline-block text-[10px] font-semibold text-[#C44B4B]">
                  Strategy: Multi-department recovery committee
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveQuadrant('all')}
            className="w-full mt-3 py-2 text-xs font-medium text-[#6D7975] hover:text-[#192A27] hover:bg-[#F7F6F1] rounded-lg border border-[#E2E6E1]"
          >
            Show All Quadrants ({filteredStudents.length})
          </button>
        </div>
      </div>

      {/* ================= FILTERED COHORT TABLE ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1] mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#192A27]">
              Selected Cohort: {activeQuadrant === 'high_low' ? 'High Academics, Low Placement' : activeQuadrant === 'high_high' ? 'Core Ready Stars' : activeQuadrant === 'low_low' ? 'Compound Risk' : 'All Students'}
            </h3>
            <p className="text-xs text-[#6D7975]">Displaying {displayedCohort.length} students matching active quadrant criteria</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E6E1] text-[#6D7975] uppercase text-[10px] font-semibold">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Placement Index</th>
                <th className="py-2.5 px-3">Coding Score</th>
                <th className="py-2.5 px-3">Mock Interviews</th>
                <th className="py-2.5 px-3">Risk Status</th>
                <th className="py-2.5 px-3 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6E1]/60">
              {displayedCohort.slice(0, 10).map((student) => (
                <tr key={student.studentId} className="hover:bg-[#F7F6F1]/60">
                  <td className="py-2.5 px-3">
                    <span 
                      onClick={() => navigate(`/admin/students/${student.studentId}`)}
                      className="font-bold text-[#192A27] hover:text-[#16856B] cursor-pointer block"
                    >
                      {student.name}
                    </span>
                    <span className="text-[10px] text-[#6D7975] font-mono">{student.studentId}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#192A27]">{student.department}</td>
                  <td className="py-2.5 px-3 tabular-nums font-bold text-[#192A27]">{student.cgpa.toFixed(2)}</td>
                  <td className="py-2.5 px-3 tabular-nums font-bold text-[#123D35]">{student.placementReadinessScore}/100</td>
                  <td className="py-2.5 px-3 tabular-nums">
                    <span className={student.codingScore < 45 ? 'text-[#C44B4B] font-bold' : 'text-[#192A27]'}>
                      {student.codingScore}/100
                    </span>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-[#192A27]">
                    {student.mockInterviewsCompleted} completed
                  </td>
                  <td className="py-2.5 px-3">
                    <RiskBadge level={student.riskLevel} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => navigate(`/admin/students/${student.studentId}`)}
                      className="p-1 text-[#6D7975] hover:text-[#16856B]"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
