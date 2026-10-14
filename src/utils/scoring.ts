import { Student, ScoreFactorBreakdown, RiskLevel, SubjectGrade } from '../types';

export interface RawStudentInput {
  studentId: string;
  name: string;
  email: string;
  department: string;
  year: number;
  semester: number;
  cgpa: number;
  internalMarks: number;
  backlogs: number;
  attendancePercentage: number;
  lmsLoginFrequency: number;
  assignmentCompletionPercentage: number;
  engagementScore: number;
  codingScore: number;
  aptitudeScore: number;
  technicalSkillsScore: number;
  communicationScore: number;
  mockInterviewsCompleted: number;
  feedbackScore: number;
  mentorId: string;
  mentorName: string;
  avatar: string;
  historicalTrends?: Array<{ term: string; attendance: number; internalMarks: number; lmsCompletion: number }>;
  subjectPerformance?: Array<{ code: string; subject: string; marks: number; attendance: number; status: 'good' | 'average' | 'critical' }>;
}

export const SCORING_WEIGHTS = {
  academic: 0.30,
  attendance: 0.20,
  lms: 0.15,
  skills: 0.15,
  placement: 0.15,
  engagement: 0.05,
};

export const PLACEMENT_WEIGHTS = {
  coding: 0.30,
  technical: 0.25,
  aptitude: 0.20,
  communication: 0.15,
  interviews: 0.10,
};

/**
 * Calculates deterministic Placement Readiness Score (0-100) and breakdown
 */
export function calculatePlacementReadiness(input: RawStudentInput): {
  score: number;
  breakdown: ScoreFactorBreakdown[];
} {
  // Normalize mock interviews: 5 or more interviews = 100%
  const normalizedInterviews = Math.min(100, (input.mockInterviewsCompleted / 4) * 100);

  const breakdown: ScoreFactorBreakdown[] = [
    {
      factor: 'Coding Proficiency',
      score: Math.round(input.codingScore),
      weight: PLACEMENT_WEIGHTS.coding * 100,
      contribution: Number(((input.codingScore * PLACEMENT_WEIGHTS.coding)).toFixed(1)),
      maxContribution: PLACEMENT_WEIGHTS.coding * 100,
      status: input.codingScore >= 70 ? 'good' : input.codingScore >= 50 ? 'warning' : 'critical',
      detail: `Algorithmic problem solving and hands-on coding tests (${input.codingScore}/100)`,
    },
    {
      factor: 'Technical Core Knowledge',
      score: Math.round(input.technicalSkillsScore),
      weight: PLACEMENT_WEIGHTS.technical * 100,
      contribution: Number(((input.technicalSkillsScore * PLACEMENT_WEIGHTS.technical)).toFixed(1)),
      maxContribution: PLACEMENT_WEIGHTS.technical * 100,
      status: input.technicalSkillsScore >= 70 ? 'good' : input.technicalSkillsScore >= 50 ? 'warning' : 'critical',
      detail: `Departmental domain & architectural fundamentals (${input.technicalSkillsScore}/100)`,
    },
    {
      factor: 'Aptitude & Logical Reasoning',
      score: Math.round(input.aptitudeScore),
      weight: PLACEMENT_WEIGHTS.aptitude * 100,
      contribution: Number(((input.aptitudeScore * PLACEMENT_WEIGHTS.aptitude)).toFixed(1)),
      maxContribution: PLACEMENT_WEIGHTS.aptitude * 100,
      status: input.aptitudeScore >= 70 ? 'good' : input.aptitudeScore >= 50 ? 'warning' : 'critical',
      detail: `Quantitative ability, logic, and analytical speed (${input.aptitudeScore}/100)`,
    },
    {
      factor: 'Communication & Professionalism',
      score: Math.round(input.communicationScore),
      weight: PLACEMENT_WEIGHTS.communication * 100,
      contribution: Number(((input.communicationScore * PLACEMENT_WEIGHTS.communication)).toFixed(1)),
      maxContribution: PLACEMENT_WEIGHTS.communication * 100,
      status: input.communicationScore >= 70 ? 'good' : input.communicationScore >= 50 ? 'warning' : 'critical',
      detail: `Verbal articulation, presentation, and clarity (${input.communicationScore}/100)`,
    },
    {
      factor: 'Mock Interview Performance',
      score: Math.round(normalizedInterviews),
      weight: PLACEMENT_WEIGHTS.interviews * 100,
      contribution: Number(((normalizedInterviews * PLACEMENT_WEIGHTS.interviews)).toFixed(1)),
      maxContribution: PLACEMENT_WEIGHTS.interviews * 100,
      status: normalizedInterviews >= 75 ? 'good' : normalizedInterviews >= 40 ? 'warning' : 'critical',
      detail: `${input.mockInterviewsCompleted} mock interview(s) completed`,
    },
  ];

  const total = breakdown.reduce((sum, item) => sum + item.contribution, 0);
  return {
    score: Number(Math.min(100, Math.max(0, total)).toFixed(1)),
    breakdown,
  };
}

/**
 * Calculates explainable Student Success Score (0-100), risk flags, and factors
 */
export function calculateStudentSuccessScore(input: RawStudentInput): {
  successScore: number;
  placementScore: number;
  riskLevel: RiskLevel;
  primaryRiskReasons: string[];
  scoreBreakdown: ScoreFactorBreakdown[];
  placementBreakdown: ScoreFactorBreakdown[];
  strengths: string[];
  improvementAreas: string[];
} {
  // 1. Normalized Academic Indicator (50% CGPA scaled to 100, 50% internal marks)
  const normalizedCgpa = (input.cgpa / 10) * 100;
  const academicScore = Math.min(100, Math.max(0, (normalizedCgpa * 0.5) + (input.internalMarks * 0.5)));

  // 2. Normalized Attendance Indicator
  const attendanceScore = Math.min(100, Math.max(0, input.attendancePercentage));

  // 3. LMS Engagement: 60% assignment completion, 40% login frequency normalized (10 logins/week = 100%)
  const normalizedLoginFreq = Math.min(100, (input.lmsLoginFrequency / 10) * 100);
  const lmsScore = Math.min(100, Math.max(0, (input.assignmentCompletionPercentage * 0.6) + (normalizedLoginFreq * 0.4)));

  // 4. Skills assessment (average of coding and tech skills)
  const skillsScore = Math.min(100, Math.max(0, (input.codingScore + input.technicalSkillsScore) / 2));

  // 5. Placement readiness
  const placementResult = calculatePlacementReadiness(input);
  const placementScore = placementResult.score;

  // 6. Extracurricular & feedback
  const engagementScore = Math.min(100, Math.max(0, (input.engagementScore * 0.5) + (input.feedbackScore * 0.5)));

  const breakdown: ScoreFactorBreakdown[] = [
    {
      factor: 'Academic Performance',
      score: Math.round(academicScore),
      weight: SCORING_WEIGHTS.academic * 100,
      contribution: Number(((academicScore * SCORING_WEIGHTS.academic)).toFixed(1)),
      maxContribution: SCORING_WEIGHTS.academic * 100,
      status: academicScore >= 70 ? 'good' : academicScore >= 50 ? 'warning' : 'critical',
      detail: `CGPA ${input.cgpa}/10.0 and internal marks average ${input.internalMarks}%`,
    },
    {
      factor: 'Classroom Attendance',
      score: Math.round(attendanceScore),
      weight: SCORING_WEIGHTS.attendance * 100,
      contribution: Number(((attendanceScore * SCORING_WEIGHTS.attendance)).toFixed(1)),
      maxContribution: SCORING_WEIGHTS.attendance * 100,
      status: attendanceScore >= 75 ? 'good' : attendanceScore >= 65 ? 'warning' : 'critical',
      detail: `${input.attendancePercentage}% verified lecture & laboratory attendance`,
    },
    {
      factor: 'LMS Engagement',
      score: Math.round(lmsScore),
      weight: SCORING_WEIGHTS.lms * 100,
      contribution: Number(((lmsScore * SCORING_WEIGHTS.lms)).toFixed(1)),
      maxContribution: SCORING_WEIGHTS.lms * 100,
      status: lmsScore >= 70 ? 'good' : lmsScore >= 50 ? 'warning' : 'critical',
      detail: `${input.assignmentCompletionPercentage}% assignments submitted, ${input.lmsLoginFrequency} active sessions/wk`,
    },
    {
      factor: 'Skills & Practical Coding',
      score: Math.round(skillsScore),
      weight: SCORING_WEIGHTS.skills * 100,
      contribution: Number(((skillsScore * SCORING_WEIGHTS.skills)).toFixed(1)),
      maxContribution: SCORING_WEIGHTS.skills * 100,
      status: skillsScore >= 70 ? 'good' : skillsScore >= 50 ? 'warning' : 'critical',
      detail: `Coding benchmark ${input.codingScore}% and core technical index ${input.technicalSkillsScore}%`,
    },
    {
      factor: 'Placement Readiness',
      score: Math.round(placementScore),
      weight: SCORING_WEIGHTS.placement * 100,
      contribution: Number(((placementScore * SCORING_WEIGHTS.placement)).toFixed(1)),
      maxContribution: SCORING_WEIGHTS.placement * 100,
      status: placementScore >= 65 ? 'good' : placementScore >= 50 ? 'warning' : 'critical',
      detail: `Holistic placement index across aptitude, interviews, and communication`,
    },
    {
      factor: 'Campus Engagement & Feedback',
      score: Math.round(engagementScore),
      weight: SCORING_WEIGHTS.engagement * 100,
      contribution: Number(((engagementScore * SCORING_WEIGHTS.engagement)).toFixed(1)),
      maxContribution: SCORING_WEIGHTS.engagement * 100,
      status: engagementScore >= 60 ? 'good' : 'warning',
      detail: `Faculty feedback rating and participation in institutional seminars`,
    },
  ];

  const totalCalculated = breakdown.reduce((sum, item) => sum + item.contribution, 0);
  const successScore = Number(Math.min(100, Math.max(0, totalCalculated)).toFixed(1));

  // Determine Primary Risk Reasons (Factual, grounded in metrics)
  const primaryRiskReasons: string[] = [];
  const strengths: string[] = [];
  const improvementAreas: string[] = [];

  if (input.attendancePercentage < 65) {
    primaryRiskReasons.push(`Critical attendance deficit (${input.attendancePercentage}% vs required 75%)`);
    improvementAreas.push('Classroom attendance requires mandatory remediation');
  } else if (input.attendancePercentage < 75) {
    primaryRiskReasons.push(`Attendance borderline (${input.attendancePercentage}% — risk of condonation)`);
  } else {
    strengths.push(`Consistent classroom attendance record (${input.attendancePercentage}%)`);
  }

  if (input.backlogs > 0) {
    primaryRiskReasons.push(`${input.backlogs} unresolved semester backlog(s)`);
    improvementAreas.push('Backlog clearance exam preparation');
  }

  if (input.internalMarks < 50) {
    primaryRiskReasons.push(`Low internal assessment marks (${input.internalMarks}%)`);
    improvementAreas.push('Continuous internal assessment performance');
  } else if (input.internalMarks >= 80) {
    strengths.push(`Strong internal examination grades (${input.internalMarks}%)`);
  }

  if (input.assignmentCompletionPercentage < 50) {
    primaryRiskReasons.push(`Severe LMS backlog (${input.assignmentCompletionPercentage}% assignments completed)`);
    improvementAreas.push('Timely LMS course submissions');
  } else if (input.assignmentCompletionPercentage >= 85) {
    strengths.push(`Reliable assignment submission discipline (${input.assignmentCompletionPercentage}%)`);
  }

  if (input.codingScore < 45 && ['Computer Science', 'Information Technology', 'Data Science'].includes(input.department)) {
    primaryRiskReasons.push(`Low competitive coding benchmark (${input.codingScore}/100)`);
    improvementAreas.push('Data structures and algorithm problem practice');
  } else if (input.codingScore >= 75) {
    strengths.push(`High competitive coding benchmark (${input.codingScore}/100)`);
  }

  if (input.mockInterviewsCompleted === 0) {
    primaryRiskReasons.push('Zero placement mock interviews recorded');
    improvementAreas.push('Participation in campus mock interviews');
  }

  if (academicScore >= 75 && placementScore < 55) {
    primaryRiskReasons.push('Academic-to-placement disconnect (Strong grades, low campus readiness)');
  }

  // Risk Classification Rules with Critical Thresholds
  let riskLevel: RiskLevel = 'low';

  if (successScore < 50 || input.attendancePercentage < 60 || input.backlogs >= 2 || (input.attendancePercentage < 68 && input.internalMarks < 50)) {
    riskLevel = 'high';
  } else if (successScore < 70 || input.attendancePercentage < 75 || input.backlogs === 1 || input.assignmentCompletionPercentage < 60) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  if (primaryRiskReasons.length === 0) {
    primaryRiskReasons.push('Standard academic monitoring, on track for placement');
  }

  return {
    successScore,
    placementScore,
    riskLevel,
    primaryRiskReasons,
    scoreBreakdown: breakdown,
    placementBreakdown: placementResult.breakdown,
    strengths: strengths.slice(0, 3),
    improvementAreas: improvementAreas.slice(0, 3),
  };
}

export function enrichStudentData(raw: RawStudentInput): Student {
  const calculations = calculateStudentSuccessScore(raw);

  const defaultTrends = [
    { term: 'Term 1', attendance: Math.min(100, raw.attendancePercentage + 6), internalMarks: Math.min(100, raw.internalMarks + 4), lmsCompletion: Math.min(100, raw.assignmentCompletionPercentage + 8) },
    { term: 'Mid-Term', attendance: raw.attendancePercentage, internalMarks: raw.internalMarks, lmsCompletion: raw.assignmentCompletionPercentage },
    { term: 'Pre-Endsem', attendance: Math.max(40, raw.attendancePercentage - (raw.attendancePercentage < 65 ? 8 : 2)), internalMarks: Math.max(35, raw.internalMarks - (raw.internalMarks < 60 ? 6 : 1)), lmsCompletion: Math.max(40, raw.assignmentCompletionPercentage - 4) },
  ];

  const defaultSubjects: SubjectGrade[] = [
    { code: 'CS301', subject: 'Data Structures & Algorithms', marks: raw.codingScore, attendance: raw.attendancePercentage, status: raw.codingScore >= 70 ? 'good' : raw.codingScore >= 50 ? 'average' : 'critical' },
    { code: 'CS302', subject: 'Database Management Systems', marks: Math.min(100, raw.internalMarks + 5), attendance: Math.min(100, raw.attendancePercentage + 2), status: raw.internalMarks >= 65 ? 'good' : 'average' },
    { code: 'CS303', subject: 'Operating Systems & Networks', marks: Math.max(30, raw.internalMarks - 5), attendance: Math.max(45, raw.attendancePercentage - 6), status: raw.internalMarks - 5 >= 60 ? 'good' : 'critical' },
    { code: 'MA301', subject: 'Applied Discrete Mathematics', marks: raw.aptitudeScore, attendance: raw.attendancePercentage, status: raw.aptitudeScore >= 65 ? 'good' : 'average' },
  ];

  return {
    ...raw,
    historicalTrends: raw.historicalTrends || defaultTrends,
    subjectPerformance: raw.subjectPerformance || defaultSubjects,
    studentSuccessScore: calculations.successScore,
    placementReadinessScore: calculations.placementScore,
    riskLevel: calculations.riskLevel,
    primaryRiskReasons: calculations.primaryRiskReasons,
    scoreBreakdown: calculations.scoreBreakdown,
    placementBreakdown: calculations.placementBreakdown,
    strengths: calculations.strengths,
    improvementAreas: calculations.improvementAreas,
  };
}
