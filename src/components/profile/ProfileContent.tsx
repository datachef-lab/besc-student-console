"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useStudent } from "@/context/StudentContext";

export default function ProfileContent() {
  const { student, batch } = useStudent();

  if (!student) return <div className="p-6">Student data not found</div>;

  // Helper function to format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Profile</h1>
        {student.alumni && <Badge>Graduated</Badge>}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
              {student?.imgFile ? (
                <Image
                  src={`https://74.207.233.48:8443/hrclIRP/studentimages/${student?.imgFile}`}
                  alt={student?.name || "student-profile-image"}
                  className="h-full w-full object-cover"
                  width={128}
                  height={128}
                />
              ) : (
                <User className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-gray-500">UID: {student.codeNumber}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>
                    {student.institutionalemail || student.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>
                    {student.phoneMobileNo || student.contactNo || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>DOB: {formatDate(student.dateOfBirth)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span>Framework: {student.coursetype || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span>Registration No.: {student.univregno || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span>Roll No.: {student.univlstexmrollno || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="academic">Academic Information</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p>{student.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </p>
                  <p>{formatDate(student.dateOfBirth)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p>
                    {student.sexId === 1
                      ? "Male"
                      : student.sexId === 2
                      ? "Female"
                      : "Not Specified"}
                  </p>
                </div>
                {/* <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Blood Group
                  </p>
                  <p>
                    {student.bloodGroup
                      ? `Group ${student.bloodGroup}`
                      : "Not Specified"}
                  </p>
                </div> */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Nationality
                  </p>
                  <p>
                    {student?.nationalityName?.trim() !== ""
                      ? `${student.nationalityName}`
                      : "Not Specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Aadhar Card Number
                  </p>
                  <p>{student.aadharcardno || "Not Provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Family Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Father&apos;s Name
                  </p>
                  <p>{student.fatherName || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Father&apos;s Contact
                  </p>
                  <p>{student.fatherMobNo || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Mother&apos;s Name
                  </p>
                  <p>{student.motherName || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Mother&apos;s Contact
                  </p>
                  <p>{student.motherMobNo || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Guardian&apos;s Name
                  </p>
                  <p>{student.guardianName || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Guardian&apos;s Contact
                  </p>
                  <p>{student.guardianMobNo || "Not Provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Course</p>
                  <p>
                    {(batch && batch.course?.courseName) || "Not Available"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Section</p>
                  <p>
                    {(batch && batch.section?.sectionName) || "Not Available"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Class Roll Number
                  </p>
                  <p>{student.rollNumber || "Not Assigned"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    UID
                  </p>
                  <p>{student.codeNumber || "Not Assigned"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Admission Year
                  </p>
                  <p>{student.admissionYear || "Not Available"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Admission Date
                  </p>
                  <p>{formatDate(student.admissiondate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Previous Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Last Institution Name
                  </p>
                  <p>{student.lastInstitution || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Last Board/University
                  </p>
                  <p>
                    {student.lastBoardUniversity
                      ? `ID: ${student.lastBoardUniversity}`
                      : "Not Provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Passed Year
                  </p>
                  <p>{student.lspassedyr || "Not Provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Email (Institutional)
                  </p>
                  <p>{student.institutionalemail || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Alternative Email
                  </p>
                  <p>
                    {student.alternativeemail ||
                      student.email ||
                      "Not Provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Mobile Number
                  </p>
                  <p>
                    {student.phoneMobileNo ||
                      student.contactNo ||
                      "Not Provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    WhatsApp Number
                  </p>
                  <p>{student.whatsappno || "Not Provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-md font-medium mb-2">
                  Residential Address
                </h3>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p>{student.residentialAddress || "Not Provided"}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    PIN: {student.resiPinNo || "Not Provided"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">Mailing Address</h3>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p>{student.mailingAddress || "Not Provided"}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    PIN: {student.mailingPinNo || "Not Provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Contact Person
                  </p>
                  <p>{student.emercontactpersonnm || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Relation to Student
                  </p>
                  <p>{student.emerpersreltostud || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Mobile Number
                  </p>
                  <p>{student.emercontactpersonmob || "Not Provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
