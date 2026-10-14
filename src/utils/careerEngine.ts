import { TargetJobRole, ResumeReview, SkillGapItem, MockInterviewSession, Student } from '../types';

export function getTargetRoleData(role: TargetJobRole): {
  title: string;
  expectedCgpa: number;
  expectedCoding: number;
  expectedTech: number;
  coreSkills: string[];
} {
  switch (role) {
    case 'sde_1':
      return {
        title: 'Software Development Engineer I (SDE-1)',
        expectedCgpa: 7.5,
        expectedCoding: 75,
        expectedTech: 75,
        coreSkills: ['Data Structures & Algorithms', 'System Architecture & OOD', 'Concurrency & Multithreading', 'Database Design (SQL/NoSQL)', 'Git & CI/CD']
      };
    case 'data_engineer':
      return {
        title: 'Data & Analytics Engineer',
        expectedCgpa: 7.5,
        expectedCoding: 70,
        expectedTech: 80,
        coreSkills: ['SQL & Query Optimization', 'Python Data Pipelines', 'Data Warehousing & ETL', 'Distributed Systems (Spark)', 'Database Modeling']
      };
    case 'frontend_specialist':
      return {
        title: 'Frontend Product Engineer',
        expectedCgpa: 7.0,
        expectedCoding: 65,
        expectedTech: 75,
        coreSkills: ['Modern TypeScript & React', 'Browser Performance & Rendering', 'CSS Architecture & Design Systems', 'REST/GraphQL APIs', 'Unit & E2E Testing']
      };
    case 'cloud_devops':
      return {
        title: 'Cloud & Infrastructure Engineer (DevOps)',
        expectedCgpa: 7.0,
        expectedCoding: 60,
        expectedTech: 80,
        coreSkills: ['Linux Kernel & Networking', 'Docker & Kubernetes Orchestration', 'AWS/GCP Cloud Architecture', 'CI/CD Automation', 'Terraform Infrastructure as Code']
      };
    case 'system_engineer':
    default:
      return {
        title: 'Core Systems & Embedded Engineer',
        expectedCgpa: 7.5,
        expectedCoding: 70,
        expectedTech: 85,
        coreSkills: ['C/C++ Memory Management', 'Operating Systems Internals', 'Network Socket Programming', 'Device Drivers', 'Microcontroller Architecture']
      };
  }
}

export function analyzeResumeForRole(role: TargetJobRole, student: Student): ResumeReview {
  const roleInfo = getTargetRoleData(role);

  return {
    targetRole: roleInfo.title,
    overallScore: student.codingScore < 50 ? 72 : 84,
    atsCompatibility: 88,
    strengths: [
      `High academic CGPA (${student.cgpa}/10.0) prominently displayed with clean contact headers`,
      'Demonstrated coursework competency in Operating Systems, Database Systems, and Discrete Math',
      'Solid institutional project descriptions with structured tech-stack tags'
    ],
    improvements: [
      `Coding assessment benchmark (${student.codingScore}/100) indicates need to link verified competitive coding profiles (LeetCode / HackerRank)`,
      'Include quantitative impact metrics (latency reduced, queries optimized) rather than generic duties',
      `Add missing industry keywords required by tier-1 ATS filters for ${roleInfo.title}`
    ],
    missingKeywords: [
      'Microservices',
      'Redis Caching',
      'Docker Containerization',
      'Asynchronous Event-Driven Architecture',
      'CI/CD Pipelines'
    ],
    bulletPointFixes: [
      {
        original: 'Worked on student attendance and grade portal for college database project.',
        improved: 'Architected responsive student success portal utilizing React and PostgreSQL, serving 1,200+ simulated users with sub-50ms query latency via composite B+ tree indexing.',
        reason: 'Quantifies impact with user scale and technical architectural rigor.'
      },
      {
        original: 'Implemented dynamic programming algorithms for knapsack and pathfinding.',
        improved: 'Developed and benchmarked 15+ dynamic programming algorithms, achieving optimal O(W) auxiliary space optimization over baseline 2D recursion.',
        reason: 'Emphasizes algorithmic complexity reduction and testing discipline.'
      }
    ]
  };
}

export function calculateSkillGaps(role: TargetJobRole, student: Student): SkillGapItem[] {
  const roleInfo = getTargetRoleData(role);

  const items: SkillGapItem[] = [
    {
      skill: 'Algorithmic Problem Solving (DSA)',
      category: 'coding',
      studentScore: student.codingScore,
      targetBenchmark: roleInfo.expectedCoding,
      gapStatus: student.codingScore >= roleInfo.expectedCoding ? 'mastered' : student.codingScore >= 50 ? 'moderate_gap' : 'critical_gap',
      recommendation: 'Complete 25 curated LeetCode Medium challenges focusing on Dynamic Programming and Graphs.'
    },
    {
      skill: 'Database Design & Index Optimization',
      category: 'core_cs',
      studentScore: student.internalMarks >= 80 ? 82 : 65,
      targetBenchmark: 75,
      gapStatus: 'mastered',
      recommendation: 'Strong theoretical grounding in B+ Trees and Normalization. Solid for technical interviews.'
    },
    {
      skill: 'System Architecture & Concurrency',
      category: 'system',
      studentScore: student.technicalSkillsScore,
      targetBenchmark: roleInfo.expectedTech,
      gapStatus: student.technicalSkillsScore >= roleInfo.expectedTech ? 'mastered' : 'moderate_gap',
      recommendation: 'Review thread synchronization, mutexes, and distributed caching trade-offs.'
    },
    {
      skill: 'Verbal Articulation & STAR Method',
      category: 'soft_skills',
      studentScore: student.communicationScore,
      targetBenchmark: 75,
      gapStatus: student.communicationScore >= 75 ? 'mastered' : 'moderate_gap',
      recommendation: 'Structure behavioral responses using Situation, Task, Action, and Result framing.'
    }
  ];

  return items;
}

export const INITIAL_MOCK_QUESTIONS = [
  {
    id: 'MOCK-Q1',
    category: 'technical' as const,
    question: 'How does a B+ Tree index accelerate SQL range queries compared to a standard Binary Search Tree or Hash Index?',
    idealKeyPoints: [
      'Leaf nodes form a doubly-linked list enabling sequential scans without tree re-traversal',
      'High fan-out (branching factor) keeps tree depth shallow (3-4 seeks), minimizing disk I/O',
      'Hash indexes only support O(1) equality lookups and cannot perform range queries'
    ]
  },
  {
    id: 'MOCK-Q2',
    category: 'system_architecture' as const,
    question: 'Explain how you would design an automated attendance and performance alert system for 20,000 university students.',
    idealKeyPoints: [
      'Event-driven ingestion via message queues (Kafka/RabbitMQ) from biometric scanner webhooks',
      'Asynchronous worker service evaluating deterministic threshold rules without locking main DB',
      'Redis cache for quick faculty dashboard reads and batch notification dispatchers'
    ]
  },
  {
    id: 'MOCK-Q3',
    category: 'behavioral' as const,
    question: 'Tell me about a time you faced a difficult technical bug or academic deadline, and how you navigated it using the STAR technique.',
    idealKeyPoints: [
      'Situation: Clear project context and severe constraint/deadline',
      'Task: Specific responsibility and challenge identified',
      'Action: Systematic debugging, profiling, or communication with peers',
      'Result: Concrete outcome with measurable recovery'
    ]
  },
  {
    id: 'MOCK-Q4',
    category: 'behavioral' as const,
    question: 'Why are you targeting this software development engineering role, and where do you see your technical trajectory over the next 3 years?',
    idealKeyPoints: [
      'Demonstrated enthusiasm for solving high-concurrency or data-intensive system challenges',
      'Trajectory progression: moving from core feature delivery to architecture ownership and code review leadership',
      'Continuous learning plan: mastering distributed consensus, system observability, and clean design patterns'
    ]
  },
  {
    id: 'MOCK-Q5',
    category: 'system_architecture' as const,
    question: 'In distributed microservices, how do you manage data consistency across autonomous services without using blocking Two-Phase Commit (2PC) transactions?',
    idealKeyPoints: [
      'Saga Pattern (Choreography or Orchestration) utilizing compensating transactions upon failure',
      'Transactional Outbox Pattern paired with reliable message brokers (Kafka/RabbitMQ) for atomic event publication',
      'Eventual consistency model with idempotent consumer handlers and unique idempotency keys'
    ]
  }
];

export function evaluateInterviewResponse(
  questionIndex: number,
  studentAnswer: string
): { score: number; feedback: string; strengths: string[]; improvementTips: string[] } {
  const ans = studentAnswer.trim();
  const wordCount = ans.split(/\s+/).length;
  const question = INITIAL_MOCK_QUESTIONS[questionIndex] || INITIAL_MOCK_QUESTIONS[0];

  if (wordCount < 12) {
    return {
      score: 4,
      feedback: `Answer is too brief for a ${question.category.replace('_', ' ')} round. Elaborate with concrete terminology, trade-offs, and examples.`,
      strengths: ['Addressed the immediate question topic'],
      improvementTips: ['Provide a structured multi-sentence answer', 'Reference concrete real-world systems or patterns']
    };
  }

  if (wordCount < 35) {
    return {
      score: 7,
      feedback: `Good foundational response. To secure full marks in a campus placement panel, highlight specific edge cases and trade-offs.`,
      strengths: ['Clear foundational understanding', 'Relevant technical keywords mentioned'],
      improvementTips: [
        question.category === 'behavioral' 
          ? 'Frame explicitly using STAR (Situation, Task, Action, Result)' 
          : 'Mention operational failure modes, latency impacts, and data volume constraints'
      ]
    };
  }

  return {
    score: 9,
    feedback: `Outstanding response! You demonstrated strong depth in ${question.category.replace('_', ' ')} fundamentals, structured thinking, and solid engineering vocabulary.`,
    strengths: [
      'Comprehensive explanation covering foundational mechanics',
      'Demonstrated awareness of real-world constraints and trade-offs',
      'Articulate, professional communication style'
    ],
    improvementTips: ['Practice verbalizing this smoothly within 90-120 seconds during live video/panel interviews']
  };
}
