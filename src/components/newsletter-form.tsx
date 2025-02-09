'use client';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Lock } from 'lucide-react';
import Image from "next/image";

import { supabase } from "../../dbConfig";
import { Database } from "../../database.types";
import { useRouter } from "next/navigation";

interface NewsLetterProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type NewsletterFormData = Database['public']['Tables']['newsletter_form']['Insert'];

export default function NewsletterFormComponent({
  darkMode,
  toggleDarkMode,
}: NewsLetterProps) {
  const [formData, setFormData] = useState<Partial<NewsletterFormData>>({
    tab_section: "mou",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      if (files && files.length > 0) {
        setFormData((prevData) => ({ ...prevData, [name]: files }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const router = useRouter(); 
  const navigateToAdmin = () => {
    router.push('/admin');
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('newsletter-photos')
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setUploadedFiles([]);

    try {
      // Handle file uploads first
      const filesToUpload = formData.attached_photos as FileList | undefined;
      if (filesToUpload) {
        const uploadPromises = Array.from(filesToUpload).map(uploadFile);
        const uploadedPaths = await Promise.all(uploadPromises);
        setUploadedFiles(uploadedPaths);
      }

      // Prepare form data for submission
      const formDataToSubmit: NewsletterFormData = {
        ...formData,
        tab_section: formData.tab_section || "mou", // Ensure tab_section is always a string
        attached_photos: uploadedFiles,
      } as NewsletterFormData;

      // Remove file input from form data if exists
      delete (formDataToSubmit as any).attached_photos_input;

      // Submit form data
      const { data, error } = await supabase
        .from("newsletter_form")
        .insert(formDataToSubmit);

      if (error) throw error;
      
      console.log("Form submitted successfully:", data);
      setSuccess(true);
      setFormData({ tab_section: "mou" }); // Reset form
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/college_logo.png"
            alt="college icon"
            height={60}
            width={60}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 px-14">
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

      <form onSubmit={handleSubmit} className="container mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Newsletter Submission Form
        </h1>

        <Tabs defaultValue="mou" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="mou">MoU Details</TabsTrigger>
            <TabsTrigger value="industry">Industry Interaction</TabsTrigger>
            <TabsTrigger value="workshops">Workshops & FDPs</TabsTrigger>
            <TabsTrigger value="seminars">Seminars & Talks</TabsTrigger>
            <TabsTrigger value="research">Research Work</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          {/* --------------------- MoU Details Tab --------------------- */}
          <TabsContent value="mou">
            <Card>
              <CardHeader>
                <CardTitle>MoU Details</CardTitle>
                <CardDescription>
                  Enter details about Memorandums of Understanding, awards, and recognitions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing MoU fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mou_org">MoUs signed with:</Label>
                    <Input
                      id="mou_org"
                      name="mou_org"
                      value={formData.mou_org || ""}
                      onChange={handleInputChange}
                      required
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
                      required
                    /> 
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty_name">Coordinated by:</Label>
                    <Input
                      id="faculty_name"
                      name="faculty_name"
                      value={formData.faculty_name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation:</Label>
                    <Input
                      id="designation"
                      name="designation"
                      value={formData.designation || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department:</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department || ""}
                      onChange={handleInputChange}
                      required
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
                  <Label htmlFor="attached_photos">Attach relevant photographs:</Label>
                  {/* For file inputs, we do not control the value */}
                  <Input
                    id="attached_photos"
                    name="attached_photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </div>

                {/* ---------- Additional Fields for MoU / Awards / Recognitions ---------- */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Faculty as Resource Person</div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_event_name">Event Name:</Label>
                    <Input
                      id="resource_event_name"
                      name="resource_event_name"
                      value={formData.resource_event_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource_date">Date:</Label>
                    <Input
                      id="resource_date"
                      name="resource_date"
                      type="date"
                      value={formData.resource_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
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
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Faculty Awards</div>
                  <div className="space-y-2">
                    <Label htmlFor="award_research_title">Research Paper Title:</Label>
                    <Input
                      id="award_research_title"
                      name="award_research_title"
                      value={formData.award_research_title || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="award_conference_journal">Conference/Journal Name:</Label>
                    <Input
                      id="award_conference_journal"
                      name="award_conference_journal"
                      value={formData.award_conference_journal || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="award_name">Award Name:</Label>
                    <Input
                      id="award_name"
                      name="award_name"
                      value={formData.award_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="award_given_by">Awarded By:</Label>
                    <Input
                      id="award_given_by"
                      name="award_given_by"
                      value={formData.award_given_by || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Outreach Activity</div>
                  <div className="space-y-2">
                    <Label htmlFor="outreach_activity_name">Activity Name:</Label>
                    <Input
                      id="outreach_activity_name"
                      name="outreach_activity_name"
                      value={formData.outreach_activity_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outreach_place">Place:</Label>
                    <Input
                      id="outreach_place"
                      name="outreach_place"
                      value={formData.outreach_place || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outreach_date">Date:</Label>
                    <Input
                      id="outreach_date"
                      name="outreach_date"
                      type="date"
                      value={formData.outreach_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Collaborative Research</div>
                  <div className="space-y-2">
                    <Label htmlFor="collaborative_research_partner">Research Partner Institution:</Label>
                    <Input
                      id="collaborative_research_partner"
                      name="collaborative_research_partner"
                      value={formData.collaborative_research_partner || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collaborative_research_description">Description (4-5 lines):</Label>
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
          </TabsContent>

          {/* --------------------- Industry – Institute Interaction Tab --------------------- */}
          <TabsContent value="industry">
            <Card>
              <CardHeader>
                <CardTitle>Industry and Institute Interaction</CardTitle>
                <CardDescription>
                  Enter details about industrial visits, internships and related activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Industrial Visit fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industrial_visit_department">Department:</Label>
                    <Input
                      id="industrial_visit_department"
                      name="industrial_visit_department"
                      value={formData.industrial_visit_department || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industrial_visit_semester">Semester:</Label>
                    <Input
                      id="industrial_visit_semester"
                      name="industrial_visit_semester"
                      value={formData.industrial_visit_semester || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industrial_visit_place">Place:</Label>
                    <Input
                      id="industrial_visit_place"
                      name="industrial_visit_place"
                      value={formData.industrial_visit_place || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industrial_visit_date">Date:</Label>
                    <Input
                      id="industrial_visit_date"
                      name="industrial_visit_date"
                      type="date"
                      value={formData.industrial_visit_date || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industrial_visit_students">Number of students:</Label>
                    <Input
                      id="industrial_visit_students"
                      name="industrial_visit_students"
                      type="number"
                      value={formData.industrial_visit_students || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Additional Industrial Visit Details */}
                <div className="space-y-2">
                  <Label htmlFor="industrial_visit_faculty_coordinators">
                    Faculty Coordinators:
                  </Label>
                  <Input
                    id="industrial_visit_faculty_coordinators"
                    name="industrial_visit_faculty_coordinators"
                    value={formData.industrial_visit_faculty_coordinators || ""}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Faculty Internship */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Faculty Internship</div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty_internship_company">Company Name:</Label>
                    <Input
                      id="faculty_internship_company"
                      name="faculty_internship_company"
                      value={formData.faculty_internship_company || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="faculty_internship_start_date">Start Date:</Label>
                      <Input
                        id="faculty_internship_start_date"
                        name="faculty_internship_start_date"
                        type="date"
                        value={formData.faculty_internship_start_date || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faculty_internship_end_date">End Date:</Label>
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
                    <Label htmlFor="faculty_internship_description">Key Learnings/Description:</Label>
                    <Textarea
                      id="faculty_internship_description"
                      name="faculty_internship_description"
                      value={formData.faculty_internship_description || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Student Internship */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Student Internship</div>
                  <div className="space-y-2">
                    <Label htmlFor="student_internship_name">Student Name:</Label>
                    <Input
                      id="student_internship_name"
                      name="student_internship_name"
                      value={formData.student_internship_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student_internship_company">Company Name:</Label>
                    <Input
                      id="student_internship_company"
                      name="student_internship_company"
                      value={formData.student_internship_company || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student_internship_start_date">Start Date:</Label>
                      <Input
                        id="student_internship_start_date"
                        name="student_internship_start_date"
                        type="date"
                        value={formData.student_internship_start_date || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student_internship_end_date">End Date:</Label>
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
          </TabsContent>

          {/* --------------------- Workshops / FDPs / Fests Tab --------------------- */}
          <TabsContent value="workshops">
            <Card>
              <CardHeader>
                <CardTitle>
                  Workshops / Faculty Development Programmes / Fests
                </CardTitle>
                <CardDescription>
                  Enter details about workshops, FDPs, and technical fests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Workshop fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workshop_name">Workshop Name:</Label>
                    <Input
                      id="workshop_name"
                      name="workshop_name"
                      value={formData.workshop_name || ""}
                      onChange={handleInputChange}
                      required
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
                      required
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
                      required
                    />
                  </div>
                </div>

                {/* NEW FIELDS for Workshop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-300">
                  <div className="space-y-2">
                    <Label htmlFor="workshop_participants">Number of Participants:</Label>
                    <Input
                      id="workshop_participants"
                      name="workshop_participants"
                      type="number"
                      value={formData.workshop_participants || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workshop_resource_person">Resource Person Name:</Label>
                    <Input
                      id="workshop_resource_person"
                      name="workshop_resource_person"
                      value={formData.workshop_resource_person || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* FDP Details */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Faculty Development Programme (FDP)</div>
                  <div className="space-y-2">
                    <Label htmlFor="fdp_details">
                      FDP Details:
                    </Label>
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
                      <Label htmlFor="fdp_resource_person">Resource Person:</Label>
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

                {/* Technical Fest */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Technical Fest</div>
                  <div className="space-y-2">
                    <Label htmlFor="tech_fest_details">Technical Fest Description:</Label>
                    <Textarea
                      id="tech_fest_details"
                      name="tech_fest_details"
                      value={formData.tech_fest_details || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tech_fest_event_name">Event Name:</Label>
                      <Input
                        id="tech_fest_event_name"
                        name="tech_fest_event_name"
                        value={formData.tech_fest_event_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tech_fest_date">Date:</Label>
                      <Input
                        id="tech_fest_date"
                        name="tech_fest_date"
                        type="date"
                        value={formData.tech_fest_date || ""}
                        onChange={handleInputChange}
                      />
                    </div>
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
          </TabsContent>

          {/* --------------------- Seminars / Expert Talks / Alumni Interaction Tab --------------------- */}
          <TabsContent value="seminars">
            <Card>
              <CardHeader>
                <CardTitle>
                  Seminars / Expert Talks / Alumni Interaction
                </CardTitle>
                <CardDescription>
                  Enter details about seminars, expert talks, and alumni interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing fields */}
                <div className="space-y-2">
                  <Label htmlFor="expert_talk">Expert Talk Organized:</Label>
                  <Textarea
                    id="expert_talk"
                    name="expert_talk"
                    value={formData.expert_talk || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alumni_interaction">Alumni Interaction:</Label>
                  <Textarea
                    id="alumni_interaction"
                    name="alumni_interaction"
                    value={formData.alumni_interaction || ""}
                    onChange={handleInputChange}
                  />
                </div>

                {/* NEW FIELDS for Expert Talk */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Expert Talk Details</div>
                  <div className="space-y-2">
                    <Label htmlFor="expert_talk_topic">Topic:</Label>
                    <Input
                      id="expert_talk_topic"
                      name="expert_talk_topic"
                      value={formData.expert_talk_topic || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expert_talk_speaker_name">Speaker Name:</Label>
                    <Input
                      id="expert_talk_speaker_name"
                      name="expert_talk_speaker_name"
                      value={formData.expert_talk_speaker_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expert_talk_speaker_affiliation">Speaker Affiliation:</Label>
                    <Input
                      id="expert_talk_speaker_affiliation"
                      name="expert_talk_speaker_affiliation"
                      value={formData.expert_talk_speaker_affiliation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expert_talk_audience">Number of Students (Audience):</Label>
                    <Input
                      id="expert_talk_audience"
                      name="expert_talk_audience"
                      type="number"
                      value={formData.expert_talk_audience || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expert_talk_date">Date:</Label>
                    <Input
                      id="expert_talk_date"
                      name="expert_talk_date"
                      type="date"
                      value={formData.expert_talk_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* NEW FIELDS for Alumni Interaction */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Alumni Interaction Details</div>
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
                    <Label htmlFor="alumni_graduation_year">Graduation Year:</Label>
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
          </TabsContent>

          {/* --------------------- Research Work Tab --------------------- */}
          <TabsContent value="research">
            <Card>
              <CardHeader>
                <CardTitle>Research Work</CardTitle>
                <CardDescription>
                  Enter details about research proposals and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Research fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="research_title">Research Title:</Label>
                    <Input
                      id="research_title"
                      name="research_title"
                      value={formData.research_title || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="research_organization">Organization:</Label>
                    <Input
                      id="research_organization"
                      name="research_organization"
                      value={formData.research_organization || ""}
                      onChange={handleInputChange}
                      required
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
                      required
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
                      required
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

                {/* NEW FIELDS for Research */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="font-semibold text-lg">Additional Research Details</div>
                  <div className="space-y-2">
                    <Label htmlFor="research_funding_organization">Funding Organization:</Label>
                    <Input
                      id="research_funding_organization"
                      name="research_funding_organization"
                      value={formData.research_funding_organization || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="research_approval_date">Approval Date:</Label>
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
                  <div className="font-semibold text-lg">Collaborative Research</div>
                  <div className="space-y-2">
                    <Label htmlFor="research_collaborative_partner">Partner Institution:</Label>
                    <Input
                      id="research_collaborative_partner"
                      name="research_collaborative_partner"
                      value={formData.research_collaborative_partner || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="research_collaboration_duration">Collaboration Duration:</Label>
                    <Input
                      id="research_collaboration_duration"
                      name="research_collaboration_duration"
                      value={formData.research_collaboration_duration || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="research_collaboration_outcomes">Key Outcomes:</Label>
                    <Textarea
                      id="research_collaboration_outcomes"
                      name="research_collaboration_outcomes"
                      value={formData.research_collaboration_outcomes || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --------------------- Summary Sheet Tab --------------------- */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Summary Sheet</CardTitle>
                <CardDescription>
                  Enter summary details for faculty and student activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Summary fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conference_published">
                      Conference Papers Published:
                    </Label>
                    <Input
                      id="conference_published"
                      name="conference_published"
                      type="number"
                      value={formData.conference_published || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="journal_published">
                      Journal Papers Published:
                    </Label>
                    <Input
                      id="journal_published"
                      name="journal_published"
                      type="number"
                      value={formData.journal_published || ""}
                      onChange={handleInputChange}
                      required
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
                      required
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
                      required
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nptel_completed">
                      NPTEL Courses Completed:
                    </Label>
                    <Input
                      id="nptel_completed"
                      name="nptel_completed"
                      type="number"
                      value={formData.nptel_completed || ""}
                      onChange={handleInputChange}
                      required
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
                        No. of Students Attended Conference (NIT/IIT/IIIT):
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
                      <Label htmlFor="hec_events_count">
                        HEC Events Count:
                      </Label>
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
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Newsletter Content'}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">Form submitted successfully!</p>}
      </form>
    </div>
  );
}
