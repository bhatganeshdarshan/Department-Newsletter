'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { supabase } from '../../../dbConfig'
import * as XLSX from 'xlsx'

interface dTypes {
  data: any,
  error: any,
  count: any,
}

export default function NewsletterAdmin() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
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
    // Fetch all data from the table
    const { data, error }: dTypes = await supabase
      .from('newsletter_form')
      .select('*')

    if (error) {
      console.error('Error fetching data for download:', error)
      return
    }

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Newsletter Form Data')

    // Generate XLSX file and trigger download
    XLSX.writeFile(workbook, 'newsletter_form_data.xlsx')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Newsletter Form Admin Panel</h1>
      <Button onClick={handleDownload} className="mb-4">Download XLSX</Button>
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
              <TableHead>Research Center Activity Name</TableHead>
              <TableHead>Research Center Activity Date</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Details</TableHead>
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
              <TableRow key={item.id}>
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
                <TableCell>{item.tech_fest_details}</TableCell>
                <TableCell>{item.expert_talk}</TableCell>
                <TableCell>{item.alumni_interaction}</TableCell>
                <TableCell>{item.research_title}</TableCell>
                <TableCell>{item.research_organization}</TableCell>
                <TableCell>{item.research_date}</TableCell>
                <TableCell>{item.research_cost}</TableCell>
                <TableCell>{item.research_proposals_submitted}</TableCell>
                <TableCell>{item.research_proposals_granted}</TableCell>
                <TableCell>{item.research_center_activity_name}</TableCell>
                <TableCell>{item.research_center_activity_date}</TableCell>
                <TableCell>{item.research_center_participants}</TableCell>
                <TableCell>{item.research_center_details}</TableCell>
                <TableCell>{item.conference_published}</TableCell>
                <TableCell>{item.journal_published}</TableCell>
                <TableCell>{item.books_published}</TableCell>
                <TableCell>{item.fdps_attended}</TableCell>
                <TableCell>{item.moocs_completed}</TableCell>
                <TableCell>{item.nptel_completed}</TableCell>
                <TableCell>{item.other_initiatives}</TableCell>
                <TableCell>{item.student_achievements}</TableCell>
                <TableCell>{item.attached_photos?.join(', ')}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDelete(item.id)}>Delete</Button>
                </TableCell>
              </TableRow>
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