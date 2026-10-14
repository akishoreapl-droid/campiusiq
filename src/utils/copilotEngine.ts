import { Student, CopilotMessage } from '../types';

export function processCopilotQuery(
  query: string,
  students: Student[],
  selectedStudentId?: string
): Omit<CopilotMessage, 'id' | 'sender' | 'timestamp'> {
  const q = query.toLowerCase().trim();

  // 1. "Which students require priority academic review?"
  if (q.includes('priority') || q.includes('academic review') || (q.includes('require') && q.includes('review'))) {
    const priorityStudents = students
      .filter(s => s.riskLevel === 'high' || s.backlogs > 1 || (s.attendancePercentage < 65 && s.internalMarks < 50))
      .sort((a, b) => a.studentSuccessScore - b.studentSuccessScore);

    const affected = priorityStudents.slice(0, 5).map(s => ({
      id: s.studentId,
      name: s.name,
      dept: s.department,
      score: s.studentSuccessScore,
    }));

    return {
      text: `Analysis complete across ${students.length} student records. Identified ${priorityStudents.length} students currently meeting priority institutional review criteria.`,
      finding: `${priorityStudents.length} students exhibit compound academic risk requiring urgent intervention.`,
      metrics: [
        { label: 'Priority Review Total', value: priorityStudents.length },
        { label: 'Avg Success Score in Cohort', value: `${(priorityStudents.reduce((acc, s) => acc + s.studentSuccessScore, 0) / (priorityStudents.length || 1)).toFixed(1)}/100` },
        { label: 'Total Backlogs in Group', value: priorityStudents.reduce((acc, s) => acc + s.backlogs, 0) },
      ],
      affectedStudents: affected,
      recommendedAction: 'Convene academic committee reviews and assign structured remedial tutorials before end-semester condonation deadlines.',
    };
  }

  // 2. "Which academically strong students need placement training?"
  if (q.includes('placement training') || (q.includes('academically strong') && q.includes('placement')) || q.includes('strong academics, low placement')) {
    const gapStudents = students
      .filter(s => (s.cgpa >= 7.5 || s.internalMarks >= 75) && s.placementReadinessScore < 55)
      .sort((a, b) => a.placementReadinessScore - b.placementReadinessScore);

    const affected = gapStudents.slice(0, 5).map(s => ({
      id: s.studentId,
      name: s.name,
      dept: s.department,
      score: s.placementReadinessScore,
    }));

    return {
      text: `Screened for students with solid academic standing (CGPA ≥ 7.5) whose placement index falls below the institutional threshold of 55.`,
      finding: `Found ${gapStudents.length} students suffering from an "Academic-to-Placement Disconnect" — strong coursework performance but high risk of hiring rejection.`,
      metrics: [
        { label: 'Target Cohort Size', value: gapStudents.length },
        { label: 'Cohort Avg CGPA', value: `${(gapStudents.reduce((acc, s) => acc + s.cgpa, 0) / (gapStudents.length || 1)).toFixed(2)}/10` },
        { label: 'Avg Coding Benchmark', value: `${(gapStudents.reduce((acc, s) => acc + s.codingScore, 0) / (gapStudents.length || 1)).toFixed(0)}/100` },
      ],
      affectedStudents: affected,
      recommendedAction: 'Enroll this cohort immediately in DSA problem-solving accelerators and schedule 2 mandatory faculty mock interviews.',
    };
  }

  // 3. "What are the most common reasons for low success scores?"
  if (q.includes('common reasons') || q.includes('causes') || q.includes('why are they at risk') || q.includes('low success scores')) {
    const lowScoreCohort = students.filter(s => s.studentSuccessScore < 60);
    const lowAttendance = lowScoreCohort.filter(s => s.attendancePercentage < 65).length;
    const lowLms = lowScoreCohort.filter(s => s.assignmentCompletionPercentage < 50).length;
    const backlogs = lowScoreCohort.filter(s => s.backlogs > 0).length;
    const lowCoding = lowScoreCohort.filter(s => s.codingScore < 45).length;

    return {
      text: `Evaluated feature contributions across all ${lowScoreCohort.length} students scoring below 60 on the Student Success Index.`,
      finding: `Classroom attendance deficit (<65%) and incomplete LMS assignments are the leading primary contributors to low scores, present in ${(lowAttendance / (lowScoreCohort.length || 1) * 100).toFixed(0)}% of low-performing cases.`,
      metrics: [
        { label: 'Attendance Deficits', value: `${lowAttendance} cases (${(lowAttendance / (lowScoreCohort.length || 1) * 100).toFixed(0)}%)` },
        { label: 'LMS Assignment Backlog', value: `${lowLms} cases (${(lowLms / (lowScoreCohort.length || 1) * 100).toFixed(0)}%)` },
        { label: 'Course Backlogs Present', value: `${backlogs} cases (${(backlogs / (lowScoreCohort.length || 1) * 100).toFixed(0)}%)` },
        { label: 'Low Coding Aptitude', value: `${lowCoding} cases` },
      ],
      recommendedAction: 'Prioritize automated SMS attendance alerts to guardians and introduce weekly LMS submission grace-checkpoints.',
    };
  }

  // 4. "Which department has the highest proportion of low-attendance students?"
  if (q.includes('department') && (q.includes('attendance') || q.includes('highest proportion'))) {
    const depts = Array.from(new Set(students.map(s => s.department)));
    const deptStats = depts.map(d => {
      const deptStudents = students.filter(s => s.department === d);
      const lowAtt = deptStudents.filter(s => s.attendancePercentage < 70).length;
      return {
        dept: d,
        total: deptStudents.length,
        lowAttCount: lowAtt,
        pct: (lowAtt / (deptStudents.length || 1)) * 100,
        avgAtt: (deptStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / (deptStudents.length || 1)).toFixed(1),
      };
    }).sort((a, b) => b.pct - a.pct);

    const worst = deptStats[0];

    return {
      text: `Computed attendance distributions across all ${depts.length} active academic departments.`,
      finding: `${worst.dept} has the highest proportion of attendance risk: ${worst.pct.toFixed(1)}% of students are below the 70% threshold.`,
      metrics: [
        { label: 'Highest Risk Dept', value: worst.dept },
        { label: 'Low Attendance Rate', value: `${worst.pct.toFixed(1)}%` },
        { label: 'Dept Avg Attendance', value: `${worst.avgAtt}%` },
        { label: 'Affected Students in Dept', value: `${worst.lowAttCount} / ${worst.total}` },
      ],
      recommendedAction: `Schedule an administrative review with the Department Chair of ${worst.dept} to inspect timetable conflicts and lab engagement.`,
    };
  }

  // 5. "Recommend an intervention plan for a selected student"
  if (q.includes('intervention plan') || q.includes('recommend an intervention') || selectedStudentId) {
    const targetStudent = selectedStudentId 
      ? students.find(s => s.studentId === selectedStudentId)
      : students.find(s => s.studentId === 'STU-2024-042') || students[0];

    if (targetStudent) {
      const topIssue = targetStudent.primaryRiskReasons[0] || 'General academic monitoring';
      const isPlacementIssue = targetStudent.placementReadinessScore < 60;
      const isAttendanceIssue = targetStudent.attendancePercentage < 70;

      let suggestedAction = '1-on-1 Faculty Mentor Counseling and Bi-weekly Academic Check-in';
      if (isPlacementIssue && targetStudent.cgpa >= 7.5) {
        suggestedAction = 'Enrollment in DSA Intensive Bootcamp + 2 Scheduled Technical Mock Interviews';
      } else if (isAttendanceIssue) {
        suggestedAction = 'Mandatory Parental Notification & Attendance Condonation Recovery Plan';
      }

      return {
        text: `Generated data-grounded intervention roadmap for ${targetStudent.name} (${targetStudent.studentId}), Department of ${targetStudent.department}.`,
        finding: `Primary risk trigger: "${topIssue}". Current Success Score is ${targetStudent.studentSuccessScore}/100 and Placement Index is ${targetStudent.placementReadinessScore}/100.`,
        metrics: [
          { label: 'Student', value: targetStudent.name },
          { label: 'Success Score', value: `${targetStudent.studentSuccessScore}/100` },
          { label: 'Risk Category', value: targetStudent.riskLevel.toUpperCase() },
          { label: 'Assigned Mentor', value: targetStudent.mentorName },
        ],
        affectedStudents: [{
          id: targetStudent.studentId,
          name: targetStudent.name,
          dept: targetStudent.department,
          score: targetStudent.studentSuccessScore,
        }],
        recommendedAction: suggestedAction,
      };
    }
  }

  // 6. "Summarize the main trends in the current dataset." / Generic fallback
  const avgSuccess = (students.reduce((acc, s) => acc + s.studentSuccessScore, 0) / (students.length || 1)).toFixed(1);
  const highRiskCount = students.filter(s => s.riskLevel === 'high').length;
  const placementReadyCount = students.filter(s => s.placementReadinessScore >= 70).length;
  const avgAttendance = (students.reduce((acc, s) => acc + s.attendancePercentage, 0) / (students.length || 1)).toFixed(1);

  return {
    text: `Analyzed institutional data across ${students.length} unified student profiles for the current academic term.`,
    finding: `The campus maintains a healthy average success score of ${avgSuccess}/100, though ${highRiskCount} students require immediate faculty intervention to prevent exam debarment.`,
    metrics: [
      { label: 'Total Enrolled', value: students.length },
      { label: 'Institutional Avg Score', value: `${avgSuccess}/100` },
      { label: 'High Risk Population', value: `${highRiskCount} (${((highRiskCount / students.length) * 100).toFixed(1)}%)` },
      { label: 'Placement Ready Cohort', value: `${placementReadyCount} (${((placementReadyCount / students.length) * 100).toFixed(1)}%)` },
      { label: 'Campus Attendance Avg', value: `${avgAttendance}%` },
    ],
    recommendedAction: 'Direct department mentors to resolve pending high-priority interventions in the Intervention Center.',
  };
}
