"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// needed later
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
//
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Sun , Moon } from 'lucide-react' ;
import Image from "next/image"

export default function NewsletterFormComponent() {
  const [formData, setFormData] = useState({})
  const [darkMode, setDarkMode] = useState(false); 

  const handleInputChange = (e:any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))

  }

  const handleSubmit = (e:any) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    /// TODO : backend connection for submit btn , need to integrate it wid supabase 
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };


  return (
    <div className={darkMode ? "dark" :""}>

 <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          {/* <img src="../app/college_logo.png" alt="College Icon" className="h-10 w-10" />  */}
          <Image src = "/images/college_logo.png" alt="college icon" height={60} width={60}/>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 px-14">BMSIT&M - Department of Artificial Intelligence and Machine Learning</h1>
        </div>

        <Button
          onClick={toggleDarkMode}
          className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-full"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </Button>
      </header>


    <form onSubmit={handleSubmit} className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Newsletter Submission Form</h1>

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
              <CardDescription>Enter details about Memorandums of Understanding and awards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mou-org">MoUs signed with:</Label>
                  <Input id="mou-org" name="mou-org" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mou-date">Date:</Label>
                  <Input id="mou-date" name="mou-date" type="date" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty-name">Coordinated by:</Label>
                  <Input id="faculty-name" name="faculty-name" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation:</Label>
                  <Input id="designation" name="designation" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department:</Label>
                  <Input id="department" name="department" onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-chair">Session Chair:</Label>
                <Input id="session-chair" name="session-chair" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boe-bos">BOE/BOS Member:</Label>
                <Input id="boe-bos" name="boe-bos" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="best-paper">Best Paper Award:</Label>
                <Textarea id="best-paper" name="best-paper" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-received">Award Received:</Label>
                <Textarea id="award-received" name="award-received" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photos">Attach relevant photographs:</Label>
                <Input id="photos" name="photos" type="file" multiple onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industry">
          <Card>
            <CardHeader>
              <CardTitle>Industry and Institute Interaction</CardTitle>
              <CardDescription>Enter details about industrial visits and internships</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industrial-visit-department">Department:</Label>
                  <Input id="industrial-visit-department" name="industrial-visit-department" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industrial-visit-semester">Semester:</Label>
                  <Input id="industrial-visit-semester" name="industrial-visit-semester" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industrial-visit-place">Place:</Label>
                  <Input id="industrial-visit-place" name="industrial-visit-place" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industrial-visit-date">Date:</Label>
                  <Input id="industrial-visit-date" name="industrial-visit-date" type="date" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industrial-visit-students">Number of students:</Label>
                  <Input id="industrial-visit-students" name="industrial-visit-students" type="number" onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty-internship">Faculty Internship:</Label>
                <Textarea id="faculty-internship" name="faculty-internship" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-internship">Student Internship:</Label>
                <Textarea id="student-internship" name="student-internship" onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workshops">
          <Card>
            <CardHeader>
              <CardTitle>Workshops / Faculty Development Programmes / Fests</CardTitle>
              <CardDescription>Enter details about workshops, FDPs, and technical fests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workshop-name">Workshop Name:</Label>
                  <Input id="workshop-name" name="workshop-name" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workshop-start-date">Start Date:</Label>
                  <Input id="workshop-start-date" name="workshop-start-date" type="date" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workshop-end-date">End Date:</Label>
                  <Input id="workshop-end-date" name="workshop-end-date" type="date" onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fdp-details">Faculty Development Programme:</Label>
                <Textarea id="fdp-details" name="fdp-details" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-fest">Technical Fest:</Label>
                <Textarea id="tech-fest" name="tech-fest" onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seminars">
          <Card>
            <CardHeader>
              <CardTitle>Seminars / Expert Talks / Alumni Interaction</CardTitle>
              <CardDescription>Enter details about seminars, expert talks, and alumni interactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expert-talk">Expert Talk Organized:</Label>
                <Textarea id="expert-talk" name="expert-talk" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alumni-interaction">Alumni Interaction:</Label>
                <Textarea id="alumni-interaction" name="alumni-interaction" onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research">
          <Card>
            <CardHeader>
              <CardTitle>Research Work</CardTitle>
              <CardDescription>Enter details about research proposals and activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="research-title">Research Title:</Label>
                  <Input id="research-title" name="research-title" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="research-organization">Organization:</Label>
                  <Input id="research-organization" name="research-organization" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="research-date">Date:</Label>
                  <Input id="research-date" name="research-date" type="date" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="research-cost">Total Cost:</Label>
                  <Input id="research-cost" name="research-cost" type="number" onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="research-proposals-submitted">Research Proposals Submitted:</Label>
                <Textarea id="research-proposals-submitted" name="research-proposals-submitted" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="research-proposals-granted">Research Proposals Granted:</Label>
                <Textarea id="research-proposals-granted" name="research-proposals-granted" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="research-centre-activities">Research Centre Activities:</Label>
                <Textarea id="research-centre-activities" name="research-centre-activities" onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Summary Sheet</CardTitle>
              <CardDescription>Enter summary details for faculty and student activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="conference-published">Conference Papers Published:</Label>
                  <Input id="conference-published" name="conference-published" type="number" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="journal-published">Journal Papers Published:</Label>
                  <Input id="journal-published" name="journal-published" type="number" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="books-published">Books Published:</Label>
                  <Input id="books-published" name="books-published" type="number" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fdps-attended">FDPs/STTP Attended:</Label>
                  <Input id="fdps-attended" name="fdps-attended" type="number" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moocs-completed">MooCs Completed:</Label>
                  <Input id="moocs-completed" name="moocs-completed" type="number" onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nptel-completed">NPTEL Courses Completed:</Label>
                  <Input id="nptel-completed" name="nptel-completed" type="number" onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="other-initiatives">Other Initiatives by the Department:</Label>
                <Textarea id="other-initiatives" name="other-initiatives" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-achievements">Student Achievements:</Label>
                <Textarea id="student-achievements" name="student-achievements" onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit">Submit Newsletter Content</Button>
      </div>
    </form>
    </div>
  )
}