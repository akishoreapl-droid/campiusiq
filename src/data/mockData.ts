import { RawStudentInput, enrichStudentData } from '../utils/scoring';
import { User, Student, Intervention, StudentActionItem, Segment, NotificationItem } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'USR-ADMIN-01',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@campusiq.edu',
    role: 'admin',
    title: 'Dean of Academic Intelligence & Quality',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Institutional Intelligence',
  },
  {
    id: 'USR-FACULTY-01',
    name: 'Dr. Aris Thorne',
    email: 'faculty@campusiq.edu',
    role: 'faculty',
    title: 'Associate Professor & Senior Faculty Mentor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    assignedStudentIds: [
      'STU-2024-001', 'STU-2024-002', 'STU-2024-005', 'STU-2024-012', 
      'STU-2024-019', 'STU-2024-027', 'STU-2024-034', 'STU-2024-042',
      'STU-2024-055', 'STU-2024-063', 'STU-2024-071', 'STU-2024-080'
    ],
  },
  {
    id: 'USR-STUDENT-01',
    name: 'Aarav Sharma',
    email: 'student@campusiq.edu',
    role: 'student',
    title: 'Undergraduate Scholar (3rd Year, CSE)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    studentId: 'STU-2024-042',
  },
];

export const MENTORS = [
  { id: 'USR-FACULTY-01', name: 'Dr. Aris Thorne', dept: 'Computer Science' },
  { id: 'USR-FACULTY-02', name: 'Prof. Elena Vance', dept: 'Information Technology' },
  { id: 'USR-FACULTY-03', name: 'Dr. Marcus Sterling', dept: 'Electronics & Comm.' },
  { id: 'USR-FACULTY-04', name: 'Prof. Ananya Iyer', dept: 'Data Science' },
  { id: 'USR-FACULTY-05', name: 'Dr. Ramesh Kulkarni', dept: 'Mechanical' },
];

const firstNames = [
  'Aarav', 'Diya', 'Rohan', 'Ananya', 'Vivaan', 'Ishaan', 'Sneha', 'Kabir', 'Tanvi', 'Aditya',
  'Meera', 'Rishi', 'Pooja', 'Varun', 'Kavya', 'Karan', 'Priya', 'Nikhil', 'Shreya', 'Siddharth',
  'Ritika', 'Dhruv', 'Sanjana', 'Abhishek', 'Tanya', 'Pranav', 'Anika', 'Sameer', 'Neha', 'Gaurav',
  'Ishita', 'Arjun', 'Rhea', 'Manish', 'Kritika', 'Akash', 'Shruti', 'Harsh', 'Simran', 'Dev'
];

const lastNames = [
  'Sharma', 'Patel', 'Verma', 'Reddy', 'Iyer', 'Nair', 'Mehta', 'Gupta', 'Chatterjee', 'Deshmukh',
  'Bose', 'Menon', 'Kulkarni', 'Joshi', 'Chopra', 'Malhotra', 'Bhat', 'Singhal', 'Sen', 'Pillai'
];

const departments = [
  'Computer Science',
  'Information Technology',
  'Data Science',
  'Electronics & Comm.',
  'Mechanical'
];

// Helper deterministic pseudorandom number generator for consistent demo results
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateRawStudents(count: number = 130): RawStudentInput[] {
  const list: RawStudentInput[] = [];

  // Anchor Student 1: Aarav Sharma (The logged in demo student) - Archetype: High Academics, Low Placement Readiness
  list.push({
    studentId: 'STU-2024-042',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campusiq.edu',
    department: 'Computer Science',
    year: 3,
    semester: 6,
    cgpa: 8.65,
    internalMarks: 84,
    backlogs: 0,
    attendancePercentage: 88,
    lmsLoginFrequency: 7,
    assignmentCompletionPercentage: 92,
    engagementScore: 78,
    codingScore: 42, // Low coding
    aptitudeScore: 68,
    technicalSkillsScore: 64,
    communicationScore: 50, // Moderate communication
    mockInterviewsCompleted: 0, // No interviews
    feedbackScore: 82,
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  });

  // Anchor Student 2: Critical High-Risk Case - Low attendance, backlog, declining marks
  list.push({
    studentId: 'STU-2024-001',
    name: 'Rohan Verma',
    email: 'rohan.verma@campusiq.edu',
    department: 'Computer Science',
    year: 3,
    semester: 5,
    cgpa: 5.4,
    internalMarks: 44,
    backlogs: 2,
    attendancePercentage: 54, // Critical attendance
    lmsLoginFrequency: 2,
    assignmentCompletionPercentage: 38, // Low LMS
    engagementScore: 40,
    codingScore: 35,
    aptitudeScore: 48,
    technicalSkillsScore: 42,
    communicationScore: 52,
    mockInterviewsCompleted: 0,
    feedbackScore: 45,
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  });

  // Anchor Student 3: Star Student - All round high performer
  list.push({
    studentId: 'STU-2024-002',
    name: 'Diya Patel',
    email: 'diya.patel@campusiq.edu',
    department: 'Data Science',
    year: 4,
    semester: 7,
    cgpa: 9.35,
    internalMarks: 94,
    backlogs: 0,
    attendancePercentage: 96,
    lmsLoginFrequency: 9,
    assignmentCompletionPercentage: 98,
    engagementScore: 92,
    codingScore: 91,
    aptitudeScore: 88,
    technicalSkillsScore: 95,
    communicationScore: 90,
    mockInterviewsCompleted: 4,
    feedbackScore: 96,
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  });

  // Anchor Student 4: Low Attendance despite acceptable knowledge
  list.push({
    studentId: 'STU-2024-005',
    name: 'Kavya Nair',
    email: 'kavya.nair@campusiq.edu',
    department: 'Information Technology',
    year: 2,
    semester: 4,
    cgpa: 7.8,
    internalMarks: 72,
    backlogs: 0,
    attendancePercentage: 61, // Flagged for condonation
    lmsLoginFrequency: 4,
    assignmentCompletionPercentage: 75,
    engagementScore: 58,
    codingScore: 70,
    aptitudeScore: 72,
    technicalSkillsScore: 68,
    communicationScore: 65,
    mockInterviewsCompleted: 1,
    feedbackScore: 70,
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  });

  // Anchor Student 5: LMS Disengagement
  list.push({
    studentId: 'STU-2024-012',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@campusiq.edu',
    department: 'Electronics & Comm.',
    year: 3,
    semester: 5,
    cgpa: 6.9,
    internalMarks: 66,
    backlogs: 1,
    attendancePercentage: 79,
    lmsLoginFrequency: 2, // low
    assignmentCompletionPercentage: 35, // low LMS completion
    engagementScore: 48,
    codingScore: 52,
    aptitudeScore: 60,
    technicalSkillsScore: 58,
    communicationScore: 58,
    mockInterviewsCompleted: 0,
    feedbackScore: 60,
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  });

  // Generate remaining students with controlled distributions
  for (let i = 6; i <= count; i++) {
    const seed = i * 37 + 11;
    const fn = firstNames[Math.floor(seededRandom(seed) * firstNames.length)];
    const ln = lastNames[Math.floor(seededRandom(seed + 1) * lastNames.length)];
    const dept = departments[Math.floor(seededRandom(seed + 2) * departments.length)];
    const year = Math.floor(seededRandom(seed + 3) * 3) + 2; // years 2, 3, 4
    const semester = (year * 2) - (seededRandom(seed + 4) > 0.5 ? 0 : 1);
    const mentor = MENTORS[Math.floor(seededRandom(seed + 5) * MENTORS.length)];

    const idStr = i.toString().padStart(3, '0');
    const studentId = `STU-2024-${idStr}`;

    // Archetype distribution:
    // ~20% high-risk, ~35% medium-risk, ~45% low-risk
    const archetypeRoll = seededRandom(seed + 6);
    let cgpa: number;
    let internalMarks: number;
    let backlogs: number;
    let attendancePercentage: number;
    let lmsLoginFrequency: number;
    let assignmentCompletionPercentage: number;
    let codingScore: number;
    let aptitudeScore: number;
    let technicalSkillsScore: number;
    let communicationScore: number;
    let mockInterviewsCompleted: number;

    if (archetypeRoll < 0.20) {
      // High-risk archetype
      cgpa = Number((4.8 + seededRandom(seed + 7) * 1.5).toFixed(2));
      internalMarks = Math.floor(38 + seededRandom(seed + 8) * 22);
      backlogs = seededRandom(seed + 9) > 0.4 ? (seededRandom(seed + 9) > 0.8 ? 3 : 2) : 1;
      attendancePercentage = Math.floor(48 + seededRandom(seed + 10) * 20);
      lmsLoginFrequency = Math.floor(1 + seededRandom(seed + 11) * 3);
      assignmentCompletionPercentage = Math.floor(30 + seededRandom(seed + 12) * 28);
      codingScore = Math.floor(25 + seededRandom(seed + 13) * 25);
      aptitudeScore = Math.floor(35 + seededRandom(seed + 14) * 25);
      technicalSkillsScore = Math.floor(30 + seededRandom(seed + 15) * 25);
      communicationScore = Math.floor(35 + seededRandom(seed + 16) * 25);
      mockInterviewsCompleted = seededRandom(seed + 17) > 0.8 ? 1 : 0;
    } else if (archetypeRoll < 0.40) {
      // Academically Strong, Low Placement Skills archetype
      cgpa = Number((7.8 + seededRandom(seed + 7) * 1.6).toFixed(2));
      internalMarks = Math.floor(76 + seededRandom(seed + 8) * 18);
      backlogs = 0;
      attendancePercentage = Math.floor(82 + seededRandom(seed + 10) * 15);
      lmsLoginFrequency = Math.floor(6 + seededRandom(seed + 11) * 3);
      assignmentCompletionPercentage = Math.floor(80 + seededRandom(seed + 12) * 18);
      codingScore = Math.floor(32 + seededRandom(seed + 13) * 22); // low
      aptitudeScore = Math.floor(58 + seededRandom(seed + 14) * 20);
      technicalSkillsScore = Math.floor(52 + seededRandom(seed + 15) * 20);
      communicationScore = Math.floor(45 + seededRandom(seed + 16) * 18); // low
      mockInterviewsCompleted = seededRandom(seed + 17) > 0.7 ? 1 : 0;
    } else if (archetypeRoll < 0.65) {
      // Medium-risk / borderline
      cgpa = Number((6.2 + seededRandom(seed + 7) * 1.3).toFixed(2));
      internalMarks = Math.floor(58 + seededRandom(seed + 8) * 18);
      backlogs = seededRandom(seed + 9) > 0.7 ? 1 : 0;
      attendancePercentage = Math.floor(67 + seededRandom(seed + 10) * 15);
      lmsLoginFrequency = Math.floor(3 + seededRandom(seed + 11) * 4);
      assignmentCompletionPercentage = Math.floor(55 + seededRandom(seed + 12) * 22);
      codingScore = Math.floor(52 + seededRandom(seed + 13) * 20);
      aptitudeScore = Math.floor(56 + seededRandom(seed + 14) * 20);
      technicalSkillsScore = Math.floor(55 + seededRandom(seed + 15) * 18);
      communicationScore = Math.floor(58 + seededRandom(seed + 16) * 18);
      mockInterviewsCompleted = Math.floor(seededRandom(seed + 17) * 2);
    } else {
      // Low risk / Star performer
      cgpa = Number((8.1 + seededRandom(seed + 7) * 1.7).toFixed(2));
      internalMarks = Math.floor(80 + seededRandom(seed + 8) * 18);
      backlogs = 0;
      attendancePercentage = Math.floor(86 + seededRandom(seed + 10) * 12);
      lmsLoginFrequency = Math.floor(6 + seededRandom(seed + 11) * 4);
      assignmentCompletionPercentage = Math.floor(85 + seededRandom(seed + 12) * 14);
      codingScore = Math.floor(75 + seededRandom(seed + 13) * 22);
      aptitudeScore = Math.floor(76 + seededRandom(seed + 14) * 20);
      technicalSkillsScore = Math.floor(78 + seededRandom(seed + 15) * 20);
      communicationScore = Math.floor(78 + seededRandom(seed + 16) * 18);
      mockInterviewsCompleted = Math.floor(1 + seededRandom(seed + 17) * 4);
    }

    const engagementScore = Math.floor(50 + seededRandom(seed + 18) * 45);
    const feedbackScore = Math.floor(55 + seededRandom(seed + 19) * 40);

    const avatarUrl = seededRandom(seed + 20) > 0.5 
      ? `https://images.unsplash.com/photo-${1534528741775 + (i % 20)}?w=150&auto=format&fit=crop&q=80`
      : `https://images.unsplash.com/photo-${1507003211169 + (i % 20)}?w=150&auto=format&fit=crop&q=80`;

    list.push({
      studentId,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@campusiq.edu`,
      department: dept,
      year,
      semester,
      cgpa,
      internalMarks,
      backlogs,
      attendancePercentage,
      lmsLoginFrequency,
      assignmentCompletionPercentage,
      engagementScore,
      codingScore,
      aptitudeScore,
      technicalSkillsScore,
      communicationScore,
      mockInterviewsCompleted,
      feedbackScore,
      mentorId: mentor.id,
      mentorName: mentor.name,
      avatar: avatarUrl,
    });
  }

  return list;
}

// Generate enriched students with explainable calculations
export const INITIAL_STUDENTS: Student[] = generateRawStudents(125).map(enrichStudentData);

// Initial realistic interventions connected to student records
export const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'INT-2024-001',
    studentId: 'STU-2024-001',
    studentName: 'Rohan Verma',
    studentDept: 'Computer Science',
    reason: 'Critical attendance below 55% and 2 pending course backlogs',
    action: 'Mandatory parental counseling & structured weekly attendance review',
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    priority: 'high',
    createdAt: '2026-09-28',
    dueDate: '2026-10-18',
    status: 'in_progress',
    type: 'attendance_counseling',
    notes: 'First meeting conducted with student on Oct 02. Agreed on a daily attendance log signed by class coordinator.',
  },
  {
    id: 'INT-2024-002',
    studentId: 'STU-2024-042',
    studentName: 'Aarav Sharma',
    studentDept: 'Computer Science',
    reason: 'Academic-to-placement gap: High CGPA (8.65) but coding benchmark is 42/100',
    action: 'Enrollment in DSA Intensive Bootcamp & schedule 2 technical mock interviews',
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    priority: 'high',
    createdAt: '2026-10-01',
    dueDate: '2026-10-25',
    status: 'assigned',
    type: 'placement_training',
    notes: 'Aarav demonstrated good theoretical grasp in OS/DBMS; needs focused problem-solving practice in LeetCode/HackerRank track.',
  },
  {
    id: 'INT-2024-003',
    studentId: 'STU-2024-005',
    studentName: 'Kavya Nair',
    studentDept: 'Information Technology',
    reason: 'Attendance 61% in Discrete Mathematics and Operating Systems',
    action: 'Compensatory weekend tutorial assignments to clear condonation risk',
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    priority: 'medium',
    createdAt: '2026-10-03',
    dueDate: '2026-10-20',
    status: 'pending',
    type: 'academic_remedial',
    notes: 'Awaiting student confirmation on tutorial slot selection.',
  },
  {
    id: 'INT-2024-004',
    studentId: 'STU-2024-012',
    studentName: 'Kabir Mehta',
    studentDept: 'Electronics & Comm.',
    reason: 'LMS submission completion dropped to 35% across last three modules',
    action: 'LMS audit review and submission of overdue lab worksheets',
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    priority: 'medium',
    createdAt: '2026-09-25',
    dueDate: '2026-10-10',
    status: 'completed',
    type: 'academic_remedial',
    notes: 'Completed all 3 pending assignments. LMS status restored to 80% on Oct 09.',
    outcome: 'Resolved — Student submitted back-dated submissions verified by lab in-charge.',
    completedAt: '2026-10-09',
  },
  {
    id: 'INT-2024-005',
    studentId: 'STU-2024-019',
    studentName: 'Pranav Malhotra',
    studentDept: 'Mechanical',
    reason: 'Low aptitude test benchmark (44%) ahead of tier-1 campus placements',
    action: 'Quantitative aptitude booster series with weekly timed evaluations',
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    priority: 'medium',
    createdAt: '2026-10-04',
    dueDate: '2026-10-30',
    status: 'in_progress',
    type: 'placement_training',
    notes: 'Pranav has enrolled in 3 modules; module 1 passed with 74%.',
  },
  {
    id: 'INT-2024-006',
    studentId: 'STU-2024-027',
    studentName: 'Simran Bhat',
    studentDept: 'Data Science',
    reason: 'Confidence deficit in verbal interviews and technical group discussions',
    action: 'Communication lab coaching & 1-on-1 faculty panel mock interview',
    mentorId: 'USR-FACULTY-01',
    mentorName: 'Dr. Aris Thorne',
    priority: 'low',
    createdAt: '2026-10-05',
    dueDate: '2026-11-05',
    status: 'assigned',
    type: 'mock_interview',
    notes: 'Scheduled for panel interview on Oct 28.',
  },
];

// Student Personalized Action Items (for Aarav Sharma's student portal)
export const INITIAL_STUDENT_ACTIONS: StudentActionItem[] = [
  {
    id: 'ACT-001',
    studentId: 'STU-2024-042',
    title: 'Complete 25 Data Structure Challenges (Arrays & Trees)',
    description: 'Solve the curated medium-level problems on the campus coding portal to raise your coding score from 42 to 70+.',
    reason: 'Directly boosts your Placement Readiness Score before upcoming campus hiring cycles.',
    dueDate: '2026-10-22',
    status: 'in_progress',
    isStudentSelfDirected: true,
    category: 'coding',
  },
  {
    id: 'ACT-002',
    studentId: 'STU-2024-042',
    title: 'Schedule First Faculty Mock Interview with Dr. Aris Thorne',
    description: 'Book your 45-minute technical and behavioral mock interview session via the faculty calendar slot.',
    reason: 'Your record indicates 0 completed mock interviews, which lowers placement index weighting.',
    dueDate: '2026-10-25',
    status: 'pending',
    isStudentSelfDirected: true,
    category: 'interview',
  },
  {
    id: 'ACT-003',
    studentId: 'STU-2024-042',
    title: 'Submit Distributed Systems Lab Module 4 on Canvas',
    description: 'Ensure lab report and verified test run outputs are submitted before midnight deadline.',
    reason: 'Maintain your excellent 92% LMS completion rate.',
    dueDate: '2026-10-16',
    status: 'completed',
    isStudentSelfDirected: true,
    category: 'assignment',
  },
  {
    id: 'ACT-004',
    studentId: 'STU-2024-042',
    title: 'Attend Faculty Mentor Review Session',
    description: 'Quarterly academic review with Dr. Aris Thorne regarding elective course roadmap and campus hiring readiness.',
    reason: 'Faculty-supervised milestone intervention INT-2024-002.',
    dueDate: '2026-10-20',
    status: 'pending',
    isStudentSelfDirected: false, // Managed by faculty
    category: 'remedial',
  },
];

// Initial System Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    title: 'Priority Risk Alert: Rohan Verma',
    message: 'Attendance dropped below 55% in Computer Science (Sem 5). Immediate faculty counseling recommended.',
    timestamp: '25 mins ago',
    read: false,
    type: 'risk_flag',
    targetRoute: '/admin/students/STU-2024-001',
    studentId: 'STU-2024-001',
  },
  {
    id: 'NOTIF-002',
    title: 'Intervention Review Due Soon',
    message: 'Intervention for Aarav Sharma (Coding Intensive Bootcamp) has milestone check-in in 3 days.',
    timestamp: '2 hours ago',
    read: false,
    type: 'intervention_due',
    targetRoute: '/admin/interventions',
  },
  {
    id: 'NOTIF-003',
    title: 'Intervention Completed',
    message: 'Dr. Aris Thorne marked LMS remediation for Kabir Mehta as Successfully Resolved.',
    timestamp: '1 day ago',
    read: true,
    type: 'task_completed',
    targetRoute: '/admin/interventions',
  },
  {
    id: 'NOTIF-004',
    title: 'Mid-Term Analytics Sync Complete',
    message: '125 student records synchronized across Attendance, Canvas LMS, and Placement assessment nodes.',
    timestamp: '2 days ago',
    read: true,
    type: 'mentor_update',
    targetRoute: '/admin/data',
  },
];

// System Segments definition based on deterministic rules
export function calculateSystemSegments(students: Student[]): Segment[] {
  const total = students.length;

  // Segment 1: High Academics, Low Placement Readiness
  const seg1Count = students.filter(s => (s.cgpa >= 7.5 || s.internalMarks >= 75) && s.placementReadinessScore < 55).length;

  // Segment 2: Low Attendance and Declining Performance
  const seg2Count = students.filter(s => s.attendancePercentage < 65 && s.internalMarks < 60).length;

  // Segment 3: Weak Subject Performance despite Acceptable Attendance
  const seg3Count = students.filter(s => s.attendancePercentage >= 75 && (s.backlogs > 0 || s.internalMarks < 55)).length;

  // Segment 4: Star Overall Performers
  const seg4Count = students.filter(s => s.studentSuccessScore >= 80 && s.placementReadinessScore >= 75).length;

  // Segment 5: LMS Disengagement
  const seg5Count = students.filter(s => s.assignmentCompletionPercentage < 50 || s.lmsLoginFrequency <= 2).length;

  // Segment 6: Multiple Simultaneous Risk Indicators
  const seg6Count = students.filter(s => s.riskLevel === 'high' && (s.attendancePercentage < 60 && s.backlogs >= 1)).length;

  return [
    {
      id: 'seg-high-acad-low-placement',
      name: 'Academically Strong, Placement Deficit',
      description: 'Students excelling in coursework examinations (CGPA ≥ 7.5) who exhibit deficits in competitive coding, aptitude, or mock interviews.',
      studentCount: seg1Count,
      percentage: Number(((seg1Count / total) * 100).toFixed(1)),
      primaryCharacteristics: 'CGPA ≥ 7.5, Placement Index < 55, low coding scores',
      suggestedStrategy: 'Enforce algorithmic coding bootcamps, resume workshops, and mandatory mock interview panels.',
      tag: 'Critical Opportunity',
      colorScheme: 'amber',
    },
    {
      id: 'seg-low-attendance-declining',
      name: 'Chronic Attendance & Academic Decline',
      description: 'Students with attendance under 65% correlating with dropping internal assessment test scores.',
      studentCount: seg2Count,
      percentage: Number(((seg2Count / total) * 100).toFixed(1)),
      primaryCharacteristics: 'Attendance < 65%, Internals < 60%, condonation alert',
      suggestedStrategy: 'Direct guardian escalation, proactive mentor counseling, and compensatory assignment contracts.',
      tag: 'High Risk',
      colorScheme: 'red',
    },
    {
      id: 'seg-subject-specific-struggle',
      name: 'Consistent Attendance, Subject Deficit',
      description: 'Students attending lectures regularly (≥75%) who are struggling to grasp core technical or mathematical subjects.',
      studentCount: seg3Count,
      percentage: Number(((seg3Count / total) * 100).toFixed(1)),
      primaryCharacteristics: 'Attendance ≥ 75%, specific subject backlogs or internal marks < 55%',
      suggestedStrategy: 'Deploy peer tutors, teaching assistant office hours, and concept remedial sessions.',
      tag: 'Intervention Target',
      colorScheme: 'pine',
    },
    {
      id: 'seg-star-performers',
      name: 'Campus High-Achievers & Core Ready',
      description: 'Exemplary students demonstrating top-tier academic grades, active LMS engagement, and advanced placement readiness.',
      studentCount: seg4Count,
      percentage: Number(((seg4Count / total) * 100).toFixed(1)),
      primaryCharacteristics: 'Success Score ≥ 80, Placement Index ≥ 75, 0 backlogs',
      suggestedStrategy: 'Fast-track to Tier-1 dream company recruitment drives, research fellowships, and peer mentor leadership.',
      tag: 'High Readiness',
      colorScheme: 'green',
    },
    {
      id: 'seg-lms-disengagement',
      name: 'LMS Disengagement & Submission Lag',
      description: 'Students with low digital course engagement (<50% submissions or ≤2 weekly sessions) risking coursework deadlines.',
      studentCount: seg5Count,
      percentage: Number(((seg5Count / total) * 100).toFixed(1)),
      primaryCharacteristics: 'LMS Submissions < 50%, Weekly Logins ≤ 2',
      suggestedStrategy: 'Automated SMS nudges, LMS deadline grace period tracking, and faculty checkpoint reviews.',
      tag: 'Operational Concern',
      colorScheme: 'amber',
    },
    {
      id: 'seg-compound-risk',
      name: 'Compound Risk (Multi-Vector Warning)',
      description: 'Students triggering concurrent alerts across attendance, course backlogs, and poor internal evaluations.',
      studentCount: seg6Count,
      percentage: Number(((seg6Count / total) * 100).toFixed(1)),
      primaryCharacteristics: 'Attendance < 60% AND Backlogs ≥ 1 AND High Risk Tier',
      suggestedStrategy: 'Comprehensive multi-department intervention committee, customized semester recovery plan.',
      tag: 'Urgent Action Required',
      colorScheme: 'red',
    },
  ];
}
