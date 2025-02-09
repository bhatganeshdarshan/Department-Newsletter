export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      newsletter_form: {
        Row: {
          // Existing fields
          alumni_interaction: string | null
          attached_photos: string[] | null
          award_received: string | null
          best_paper_award: string | null
          boe_bos_member: string | null
          books_published: number | null
          conference_published: number | null
          department: string | null
          designation: string | null
          expert_talk: string | null
          faculty_internship: string | null
          faculty_name: string | null
          fdp_details: string | null
          fdps_attended: number | null
          id: number
          industrial_visit_date: string | null
          industrial_visit_department: string | null
          industrial_visit_place: string | null
          industrial_visit_semester: string | null
          industrial_visit_students: number | null
          journal_published: number | null
          moocs_completed: number | null
          mou_date: string | null
          mou_org: string | null
          nptel_completed: number | null
          other_initiatives: string | null
          research_center_activities: string | null 
          research_center_activity_date: string | null
          research_center_activity_name: string | null
          research_center_details: string | null
          research_center_participants: number | null
          research_cost: number | null
          research_date: string | null
          research_organization: string | null
          research_proposals_granted: string | null
          research_proposals_submitted: string | null
          research_title: string | null
          session_chair: string | null
          student_achievements: string | null
          student_internship: string | null
          tab_section: string
          tech_fest_details: string | null
          workshop_end_date: string | null
          workshop_name: string | null
          workshop_start_date: string | null

          // New Fields – MoU / Awards / Recognitions
          resource_event_name: string | null
          resource_date: string | null
          resource_institution: string | null
          resource_topic: string | null
          award_research_title: string | null
          award_conference_journal: string | null
          award_name: string | null
          award_given_by: string | null
          outreach_activity_name: string | null
          outreach_place: string | null
          outreach_date: string | null
          collaborative_research_partner: string | null
          collaborative_research_description: string | null

          // New Fields – Industry – Institute Interaction
          industrial_visit_faculty_coordinators: string | null
          faculty_internship_company: string | null
          faculty_internship_start_date: string | null
          faculty_internship_end_date: string | null
          faculty_internship_description: string | null
          student_internship_name: string | null
          student_internship_company: string | null
          student_internship_start_date: string | null
          student_internship_end_date: string | null

          // New Fields – Workshops / FDPs / Fests
          workshop_participants: number | null
          workshop_resource_person: string | null
          fdp_duration: string | null
          fdp_resource_person: string | null
          fdp_institution: string | null
          tech_fest_event_name: string | null
          tech_fest_date: string | null
          tech_fest_participating_colleges: number | null

          // New Fields – Seminars / Expert Talks / Alumni Interaction
          expert_talk_topic: string | null
          expert_talk_speaker_name: string | null
          expert_talk_speaker_affiliation: string | null
          expert_talk_audience: number | null
          expert_talk_date: string | null
          alumni_name: string | null
          alumni_graduation_year: number | null
          alumni_company: string | null
          alumni_topic: string | null

          // New Fields – Research Work
          research_funding_organization: string | null
          research_approval_date: string | null
          research_collaborative_partner: string | null
          research_collaboration_duration: string | null
          research_collaboration_outcomes: string | null

          // New Fields – Summary Sheet
          faculty_books_chapters: number | null
          faculty_collaborative_research: number | null
          faculty_expert_talks: number | null
          faculty_alumni_talks: number | null
          faculty_industrial_visits: number | null
          faculty_mous_operational: number | null
          faculty_consultancy_completed: number | null
          faculty_edp_completed: number | null
          faculty_talks_delivered: number | null
          student_conference_papers: number | null
          student_journal_papers: number | null
          student_conferences_attended: number | null
          student_hackathons: number | null
          student_moocs_completed: number | null
          student_nptel_completed: number | null
          student_aicte_participation: number | null
          sports_events_count: number | null
          placement_companies: number | null
          placement_ctc: string | null
          hec_events_count: number | null
          ncc_bicep_events_count: number | null
        }
        Insert: {
          // Existing fields (all optional except tab_section)
          alumni_interaction?: string | null
          attached_photos?: string[] | null
          award_received?: string | null
          best_paper_award?: string | null
          boe_bos_member?: string | null
          books_published?: number | null
          conference_published?: number | null
          department?: string | null
          designation?: string | null
          expert_talk?: string | null
          faculty_internship?: string | null
          faculty_name?: string | null
          fdp_details?: string | null
          fdps_attended?: number | null
          id?: number
          industrial_visit_date?: string | null
          industrial_visit_department?: string | null
          industrial_visit_place?: string | null
          industrial_visit_semester?: string | null
          industrial_visit_students?: number | null
          journal_published?: number | null
          moocs_completed?: number | null
          mou_date?: string | null
          mou_org?: string | null
          nptel_completed?: number | null
          other_initiatives?: string | null
          research_center_activities?: string | null
          research_center_activity_date?: string | null
          research_center_activity_name?: string | null
          research_center_details?: string | null
          research_center_participants?: number | null
          research_cost?: number | null
          research_date?: string | null
          research_organization?: string | null
          research_proposals_granted?: string | null
          research_proposals_submitted?: string | null
          research_title?: string | null
          session_chair?: string | null
          student_achievements?: string | null
          student_internship?: string | null
          tab_section: string
          tech_fest_details?: string | null
          workshop_end_date?: string | null
          workshop_name?: string | null
          workshop_start_date?: string | null

          // New Fields – MoU / Awards / Recognitions
          resource_event_name?: string | null
          resource_date?: string | null
          resource_institution?: string | null
          resource_topic?: string | null
          award_research_title?: string | null
          award_conference_journal?: string | null
          award_name?: string | null
          award_given_by?: string | null
          outreach_activity_name?: string | null
          outreach_place?: string | null
          outreach_date?: string | null
          collaborative_research_partner?: string | null
          collaborative_research_description?: string | null

          // New Fields – Industry – Institute Interaction
          industrial_visit_faculty_coordinators?: string | null
          faculty_internship_company?: string | null
          faculty_internship_start_date?: string | null
          faculty_internship_end_date?: string | null
          faculty_internship_description?: string | null
          student_internship_name?: string | null
          student_internship_company?: string | null
          student_internship_start_date?: string | null
          student_internship_end_date?: string | null

          // New Fields – Workshops / FDPs / Fests
          workshop_participants?: number | null
          workshop_resource_person?: string | null
          fdp_duration?: string | null
          fdp_resource_person?: string | null
          fdp_institution?: string | null
          tech_fest_event_name?: string | null
          tech_fest_date?: string | null
          tech_fest_participating_colleges?: number | null

          // New Fields – Seminars / Expert Talks / Alumni Interaction
          expert_talk_topic?: string | null
          expert_talk_speaker_name?: string | null
          expert_talk_speaker_affiliation?: string | null
          expert_talk_audience?: number | null
          expert_talk_date?: string | null
          alumni_name?: string | null
          alumni_graduation_year?: number | null
          alumni_company?: string | null
          alumni_topic?: string | null

          // New Fields – Research Work
          research_funding_organization?: string | null
          research_approval_date?: string | null
          research_collaborative_partner?: string | null
          research_collaboration_duration?: string | null
          research_collaboration_outcomes?: string | null

          // New Fields – Summary Sheet
          faculty_books_chapters?: number | null
          faculty_collaborative_research?: number | null
          faculty_expert_talks?: number | null
          faculty_alumni_talks?: number | null
          faculty_industrial_visits?: number | null
          faculty_mous_operational?: number | null
          faculty_consultancy_completed?: number | null
          faculty_edp_completed?: number | null
          faculty_talks_delivered?: number | null
          student_conference_papers?: number | null
          student_journal_papers?: number | null
          student_conferences_attended?: number | null
          student_hackathons?: number | null
          student_moocs_completed?: number | null
          student_nptel_completed?: number | null
          student_aicte_participation?: number | null
          sports_events_count?: number | null
          placement_companies?: number | null
          placement_ctc?: string | null
          hec_events_count?: number | null
          ncc_bicep_events_count?: number | null
        }
        Update: {
          // Existing fields (all optional)
          alumni_interaction?: string | null
          attached_photos?: string[] | null
          award_received?: string | null
          best_paper_award?: string | null
          boe_bos_member?: string | null
          books_published?: number | null
          conference_published?: number | null
          department?: string | null
          designation?: string | null
          expert_talk?: string | null
          faculty_internship?: string | null
          faculty_name?: string | null
          fdp_details?: string | null
          fdps_attended?: number | null
          id?: number
          industrial_visit_date?: string | null
          industrial_visit_department?: string | null
          industrial_visit_place?: string | null
          industrial_visit_semester?: string | null
          industrial_visit_students?: number | null
          journal_published?: number | null
          moocs_completed?: number | null
          mou_date?: string | null
          mou_org?: string | null
          nptel_completed?: number | null
          other_initiatives?: string | null
          research_center_activity_date?: string | null
          research_center_activity_name?: string | null
          research_center_activities?: string | null
          research_center_details?: string | null
          research_center_participants?: number | null
          research_cost?: number | null
          research_date?: string | null
          research_organization?: string | null
          research_proposals_granted?: string | null
          research_proposals_submitted?: string | null
          research_title?: string | null
          session_chair?: string | null
          student_achievements?: string | null
          student_internship?: string | null
          tab_section?: string
          tech_fest_details?: string | null
          workshop_end_date?: string | null
          workshop_name?: string | null
          workshop_start_date?: string | null

          // New Fields – MoU / Awards / Recognitions
          resource_event_name?: string | null
          resource_date?: string | null
          resource_institution?: string | null
          resource_topic?: string | null
          award_research_title?: string | null
          award_conference_journal?: string | null
          award_name?: string | null
          award_given_by?: string | null
          outreach_activity_name?: string | null
          outreach_place?: string | null
          outreach_date?: string | null
          collaborative_research_partner?: string | null
          collaborative_research_description?: string | null

          // New Fields – Industry – Institute Interaction
          industrial_visit_faculty_coordinators?: string | null
          faculty_internship_company?: string | null
          faculty_internship_start_date?: string | null
          faculty_internship_end_date?: string | null
          faculty_internship_description?: string | null
          student_internship_name?: string | null
          student_internship_company?: string | null
          student_internship_start_date?: string | null
          student_internship_end_date?: string | null

          // New Fields – Workshops / FDPs / Fests
          workshop_participants?: number | null
          workshop_resource_person?: string | null
          fdp_duration?: string | null
          fdp_resource_person?: string | null
          fdp_institution?: string | null
          tech_fest_event_name?: string | null
          tech_fest_date?: string | null
          tech_fest_participating_colleges?: number | null

          // New Fields – Seminars / Expert Talks / Alumni Interaction
          expert_talk_topic?: string | null
          expert_talk_speaker_name?: string | null
          expert_talk_speaker_affiliation?: string | null
          expert_talk_audience?: number | null
          expert_talk_date?: string | null
          alumni_name?: string | null
          alumni_graduation_year?: number | null
          alumni_company?: string | null
          alumni_topic?: string | null

          // New Fields – Research Work
          research_funding_organization?: string | null
          research_approval_date?: string | null
          research_collaborative_partner?: string | null
          research_collaboration_duration?: string | null
          research_collaboration_outcomes?: string | null

          // New Fields – Summary Sheet
          faculty_books_chapters?: number | null
          faculty_collaborative_research?: number | null
          faculty_expert_talks?: number | null
          faculty_alumni_talks?: number | null
          faculty_industrial_visits?: number | null
          faculty_mous_operational?: number | null
          faculty_consultancy_completed?: number | null
          faculty_edp_completed?: number | null
          faculty_talks_delivered?: number | null
          student_conference_papers?: number | null
          student_journal_papers?: number | null
          student_conferences_attended?: number | null
          student_hackathons?: number | null
          student_moocs_completed?: number | null
          student_nptel_completed?: number | null
          student_aicte_participation?: number | null
          sports_events_count?: number | null
          placement_companies?: number | null
          placement_ctc?: string | null
          hec_events_count?: number | null
          ncc_bicep_events_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
  
// The following helper types remain unchanged:

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
