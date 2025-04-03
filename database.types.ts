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
          // ───────────── Existing Fields ─────────────
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

          // ───────────── “Old” New Fields ─────────────
          // (MoU / Awards / Recognitions)
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

          // (Industry – Institute Interaction)
          industrial_visit_faculty_coordinators: string | null
          faculty_internship_company: string | null
          faculty_internship_start_date: string | null
          faculty_internship_end_date: string | null
          faculty_internship_description: string | null
          student_internship_name: string | null
          student_internship_company: string | null
          student_internship_start_date: string | null
          student_internship_end_date: string | null

          // (Workshops / FDPs / Fests)
          workshop_participants: number | null
          workshop_resource_person: string | null
          fdp_duration: string | null
          fdp_resource_person: string | null
          fdp_institution: string | null
          tech_fest_event_name: string | null
          tech_fest_date: string | null
          tech_fest_participating_colleges: number | null

          // (Seminars / Expert Talks / Alumni Interaction)
          expert_talk_topic: string | null
          expert_talk_speaker_name: string | null
          expert_talk_speaker_affiliation: string | null
          expert_talk_audience: number | null
          expert_talk_date: string | null
          alumni_name: string | null
          alumni_graduation_year: number | null
          alumni_company: string | null
          alumni_topic: string | null

          // (Research Work)
          research_funding_organization: string | null
          research_approval_date: string | null
          research_collaborative_partner: string | null
          research_collaboration_duration: string | null
          research_collaboration_outcomes: string | null

          // (Summary Sheet)
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

          // ───────────── Brand-New Fields (from final code) ─────────────
          // (Faculty as Resource Person)
          resource_faculty_name: string | null
          resource_faculty_designation: string | null
          resource_faculty_department: string | null
          resource_activity_name: string | null
          resource_place: string | null
          resource_date_new: string | null
          resource_photos: string[] | null

          // (Faculty Awards - new paper work fields)
          fa_paper_title: string | null
          fa_author_names: string | null
          fa_international_journal_name: string | null
          fa_international_conf_name: string | null
          fa_conference_name: string | null
          fa_book_chapter_title: string | null
          fa_publisher_name: string | null
          fa_editor_names: string | null
          fa_doi: string | null
          fa_volume: string | null
          fa_publication_name: string | null
          fa_publication_date: string | null
          fa_presentation_date: string | null
          fa_certificates: string[] | null
          fa_award_name: string | null
          fa_awarded_by: string | null
          fa_location: string | null
          fa_mode: string | null
          fa_pub_type: string | null

          // (MoU Collaborative Research - new fields)
          collab_faculty_name: string | null
          collab_faculty_designation: string | null
          collab_faculty_department: string | null
          collab_place: string | null
          collab_date: string | null
          collab_photos: string[] | null

          // (Faculty Internship - new fields)
          fi_faculty_name: string | null
          fi_faculty_designation: string | null
          fi_faculty_department: string | null
          fi_place: string | null
          fi_photos: string[] | null

          // (Student Internship - new fields)
          si_student_name_new: string | null
          si_student_designation: string | null
          si_student_department: string | null
          si_place: string | null
          si_photos: string[] | null

          // (Workshops - new fields)
          ws_faculty_coordinator_name: string | null
          ws_faculty_coordinator_designation: string | null
          ws_department: string | null
          ws_place: string | null
          ws_photos: string[] | null
          ws_description: string | null

          // (FDP - new fields)
          fdp_faculty_coordinator_name: string | null
          fdp_faculty_coordinator_designation: string | null
          fdp_department: string | null
          fdp_place: string | null
          fdp_date: string | null
          fdp_photos: string[] | null
          fdp_description: string | null

          // (Technical Fest - new fields)
          tf_faculty_coordinator_name: string | null
          tf_faculty_coordinator_designation: string | null
          tf_department: string | null
          tf_place: string | null
          tf_date: string | null
          tf_photos: string[] | null
          tf_description: string | null

          // (Expert Talk - new fields)
          et_department_new: string | null
          et_faculty_coordinator_name: string | null
          et_faculty_coordinator_designation: string | null
          et_dep_2: string | null
          et_place: string | null
          et_date_new: string | null
          et_photos: string[] | null
          et_description: string | null

          // (Alumni Interaction - new fields)
          alumni_photo: string[] | null
          alumni_department_new: string | null
          alumni_date_new: string | null

          // (Research Work - new fields)
          rw_faculty_name: string | null
          rw_faculty_designation: string | null
          rw_faculty_department: string | null
          rw_organization: string | null
          rw_title_of_project: string | null
          rw_place: string | null
          rw_photos: string[] | null
          // note: rw_total_cost was commented out in your code snippet,
          // but if you want it, add it here:
          // rw_total_cost: number | null

          // (Publications – Faculty)
          fpub_paper_title: string | null
          fpub_author_names: string | null
          fpub_international_journal_name: string | null
          fpub_int_conf_name: string | null
          fpub_national_conf: string | null
          fpub_conference_name: string | null
          fpub_book_chapter_title: string | null
          fpub_publisher_name: string | null
          fpub_editor_names: string | null
          fpub_doi: string | null
          fpub_volume_issn_impact: string | null
          fpub_volume_of_publication: string | null
          fpub_publication_name: string | null
          fpub_publication_date: string | null
          fpub_presentation_date: string | null
          fpub_certificates: string[] | null
          fpub_award_name: string | null
          fpub_awarded_by: string | null
          fpub_location: string | null
          fpub_mode: string | null
          fpub_pub_type: string | null
          fpub_google_scholar_id: string | null

          // (Publications – Students)
          spub_paper_title: string | null
          spub_author_names: string | null
          spub_international_journal_name: string | null
          spub_international_conf_name: string | null
          spub_conference_name: string | null
          spub_book_chapter_title: string | null
          spub_publisher_name: string | null
          spub_editor_names: string | null
          spub_doi: string | null
          spub_volume_of_publication: string | null
          spub_publication_name: string | null
          spub_publication_date: string | null
          spub_presentation_date: string | null
          spub_certificates: string[] | null
          spub_award_name: string | null
          spub_awarded_by: string | null
          spub_location: string | null
          spub_mode: string | null
          spub_pub_type: string | null
          spub_google_scholar_id: string | null
        }
        Insert: {
          // ───── Everything from "Row", but optional except `tab_section` ─────
          tab_section: string

          // Existing fields
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
          tech_fest_details?: string | null
          workshop_end_date?: string | null
          workshop_name?: string | null
          workshop_start_date?: string | null

          // “Old” New Fields
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
          industrial_visit_faculty_coordinators?: string | null
          faculty_internship_company?: string | null
          faculty_internship_start_date?: string | null
          faculty_internship_end_date?: string | null
          faculty_internship_description?: string | null
          student_internship_name?: string | null
          student_internship_company?: string | null
          student_internship_start_date?: string | null
          student_internship_end_date?: string | null
          workshop_participants?: number | null
          workshop_resource_person?: string | null
          fdp_duration?: string | null
          fdp_resource_person?: string | null
          fdp_institution?: string | null
          tech_fest_event_name?: string | null
          tech_fest_date?: string | null
          tech_fest_participating_colleges?: number | null
          expert_talk_topic?: string | null
          expert_talk_speaker_name?: string | null
          expert_talk_speaker_affiliation?: string | null
          expert_talk_audience?: number | null
          expert_talk_date?: string | null
          alumni_name?: string | null
          alumni_graduation_year?: number | null
          alumni_company?: string | null
          alumni_topic?: string | null
          research_funding_organization?: string | null
          research_approval_date?: string | null
          research_collaborative_partner?: string | null
          research_collaboration_duration?: string | null
          research_collaboration_outcomes?: string | null
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

          // ───────────── Brand-New Fields ─────────────
          resource_faculty_name?: string | null
          resource_faculty_designation?: string | null
          resource_faculty_department?: string | null
          resource_activity_name?: string | null
          resource_place?: string | null
          resource_date_new?: string | null
          resource_photos?: string[] | null

          fa_paper_title?: string | null
          fa_author_names?: string | null
          fa_international_journal_name?: string | null
          fa_international_conf_name?: string | null
          fa_conference_name?: string | null
          fa_book_chapter_title?: string | null
          fa_publisher_name?: string | null
          fa_editor_names?: string | null
          fa_doi?: string | null
          fa_volume?: string | null
          fa_publication_name?: string | null
          fa_publication_date?: string | null
          fa_presentation_date?: string | null
          fa_certificates?: string[] | null
          fa_award_name?: string | null
          fa_awarded_by?: string | null
          fa_location?: string | null
          fa_mode?: string | null
          fa_pub_type?: string | null

          collab_faculty_name?: string | null
          collab_faculty_designation?: string | null
          collab_faculty_department?: string | null
          collab_place?: string | null
          collab_date?: string | null
          collab_photos?: string[] | null

          fi_faculty_name?: string | null
          fi_faculty_designation?: string | null
          fi_faculty_department?: string | null
          fi_place?: string | null
          fi_photos?: string[] | null

          si_student_name_new?: string | null
          si_student_designation?: string | null
          si_student_department?: string | null
          si_place?: string | null
          si_photos?: string[] | null

          ws_faculty_coordinator_name?: string | null
          ws_faculty_coordinator_designation?: string | null
          ws_department?: string | null
          ws_place?: string | null
          ws_photos?: string[] | null
          ws_description?: string | null

          fdp_faculty_coordinator_name?: string | null
          fdp_faculty_coordinator_designation?: string | null
          fdp_department?: string | null
          fdp_place?: string | null
          fdp_date?: string | null
          fdp_photos?: string[] | null
          fdp_description?: string | null

          tf_faculty_coordinator_name?: string | null
          tf_faculty_coordinator_designation?: string | null
          tf_department?: string | null
          tf_place?: string | null
          tf_date?: string | null
          tf_photos?: string[] | null
          tf_description?: string | null

          et_department_new?: string | null
          et_faculty_coordinator_name?: string | null
          et_faculty_coordinator_designation?: string | null
          et_dep_2?: string | null
          et_place?: string | null
          et_date_new?: string | null
          et_photos?: string[] | null
          et_description?: string | null

          alumni_photo?: string[] | null
          alumni_department_new?: string | null
          alumni_date_new?: string | null

          rw_faculty_name?: string | null
          rw_faculty_designation?: string | null
          rw_faculty_department?: string | null
          rw_organization?: string | null
          rw_title_of_project?: string | null
          rw_place?: string | null
          rw_photos?: string[] | null
          // rw_total_cost?: number | null

          fpub_paper_title?: string | null
          fpub_author_names?: string | null
          fpub_international_journal_name?: string | null
          fpub_int_conf_name?: string | null
          fpub_national_conf?: string | null
          fpub_conference_name?: string | null
          fpub_book_chapter_title?: string | null
          fpub_publisher_name?: string | null
          fpub_editor_names?: string | null
          fpub_doi?: string | null
          fpub_volume_issn_impact?: string | null
          fpub_volume_of_publication?: string | null
          fpub_publication_name?: string | null
          fpub_publication_date?: string | null
          fpub_presentation_date?: string | null
          fpub_certificates?: string[] | null
          fpub_award_name?: string | null
          fpub_awarded_by?: string | null
          fpub_location?: string | null
          fpub_mode?: string | null
          fpub_pub_type?: string | null
          fpub_google_scholar_id?: string | null

          spub_paper_title?: string | null
          spub_author_names?: string | null
          spub_international_journal_name?: string | null
          spub_international_conf_name?: string | null
          spub_conference_name?: string | null
          spub_book_chapter_title?: string | null
          spub_publisher_name?: string | null
          spub_editor_names?: string | null
          spub_doi?: string | null
          spub_volume_of_publication?: string | null
          spub_publication_name?: string | null
          spub_publication_date?: string | null
          spub_presentation_date?: string | null
          spub_certificates?: string[] | null
          spub_award_name?: string | null
          spub_awarded_by?: string | null
          spub_location?: string | null
          spub_mode?: string | null
          spub_pub_type?: string | null
          spub_google_scholar_id?: string | null
        }
        Update: {
          // Same shape as Insert, but all optional
          tab_section?: string
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
          tech_fest_details?: string | null
          workshop_end_date?: string | null
          workshop_name?: string | null
          workshop_start_date?: string | null
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
          industrial_visit_faculty_coordinators?: string | null
          faculty_internship_company?: string | null
          faculty_internship_start_date?: string | null
          faculty_internship_end_date?: string | null
          faculty_internship_description?: string | null
          student_internship_name?: string | null
          student_internship_company?: string | null
          student_internship_start_date?: string | null
          student_internship_end_date?: string | null
          workshop_participants?: number | null
          workshop_resource_person?: string | null
          fdp_duration?: string | null
          fdp_resource_person?: string | null
          fdp_institution?: string | null
          tech_fest_event_name?: string | null
          tech_fest_date?: string | null
          tech_fest_participating_colleges?: number | null
          expert_talk_topic?: string | null
          expert_talk_speaker_name?: string | null
          expert_talk_speaker_affiliation?: string | null
          expert_talk_audience?: number | null
          expert_talk_date?: string | null
          alumni_name?: string | null
          alumni_graduation_year?: number | null
          alumni_company?: string | null
          alumni_topic?: string | null
          research_funding_organization?: string | null
          research_approval_date?: string | null
          research_collaborative_partner?: string | null
          research_collaboration_duration?: string | null
          research_collaboration_outcomes?: string | null
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

          // Brand-New Fields
          resource_faculty_name?: string | null
          resource_faculty_designation?: string | null
          resource_faculty_department?: string | null
          resource_activity_name?: string | null
          resource_place?: string | null
          resource_date_new?: string | null
          resource_photos?: string[] | null

          fa_paper_title?: string | null
          fa_author_names?: string | null
          fa_international_journal_name?: string | null
          fa_international_conf_name?: string | null
          fa_conference_name?: string | null
          fa_book_chapter_title?: string | null
          fa_publisher_name?: string | null
          fa_editor_names?: string | null
          fa_doi?: string | null
          fa_volume?: string | null
          fa_publication_name?: string | null
          fa_publication_date?: string | null
          fa_presentation_date?: string | null
          fa_certificates?: string[] | null
          fa_award_name?: string | null
          fa_awarded_by?: string | null
          fa_location?: string | null
          fa_mode?: string | null
          fa_pub_type?: string | null

          collab_faculty_name?: string | null
          collab_faculty_designation?: string | null
          collab_faculty_department?: string | null
          collab_place?: string | null
          collab_date?: string | null
          collab_photos?: string[] | null

          fi_faculty_name?: string | null
          fi_faculty_designation?: string | null
          fi_faculty_department?: string | null
          fi_place?: string | null
          fi_photos?: string[] | null

          si_student_name_new?: string | null
          si_student_designation?: string | null
          si_student_department?: string | null
          si_place?: string | null
          si_photos?: string[] | null

          ws_faculty_coordinator_name?: string | null
          ws_faculty_coordinator_designation?: string | null
          ws_department?: string | null
          ws_place?: string | null
          ws_photos?: string[] | null
          ws_description?: string | null

          fdp_faculty_coordinator_name?: string | null
          fdp_faculty_coordinator_designation?: string | null
          fdp_department?: string | null
          fdp_place?: string | null
          fdp_date?: string | null
          fdp_photos?: string[] | null
          fdp_description?: string | null

          tf_faculty_coordinator_name?: string | null
          tf_faculty_coordinator_designation?: string | null
          tf_department?: string | null
          tf_place?: string | null
          tf_date?: string | null
          tf_photos?: string[] | null
          tf_description?: string | null

          et_department_new?: string | null
          et_faculty_coordinator_name?: string | null
          et_faculty_coordinator_designation?: string | null
          et_dep_2?: string | null
          et_place?: string | null
          et_date_new?: string | null
          et_photos?: string[] | null
          et_description?: string | null

          alumni_photo?: string[] | null
          alumni_department_new?: string | null
          alumni_date_new?: string | null

          rw_faculty_name?: string | null
          rw_faculty_designation?: string | null
          rw_faculty_department?: string | null
          rw_organization?: string | null
          rw_title_of_project?: string | null
          rw_place?: string | null
          rw_photos?: string[] | null
          // rw_total_cost?: number | null

          fpub_paper_title?: string | null
          fpub_author_names?: string | null
          fpub_international_journal_name?: string | null
          fpub_int_conf_name?: string | null
          fpub_national_conf?: string | null
          fpub_conference_name?: string | null
          fpub_book_chapter_title?: string | null
          fpub_publisher_name?: string | null
          fpub_editor_names?: string | null
          fpub_doi?: string | null
          fpub_volume_issn_impact?: string | null
          fpub_volume_of_publication?: string | null
          fpub_publication_name?: string | null
          fpub_publication_date?: string | null
          fpub_presentation_date?: string | null
          fpub_certificates?: string[] | null
          fpub_award_name?: string | null
          fpub_awarded_by?: string | null
          fpub_location?: string | null
          fpub_mode?: string | null
          fpub_pub_type?: string | null
          fpub_google_scholar_id?: string | null

          spub_paper_title?: string | null
          spub_author_names?: string | null
          spub_international_journal_name?: string | null
          spub_international_conf_name?: string | null
          spub_conference_name?: string | null
          spub_book_chapter_title?: string | null
          spub_publisher_name?: string | null
          spub_editor_names?: string | null
          spub_doi?: string | null
          spub_volume_of_publication?: string | null
          spub_publication_name?: string | null
          spub_publication_date?: string | null
          spub_presentation_date?: string | null
          spub_certificates?: string[] | null
          spub_award_name?: string | null
          spub_awarded_by?: string | null
          spub_location?: string | null
          spub_mode?: string | null
          spub_pub_type?: string | null
          spub_google_scholar_id?: string | null
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
