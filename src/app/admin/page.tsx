'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { supabase } from '../../../dbConfig'
import * as XLSX from 'xlsx'

interface dTypes {
  data: any,
  error: any,
  count: any,
}

// S3 endpoint for photos
const S3_ENDPOINT = 'https://phyeyoqcciwclxsomwcg.supabase.co/storage/v1/object/public/newsletter-photos/'

// Define an array of new (extra) field definitions for the detailed view.
const extraFields = [
  { label: 'Resource Event Name', key: 'resource_event_name' },
  { label: 'Resource Date', key: 'resource_date' },
  { label: 'Resource Institution', key: 'resource_institution' },
  { label: 'Resource Topic', key: 'resource_topic' },
  { label: 'Award Research Title', key: 'award_research_title' },
  { label: 'Award Conference/Journal', key: 'award_conference_journal' },
  { label: 'Award Name', key: 'award_name' },
  { label: 'Award Given By', key: 'award_given_by' },
  { label: 'Outreach Activity Name', key: 'outreach_activity_name' },
  { label: 'Outreach Place', key: 'outreach_place' },
  { label: 'Outreach Date', key: 'outreach_date' },
  { label: 'Collaborative Research Partner', key: 'collaborative_research_partner' },
  { label: 'Collaborative Research Description', key: 'collaborative_research_description' },
  { label: 'Industrial Visit Faculty Coordinators', key: 'industrial_visit_faculty_coordinators' },
  { label: 'Faculty Internship Company', key: 'faculty_internship_company' },
  { label: 'Faculty Internship Start Date', key: 'faculty_internship_start_date' },
  { label: 'Faculty Internship End Date', key: 'faculty_internship_end_date' },
  { label: 'Faculty Internship Description', key: 'faculty_internship_description' },
  { label: 'Student Internship Name', key: 'student_internship_name' },
  { label: 'Student Internship Company', key: 'student_internship_company' },
  { label: 'Student Internship Start Date', key: 'student_internship_start_date' },
  { label: 'Student Internship End Date', key: 'student_internship_end_date' },
  { label: 'Workshop Participants', key: 'workshop_participants' },
  { label: 'Workshop Resource Person', key: 'workshop_resource_person' },
  { label: 'FDP Duration', key: 'fdp_duration' },
  { label: 'FDP Resource Person', key: 'fdp_resource_person' },
  { label: 'FDP Institution', key: 'fdp_institution' },
  { label: 'Tech Fest Event Name', key: 'tech_fest_event_name' },
  { label: 'Tech Fest Date', key: 'tech_fest_date' },
  { label: 'Tech Fest Participating Colleges', key: 'tech_fest_participating_colleges' },
  { label: 'Expert Talk Topic', key: 'expert_talk_topic' },
  { label: 'Expert Talk Speaker Name', key: 'expert_talk_speaker_name' },
  { label: 'Expert Talk Speaker Affiliation', key: 'expert_talk_speaker_affiliation' },
  { label: 'Expert Talk Audience', key: 'expert_talk_audience' },
  { label: 'Expert Talk Date', key: 'expert_talk_date' },
  { label: 'Alumni Name', key: 'alumni_name' },
  { label: 'Alumni Graduation Year', key: 'alumni_graduation_year' },
  { label: 'Alumni Company', key: 'alumni_company' },
  { label: 'Alumni Topic', key: 'alumni_topic' },
  { label: 'Research Funding Organization', key: 'research_funding_organization' },
  { label: 'Research Approval Date', key: 'research_approval_date' },
  { label: 'Research Collaborative Partner', key: 'research_collaborative_partner' },
  { label: 'Research Collaboration Duration', key: 'research_collaboration_duration' },
  { label: 'Research Collaboration Outcomes', key: 'research_collaboration_outcomes' },
  { label: 'Faculty Books Chapters', key: 'faculty_books_chapters' },
  { label: 'Faculty Collaborative Research', key: 'faculty_collaborative_research' },
  { label: 'Faculty Expert Talks', key: 'faculty_expert_talks' },
  { label: 'Faculty Alumni Talks', key: 'faculty_alumni_talks' },
  { label: 'Faculty Industrial Visits', key: 'faculty_industrial_visits' },
  { label: 'Faculty MoUs Operational', key: 'faculty_mous_operational' },
  { label: 'Faculty Consultancy Completed', key: 'faculty_consultancy_completed' },
  { label: 'Faculty EDP Completed', key: 'faculty_edp_completed' },
  { label: 'Faculty Talks Delivered', key: 'faculty_talks_delivered' },
  { label: 'Student Conference Papers', key: 'student_conference_papers' },
  { label: 'Student Journal Papers', key: 'student_journal_papers' },
  { label: 'Student Conferences Attended', key: 'student_conferences_attended' },
  { label: 'Student Hackathons', key: 'student_hackathons' },
  { label: 'Student MOOCs Completed', key: 'student_moocs_completed' },
  { label: 'Student NPTEL Completed', key: 'student_nptel_completed' },
  { label: 'Student AICTE Participation', key: 'student_aicte_participation' },
  { label: 'Sports Events Count', key: 'sports_events_count' },
  { label: 'Placement Companies', key: 'placement_companies' },
  { label: 'Placement CTC', key: 'placement_ctc' },
  { label: 'HEC Events Count', key: 'hec_events_count' },
  { label: 'NCC/BICEP Events Count', key: 'ncc_bicep_events_count' },
]

const NewsletterAdmin = () => {
  const [data, setData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchData()
  }, [currentPage])

  const fetchData = async () => {
    const { data, error, count }: dTypes = await supabase
      .from('newsletter_form')
      .select('*', { count: 'exact' })
      .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

    if (error) console.error('Error fetching data:', error)
    else {
      setData(data)
      setTotalPages(Math.ceil(count / itemsPerPage))
    }
  }

  const handleDelete = async (id: any) => {
    const { error } = await supabase
      .from('newsletter_form')
      .delete()
      .eq('id', id)

    if (error) console.error('Error deleting item:', error)
    else fetchData()
  }

  const handleDownload = async () => {
    const { data, error }: dTypes = await supabase
      .from('newsletter_form')
      .select('*')

    if (error) {
      console.error('Error fetching data for download:', error)
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Newsletter Form Data')
    XLSX.writeFile(workbook, 'newsletter_form_data.xlsx')
  }

  const getPhotoUrl = (path: string) => {
    return `${S3_ENDPOINT}${path}`
  }

  const toggleExpandedRow = (id: number) => {
    if (expandedRow === id) setExpandedRow(null)
    else setExpandedRow(id)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Newsletter Form Admin Panel</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <Button onClick={handleDownload}>Download XLSX</Button>
      </div>
      <div className="overflow-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tab Section</TableHead>
              <TableHead>MOU Org</TableHead>
              <TableHead>MOU Date</TableHead>
              <TableHead>Faculty Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Session Chair</TableHead>
              <TableHead>BOE/BOS Member</TableHead>
              <TableHead>Best Paper Award</TableHead>
              <TableHead>Award Received</TableHead>
              <TableHead>Industrial Visit Dept</TableHead>
              <TableHead>Visit Semester</TableHead>
              <TableHead>Visit Place</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Visit Students</TableHead>
              <TableHead>Faculty Internship</TableHead>
              <TableHead>Student Internship</TableHead>
              <TableHead>Workshop Name</TableHead>
              <TableHead>Workshop Start Date</TableHead>
              <TableHead>Workshop End Date</TableHead>
              <TableHead>FDP Details</TableHead>
              <TableHead>Tech Fest Details</TableHead>
              <TableHead>Expert Talk</TableHead>
              <TableHead>Alumni Interaction</TableHead>
              <TableHead>Research Title</TableHead>
              <TableHead>Research Org</TableHead>
              <TableHead>Research Date</TableHead>
              <TableHead>Research Cost</TableHead>
              <TableHead>Proposals Submitted</TableHead>
              <TableHead>Proposals Granted</TableHead>
              <TableHead>Old Details</TableHead>
              <TableHead>Conference Published</TableHead>
              <TableHead>Journal Published</TableHead>
              <TableHead>Books Published</TableHead>
              <TableHead>FDPs Attended</TableHead>
              <TableHead>MOOCs Completed</TableHead>
              <TableHead>NPTEL Completed</TableHead>
              <TableHead>Other Initiatives</TableHead>
              <TableHead>Student Achievements</TableHead>
              <TableHead>Attached Photos</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.tab_section}</TableCell>
                  <TableCell>{item.mou_org}</TableCell>
                  <TableCell>{item.mou_date}</TableCell>
                  <TableCell>{item.faculty_name}</TableCell>
                  <TableCell>{item.designation}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.session_chair}</TableCell>
                  <TableCell>{item.boe_bos_member}</TableCell>
                  <TableCell>{item.best_paper_award}</TableCell>
                  <TableCell>{item.award_received}</TableCell>
                  <TableCell>{item.industrial_visit_department}</TableCell>
                  <TableCell>{item.industrial_visit_semester}</TableCell>
                  <TableCell>{item.industrial_visit_place}</TableCell>
                  <TableCell>{item.industrial_visit_date}</TableCell>
                  <TableCell>{item.industrial_visit_students}</TableCell>
                  <TableCell>{item.faculty_internship}</TableCell>
                  <TableCell>{item.student_internship}</TableCell>
                  <TableCell>{item.workshop_name}</TableCell>
                  <TableCell>{item.workshop_start_date}</TableCell>
                  <TableCell>{item.workshop_end_date}</TableCell>
                  <TableCell>{item.fdp_details}</TableCell>
                  <TableCell>{item.tech_fest_details || item.tech_fest}</TableCell>
                  <TableCell>{item.expert_talk}</TableCell>
                  <TableCell>{item.alumni_interaction}</TableCell>
                  <TableCell>{item.research_title}</TableCell>
                  <TableCell>{item.research_organization}</TableCell>
                  <TableCell>{item.research_date}</TableCell>
                  <TableCell>{item.research_cost}</TableCell>
                  <TableCell>{item.research_proposals_submitted}</TableCell>
                  <TableCell>{item.research_proposals_granted}</TableCell>
                  <TableCell>{item.research_center_details || item.research_centre_activities}</TableCell>
                  <TableCell>{item.conference_published}</TableCell>
                  <TableCell>{item.journal_published}</TableCell>
                  <TableCell>{item.books_published}</TableCell>
                  <TableCell>{item.fdps_attended}</TableCell>
                  <TableCell>{item.moocs_completed}</TableCell>
                  <TableCell>{item.nptel_completed}</TableCell>
                  <TableCell>{item.other_initiatives}</TableCell>
                  <TableCell>{item.student_achievements}</TableCell>
                  <TableCell>
                    {item.attached_photos &&
                      item.attached_photos.map((photo: string, index: number) => (
                        <div key={index}>
                          <a
                            href={getPhotoUrl(photo)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Photo {index + 1}
                          </a>
                        </div>
                      ))}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Button variant="destructive" onClick={() => handleDelete(item.id)}>Delete</Button>
                      <Button onClick={() => toggleExpandedRow(item.id)}>
                        {expandedRow === item.id ? 'Collapse Details' : 'Expand Details'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRow === item.id && (
                  <TableRow>
                    <TableCell colSpan={data.length}>
                      <div className="bg-gray-100 p-2 rounded">
                        <h3 className="font-semibold mb-2">Extra Details</h3>
                        {extraFields.map(({ label, key }) => (
                          <div key={key} className="mb-1">
                            <span className="font-medium">{label}:</span>{' '}
                            <span>{item[key] !== null && item[key] !== undefined ? item[key].toString() : '-'}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default NewsletterAdmin
