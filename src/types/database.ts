export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      academic_programs: {
        Row: {
          code: string
          created_at: string | null
          degree_type: string | null
          department_id: string
          duration_years: number | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          degree_type?: string | null
          department_id: string
          duration_years?: number | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          degree_type?: string | null
          department_id?: string
          duration_years?: number | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_terms: {
        Row: {
          code: string | null
          created_at: string | null
          end_date: string | null
          id: string
          institution_id: string
          is_current: boolean | null
          name: string
          start_date: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          institution_id: string
          is_current?: boolean | null
          name: string
          start_date?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          institution_id?: string
          is_current?: boolean | null
          name?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_terms_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          created_at: string | null
          id: string
          session_id: string
          source: string | null
          status: string
          student_profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id: string
          source?: string | null
          status: string
          student_profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string
          source?: string | null
          status?: string
          student_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_sessions: {
        Row: {
          created_at: string | null
          id: string
          offering_id: string
          session_date: string
          session_topic: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          offering_id: string
          session_date: string
          session_topic?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          offering_id?: string
          session_date?: string
          session_topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_sessions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "course_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      campuses: {
        Row: {
          address: string | null
          code: string | null
          created_at: string | null
          id: string
          institution_id: string
          name: string
        }
        Insert: {
          address?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          institution_id: string
          name: string
        }
        Update: {
          address?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          institution_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "campuses_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      course_offerings: {
        Row: {
          course_id: string
          created_at: string | null
          faculty_user_id: string | null
          id: string
          section: string | null
          term_id: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          faculty_user_id?: string | null
          id?: string
          section?: string | null
          term_id?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          faculty_user_id?: string | null
          id?: string
          section?: string | null
          term_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_offerings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_offerings_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string | null
          credits: number | null
          department_id: string | null
          id: string
          semester: number | null
          title: string
        }
        Insert: {
          code: string
          created_at?: string | null
          credits?: number | null
          department_id?: string | null
          id?: string
          semester?: number | null
          title: string
        }
        Update: {
          code?: string
          created_at?: string | null
          credits?: number | null
          department_id?: string | null
          id?: string
          semester?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string | null
          id: string
          institution_id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          institution_id: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          institution_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_profiles: {
        Row: {
          cabin_location: string | null
          created_at: string | null
          department_id: string | null
          designation: string | null
          employee_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          cabin_location?: string | null
          created_at?: string | null
          department_id?: string | null
          designation?: string | null
          employee_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          cabin_location?: string | null
          created_at?: string | null
          department_id?: string | null
          designation?: string | null
          employee_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          answer: string
          id: string
          last_reviewed: string | null
          mastery: string | null
          question: string
          subject: string
          topic: string
          user_id: string | null
        }
        Insert: {
          answer: string
          id?: string
          last_reviewed?: string | null
          mastery?: string | null
          question: string
          subject: string
          topic: string
          user_id?: string | null
        }
        Update: {
          answer?: string
          id?: string
          last_reviewed?: string | null
          mastery?: string | null
          question?: string
          subject?: string
          topic?: string
          user_id?: string | null
        }
        Relationships: []
      }
      import_batches: {
        Row: {
          created_at: string | null
          created_by: string | null
          dataset_type: string
          failed_rows: number | null
          filename: string
          id: string
          institution_id: string | null
          status: string | null
          successful_rows: number | null
          total_rows: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          dataset_type: string
          failed_rows?: number | null
          filename: string
          id?: string
          institution_id?: string | null
          status?: string | null
          successful_rows?: number | null
          total_rows?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          dataset_type?: string
          failed_rows?: number | null
          filename?: string
          id?: string
          institution_id?: string | null
          status?: string | null
          successful_rows?: number | null
          total_rows?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "import_batches_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      import_row_errors: {
        Row: {
          batch_id: string
          created_at: string | null
          error_message: string
          id: string
          raw_data: Json | null
          row_number: number
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          error_message: string
          id?: string
          raw_data?: Json | null
          row_number: number
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          error_message?: string
          id?: string
          raw_data?: Json | null
          row_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_row_errors_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          inquiry_type: string | null
          message: string
          name: string
          phone: string | null
          role: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          inquiry_type?: string | null
          message: string
          name: string
          phone?: string | null
          role?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          inquiry_type?: string | null
          message?: string
          name?: string
          phone?: string | null
          role?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      institutions: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      interventions: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          department: string | null
          description: string | null
          due_date: string | null
          id: string
          severity: string
          status: string | null
          student_id: string
          student_name: string
          student_profile_id: string | null
          title: string
          trigger_metrics: string | null
          type: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          severity: string
          status?: string | null
          student_id: string
          student_name: string
          student_profile_id?: string | null
          title: string
          trigger_metrics?: string | null
          type: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          severity?: string
          status?: string | null
          student_id?: string
          student_name?: string
          student_profile_id?: string | null
          title?: string
          trigger_metrics?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interventions_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          target_route: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          target_route?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          target_route?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      placement_profiles: {
        Row: {
          aptitude_score: number | null
          coding_score: number | null
          communication_score: number | null
          created_at: string | null
          id: string
          mock_interviews_completed: number | null
          readiness_tier: string | null
          resume_score: number | null
          student_profile_id: string
          technical_score: number | null
          updated_at: string | null
        }
        Insert: {
          aptitude_score?: number | null
          coding_score?: number | null
          communication_score?: number | null
          created_at?: string | null
          id?: string
          mock_interviews_completed?: number | null
          readiness_tier?: string | null
          resume_score?: number | null
          student_profile_id: string
          technical_score?: number | null
          updated_at?: string | null
        }
        Update: {
          aptitude_score?: number | null
          coding_score?: number | null
          communication_score?: number | null
          created_at?: string | null
          id?: string
          mock_interviews_completed?: number | null
          readiness_tier?: string | null
          resume_score?: number | null
          student_profile_id?: string
          technical_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "placement_profiles_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: true
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          institution_id: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          institution_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          institution_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          completed_at: string | null
          id: string
          percentage: number
          score: number
          subject: string
          topic: string
          total_questions: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          percentage: number
          score: number
          subject: string
          topic: string
          total_questions: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          percentage?: number
          score?: number
          subject?: string
          topic?: string
          total_questions?: number
          user_id?: string | null
        }
        Relationships: []
      }
      student_enrollments: {
        Row: {
          created_at: string | null
          enrollment_date: string | null
          id: string
          offering_id: string
          status: string | null
          student_profile_id: string
        }
        Insert: {
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          offering_id: string
          status?: string | null
          student_profile_id: string
        }
        Update: {
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          offering_id?: string
          status?: string | null
          student_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "course_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_enrollments_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          attendance_percentage: number | null
          backlogs: number | null
          batch_year: number
          cgpa: number | null
          created_at: string | null
          current_semester: number | null
          current_year: number | null
          department_id: string | null
          email: string
          id: string
          institution_id: string | null
          internal_marks: number | null
          mentor_id: string | null
          name: string
          placement_readiness_score: number | null
          program_id: string | null
          risk_level: string | null
          roll_number: string
          student_success_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attendance_percentage?: number | null
          backlogs?: number | null
          batch_year?: number
          cgpa?: number | null
          created_at?: string | null
          current_semester?: number | null
          current_year?: number | null
          department_id?: string | null
          email: string
          id?: string
          institution_id?: string | null
          internal_marks?: number | null
          mentor_id?: string | null
          name: string
          placement_readiness_score?: number | null
          program_id?: string | null
          risk_level?: string | null
          roll_number: string
          student_success_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attendance_percentage?: number | null
          backlogs?: number | null
          batch_year?: number
          cgpa?: number | null
          created_at?: string | null
          current_semester?: number | null
          current_year?: number | null
          department_id?: string | null
          email?: string
          id?: string
          institution_id?: string | null
          internal_marks?: number | null
          mentor_id?: string | null
          name?: string
          placement_readiness_score?: number | null
          program_id?: string | null
          risk_level?: string | null
          roll_number?: string
          student_success_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "academic_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      study_tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          difficulty: string | null
          due_date: string
          estimated_minutes: number | null
          id: string
          priority: string | null
          student_profile_id: string | null
          subject: string
          title: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          difficulty?: string | null
          due_date: string
          estimated_minutes?: number | null
          id?: string
          priority?: string | null
          student_profile_id?: string | null
          subject: string
          title: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          difficulty?: string | null
          due_date?: string
          estimated_minutes?: number | null
          id?: string
          priority?: string | null
          student_profile_id?: string | null
          subject?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_tasks_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_masteries: {
        Row: {
          id: string
          mastery_percentage: number
          quizzes_taken: number | null
          status: string | null
          subject: string
          topic: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          mastery_percentage?: number
          quizzes_taken?: number | null
          status?: string | null
          subject: string
          topic: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          mastery_percentage?: number
          quizzes_taken?: number | null
          status?: string | null
          subject?: string
          topic?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tutor_inquiries: {
        Row: {
          created_at: string | null
          id: string
          query_mode: string | null
          question: string
          response: string | null
          student_name: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          query_mode?: string | null
          question: string
          response?: string | null
          student_name?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          query_mode?: string | null
          question?: string
          response?: string | null
          student_name?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      user_role_assignments: {
        Row: {
          created_at: string | null
          department_id: string | null
          id: string
          institution_id: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          id?: string
          institution_id?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          id?: string
          institution_id?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: { target_user_id: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
