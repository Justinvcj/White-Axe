export type UserRole = 'SuperAdmin' | 'Admin' | 'Teacher' | 'Student' | 'Parent';
export type StudentTier = 'C1' | 'C2' | 'C3' | 'UNASSIGNED';

export interface School { id: string; name: string; domain?: string | null; created_at: string; updated_at: string; }
export interface User { id: string; school_id: string; role: UserRole; first_name: string; last_name: string; email: string; created_at: string; updated_at: string; }
export interface Class { id: string; school_id: string; name: string; grade_level: number; created_at: string; updated_at: string; }
export interface Subject { id: string; school_id: string; name: string; created_at: string; updated_at: string; }
export interface Topic { id: string; subject_id: string; name: string; description?: string | null; order_index: number; created_at: string; updated_at: string; }
export interface KnowledgeGraphEdge { id: string; parent_topic_id: string; child_topic_id: string; dependency_weight?: number; created_at: string; }
export interface StudentProfile { user_id: string; current_tier?: StudentTier | null; clickstream_confidence_index?: number | null; overall_mastery_score?: number | null; created_at: string; updated_at: string; }
export interface TeacherObservation { id?: string; teacher_id: string; student_id: string; topic_id: string; observed_tier: StudentTier; notes?: string | null; created_at?: string; }
export interface Assessment { id: string; class_id: string; topic_id: string; scheduled_at?: string | null; status?: string; created_at: string; updated_at: string; }
export interface Question { id: string; assessment_id: string; content: string; complexity_level: number; created_at: string; updated_at: string; }
export interface StudentResponse { id?: string; assessment_id: string; question_id: string; student_id: string; response_data?: Record<string, unknown>; is_correct?: boolean | null; response_latency_ms?: number | null; created_at?: string; }
export interface ParentFeedback { id: string; parent_id: string; student_id: string; reported_interests?: string[] | null; created_at: string; }
export interface CompatibilityScore { id: string; teacher_id: string; compatibility_index?: number | null; calculated_at?: string; created_at: string; updated_at: string; }

export interface Database {
  public: {
    Tables: {
      schools: { Row: School; Insert: Partial<School>; Update: Partial<School>; };
      users: { Row: User; Insert: Partial<User>; Update: Partial<User>; };
      classes: { Row: Class; Insert: Partial<Class>; Update: Partial<Class>; };
      subjects: { Row: Subject; Insert: Partial<Subject>; Update: Partial<Subject>; };
      topics: { Row: Topic; Insert: Partial<Topic>; Update: Partial<Topic>; };
      knowledge_graph_edges: { Row: KnowledgeGraphEdge; Insert: Partial<KnowledgeGraphEdge>; Update: Partial<KnowledgeGraphEdge>; };
      student_profiles: { Row: StudentProfile; Insert: Partial<StudentProfile>; Update: Partial<StudentProfile>; };
      teacher_observations: { Row: TeacherObservation; Insert: Partial<TeacherObservation>; Update: Partial<TeacherObservation>; };
      assessments: { Row: Assessment; Insert: Partial<Assessment>; Update: Partial<Assessment>; };
      questions: { Row: Question; Insert: Partial<Question>; Update: Partial<Question>; };
      student_responses: { Row: StudentResponse; Insert: Partial<StudentResponse>; Update: Partial<StudentResponse>; };
      parent_feedbacks: { Row: ParentFeedback; Insert: Partial<ParentFeedback>; Update: Partial<ParentFeedback>; };
      compatibility_scores: { Row: CompatibilityScore; Insert: Partial<CompatibilityScore>; Update: Partial<CompatibilityScore>; };
    };
  };
}
