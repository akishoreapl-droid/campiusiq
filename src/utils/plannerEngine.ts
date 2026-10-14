import { StudyTask, TopicMastery, Student } from '../types';

export const INITIAL_STUDY_TASKS: StudyTask[] = [
  {
    id: 'TASK-001',
    studentId: 'STU-2024-042',
    title: 'Solve 3 0/1 Knapsack & DP Subarray Challenges',
    subject: 'DSA',
    topic: 'Dynamic Programming',
    deadline: 'Tomorrow, 6:00 PM',
    priority: 'high',
    estimatedMinutes: 45,
    status: 'in_progress',
    source: 'quiz_remediation',
    notes: 'Triggered by low quiz score (42%) in Dynamic Programming. Focus on bottom-up space optimization.'
  },
  {
    id: 'TASK-002',
    studentId: 'STU-2024-042',
    title: 'Review B+ Tree Node Splitting and Latch Crabbing',
    subject: 'DBMS',
    topic: 'Indexing & B+ Trees',
    deadline: 'Oct 15, 2026',
    priority: 'medium',
    estimatedMinutes: 30,
    status: 'pending',
    source: 'ai_recommended',
    notes: 'Suggested by AI Study Tutor to prepare for Mid-Term Section B (10-mark questions).'
  },
  {
    id: 'TASK-003',
    studentId: 'STU-2024-042',
    title: 'Complete 10 Practice Flashcards on Virtual Memory',
    subject: 'Operating Systems',
    topic: 'Virtual Memory & Paging',
    deadline: 'Oct 16, 2026',
    priority: 'medium',
    estimatedMinutes: 20,
    status: 'pending',
    source: 'student_created',
    notes: 'Review Belady\'s Anomaly and Clock replacement algorithm.'
  },
  {
    id: 'TASK-004',
    studentId: 'STU-2024-042',
    title: 'Review TCP 3-Way Handshake & SYN Cookie Security',
    subject: 'Computer Networks',
    topic: 'TCP/IP',
    deadline: 'Oct 12, 2026',
    priority: 'low',
    estimatedMinutes: 25,
    status: 'completed',
    source: 'ai_recommended',
    completedAt: 'Oct 11, 2026',
    notes: 'Completed review and passed TCP quiz with 85%.'
  }
];

export function getWhatShouldIStudyNext(
  masteries: TopicMastery[],
  pendingTasks: StudyTask[]
): {
  recommendationTitle: string;
  subject: string;
  reason: string;
  estimatedDuration: string;
  actionableStep: string;
  associatedTaskId?: string;
} {
  // Find topic with lowest mastery percentage
  const sorted = [...masteries].sort((a, b) => a.masteryPercentage - b.masteryPercentage);
  const weakest = sorted[0];

  if (weakest && weakest.masteryPercentage < 60) {
    const matchingTask = pendingTasks.find(t => t.topic.toLowerCase().includes(weakest.topic.toLowerCase()));
    return {
      recommendationTitle: `Master ${weakest.topic} (${weakest.subject})`,
      subject: weakest.subject,
      reason: `Current topic mastery is at ${weakest.masteryPercentage}%, which is below the 70% placement readiness threshold.`,
      estimatedDuration: '35 mins',
      actionableStep: 'Review the step-by-step tabulation breakdown in the AI Study Tutor and attempt a 5-question targeted quiz.',
      associatedTaskId: matchingTask?.id
    };
  }

  // Fallback to highest priority pending task
  const topTask = pendingTasks.find(t => t.priority === 'high') || pendingTasks[0];
  if (topTask) {
    return {
      recommendationTitle: topTask.title,
      subject: topTask.subject,
      reason: `High priority study task scheduled before upcoming milestone.`,
      estimatedDuration: `${topTask.estimatedMinutes} mins`,
      actionableStep: topTask.notes || 'Focus on completing this task today to stay on track with your study plan.',
      associatedTaskId: topTask.id
    };
  }

  return {
    recommendationTitle: 'Comprehensive Subject Revision',
    subject: 'All Subjects',
    reason: 'All current study tasks completed! Reinforce memory retention with flashcards.',
    estimatedDuration: '20 mins',
    actionableStep: 'Review flashcards marked "Needs Revision" in the Practice portal.'
  };
}
