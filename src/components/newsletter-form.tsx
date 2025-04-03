"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { supabase } from "../../dbConfig";
import { Database } from "../../database.types";
import { useRouter } from "next/navigation";

interface NewsLetterProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type NewsletterFormData = Database["public"]["Tables"]["newsletter_form"]["Insert"];

export default function NewsletterFormComponent() {
  const [formData, setFormData] = useState<Partial<NewsletterFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const router = useRouter();
  const navigateToAdmin = () => {
    router.push("/admin");
  };

  // Handles changes for all inputs, including file inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      if (files && files.length > 0) {
        setFormData((prevData) => ({ ...prevData, [name]: files }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Upload a single file to Supabase Storage
  const uploadFile = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("newsletter-photos")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
    return data.path;
  };

  // Handle final form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setUploadedFiles([]);

    try {
      // Handle file uploads first (if any)
      const filesToUpload = formData.attached_photos as FileList | undefined;
      let uploadedPaths: string[] = [];

      if (filesToUpload) {
        const uploadPromises = Array.from(filesToUpload).map(uploadFile);
        uploadedPaths = await Promise.all(uploadPromises);
        setUploadedFiles(uploadedPaths);
      }

      // Prepare form data for submission
      const formDataToSubmit: NewsletterFormData = {
        ...formData,
        attached_photos: uploadedPaths,
      } as NewsletterFormData;

      // Remove any leftover file input references
      delete (formDataToSubmit as any).attached_photos_input;

      // Submit form data to Supabase
      const { data, error } = await supabase
        .from("newsletter_form")
        .insert(formDataToSubmit);

      if (error) throw error;

      console.log("Form submitted successfully:", data);
      setSuccess(true);
      // Reset form
      setFormData({});
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* ------------------ Header Section ------------------ */}
      <header className="flex justify-between items-center p-4 bg-white -100 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/college_logo.png"
            alt="college icon"
            height={80}
            width={80}
          />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 px-14">
            BMSIT&M - Department of Artificial Intelligence and Machine Learning
          </h1>
        </div>

        <Button
          onClick={navigateToAdmin}
          className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-full"
        >
          <Lock />
          <span>Admin Panel</span>
        </Button>
      </header>

      {/* ------------------ Main Form Section ------------------ */}
      <form onSubmit={handleSubmit} className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Newsletter Submission Form
        </h1>

        <Accordion type="multiple" className="space-y-4">
          {/* ─────────────────────────────────────────
               MoU / Awards / Recognitions
          ───────────────────────────────────────── */}
          <AccordionItem value="mou">
            <AccordionTrigger className="text-lg font-semibold">
              MoU / Awards / Recognitions
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>MoU Details</CardTitle>
                  <CardDescription>
                    Enter details about newly signed MoUs or recognitions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Original MoU fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mou_org">MoUs signed with:</Label>
                      <Input
                        id="mou_org"
                        name="mou_org"
                        value={formData.mou_org || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mou_date">Date:</Label>
                      <Input
                        id="mou_date"
                        name="mou_date"
                        type="date"
                        value={formData.mou_date || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faculty_name">
                        Coordinated by (Faculty Name):
                      </Label>
                      <Input
                        id="faculty_name"
                        name="faculty_name"
                        value={formData.faculty_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation:</Label>
                      <Input
                        id="designation"
                        name="designation"
                        value={formData.designation || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department:</Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session_chair">Session Chair:</Label>
                    <Input
                      id="session_chair"
                      name="session_chair"
                      value={formData.session_chair || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boe_bos_member">BOE/BOS Member:</Label>
                    <Input
                      id="boe_bos_member"
                      name="boe_bos_member"
                      value={formData.boe_bos_member || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="best_paper_award">Best Paper Award:</Label>
                    <Textarea
                      id="best_paper_award"
                      name="best_paper_award"
                      value={formData.best_paper_award || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="award_received">Award Received:</Label>
                    <Textarea
                      id="award_received"
                      name="award_received"
                      value={formData.award_received || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attached_photos">
                      Attach relevant photographs:
                    </Label>
                    <Input
                      id="attached_photos"
                      name="attached_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Faculty as Resource Person
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="resource-person">
            <AccordionTrigger className="text-lg font-semibold">
              Faculty as Resource Person
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Faculty as Resource Person</CardTitle>
                  <CardDescription>Faculty delivering talks / sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields you requested */}
                  <div className="space-y-2">
                    <Label htmlFor="resource_faculty_name">Faculty Name:</Label>
                    <Input
                      id="resource_faculty_name"
                      name="resource_faculty_name"
                      value={formData.resource_faculty_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_faculty_designation">
                      Faculty Designation:
                    </Label>
                    <Input
                      id="resource_faculty_designation"
                      name="resource_faculty_designation"
                      value={formData.resource_faculty_designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_faculty_department">
                      Faculty Department:
                    </Label>
                    <Input
                      id="resource_faculty_department"
                      name="resource_faculty_department"
                      value={formData.resource_faculty_department || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_activity_name">Activity Name:</Label>
                    <Input
                      id="resource_activity_name"
                      name="resource_activity_name"
                      value={formData.resource_activity_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_place">Place:</Label>
                    <Input
                      id="resource_place"
                      name="resource_place"
                      value={formData.resource_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_date_new">Date:</Label>
                    <Input
                      id="resource_date_new"
                      name="resource_date_new"
                      type="date"
                      value={formData.resource_date_new || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_photos">Photos:</Label>
                    <Input
                      id="resource_photos"
                      name="resource_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields from original code */}
                  <div className="space-y-2 pt-4 border-t border-gray-300">
                    <Label htmlFor="resource_event_name">Event Name:</Label>
                    <Input
                      id="resource_event_name"
                      name="resource_event_name"
                      value={formData.resource_event_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="resource_date">Old: Date:</Label>
                    <Input
                      id="resource_date"
                      name="resource_date"
                      type="date"
                      value={formData.resource_date || ""}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="resource_institution">Institution Name:</Label>
                    <Input
                      id="resource_institution"
                      name="resource_institution"
                      value={formData.resource_institution || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_topic">Topic of Talk:</Label>
                    <Textarea
                      id="resource_topic"
                      name="resource_topic"
                      value={formData.resource_topic || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Faculty Awards
               (Retain old + add new Paper Work at top)
          ───────────────────────────────────────── */}
          <AccordionItem value="faculty-awards">
            <AccordionTrigger className="text-lg font-semibold">
              Faculty Awards
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Faculty Awards</CardTitle>
                  <CardDescription>
                    Awards / recognitions received by faculty
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW Paper Work fields at top */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fa_paper_title">Paper Title:</Label>
                      <Input
                        id="fa_paper_title"
                        name="fa_paper_title"
                        value={formData.fa_paper_title || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_author_names">Author Names:</Label>
                      <Input
                        id="fa_author_names"
                        name="fa_author_names"
                        value={formData.fa_author_names || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_international_journal_name">
                        International Journal Name:
                      </Label>
                      <Input
                        id="fa_international_journal_name"
                        name="fa_international_journal_name"
                        value={formData.fa_international_journal_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_international_conf_name">
                        International Conference Name:
                      </Label>
                      <Input
                        id="fa_international_conf_name"
                        name="fa_international_conf_name"
                        value={formData.fa_international_conf_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_conference_name">Conference Name:</Label>
                      <Input
                        id="fa_conference_name"
                        name="fa_conference_name"
                        value={formData.fa_conference_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_book_chapter_title">Book Chapter Title:</Label>
                      <Input
                        id="fa_book_chapter_title"
                        name="fa_book_chapter_title"
                        value={formData.fa_book_chapter_title || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_publisher_name">Publisher Name:</Label>
                      <Input
                        id="fa_publisher_name"
                        name="fa_publisher_name"
                        value={formData.fa_publisher_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_editor_names">Editor Name(s):</Label>
                      <Input
                        id="fa_editor_names"
                        name="fa_editor_names"
                        value={formData.fa_editor_names || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_doi">Digital object identifier (DOI):</Label>
                      <Input
                        id="fa_doi"
                        name="fa_doi"
                        value={formData.fa_doi || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_volume">Volume of Publication:</Label>
                      <Input
                        id="fa_volume"
                        name="fa_volume"
                        value={formData.fa_volume || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_publication_name">Publication Name:</Label>
                      <Input
                        id="fa_publication_name"
                        name="fa_publication_name"
                        value={formData.fa_publication_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_publication_date">Publication Date:</Label>
                      <Input
                        id="fa_publication_date"
                        name="fa_publication_date"
                        type="date"
                        value={formData.fa_publication_date || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_presentation_date">Presentation Date:</Label>
                      <Input
                        id="fa_presentation_date"
                        name="fa_presentation_date"
                        type="date"
                        value={formData.fa_presentation_date || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_certificates">
                        Certificates (Presenter/Best Paper Award):
                      </Label>
                      <Input
                        id="fa_certificates"
                        name="fa_certificates"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_award_name">Award Name:</Label>
                      <Input
                        id="fa_award_name"
                        name="fa_award_name"
                        value={formData.fa_award_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_awarded_by">Awarded By:</Label>
                      <Input
                        id="fa_awarded_by"
                        name="fa_awarded_by"
                        value={formData.fa_awarded_by || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_location">Location:</Label>
                      <Input
                        id="fa_location"
                        name="fa_location"
                        value={formData.fa_location || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_mode">Mode(Online/Offline):</Label>
                      <Input
                        id="fa_mode"
                        name="fa_mode"
                        value={formData.fa_mode || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fa_pub_type">
                        International Journal/Conference/Magazine/ Book Chapters
                      </Label>
                      <Input
                        id="fa_pub_type"
                        name="fa_pub_type"
                        value={formData.fa_pub_type || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* OLD fields at bottom */}
                  {/* <div className="pt-4 border-t border-gray-300 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="award_research_title">
                        Old: Research Paper Title:
                      </Label>
                      <Input
                        id="award_research_title"
                        name="award_research_title"
                        value={formData.award_research_title || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="award_conference_journal">
                        Old: Conference/Journal Name:
                      </Label>
                      <Input
                        id="award_conference_journal"
                        name="award_conference_journal"
                        value={formData.award_conference_journal || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="award_name">Old: Award Name:</Label>
                      <Input
                        id="award_name"
                        name="award_name"
                        value={formData.award_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="award_given_by">Old: Awarded By:</Label>
                      <Input
                        id="award_given_by"
                        name="award_given_by"
                        value={formData.award_given_by || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Collaborative Research (MoU)
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="collab-research">
            <AccordionTrigger className="text-lg font-semibold">
              Collaborative Research (MoU)
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>MoU Collaborative Research</CardTitle>
                  <CardDescription>
                    Details of collaborative research under MoU
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields first */}
                  <div className="space-y-2">
                    <Label htmlFor="collab_faculty_name">Faculty Name:</Label>
                    <Input
                      id="collab_faculty_name"
                      name="collab_faculty_name"
                      value={formData.collab_faculty_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collab_faculty_designation">
                      Faculty Designation:
                    </Label>
                    <Input
                      id="collab_faculty_designation"
                      name="collab_faculty_designation"
                      value={formData.collab_faculty_designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collab_faculty_department">
                      Faculty Department:
                    </Label>
                    <Input
                      id="collab_faculty_department"
                      name="collab_faculty_department"
                      value={formData.collab_faculty_department || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collab_place">Place:</Label>
                    <Input
                      id="collab_place"
                      name="collab_place"
                      value={formData.collab_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collab_date">Date:</Label>
                    <Input
                      id="collab_date"
                      name="collab_date"
                      type="date"
                      value={formData.collab_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collab_photos">Photos:</Label>
                    <Input
                      id="collab_photos"
                      name="collab_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields */}
                  <div className="pt-4 border-t border-gray-300 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="collaborative_research_partner">
                        Research Partner Institution:
                      </Label>
                      <Input
                        id="collaborative_research_partner"
                        name="collaborative_research_partner"
                        value={formData.collaborative_research_partner || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collaborative_research_description">
                        Description (4-5 lines):
                      </Label>
                      <Textarea
                        id="collaborative_research_description"
                        name="collaborative_research_description"
                        value={formData.collaborative_research_description || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Faculty Internship
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="faculty-internship">
            <AccordionTrigger className="text-lg font-semibold">
              Faculty Internship
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Faculty Internship</CardTitle>
                  <CardDescription>
                    Details of faculty internships in industries/organizations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields first */}
                  <div className="space-y-2">
                    <Label htmlFor="fi_faculty_name">Faculty Name:</Label>
                    <Input
                      id="fi_faculty_name"
                      name="fi_faculty_name"
                      value={formData.fi_faculty_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fi_faculty_designation">Faculty Designation:</Label>
                    <Input
                      id="fi_faculty_designation"
                      name="fi_faculty_designation"
                      value={formData.fi_faculty_designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fi_faculty_department">Faculty Department:</Label>
                    <Input
                      id="fi_faculty_department"
                      name="fi_faculty_department"
                      value={formData.fi_faculty_department || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fi_place">Place:</Label>
                    <Input
                      id="fi_place"
                      name="fi_place"
                      value={formData.fi_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fi_photos">Photos:</Label>
                    <Input
                      id="fi_photos"
                      name="fi_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields */}
                  <div className="pt-4 border-t border-gray-300 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="faculty_internship_company">
                        Company Name:
                      </Label>
                      <Input
                        id="faculty_internship_company"
                        name="faculty_internship_company"
                        value={formData.faculty_internship_company || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty_internship_start_date">
                          Start Date:
                        </Label>
                        <Input
                          id="faculty_internship_start_date"
                          name="faculty_internship_start_date"
                          type="date"
                          value={formData.faculty_internship_start_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faculty_internship_end_date">
                          End Date:
                        </Label>
                        <Input
                          id="faculty_internship_end_date"
                          name="faculty_internship_end_date"
                          type="date"
                          value={formData.faculty_internship_end_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faculty_internship_description">
                        Key Learnings/Description:
                      </Label>
                      <Textarea
                        id="faculty_internship_description"
                        name="faculty_internship_description"
                        value={formData.faculty_internship_description || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Student Internship
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="student-internship">
            <AccordionTrigger className="text-lg font-semibold">
              Student Internship
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Student Internship</CardTitle>
                  <CardDescription>
                    Details of student internships in industries/organizations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields first */}
                  <div className="space-y-2">
                    <Label htmlFor="si_student_name_new">Student Name:</Label>
                    <Input
                      id="si_student_name_new"
                      name="si_student_name_new"
                      value={formData.si_student_name_new || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si_student_designation">
                      Student Designation:
                    </Label>
                    <Input
                      id="si_student_designation"
                      name="si_student_designation"
                      value={formData.si_student_designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si_student_department">
                      Student Department:
                    </Label>
                    <Input
                      id="si_student_department"
                      name="si_student_department"
                      value={formData.si_student_department || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si_place">Place:</Label>
                    <Input
                      id="si_place"
                      name="si_place"
                      value={formData.si_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si_photos">Photos:</Label>
                    <Input
                      id="si_photos"
                      name="si_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields */}
                  <div className="pt-4 border-t border-gray-300 space-y-4">
                    {/* <div className="space-y-2">
                      <Label htmlFor="student_internship_name">
                        Old: Student Name:
                      </Label>
                      <Input
                        id="student_internship_name"
                        name="student_internship_name"
                        value={formData.student_internship_name || ""}
                        onChange={handleInputChange}
                      />
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="student_internship_company">
                        Company Name:
                      </Label>
                      <Input
                        id="student_internship_company"
                        name="student_internship_company"
                        value={formData.student_internship_company || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student_internship_start_date">
                          Start Date:
                        </Label>
                        <Input
                          id="student_internship_start_date"
                          name="student_internship_start_date"
                          type="date"
                          value={formData.student_internship_start_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student_internship_end_date">
                          End Date:
                        </Label>
                        <Input
                          id="student_internship_end_date"
                          name="student_internship_end_date"
                          type="date"
                          value={formData.student_internship_end_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Workshops
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="workshop">
            <AccordionTrigger className="text-lg font-semibold">
              Workshops
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Workshops</CardTitle>
                  <CardDescription>
                    Details about Workshops organized
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields first */}
                  <div className="space-y-2">
                    <Label htmlFor="ws_faculty_coordinator_name">
                      Faculty Coordinator Name:
                    </Label>
                    <Input
                      id="ws_faculty_coordinator_name"
                      name="ws_faculty_coordinator_name"
                      value={formData.ws_faculty_coordinator_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ws_faculty_coordinator_designation">
                      Faculty Coordinator Designation:
                    </Label>
                    <Input
                      id="ws_faculty_coordinator_designation"
                      name="ws_faculty_coordinator_designation"
                      value={formData.ws_faculty_coordinator_designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ws_department">Department:</Label>
                    <Input
                      id="ws_department"
                      name="ws_department"
                      value={formData.ws_department || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ws_place">Place:</Label>
                    <Input
                      id="ws_place"
                      name="ws_place"
                      value={formData.ws_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="ws_date">Date:</Label>
                    <Input
                      id="ws_date"
                      name="ws_date"
                      type="date"
                      value={formData.ws_date || ""}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="ws_photos">Photos:</Label>
                    <Input
                      id="ws_photos"
                      name="ws_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ws_description">Description:</Label>
                    <Textarea
                      id="ws_description"
                      name="ws_description"
                      value={formData.ws_description || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields */}
                  <div className="pt-4 border-t border-gray-300 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workshop_name">Workshop Name:</Label>
                        <Input
                          id="workshop_name"
                          name="workshop_name"
                          value={formData.workshop_name || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workshop_start_date">Start Date:</Label>
                        <Input
                          id="workshop_start_date"
                          name="workshop_start_date"
                          type="date"
                          value={formData.workshop_start_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workshop_end_date">End Date:</Label>
                        <Input
                          id="workshop_end_date"
                          name="workshop_end_date"
                          type="date"
                          value={formData.workshop_end_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-300">
                      <div className="space-y-2">
                        <Label htmlFor="workshop_participants">
                          Number of Participants:
                        </Label>
                        <Input
                          id="workshop_participants"
                          name="workshop_participants"
                          type="number"
                          value={formData.workshop_participants || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workshop_resource_person">
                          Resource Person Name:
                        </Label>
                        <Input
                          id="workshop_resource_person"
                          name="workshop_resource_person"
                          value={formData.workshop_resource_person || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               FDP
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="fdp">
            <AccordionTrigger className="text-lg font-semibold">
              FDP (Faculty Development Programmes)
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Faculty Development Programmes</CardTitle>
                  <CardDescription>
                    Details about FDPs organized or attended
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields first */}
                  <div className="space-y-2">
                    <Label htmlFor="fdp_faculty_coordinator_name">
                      Faculty Coordinator Name:
                    </Label>
                    <Input
                      id="fdp_faculty_coordinator_name"
                      name="fdp_faculty_coordinator_name"
                      value={formData.fdp_faculty_coordinator_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fdp_faculty_coordinator_designation">
                      Faculty Coordinator Designation:
                    </Label>
                    <Input
                      id="fdp_faculty_coordinator_designation"
                      name="fdp_faculty_coordinator_designation"
                      value={formData.fdp_faculty_coordinator_designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fdp_department">Department:</Label>
                    <Input
                      id="fdp_department"
                      name="fdp_department"
                      value={formData.fdp_department || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fdp_place">Place:</Label>
                    <Input
                      id="fdp_place"
                      name="fdp_place"
                      value={formData.fdp_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fdp_date">Date:</Label>
                    <Input
                      id="fdp_date"
                      name="fdp_date"
                      type="date"
                      value={formData.fdp_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fdp_photos">Photos:</Label>
                    <Input
                      id="fdp_photos"
                      name="fdp_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fdp_description">Description:</Label>
                    <Textarea
                      id="fdp_description"
                      name="fdp_description"
                      value={formData.fdp_description || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields */}
                  <div className="pt-4 border-t border-gray-300 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fdp_details">FDP Details:</Label>
                      <Textarea
                        id="fdp_details"
                        name="fdp_details"
                        value={formData.fdp_details || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fdp_duration">Duration:</Label>
                        <Input
                          id="fdp_duration"
                          name="fdp_duration"
                          value={formData.fdp_duration || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fdp_resource_person"> Resource Person:</Label>
                        <Input
                          id="fdp_resource_person"
                          name="fdp_resource_person"
                          value={formData.fdp_resource_person || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fdp_institution">Institution Name:</Label>
                        <Input
                          id="fdp_institution"
                          name="fdp_institution"
                          value={formData.fdp_institution || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Technical Fest
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="tech-fest">
            <AccordionTrigger className="text-lg font-semibold">
              Technical Fest
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Technical Fest</CardTitle>
                  <CardDescription>
                    Details about the technical fest conducted
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields first */}
                  <div className="space-y-2">
                    <Label htmlFor="tf_faculty_coordinator_name">
                      Faculty Coordinator Name:
                    </Label>
                    <Input
                      id="tf_faculty_coordinator_name"
                      name="tf_faculty_coordinator_name"
                      value={formData.tf_faculty_coordinator_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tf_faculty_coordinator_designation">
                      Faculty Coordinator Designation:
                    </Label>
                    <Input
                      id="tf_faculty_coordinator_designation"
                      name="tf_faculty_coordinator_designation"
                      value={formData.tf_faculty_coordinator_designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tf_department">Department:</Label>
                    <Input
                      id="tf_department"
                      name="tf_department"
                      value={formData.tf_department || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tf_place">Place:</Label>
                    <Input
                      id="tf_place"
                      name="tf_place"
                      value={formData.tf_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tf_date">Date:</Label>
                    <Input
                      id="tf_date"
                      name="tf_date"
                      type="date"
                      value={formData.tf_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tf_photos">Photos:</Label>
                    <Input
                      id="tf_photos"
                      name="tf_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tf_description">Description:</Label>
                    <Textarea
                      id="tf_description"
                      name="tf_description"
                      value={formData.tf_description || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields */}
                  <div className="pt-4 border-t border-gray-300 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tech_fest_details">
                        Technical Fest Description:
                      </Label>
                      <Textarea
                        id="tech_fest_details"
                        name="tech_fest_details"
                        value={formData.tech_fest_details || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tech_fest_event_name">
                           Event Name:
                        </Label>
                        <Input
                          id="tech_fest_event_name"
                          name="tech_fest_event_name"
                          value={formData.tech_fest_event_name || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="tech_fest_date"> Date:</Label>
                        <Input
                          id="tech_fest_date"
                          name="tech_fest_date"
                          type="date"
                          value={formData.tech_fest_date || ""}
                          onChange={handleInputChange}
                        />
                      </div> */}
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="tech_fest_participating_colleges">
                        No. of Participating Colleges:
                      </Label>
                      <Input
                        id="tech_fest_participating_colleges"
                        name="tech_fest_participating_colleges"
                        type="number"
                        value={formData.tech_fest_participating_colleges || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Expert Talk
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="expert-talk">
            <AccordionTrigger className="text-lg font-semibold">
              Expert Talk
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Expert Talk</CardTitle>
                  <CardDescription>
                    Details about any expert talk organized
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields first */}
                  <div className="space-y-2">
                    <Label htmlFor="et_department_new">Department:</Label>
                    <Input
                      id="et_department_new"
                      name="et_department_new"
                      value={formData.et_department_new || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="et_faculty_coordinator_name">
                      Faculty Coordinator Name:
                    </Label>
                    <Input
                      id="et_faculty_coordinator_name"
                      name="et_faculty_coordinator_name"
                      value={formData.et_faculty_coordinator_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="et_faculty_coordinator_designation">
                      Faculty Coordinator Designation:
                    </Label>
                    <Input
                      id="et_faculty_coordinator_designation"
                      name="et_faculty_coordinator_designation"
                      value={formData.et_faculty_coordinator_designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="et_dep_2">Department (again?):</Label>
                    <Input
                      id="et_dep_2"
                      name="et_dep_2"
                      value={formData.et_dep_2 || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="et_place">Place:</Label>
                    <Input
                      id="et_place"
                      name="et_place"
                      value={formData.et_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="et_date_new">Date:</Label>
                    <Input
                      id="et_date_new"
                      name="et_date_new"
                      type="date"
                      value={formData.et_date_new || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="et_photos">Photos:</Label>
                    <Input
                      id="et_photos"
                      name="et_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="et_description">Description:</Label>
                    <Textarea
                      id="et_description"
                      name="et_description"
                      value={formData.et_description || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields */}
                  <div className="pt-4 border-t border-gray-300 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="expert_talk_topic"> Topic:</Label>
                      <Input
                        id="expert_talk_topic"
                        name="expert_talk_topic"
                        value={formData.expert_talk_topic || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expert_talk_speaker_name">
                        Speaker Name:
                      </Label>
                      <Input
                        id="expert_talk_speaker_name"
                        name="expert_talk_speaker_name"
                        value={formData.expert_talk_speaker_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expert_talk_speaker_affiliation">
                        Speaker Affiliation:
                      </Label>
                      <Input
                        id="expert_talk_speaker_affiliation"
                        name="expert_talk_speaker_affiliation"
                        value={formData.expert_talk_speaker_affiliation || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expert_talk_audience">
                        Number of Students (Audience):
                      </Label>
                      <Input
                        id="expert_talk_audience"
                        name="expert_talk_audience"
                        type="number"
                        value={formData.expert_talk_audience || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="expert_talk_date">Date:</Label>
                      <Input
                        id="expert_talk_date"
                        name="expert_talk_date"
                        type="date"
                        value={formData.expert_talk_date || ""}
                        onChange={handleInputChange}
                      />
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Alumni Interaction
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="alumni-interaction">
            <AccordionTrigger className="text-lg font-semibold">
              Alumni Interaction
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Alumni Interaction</CardTitle>
                  <CardDescription>
                    Details about alumni interacting with current students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields first */}
                  <div className="space-y-2">
                    <Label htmlFor="alumni_photo">Photo:</Label>
                    <Input
                      id="alumni_photo"
                      name="alumni_photo"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alumni_department_new">Department:</Label>
                    <Input
                      id="alumni_department_new"
                      name="alumni_department_new"
                      value={formData.alumni_department_new || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alumni_date_new">Date:</Label>
                    <Input
                      id="alumni_date_new"
                      name="alumni_date_new"
                      type="date"
                      value={formData.alumni_date_new || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields */}
                  <div className="pt-4 border-t border-gray-300 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="alumni_name">Alumni Name:</Label>
                      <Input
                        id="alumni_name"
                        name="alumni_name"
                        value={formData.alumni_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alumni_graduation_year">
                        Graduation Year:
                      </Label>
                      <Input
                        id="alumni_graduation_year"
                        name="alumni_graduation_year"
                        value={formData.alumni_graduation_year || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alumni_company">Company Name:</Label>
                      <Input
                        id="alumni_company"
                        name="alumni_company"
                        value={formData.alumni_company || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alumni_topic">Topic of Interaction:</Label>
                      <Textarea
                        id="alumni_topic"
                        name="alumni_topic"
                        value={formData.alumni_topic || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Research Work
               (keep old + add new)
          ───────────────────────────────────────── */}
          <AccordionItem value="research-work">
            <AccordionTrigger className="text-lg font-semibold">
              Research Work
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Research Work</CardTitle>
                  <CardDescription>
                    Enter details about research proposals and activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* NEW fields first */}
                  <div className="space-y-2">
                    <Label htmlFor="rw_faculty_name">Faculty Name:</Label>
                    <Input
                      id="rw_faculty_name"
                      name="rw_faculty_name"
                      value={formData.rw_faculty_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rw_faculty_designation">
                      Faculty Designation:
                    </Label>
                    <Input
                      id="rw_faculty_designation"
                      name="rw_faculty_designation"
                      value={formData.rw_faculty_designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rw_faculty_department">
                      Faculty Department:
                    </Label>
                    <Input
                      id="rw_faculty_department"
                      name="rw_faculty_department"
                      value={formData.rw_faculty_department || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rw_organization">Organization:</Label>
                    <Input
                      id="rw_organization"
                      name="rw_organization"
                      value={formData.rw_organization || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rw_title_of_project">Title of Project:</Label>
                    <Input
                      id="rw_title_of_project"
                      name="rw_title_of_project"
                      value={formData.rw_title_of_project || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="rw_total_cost">Total Cost:</Label>
                    <Input
                      id="rw_total_cost"
                      name="rw_total_cost"
                      type="number"
                      value={formData.rw_total_cost || ""}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="rw_place">Place:</Label>
                    <Input
                      id="rw_place"
                      name="rw_place"
                      value={formData.rw_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rw_photos">Photos:</Label>
                    <Input
                      id="rw_photos"
                      name="rw_photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* OLD fields */}
                  <div className="pt-4 border-t border-gray-300 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="research_title">
                          Research Title:
                        </Label>
                        <Input
                          id="research_title"
                          name="research_title"
                          value={formData.research_title || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="research_organization">
                          Organization:
                        </Label>
                        <Input
                          id="research_organization"
                          name="research_organization"
                          value={formData.research_organization || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="research_date">Date:</Label>
                        <Input
                          id="research_date"
                          name="research_date"
                          type="date"
                          value={formData.research_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="research_cost">Total Cost:</Label>
                        <Input
                          id="research_cost"
                          name="research_cost"
                          type="number"
                          value={formData.research_cost || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="research_proposals_submitted">
                        Research Proposals Submitted:
                      </Label>
                      <Textarea
                        id="research_proposals_submitted"
                        name="research_proposals_submitted"
                        value={formData.research_proposals_submitted || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="research_proposals_granted">
                        Research Proposals Granted:
                      </Label>
                      <Textarea
                        id="research_proposals_granted"
                        name="research_proposals_granted"
                        value={formData.research_proposals_granted || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="research_center_activities">
                        Research Centre Activities:
                      </Label>
                      <Textarea
                        id="research_center_activities"
                        name="research_center_activities"
                        value={formData.research_center_activities || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="pt-4 border-t border-gray-300">
                      <div className="font-semibold text-lg">
                        Additional Research Details
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="research_funding_organization">
                          Funding Organization:
                        </Label>
                        <Input
                          id="research_funding_organization"
                          name="research_funding_organization"
                          value={formData.research_funding_organization || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="research_approval_date">
                          Approval Date:
                        </Label>
                        <Input
                          id="research_approval_date"
                          name="research_approval_date"
                          type="date"
                          value={formData.research_approval_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-300">
                      <div className="font-semibold text-lg">
                        Collaborative Research
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="research_collaborative_partner">
                          Partner Institution:
                        </Label>
                        <Input
                          id="research_collaborative_partner"
                          name="research_collaborative_partner"
                          value={formData.research_collaborative_partner || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="research_collaboration_duration">
                          Collaboration Duration:
                        </Label>
                        <Input
                          id="research_collaboration_duration"
                          name="research_collaboration_duration"
                          value={formData.research_collaboration_duration || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="research_collaboration_outcomes">
                          Key Outcomes:
                        </Label>
                        <Textarea
                          id="research_collaboration_outcomes"
                          name="research_collaboration_outcomes"
                          value={formData.research_collaboration_outcomes || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               NEW TAB 1:
               Publication of Research Papers by the Faculty Members
          ───────────────────────────────────────── */}
          <AccordionItem value="faculty-publications">
            <AccordionTrigger className="text-lg font-semibold">
              Publication of Research Papers by the Faculty Members
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Faculty Publication Paper Work</CardTitle>
                  <CardDescription>
                    Enter details of faculty research publications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fpub_paper_title">Paper Title:</Label>
                    <Input
                      id="fpub_paper_title"
                      name="fpub_paper_title"
                      value={formData.fpub_paper_title || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_author_names">Author Names:</Label>
                    <Input
                      id="fpub_author_names"
                      name="fpub_author_names"
                      value={formData.fpub_author_names || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_international_journal_name">
                      International Journal Name:
                    </Label>
                    <Input
                      id="fpub_international_journal_name"
                      name="fpub_international_journal_name"
                      value={formData.fpub_international_journal_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_int_conf_name">
                      International Conference Name:
                    </Label>
                    <Input
                      id="fpub_int_conf_name"
                      name="fpub_int_conf_name"
                      value={formData.fpub_int_conf_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_national_conf">
                      National Conference:
                    </Label>
                    <Input
                      id="fpub_national_conf"
                      name="fpub_national_conf"
                      value={formData.fpub_national_conf || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_conference_name">
                      Conference Name:
                    </Label>
                    <Input
                      id="fpub_conference_name"
                      name="fpub_conference_name"
                      value={formData.fpub_conference_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_book_chapter_title">
                      Book Chapter Title:
                    </Label>
                    <Input
                      id="fpub_book_chapter_title"
                      name="fpub_book_chapter_title"
                      value={formData.fpub_book_chapter_title || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_publisher_name">Publisher Name:</Label>
                    <Input
                      id="fpub_publisher_name"
                      name="fpub_publisher_name"
                      value={formData.fpub_publisher_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_editor_names">Editor Name(s):</Label>
                    <Input
                      id="fpub_editor_names"
                      name="fpub_editor_names"
                      value={formData.fpub_editor_names || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_doi">DOI (Digital Object Identifier):</Label>
                    <Input
                      id="fpub_doi"
                      name="fpub_doi"
                      value={formData.fpub_doi || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_volume_issn_impact">
                      volume, ISSN Nos, impact factor
                    </Label>
                    <Input
                      id="fpub_volume_issn_impact"
                      name="fpub_volume_issn_impact"
                      value={formData.fpub_volume_issn_impact || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_volume_of_publication">
                      Volume of Publication:
                    </Label>
                    <Input
                      id="fpub_volume_of_publication"
                      name="fpub_volume_of_publication"
                      value={formData.fpub_volume_of_publication || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_publication_name">
                      Publication Name:
                    </Label>
                    <Input
                      id="fpub_publication_name"
                      name="fpub_publication_name"
                      value={formData.fpub_publication_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_publication_date">Publication Date:</Label>
                    <Input
                      id="fpub_publication_date"
                      name="fpub_publication_date"
                      type="date"
                      value={formData.fpub_publication_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_presentation_date">Presentation Date:</Label>
                    <Input
                      id="fpub_presentation_date"
                      name="fpub_presentation_date"
                      type="date"
                      value={formData.fpub_presentation_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_certificates">
                      Certificates (Presenter/Best Paper Award):
                    </Label>
                    <Input
                      id="fpub_certificates"
                      name="fpub_certificates"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_award_name">Award Name:</Label>
                    <Input
                      id="fpub_award_name"
                      name="fpub_award_name"
                      value={formData.fpub_award_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_awarded_by">Awarded By:</Label>
                    <Input
                      id="fpub_awarded_by"
                      name="fpub_awarded_by"
                      value={formData.fpub_awarded_by || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_location">Location:</Label>
                    <Input
                      id="fpub_location"
                      name="fpub_location"
                      value={formData.fpub_location || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_mode">Mode (Online/Offline):</Label>
                    <Input
                      id="fpub_mode"
                      name="fpub_mode"
                      value={formData.fpub_mode || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_pub_type">
                      International Journal/Conference/Magazine/ Book Chapters
                    </Label>
                    <Input
                      id="fpub_pub_type"
                      name="fpub_pub_type"
                      value={formData.fpub_pub_type || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpub_google_scholar_id">Google scholar id</Label>
                    <Input
                      id="fpub_google_scholar_id"
                      name="fpub_google_scholar_id"
                      value={formData.fpub_google_scholar_id || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               NEW TAB 2:
               Publication of Research Papers by the Student Members
          ───────────────────────────────────────── */}
          <AccordionItem value="student-publications">
            <AccordionTrigger className="text-lg font-semibold">
              Publication of Research Papers by the Student Members
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Student Publication Paper Work</CardTitle>
                  <CardDescription>
                    Enter details of student research publications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="spub_paper_title">Paper Title:</Label>
                    <Input
                      id="spub_paper_title"
                      name="spub_paper_title"
                      value={formData.spub_paper_title || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_author_names">Author Names:</Label>
                    <Input
                      id="spub_author_names"
                      name="spub_author_names"
                      value={formData.spub_author_names || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_international_journal_name">
                      International Journal Name:
                    </Label>
                    <Input
                      id="spub_international_journal_name"
                      name="spub_international_journal_name"
                      value={formData.spub_international_journal_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_international_conf_name">
                      International Conference Name:
                    </Label>
                    <Input
                      id="spub_international_conf_name"
                      name="spub_international_conf_name"
                      value={formData.spub_international_conf_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_conference_name">Conference Name:</Label>
                    <Input
                      id="spub_conference_name"
                      name="spub_conference_name"
                      value={formData.spub_conference_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_book_chapter_title">
                      Book Chapter Title:
                    </Label>
                    <Input
                      id="spub_book_chapter_title"
                      name="spub_book_chapter_title"
                      value={formData.spub_book_chapter_title || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_publisher_name">Publisher Name:</Label>
                    <Input
                      id="spub_publisher_name"
                      name="spub_publisher_name"
                      value={formData.spub_publisher_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_editor_names">Editor Name(s):</Label>
                    <Input
                      id="spub_editor_names"
                      name="spub_editor_names"
                      value={formData.spub_editor_names || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_doi">DOI (Digital Object Identifier):</Label>
                    <Input
                      id="spub_doi"
                      name="spub_doi"
                      value={formData.spub_doi || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_volume_of_publication">
                      Volume of Publication:
                    </Label>
                    <Input
                      id="spub_volume_of_publication"
                      name="spub_volume_of_publication"
                      value={formData.spub_volume_of_publication || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_publication_name">Publication Name:</Label>
                    <Input
                      id="spub_publication_name"
                      name="spub_publication_name"
                      value={formData.spub_publication_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_publication_date">Publication Date:</Label>
                    <Input
                      id="spub_publication_date"
                      name="spub_publication_date"
                      type="date"
                      value={formData.spub_publication_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_presentation_date">Presentation Date:</Label>
                    <Input
                      id="spub_presentation_date"
                      name="spub_presentation_date"
                      type="date"
                      value={formData.spub_presentation_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_certificates">
                      Certificates (Presenter/Best Paper Award):
                    </Label>
                    <Input
                      id="spub_certificates"
                      name="spub_certificates"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_award_name">Award Name:</Label>
                    <Input
                      id="spub_award_name"
                      name="spub_award_name"
                      value={formData.spub_award_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_awarded_by">Awarded By:</Label>
                    <Input
                      id="spub_awarded_by"
                      name="spub_awarded_by"
                      value={formData.spub_awarded_by || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_location">Location:</Label>
                    <Input
                      id="spub_location"
                      name="spub_location"
                      value={formData.spub_location || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_mode">Mode (Online/Offline):</Label>
                    <Input
                      id="spub_mode"
                      name="spub_mode"
                      value={formData.spub_mode || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_pub_type">
                      International Journal/Conference/Magazine/ Book Chapters
                    </Label>
                    <Input
                      id="spub_pub_type"
                      name="spub_pub_type"
                      value={formData.spub_pub_type || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spub_google_scholar_id">Google scholar id</Label>
                    <Input
                      id="spub_google_scholar_id"
                      name="spub_google_scholar_id"
                      value={formData.spub_google_scholar_id || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ─────────────────────────────────────────
               Summary Sheet
               (Add new labels for conf/journal notes)
          ───────────────────────────────────────── */}
          <AccordionItem value="summary">
            <AccordionTrigger className="text-lg font-semibold">
              Summary Sheet
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Summary Sheet</CardTitle>
                  <CardDescription>
                    Enter summary details for faculty and student activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="conference_published">
                        Conference Papers Published (indexed in SCOPUS, WoS, SCI, SCIE only):
                      </Label>
                      <Input
                        id="conference_published"
                        name="conference_published"
                        type="number"
                        value={formData.conference_published || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="journal_published">
                        Journal Papers Published (indexed in SCOPUS, WoS, SCI, SCIE only):
                      </Label>
                      <Input
                        id="journal_published"
                        name="journal_published"
                        type="number"
                        value={formData.journal_published || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="books_published">Books Published:</Label>
                      <Input
                        id="books_published"
                        name="books_published"
                        type="number"
                        value={formData.books_published || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fdps_attended">FDPs/STTP Attended:</Label>
                      <Input
                        id="fdps_attended"
                        name="fdps_attended"
                        type="number"
                        value={formData.fdps_attended || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moocs_completed">MooCs Completed:</Label>
                      <Input
                        id="moocs_completed"
                        name="moocs_completed"
                        type="number"
                        value={formData.moocs_completed || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nptel_completed">NPTEL Courses Completed:</Label>
                      <Input
                        id="nptel_completed"
                        name="nptel_completed"
                        type="number"
                        value={formData.nptel_completed || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="other_initiatives">
                      Other Initiatives by the Department:
                    </Label>
                    <Textarea
                      id="other_initiatives"
                      name="other_initiatives"
                      value={formData.other_initiatives || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student_achievements">
                      Student Achievements:
                    </Label>
                    <Textarea
                      id="student_achievements"
                      name="student_achievements"
                      value={formData.student_achievements || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* ---------- Additional Faculty Summary Fields ---------- */}
                  <div className="pt-4 border-t border-gray-300">
                    <div className="font-semibold text-lg">Faculty Summary</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty_books_chapters">
                          Book Chapters Published:
                        </Label>
                        <Input
                          id="faculty_books_chapters"
                          name="faculty_books_chapters"
                          type="number"
                          value={formData.faculty_books_chapters || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faculty_collaborative_research">
                          Collaborative Research Count:
                        </Label>
                        <Input
                          id="faculty_collaborative_research"
                          name="faculty_collaborative_research"
                          type="number"
                          value={formData.faculty_collaborative_research || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faculty_expert_talks">
                          Expert Talks Organized:
                        </Label>
                        <Input
                          id="faculty_expert_talks"
                          name="faculty_expert_talks"
                          type="number"
                          value={formData.faculty_expert_talks || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty_alumni_talks">
                          Alumni Talks Organized:
                        </Label>
                        <Input
                          id="faculty_alumni_talks"
                          name="faculty_alumni_talks"
                          type="number"
                          value={formData.faculty_alumni_talks || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faculty_industrial_visits">
                          Industrial Visits Organized:
                        </Label>
                        <Input
                          id="faculty_industrial_visits"
                          name="faculty_industrial_visits"
                          type="number"
                          value={formData.faculty_industrial_visits || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faculty_mous_operational">
                          MoUs Currently Operational:
                        </Label>
                        <Input
                          id="faculty_mous_operational"
                          name="faculty_mous_operational"
                          type="number"
                          value={formData.faculty_mous_operational || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty_consultancy_completed">
                          Consultancy Work Completed:
                        </Label>
                        <Input
                          id="faculty_consultancy_completed"
                          name="faculty_consultancy_completed"
                          type="number"
                          value={formData.faculty_consultancy_completed || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faculty_edp_completed">
                          EDP Completed:
                        </Label>
                        <Input
                          id="faculty_edp_completed"
                          name="faculty_edp_completed"
                          type="number"
                          value={formData.faculty_edp_completed || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faculty_talks_delivered">
                          Talks Delivered by Faculty:
                        </Label>
                        <Input
                          id="faculty_talks_delivered"
                          name="faculty_talks_delivered"
                          type="number"
                          value={formData.faculty_talks_delivered || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ---------- Additional Student Summary Fields ---------- */}
                  <div className="pt-4 border-t border-gray-300">
                    <div className="font-semibold text-lg">Student Summary</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student_conference_papers">
                          Conference Papers Published (Students):
                        </Label>
                        <Input
                          id="student_conference_papers"
                          name="student_conference_papers"
                          type="number"
                          value={formData.student_conference_papers || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student_journal_papers">
                          Journal Papers Published (Students):
                        </Label>
                        <Input
                          id="student_journal_papers"
                          name="student_journal_papers"
                          type="number"
                          value={formData.student_journal_papers || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student_conferences_attended">
                          No. of Students Attended Conf. (NIT/IIT/IIIT):
                        </Label>
                        <Input
                          id="student_conferences_attended"
                          name="student_conferences_attended"
                          type="number"
                          value={formData.student_conferences_attended || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="student_hackathons">
                          No. of Students Attended Hackathons:
                        </Label>
                        <Input
                          id="student_hackathons"
                          name="student_hackathons"
                          type="number"
                          value={formData.student_hackathons || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student_moocs_completed">
                          MooCs Completed (Students):
                        </Label>
                        <Input
                          id="student_moocs_completed"
                          name="student_moocs_completed"
                          type="number"
                          value={formData.student_moocs_completed || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student_nptel_completed">
                          NPTEL Courses Completed (Students):
                        </Label>
                        <Input
                          id="student_nptel_completed"
                          name="student_nptel_completed"
                          type="number"
                          value={formData.student_nptel_completed || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <Label htmlFor="student_aicte_participation">
                        No. of Students Participated in AICTE Activities:
                      </Label>
                      <Input
                        id="student_aicte_participation"
                        name="student_aicte_participation"
                        type="number"
                        value={formData.student_aicte_participation || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* ---------- Other Departmental Activities ---------- */}
                  <div className="pt-4 border-t border-gray-300">
                    <div className="font-semibold text-lg">Other Activities</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sports_events_count">
                          Sports Events Count:
                        </Label>
                        <Input
                          id="sports_events_count"
                          name="sports_events_count"
                          type="number"
                          value={formData.sports_events_count || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="placement_companies">
                          Placement Activities (Companies Count):
                        </Label>
                        <Input
                          id="placement_companies"
                          name="placement_companies"
                          type="number"
                          value={formData.placement_companies || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="placement_ctc">
                          Package Details (CTC in LPA):
                        </Label>
                        <Input
                          id="placement_ctc"
                          name="placement_ctc"
                          value={formData.placement_ctc || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="hec_events_count">HEC Events Count:</Label>
                        <Input
                          id="hec_events_count"
                          name="hec_events_count"
                          type="number"
                          value={formData.hec_events_count || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ncc_bicep_events_count">
                          NCC/BICEP Activities Count:
                        </Label>
                        <Input
                          id="ncc_bicep_events_count"
                          name="ncc_bicep_events_count"
                          type="number"
                          value={formData.ncc_bicep_events_count || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ------------------ Submit Button & Messages ------------------ */}
        <div className="flex justify-end mt-8">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Newsletter Content"}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 mt-4">Form submitted successfully!</p>
        )}
      </form>
    </div>
  );
}
