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
  const router = useRouter() ; 
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
      //console.error("Error details:", error.message, error.status);
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

      // Remove file input from form data
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
        onClick = {navigateToAdmin}
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

          <TabsContent value="mou">
            <Card>
              <CardHeader>
                <CardTitle>MoU Details</CardTitle>
                <CardDescription>
                  Enter details about Memorandums of Understanding and awards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mou-org">MoUs signed with:</Label>
                    <Input
                      id="mou_org"
                      name="mou_org"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mou-date">Date:</Label>
                    <Input
                      id="mou_date"
                      name="mou_date"
                      type="date"
                      onChange={handleInputChange}
                      required
                    /> 
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-name">Coordinated by:</Label>
                    <Input
                      id="faculty_name"
                      name="faculty_name"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation:</Label>
                    <Input
                      id="designation"
                      name="designation"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department:</Label>
                    <Input
                      id="department"
                      name="department"
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
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boe_bos_member">BOE/BOS Member:</Label>
                  <Input
                    id="boe_bos_member"
                    name="boe_bos_member"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="best_paper_award">Best Paper Award:</Label>
                  <Textarea
                    id="best_paper_award"
                    name="best_paper_award"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="award_received">Award Received:</Label>
                  <Textarea
                    id="award_received"
                    name="award_received"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attached_photos">Attach relevant photographs:</Label>
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
          </TabsContent>

          <TabsContent value="industry">
            <Card>
              <CardHeader>
                <CardTitle>Industry and Institute Interaction</CardTitle>
                <CardDescription>
                  Enter details about industrial visits and internships
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industrial_visit_department">
                      Department:
                    </Label>
                    <Input
                      id="industrial_visit_department"
                      name="industrial_visit_department"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industrial_visit_semester">Semester:</Label>
                    <Input
                      id="industrial_visit_semester"
                      name="industrial_visit_semester"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industrial_visit_place">Place:</Label>
                    <Input
                      id="industrial_visit_place"
                      name="industrial_visit_place"
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
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industrial_visit_students">
                      Number of students:
                    </Label>
                    <Input
                      id="industrial_visit_students"
                      name="industrial_visit_students"
                      type="number"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty_internship">
                    Faculty Internship:
                  </Label>
                  <Textarea
                    id="faculty_internship"
                    name="faculty_internship"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student_internship">
                    Student Internship:
                  </Label>
                  <Textarea
                    id="student_internship"
                    name="student_internship"
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workshop_name">Workshop Name:</Label>
                    <Input
                      id="workshop_name"
                      name="workshop_name"
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
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fdp_details">
                    Faculty Development Programme:
                  </Label>
                  <Textarea
                    id="fdp_details"
                    name="fdp_details"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech_fest">Technical Fest:</Label>
                  <Textarea
                    id="tech_fest"
                    name="tech_fest"
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seminars">
            <Card>
              <CardHeader>
                <CardTitle>
                  Seminars / Expert Talks / Alumni Interaction
                </CardTitle>
                <CardDescription>
                  Enter details about seminars, expert talks, and alumni
                  interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expert_talk">Expert Talk Organized:</Label>
                  <Textarea
                    id="expert_talk"
                    name="expert_talk"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alumni_interaction">
                    Alumni Interaction:
                  </Label>
                  <Textarea
                    id="alumni_interaction"
                    name="alumni_interaction"
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="research">
            <Card>
              <CardHeader>
                <CardTitle>Research Work</CardTitle>
                <CardDescription>
                  Enter details about research proposals and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="research_title">Research Title:</Label>
                    <Input
                      id="research_title"
                      name="research_title"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="research_organization">Organization:</Label>
                    <Input
                      id="research_organization"
                      name="research_organization"
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
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="research_centre_activities">
                    Research Centre Activities:
                  </Label>
                  <Textarea
                    id="research_centre_activities"
                    name="research_centre_activities"
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
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
                      Conference Papers Published:
                    </Label>
                    <Input
                      id="conference_published"
                      name="conference_published"
                      type="number"
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
                    onChange={handleInputChange}
                  />
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

