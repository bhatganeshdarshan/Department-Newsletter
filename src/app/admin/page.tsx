"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { supabase } from "../../../dbConfig";
import * as XLSX from "xlsx";

// ──────────────────────────────────────────────────────────
// Type definitions matching Supabase's possible response
// ──────────────────────────────────────────────────────────
interface SupabaseSelectResponse<T> {
  data: T[] | null;
  count: number | null;
  error: Error | null; // or PostgrestError if you import from @supabase/supabase-js
  status: number;
  statusText: string;
}

// We can define a row type if you prefer, or just use `any`.
type NewsletterRow = any;

// List of Admin email addresses allowed
const ALLOWED_ADMIN_EMAILS = ["bhatganeshdarshan10@gmail.com" , "rajeshaiml@bmsit.in"];

// S3 endpoint for photos
const S3_ENDPOINT =
  "https://phyeyoqcciwclxsomwcg.supabase.co/storage/v1/object/public/newsletter-photos/";

// Main columns to display in the table row
const mainColumns = [
  { label: "ID", key: "id" },
  { label: "Tab Section", key: "tab_section" },
  { label: "MoU Org", key: "mou_org" },
  { label: "MoU Date", key: "mou_date" },
  { label: "Faculty Name", key: "faculty_name" },
  { label: "Department", key: "department" },
  { label: "Best Paper Award", key: "best_paper_award" },
  { label: "Award Received", key: "award_received" },
  { label: "IV Department", key: "industrial_visit_department" },
  { label: "IV Semester", key: "industrial_visit_semester" },
  { label: "Workshop Name", key: "workshop_name" },
  { label: "Workshop Start", key: "workshop_start_date" },
  { label: "FDP Details", key: "fdp_details" },
  { label: "Tech Fest Details", key: "tech_fest_details" },
  { label: "Research Title", key: "research_title" },
  { label: "Research Org", key: "research_organization" },
  { label: "Research Date", key: "research_date" },
  { label: "Proposals Submitted", key: "research_proposals_submitted" },
  { label: "Proposals Granted", key: "research_proposals_granted" },
  { label: "Conference Published", key: "conference_published" },
  { label: "Journal Published", key: "journal_published" },
  { label: "Books Published", key: "books_published" },
  { label: "FDPs Attended", key: "fdps_attended" },
  { label: "MOOCs Completed", key: "moocs_completed" },
  { label: "NPTEL Completed", key: "nptel_completed" },
  { label: "Other Initiatives", key: "other_initiatives" },
  { label: "Student Achievements", key: "student_achievements" },
];

// Extra fields displayed in "Expand Details"
const extraFields = [
  { label: "Session Chair", key: "session_chair" },
  { label: "BOE/BOS Member", key: "boe_bos_member" },
  { label: "Faculty Internship Company", key: "faculty_internship_company" },
  { label: "Faculty Internship Start Date", key: "faculty_internship_start_date" },
  { label: "Faculty Internship End Date", key: "faculty_internship_end_date" },
  { label: "Faculty Internship Description", key: "faculty_internship_description" },
  { label: "Student Internship Name", key: "student_internship_name" },
  { label: "Student Internship Company", key: "student_internship_company" },
  { label: "Student Internship Start Date", key: "student_internship_start_date" },
  { label: "Student Internship End Date", key: "student_internship_end_date" },
  { label: "Workshop Participants", key: "workshop_participants" },
  { label: "Workshop Resource Person", key: "workshop_resource_person" },
  { label: "FDP Duration", key: "fdp_duration" },
  { label: "FDP Resource Person", key: "fdp_resource_person" },
  { label: "FDP Institution", key: "fdp_institution" },
  { label: "Tech Fest Event Name", key: "tech_fest_event_name" },
  { label: "Tech Fest Date", key: "tech_fest_date" },
  { label: "Tech Fest Participating Colleges", key: "tech_fest_participating_colleges" },
  { label: "Collaborative Research Partner", key: "collaborative_research_partner" },
  { label: "Collaborative Research Description", key: "collaborative_research_description" },
  { label: "Research Cost", key: "research_cost" },
  { label: "Research Center Activities", key: "research_center_activities" },
  { label: "Research Funding Org", key: "research_funding_organization" },
  { label: "Research Approval Date", key: "research_approval_date" },
  { label: "Research Collab Partner", key: "research_collaborative_partner" },
  { label: "Research Collab Duration", key: "research_collaboration_duration" },
  { label: "Research Collab Outcomes", key: "research_collaboration_outcomes" },
  { label: "Faculty Books Chapters", key: "faculty_books_chapters" },
  { label: "Faculty Collaborative Research", key: "faculty_collaborative_research" },
  { label: "Faculty Expert Talks", key: "faculty_expert_talks" },
  { label: "Faculty Alumni Talks", key: "faculty_alumni_talks" },
  { label: "Faculty Industrial Visits", key: "faculty_industrial_visits" },
  { label: "Faculty MoUs Operational", key: "faculty_mous_operational" },
  { label: "Faculty Consultancy Completed", key: "faculty_consultancy_completed" },
  { label: "Faculty EDP Completed", key: "faculty_edp_completed" },
  { label: "Faculty Talks Delivered", key: "faculty_talks_delivered" },
  { label: "Student Conference Papers", key: "student_conference_papers" },
  { label: "Student Journal Papers", key: "student_journal_papers" },
  { label: "Student Conferences Attended", key: "student_conferences_attended" },
  { label: "Student Hackathons", key: "student_hackathons" },
  { label: "Student MOOCs Completed", key: "student_moocs_completed" },
  { label: "Student NPTEL Completed", key: "student_nptel_completed" },
  { label: "Student AICTE Participation", key: "student_aicte_participation" },
  { label: "Sports Events Count", key: "sports_events_count" },
  { label: "Placement Companies", key: "placement_companies" },
  { label: "Placement CTC", key: "placement_ctc" },
  { label: "HEC Events Count", key: "hec_events_count" },
  { label: "NCC/BICEP Events Count", key: "ncc_bicep_events_count" },
];

export default function NewsletterAdmin() {
  // Authentication states
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Admin data states
  const [data, setData] = useState<NewsletterRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const itemsPerPage = 10;

  // ──────────────────────────────────────────────────────────
  // 1) Check Auth on mount
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        setUserEmail(null);
      } else {
        // if userData.user?.email is undefined, fallback to null
        setUserEmail(userData.user?.email ?? null);
      }
      setAuthChecked(true); // We have checked authentication
    };
    checkAuth();
  }, []);

  // ──────────────────────────────────────────────────────────
  // 2) Fetch data only if user is valid
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      const response = (await supabase
        .from("newsletter_form")
        .select("*", { count: "exact" })
        .range(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage - 1
        )) as unknown as SupabaseSelectResponse<NewsletterRow>;

      const { data: rows, error, count } = response;

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        // rows could be null, fallback to []
        setData(rows ?? []);

        // count can be null, fallback to 0
        const total = count ?? 0;
        setTotalPages(Math.ceil(total / itemsPerPage));
      }
    };

    // Only fetch if:
    // - we have completed checking auth
    // - userEmail is not null
    // - userEmail is in allowed list
    if (authChecked && userEmail && ALLOWED_ADMIN_EMAILS.includes(userEmail)) {
      fetchData();
    }
  }, [authChecked, userEmail, currentPage]);

  // ──────────────────────────────────────────────────────────
  // 3) Condition-based rendering
  // ──────────────────────────────────────────────────────────

  // If we haven't finished checking auth, show a "Loading" or "Checking" state
  if (!authChecked) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-semibold">Checking user status...</h1>
        <p className="text-gray-600 mt-2">Please wait...</p>
      </div>
    );
  }

  // If userEmail is null, there's no user logged in
  if (!userEmail) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-semibold">Please log in</h1>
      </div>
    );
  }

  // If userEmail is not in the allowed list
  if (!ALLOWED_ADMIN_EMAILS.includes(userEmail)) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // 4) The user is valid -> Admin Panel
  // ──────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("newsletter_form").delete().eq("id", id);
    if (error) {
      console.error("Error deleting item:", error);
      return;
    }
    // Re-fetch data after deletion
    const response = (await supabase
      .from("newsletter_form")
      .select("*", { count: "exact" })
      .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)) as unknown as SupabaseSelectResponse<NewsletterRow>;

    const { data: rows, error: fetchError, count } = response;
    if (fetchError) {
      console.error("Error fetching data:", fetchError);
    } else {
      setData(rows ?? []);
      setTotalPages(Math.ceil((count ?? 0) / itemsPerPage));
    }
  };

  // Download entire dataset as XLSX
  const handleDownload = async () => {
    const response = (await supabase
      .from("newsletter_form")
      .select("*", { count: "exact" })) as unknown as SupabaseSelectResponse<NewsletterRow>;

    const { data: allRows, error } = response;
    if (error) {
      console.error("Error fetching data for download:", error);
      return;
    }

    // allRows can be null, fallback to []
    const worksheet = XLSX.utils.json_to_sheet(allRows ?? []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Newsletter Form Data");
    XLSX.writeFile(workbook, "newsletter_form_data.xlsx");
  };

  const getPhotoUrl = (path: string) => {
    return `${S3_ENDPOINT}${path}`;
  };

  const toggleExpandedRow = (id: number) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };

  // ──────────────────────────────────────────────────────────
  // 5) Render the table since user is verified
  // ──────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Newsletter Form Admin Panel</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={handleDownload}>Download XLSX</Button>
      </div>

      <div className="overflow-auto bg-white shadow-sm rounded-lg">
        <Table className="min-w-full border">
          <TableHeader className="bg-gray-50">
            <TableRow>
              {mainColumns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead>Attached Photos</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {/* MAIN ROW */}
                <TableRow className="hover:bg-gray-50">
                  {mainColumns.map((col) => (
                    <TableCell key={col.key}>
                      {item[col.key] != null ? item[col.key].toString() : ""}
                    </TableCell>
                  ))}

                  {/* Photos */}
                  <TableCell>
                    {item.attached_photos &&
                      item.attached_photos.map((photo: string, index: number) => (
                        <div key={index}>
                          <a
                            href={getPhotoUrl(photo)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            Photo {index + 1}
                          </a>
                        </div>
                      ))}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                      <Button onClick={() => toggleExpandedRow(item.id)}>
                        {expandedRow === item.id ? "Collapse" : "Details"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded row with extra details */}
                {expandedRow === item.id && (
                  <TableRow>
                    {/* colSpan = mainColumns.length + 2 (photos + actions) */}
                    <TableCell colSpan={mainColumns.length + 2}>
                      <div className="bg-gray-100 p-4 rounded-md mt-2">
                        <h3 className="font-semibold mb-4 text-lg">Extra Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {extraFields.map(({ label, key }) => {
                            const fieldValue = item[key];
                            return (
                              <div key={key} className="border p-2 rounded bg-white">
                                <span className="block font-medium mb-1">{label}</span>
                                <span className="block text-gray-700">
                                  {fieldValue != null ? fieldValue.toString() : "—"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => setCurrentPage(pageNumber)}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
