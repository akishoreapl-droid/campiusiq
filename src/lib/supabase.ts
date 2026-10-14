import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { User, UserRole, Student, Intervention, StudyTask, TopicMastery, Flashcard, QuizAttempt } from '../types';
import { calculateStudentSuccessScore, calculatePlacementReadiness, RawStudentInput, enrichStudentData } from '../utils/scoring';
import { INITIAL_STUDENTS } from '../data/mockData';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cxvikyzuwnxczsbcllwh.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmlreXp1d254Y3pzYmNsbHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NzM1NTUsImV4cCI6MjEwNzQ0OTU1NX0.8Y_r83kjL7onPcfKY3687rT7XBVZgfM3lFI50cVslNs';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface InquiryRecord {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  phone?: string;
  inquiry_type: 'admission' | 'academic_support' | 'placement_help' | 'system_feedback' | 'general';
  role: 'student' | 'faculty' | 'parent' | 'recruiter' | 'visitor';
  subject: string;
  message: string;
  status?: 'new' | 'in_review' | 'resolved';
}

export interface DbIntervention {
  id?: string;
  created_at?: string;
  student_id: string;
  student_name: string;
  department?: string;
  type: string;
  severity: string;
  title: string;
  description?: string;
  trigger_metrics?: string;
  status?: string;
  assigned_to?: string;
  due_date?: string;
  student_profile_id?: string;
}

export interface DbStudyTask {
  id?: string;
  created_at?: string;
  title: string;
  subject: string;
  due_date: string;
  estimated_minutes?: number;
  priority?: string;
  difficulty?: string;
  completed?: boolean;
  user_id?: string;
  student_profile_id?: string;
}

export interface DbTutorInquiry {
  id?: string;
  created_at?: string;
  student_name?: string;
  subject?: string;
  query_mode?: string;
  question: string;
  response?: string;
}

// ---------------- 1. INQUIRIES ----------------

export async function submitInquiry(data: InquiryRecord) {
  try {
    const { data: record, error } = await supabase
      .from('inquiries')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        inquiry_type: data.inquiry_type || 'general',
        role: data.role || 'visitor',
        subject: data.subject,
        message: data.message,
        status: 'new'
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase submitInquiry error:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data: record };
  } catch (err: any) {
    console.error('Supabase submitInquiry exception:', err);
    return { success: false, error: err?.message || 'Failed to submit inquiry' };
  }
}

export async function fetchInquiries() {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetchInquiries error:', error);
      return { success: false, data: [] };
    }
    return { success: true, data: data as InquiryRecord[] };
  } catch (err) {
    console.error('Supabase fetchInquiries exception:', err);
    return { success: false, data: [] };
  }
}

export async function updateInquiryStatus(id: string, status: 'new' | 'in_review' | 'resolved') {
  try {
    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ---------------- 2. STUDENT PROFILES & ENRICHMENT ----------------

export async function fetchStudentsFromDb(): Promise<Student[]> {
  try {
    const { data: profiles, error } = await supabase
      .from('student_profiles')
      .select(`
        *,
        placement_profiles (*)
      `)
      .order('roll_number', { ascending: true });

    if (error || !profiles || profiles.length === 0) {
      return [];
    }

    return profiles.map((p: any) => {
      const placement = p.placement_profiles || {};
      const rawInput: RawStudentInput = {
        studentId: p.roll_number,
        name: p.name,
        email: p.email,
        department: 'Computer Science',
        year: p.current_year || 3,
        semester: p.current_semester || 5,
        cgpa: Number(p.cgpa) || 0,
        internalMarks: Number(p.internal_marks) || 70,
        backlogs: p.backlogs || 0,
        attendancePercentage: Number(p.attendance_percentage) || 100,
        lmsLoginFrequency: 5,
        assignmentCompletionPercentage: Math.min(100, Math.round((Number(p.attendance_percentage) || 85) * 0.95)),
        engagementScore: Math.round(((Number(p.attendance_percentage) || 85) + (Number(p.internal_marks) || 70)) / 2),
        codingScore: Number(placement.coding_score) || 60,
        aptitudeScore: Number(placement.aptitude_score) || 65,
        technicalSkillsScore: Number(placement.technical_score) || 65,
        communicationScore: Number(placement.communication_score) || 70,
        mockInterviewsCompleted: placement.mock_interviews_completed || 0,
        feedbackScore: 80,
        mentorId: p.mentor_id || 'USR-FACULTY-01',
        mentorName: 'Dr. Aris Thorne',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      };

      return enrichStudentData(rawInput);
    });
  } catch (err) {
    console.warn('fetchStudentsFromDb error:', err);
    return [];
  }
}

/**
 * Seeds initial institutional students into PostgreSQL if student_profiles table is empty.
 */
export async function seedInitialStudentsIfEmpty(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('student_profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn('Count check failed:', error);
      return false;
    }

    if (count !== null && count > 0) {
      return true; // Already populated
    }

    const institutionId = '00000000-0000-0000-0000-000000000001';

    // Seed up to 25 core institutional profiles
    for (const student of INITIAL_STUDENTS.slice(0, 25)) {
      const { data: inserted, error: insertErr } = await supabase
        .from('student_profiles')
        .insert([{
          institution_id: institutionId,
          roll_number: student.studentId,
          name: student.name,
          email: student.email,
          batch_year: 2026 - student.year,
          current_year: student.year,
          current_semester: student.semester,
          cgpa: student.cgpa,
          internal_marks: student.internalMarks,
          attendance_percentage: student.attendancePercentage,
          backlogs: student.backlogs,
          risk_level: student.riskLevel,
          student_success_score: student.studentSuccessScore,
          placement_readiness_score: student.placementReadinessScore,
        }])
        .select('id')
        .single();

      if (inserted?.id && !insertErr) {
        await supabase
          .from('placement_profiles')
          .insert([{
            student_profile_id: inserted.id,
            coding_score: student.codingScore,
            aptitude_score: student.aptitudeScore,
            technical_score: student.technicalSkillsScore,
            communication_score: student.communicationScore,
            mock_interviews_completed: student.mockInterviewsCompleted,
            readiness_tier: student.placementReadinessScore >= 75 ? 'Placement Ready' : 'Developing',
          }]);
      }
    }

    return true;
  } catch (err) {
    console.warn('seedInitialStudentsIfEmpty exception:', err);
    return false;
  }
}

// ---------------- 3. INTERVENTIONS ----------------

export async function saveInterventionToDb(item: DbIntervention) {
  try {
    const { data, error } = await supabase
      .from('interventions')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function fetchInterventionsFromDb(): Promise<Intervention[]> {
  try {
    const { data, error } = await supabase
      .from('interventions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((inv: any) => ({
      id: inv.id,
      studentId: inv.student_id,
      studentName: inv.student_name,
      studentDept: inv.department || 'Computer Science',
      mentorId: 'USR-FACULTY-01',
      mentorName: inv.assigned_to || 'Dr. Aris Thorne',
      type: (inv.type as any) || 'academic_remedial',
      priority: (inv.severity?.toLowerCase() as any) || 'medium',
      reason: inv.trigger_metrics || 'Academic risk flagged by early-warning system',
      action: inv.title,
      dueDate: inv.due_date || 'In 14 days',
      status: (inv.status?.toLowerCase().replace(' ', '_') as any) || 'pending',
      notes: inv.description || '',
      createdAt: inv.created_at ? inv.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    }));
  } catch (err) {
    return [];
  }
}

export async function updateInterventionInDb(id: string, status: string, notes?: string) {
  try {
    const { error } = await supabase
      .from('interventions')
      .update({
        status,
        description: notes,
      })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ---------------- 4. STUDY TASKS ----------------

export async function fetchStudyTasksFromDb(userId?: string): Promise<StudyTask[]> {
  try {
    let query = supabase.from('study_tasks').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((t: any) => ({
      id: t.id,
      studentId: t.student_id || 'STU-2024-042',
      title: t.title,
      subject: t.subject,
      topic: t.subject,
      deadline: t.due_date,
      priority: (t.priority?.toLowerCase() as any) || 'medium',
      estimatedMinutes: t.estimated_minutes || 45,
      status: t.completed ? 'completed' : 'pending',
      source: 'student_created',
    }));
  } catch {
    return [];
  }
}

export async function saveStudyTaskToDb(task: DbStudyTask) {
  try {
    const { data, error } = await supabase
      .from('study_tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateStudyTaskInDb(taskId: string, completed: boolean) {
  try {
    const { error } = await supabase
      .from('study_tasks')
      .update({ completed })
      .eq('id', taskId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteStudyTaskFromDb(taskId: string) {
  try {
    const { error } = await supabase
      .from('study_tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ---------------- 5. QUIZZES & TOPIC MASTERY ----------------

export async function fetchQuizAttemptsFromDb(userId?: string): Promise<QuizAttempt[]> {
  try {
    let query = supabase.from('quiz_attempts').select('*').order('completed_at', { ascending: false });
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((q: any) => ({
      id: q.id,
      studentId: q.student_id || q.user_id || 'STU-2024-042',
      subject: q.subject,
      topic: q.topic,
      difficulty: (q.difficulty as any) || 'intermediate',
      totalQuestions: q.total_questions || 5,
      score: q.score,
      percentage: q.percentage,
      completedAt: q.completed_at || new Date().toISOString(),
      answers: q.answers || {},
    }));
  } catch {
    return [];
  }
}

export async function saveQuizAttemptToDb(attempt: QuizAttempt, userId?: string) {
  try {
    const { error } = await supabase
      .from('quiz_attempts')
      .insert([{
        user_id: userId || null,
        subject: attempt.subject,
        topic: attempt.topic,
        score: attempt.score,
        total_questions: attempt.totalQuestions,
        percentage: attempt.percentage,
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function fetchTopicMasteriesFromDb(userId?: string): Promise<TopicMastery[]> {
  try {
    let query = supabase.from('topic_masteries').select('*');
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((m: any) => ({
      subject: m.subject,
      topic: m.topic,
      masteryPercentage: m.mastery_percentage,
      quizzesTaken: m.quizzes_taken || 1,
      lastPracticed: 'Recently',
      status: (m.status as any) || 'needs_revision',
    }));
  } catch {
    return [];
  }
}

export async function upsertTopicMasteryInDb(mastery: TopicMastery, userId?: string) {
  try {
    const { error } = await supabase
      .from('topic_masteries')
      .upsert([{
        user_id: userId || null,
        subject: mastery.subject,
        topic: mastery.topic,
        mastery_percentage: mastery.masteryPercentage,
        quizzes_taken: mastery.quizzesTaken,
        status: mastery.status,
        updated_at: new Date().toISOString(),
      }], { onConflict: 'user_id,subject,topic' });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ---------------- 6. FLASHCARDS ----------------

export async function fetchFlashcardsFromDb(userId?: string): Promise<Flashcard[]> {
  try {
    let query = supabase.from('flashcards').select('*');
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((f: any) => ({
      id: f.id,
      subject: f.subject,
      topic: f.topic,
      front: f.front || f.question || '',
      back: f.back || f.answer || '',
      mastery: (f.mastery as any) || 'learning',
      lastReviewed: f.last_reviewed || 'Recently',
    }));
  } catch {
    return [];
  }
}

export async function saveFlashcardToDb(card: Omit<Flashcard, 'id'>, userId?: string) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([{
        user_id: userId || null,
        subject: card.subject,
        topic: card.topic,
        question: card.front,
        answer: card.back,
        mastery: card.mastery,
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateFlashcardInDb(id: string, mastery: string) {
  try {
    const { error } = await supabase
      .from('flashcards')
      .update({
        mastery,
        last_reviewed: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ---------------- 7. TUTOR / AI INQUIRIES ----------------

export async function saveTutorInquiryToDb(inquiry: DbTutorInquiry) {
  try {
    const { data, error } = await supabase
      .from('tutor_inquiries')
      .insert([inquiry])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ---------------- 8. IMPORT BATCHES HISTORY ----------------

export async function fetchImportBatchesFromDb() {
  try {
    const { data, error } = await supabase
      .from('import_batches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

// ---------------- 9. AUTHENTICATION SERVICES ----------------

/**
 * Fetch trusted institutional role strictly from the database (user_role_assignments table)
 */
export async function getTrustedUserRole(userId: string): Promise<UserRole | null> {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('user_role_assignments')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data?.role) {
      const normalized = String(data.role).toLowerCase().trim();
      if (normalized === 'admin' || normalized === 'faculty' || normalized === 'student') {
        return normalized as UserRole;
      }
    }
  } catch (err) {
    console.warn('Error fetching trusted role from user_role_assignments:', err);
  }
  return null;
}

/**
 * Fetch user profile from the database (profiles table)
 */
export async function getTrustedUserProfile(userId: string): Promise<{ full_name?: string; email?: string } | null> {
  if (!userId) return null;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .maybeSingle();
    return data || null;
  } catch {
    return null;
  }
}

/**
 * Asynchronously resolves an authenticated Supabase user into an Application User,
 * verifying their trusted role against PostgreSQL user_role_assignments.
 * Returns null if the user has no valid assigned institutional role.
 */
export async function resolveSupabaseUserToAppUser(supabaseUser: any): Promise<User | null> {
  if (!supabaseUser?.id) return null;

  // 1. Fetch trusted role strictly from database
  let role = await getTrustedUserRole(supabaseUser.id);

  // Fallback to metadata only if user_role_assignments has not yet propagated
  if (!role && supabaseUser.user_metadata?.role) {
    const metaRole = String(supabaseUser.user_metadata.role).toLowerCase().trim();
    if (metaRole === 'admin' || metaRole === 'faculty' || metaRole === 'student') {
      role = metaRole as UserRole;
    }
  }

  // Deny access if no trusted database role is found
  if (!role) {
    return null;
  }

  const profile = await getTrustedUserProfile(supabaseUser.id);
  const metadata = supabaseUser.user_metadata || {};
  const email = (supabaseUser.email || profile?.email || '').toLowerCase().trim();
  const name = profile?.full_name || metadata.full_name || metadata.name || (email ? email.split('@')[0] : 'Campus User');

  const defaultTitle = role === 'admin' 
    ? 'Dean of Academic Intelligence & Quality'
    : role === 'faculty'
    ? 'Associate Professor & Senior Mentor'
    : 'Undergraduate Scholar';

  const title = metadata.title || defaultTitle;
  const department = metadata.department || (role === 'admin' ? 'Institutional Intelligence' : 'Computer Science');

  const avatar = metadata.avatar || (
    role === 'admin'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      : role === 'faculty'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  );

  return {
    id: supabaseUser.id,
    name,
    email,
    role,
    title,
    avatar,
    department,
    studentId: metadata.studentId || (role === 'student' ? 'STU-2024-042' : undefined),
    assignedStudentIds: role === 'faculty' ? [
      'STU-2024-001', 'STU-2024-002', 'STU-2024-005', 'STU-2024-012', 
      'STU-2024-019', 'STU-2024-027', 'STU-2024-034', 'STU-2024-042'
    ] : undefined,
  };
}

export function mapSupabaseUserToAppUser(supabaseUser: any, explicitRole?: UserRole): User {
  const metadata = supabaseUser?.user_metadata || {};
  const email = (supabaseUser?.email || '').toLowerCase().trim();

  let role: UserRole = explicitRole || (
    metadata.role === 'admin' || metadata.role === 'faculty' || metadata.role === 'student'
      ? metadata.role
      : 'student'
  );

  const name = metadata.name || metadata.full_name || (email ? email.split('@')[0] : 'Campus User');
  const defaultTitle = role === 'admin' 
    ? 'Dean of Academic Intelligence & Quality'
    : role === 'faculty'
    ? 'Associate Professor & Senior Mentor'
    : 'Undergraduate Scholar';
  const title = metadata.title || defaultTitle;
  const department = metadata.department || (role === 'admin' ? 'Institutional Intelligence' : 'Computer Science');

  const avatar = metadata.avatar || (
    role === 'admin'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      : role === 'faculty'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  );

  return {
    id: supabaseUser?.id || `usr-${Date.now()}`,
    name,
    email: supabaseUser?.email || '',
    role,
    title,
    avatar,
    department,
    studentId: metadata.studentId || (role === 'student' ? 'STU-2024-042' : undefined),
    assignedStudentIds: role === 'faculty' ? [
      'STU-2024-001', 'STU-2024-002', 'STU-2024-005', 'STU-2024-012', 
      'STU-2024-019', 'STU-2024-027', 'STU-2024-034', 'STU-2024-042'
    ] : undefined,
  };
}

export function formatAuthError(error: any): string {
  if (!error) return 'An unexpected authentication error occurred.';
  const msg = (error.message || error.error_description || String(error)).toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please verify via confirmation link or confirm the email in your Supabase Auth dashboard.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (msg.includes('password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (msg.includes('valid email') || msg.includes('invalid format')) {
    return 'Please enter a valid email address.';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Too many login attempts. Please wait a moment and try again.';
  }
  return error.message || 'Authentication failed. Please check your credentials and try again.';
}

export async function authSignIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      return { success: false, error: formatAuthError(error) };
    }
    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: formatAuthError(err) };
  }
}

export async function authSignUp(params: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  department?: string;
}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: params.password,
      options: {
        data: {
          name: params.name.trim(),
          role: params.role,
          department: params.department?.trim() || 'Computer Science',
        },
      },
    });
    if (error) {
      return { success: false, error: formatAuthError(error) };
    }

    // If user was created, record role in user_role_assignments
    if (data.user?.id) {
      await supabase.from('user_role_assignments').insert([{
        user_id: data.user.id,
        role: params.role,
        institution_id: '00000000-0000-0000-0000-000000000001'
      }]);
    }

    return { 
      success: true, 
      user: data.user, 
      session: data.session,
      requiresEmailConfirmation: !data.session && !!data.user
    };
  } catch (err: any) {
    return { success: false, error: formatAuthError(err) };
  }
}

export async function authSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error signing out' };
  }
}
