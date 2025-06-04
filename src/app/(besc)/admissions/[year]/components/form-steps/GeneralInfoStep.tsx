import { useState, useEffect } from "react";
import { FormData } from "../../types";
import {
  Input
} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { AdmissionGeneralInfo, Nationality } from "@/db/schema";

interface GeneralInfoStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  stepHeading?: string;
  stepNotes: React.ReactNode;
}

const STATES = [
  "West Bengal",
  "Maharashtra",
  "Gujarat",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Delhi",
  "Bihar",
  "Rajasthan",
  "Madhya Pradesh",
  // ...add more as needed
];

const CATEGORIES = [
  "General",
  "SC",
  "ST",
  "OBC-A",
  "OBC-B",
];

const GENDERS = ["Male", "Female", "Other"];

const DEGREES = ["Under Graduate", "Post Graduate"];

// Simple static red dot for required fields
const RedDot = () => (
  <span className="ml-1 inline-block align-middle">
    <span className="inline-block h-2 w-2 rounded-full bg-red-600"></span>
  </span>
);

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

// const stepNotes: Record<number, React.ReactNode> = {
//   1: (
//     <div>
//       <div><b>Please Note :</b></div>
//       <ol className="list-decimal ml-5 mt-1 space-y-1 text-sm">
//         <li>All the fields in the above Form are mandatory.</li>
//         <li>Please cross check all the fields especially <b>Category, Gender & Mobile Number</b> before submitting the Form, as these fields are not editable afterwards.</li>
//         <li>As per UGC directives in alignment with NEP 2020, all applicants seeking admission are required to create an Academic Bank of Credits (ABC) account. You will be required to submit this ABC ID at the time of registration to University of Calcutta. <a href="https://www.abc.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Click here to create your ABC ID.</a></li>
//         <li>For Indian citizens applying for admission, it is mandatory to possess an Aadhar Card. Kindly ensure that you have your Aadhar and related ready to prevent any delays in the admission process.</li>
//         <li><span className="text-red-600 font-bold">Red dot</span> indicates mandatory field.</li>
//       </ol>
//     </div>
//   ),
//   2: (
//     <div>
//       <b>Academic Information Note:</b> Please ensure all academic details are accurate and match your official documents. Incorrect information may lead to disqualification.
//     </div>
//   ),
//   3: (
//     <div>
//       <b>Course Application Note:</b> Select your desired program and specialization carefully. Once submitted, changes may not be allowed.
//     </div>
//   ),
//   4: (
//     <div>
//       <b>Additional Information Note:</b> Provide honest and complete information about your extracurriculars and work experience.
//     </div>
//   ),
//   5: (
//     <div>
//       <b>Payment Note:</b> Review your payment details before proceeding. Application fees are non-refundable.
//     </div>
//   ),
// };

export default function GeneralInfoStep({ formData, handleInputChange, stepHeading, stepNotes }: GeneralInfoStepProps) {
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [generalInfo, setGeneralInfo] = useState<AdmissionGeneralInfo>({
    applicationFormId: 0,
    dateOfBirth: new Date().toISOString().split('T')[0],
    email: "",
    firstName: "",
    middleName: null,
    lastName: "",
    mobileNumber: "",
    password: "",
    categoryId: null,
    degreeId: null,
    gender: "FEMALE",
    isGujarati: false,
    nationalityId: null,
    otherNationality: null,
    religionId: null,
    whatsappNumber: null,    
  });

  // Fetch nationalities on component mount
  useEffect(() => {
    // TODO: Replace with actual API call to fetch nationalities
    const fetchNationalities = async () => {
      try {
        // This is a placeholder - replace with actual API call
        const response = await fetch('/api/nationalities');
        const data = await response.json();
        setNationalities(data);
      } catch (error) {
        console.error('Error fetching nationalities:', error);
      }
    };

    fetchNationalities();
  }, []);

  // Sync formData with generalInfo
  useEffect(() => {
    setGeneralInfo(prev => ({
      ...prev,
      firstName: formData.firstName || "",
      middleName: formData.middleName || null,
      lastName: formData.lastName || "",
      email: formData.email || "",
      mobileNumber: formData.phone || "",
      whatsappNumber: formData.whatsappNumber || null,
      dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0],
      isGujarati: formData.isGujarati || false,
      password: formData.password || "",
      // Map other fields as needed
    }));
  }, [formData]);

  // Handle changes in generalInfo and sync back to formData
  const handleGeneralInfoChange = (field: keyof AdmissionGeneralInfo, value: any) => {
    // For lastName, ensure we always store a string in the UI
    if (field === 'lastName') {
      const stringValue = value || "";
      setGeneralInfo(prev => ({ ...prev, [field]: stringValue }));
      handleInputChange('lastName', stringValue);
      return;
    }

    setGeneralInfo(prev => ({ ...prev, [field]: value }));
    
    // Map the changes back to formData
    switch (field) {
      case 'firstName':
        handleInputChange('firstName', value || "");
        break;
      case 'middleName':
        handleInputChange('middleName', value);
        break;
      case 'email':
        handleInputChange('email', value || "");
        break;
      case 'mobileNumber':
        handleInputChange('phone', value || "");
        break;
      case 'whatsappNumber':
        handleInputChange('whatsappNumber', value);
        break;
      case 'dateOfBirth':
        handleInputChange('dateOfBirth', value || new Date().toISOString().split('T')[0]);
        break;
      case 'isGujarati':
        handleInputChange('isGujarati', value);
        break;
      case 'password':
        handleInputChange('password', value || "");
        break;
      // Add other field mappings as needed
    }
  };

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // OTP state
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [sameAsMobile, setSameAsMobile] = useState(true);

  // Helper for DOB
  const dob = generalInfo.dateOfBirth ? new Date(generalInfo.dateOfBirth) : new Date();
  const dobDay = dob.getDate().toString();
  const dobMonth = (dob.getMonth() + 1).toString();
  const dobYear = dob.getFullYear().toString();

  // Serial number helper
  let sl = 1;

  // Handle nationality change
  const handleNationalityChange = (value: string) => {
    if (value === "other") {
      // If "Other" is selected, set nationalityId to null and show other nationality input
      handleGeneralInfoChange("nationalityId", null);
      handleInputChange("nationality", "Other");
    } else {
      // Find the selected nationality from the array
      const selectedNationality = nationalities.find(n => n.id?.toString() === value);
      if (selectedNationality?.id) {
        handleGeneralInfoChange("nationalityId", selectedNationality.id);
        handleInputChange("nationality", selectedNationality.name);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">{stepHeading || "Step 1 of 5 - General Information (Sr. No. 1 to 13)"}</h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-4 text-left">
          {stepNotes}
        </div>
      </div>
      {/* General Info Section */}
      <Card className="p-6 space-y-6">
        {/* 1. Applicant's Name */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end gap-4 ">
            <div className="flex-1 ">
              <Label className="mb-1 block">1. Applicant's Name</Label>
              <div className="flex w-full gap-2 mt-4">
                <div className="w-1/3">
                  <Label className="mb-1 flex items-center">First Name <RedDot /></Label>
                  <Input 
                    value={generalInfo.firstName} 
                    onChange={e => handleGeneralInfoChange("firstName", e.target.value)} 
                    required 
                    placeholder="AS PER CLASS XII BOARD MARKSHEET" 
                  />
                </div>
                <div className="w-1/3">
                  <Label className="mb-1 flex items-center"> Middle Name </Label>
                  <Input 
                    value={generalInfo.middleName || ""} 
                    onChange={e => handleGeneralInfoChange("middleName", e.target.value)} 
                    placeholder="AS PER CLASS XII BOARD MARKSHEET" 
                  />
                  <p className="text-red-500 font-semibold text-xs">(Do not write if not given in Class XII Board Marksheet)</p>
                </div>
                <div className="w-1/3">
                  <Label className="mb-1 flex items-center">Last Name <RedDot /></Label>
                  <Input 
                    value={generalInfo.lastName || ""} 
                    onChange={e => handleGeneralInfoChange("lastName", e.target.value)} 
                    required 
                    placeholder="AS PER CLASS XII BOARD MARKSHEET" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 2. Email */}
        <div>
          <Label className="flex items-center mb-1">2. Email <RedDot /></Label>
          <Input 
            value={generalInfo.email} 
            onChange={e => handleGeneralInfoChange("email", e.target.value)} 
            required 
            placeholder="Email" 
            disabled={emailVerified} 
          />
        </div>
        {/* 3. Date of Birth (split) */}
        <div>
          <Label className="flex items-center mb-1">3. Date of Birth <RedDot /></Label>
          <div className="flex gap-2">
            <Select 
              value={dobDay} 
              onValueChange={val => {
                const newDate = new Date(generalInfo.dateOfBirth || new Date());
                newDate.setDate(Number(val));
                handleGeneralInfoChange("dateOfBirth", newDate.toISOString().split('T')[0]);
              }}
            >
              <SelectTrigger className="w-24"><SelectValue placeholder="Select date" /></SelectTrigger>
              <SelectContent>{days.map(day => <SelectItem key={day} value={day.toString()}>{day}</SelectItem>)}</SelectContent>
            </Select>
            <Select 
              value={dobMonth} 
              onValueChange={val => {
                const newDate = new Date(generalInfo.dateOfBirth || new Date());
                newDate.setMonth(Number(val) - 1);
                handleGeneralInfoChange("dateOfBirth", newDate.toISOString().split('T')[0]);
              }}
            >
              <SelectTrigger className="w-32"><SelectValue placeholder="Select month" /></SelectTrigger>
              <SelectContent>{months.map((month, idx) => <SelectItem key={month} value={(idx + 1).toString()}>{month}</SelectItem>)}</SelectContent>
            </Select>
            <Select 
              value={dobYear} 
              onValueChange={val => {
                const newDate = new Date(generalInfo.dateOfBirth || new Date());
                newDate.setFullYear(Number(val));
                handleGeneralInfoChange("dateOfBirth", newDate.toISOString().split('T')[0]);
              }}
            >
              <SelectTrigger className="w-32"><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>{years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        {/* 4(a) and 4(b) Nationality/Other Nationality on same line */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label className="flex items-center mb-1">4(a). Nationality <RedDot /></Label>
            <Select 
              value={generalInfo.nationalityId?.toString() || "other"} 
              onValueChange={handleNationalityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Nationality" />
              </SelectTrigger>
              <SelectContent>
                {nationalities.map(nationality => (
                  nationality.id && (
                    <SelectItem key={nationality.id} value={nationality.id.toString()}>
                      {nationality.name}
                    </SelectItem>
                  )
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label className="flex items-center mb-1">4(b). Other Nationality</Label>
            <Input 
              value={formData.otherNationality || ""} 
              onChange={e => handleInputChange("otherNationality", e.target.value)} 
              placeholder="Other Nationality" 
              disabled={generalInfo.nationalityId !== null}
            />
          </div>
        </div>
        {/* 5. Category */}
        <div>
          <Label className="flex items-center mb-1">5. Select Category <RedDot /></Label>
          <Select 
            value={formData.category || ""} 
            onValueChange={val => handleInputChange("category", val)}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {/* 6. Is either of your parents Gujarati? */}
        <div>
          <Label className="flex items-center mb-1">6. Is either of your parents Gujarati? <RedDot /></Label>
          <Select 
            value={generalInfo.isGujarati ? "Yes" : "No"} 
            onValueChange={val => handleGeneralInfoChange("isGujarati", val === "Yes")}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* 7. Gender */}
        <div>
          <Label className="flex items-center mb-1">7. Select Your Gender <RedDot /></Label>
          <Select 
            value={generalInfo.gender || ""} 
            onValueChange={val => handleGeneralInfoChange("gender", val)}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {/* 8(a) and 8(b) Mobile/WhatsApp on same line */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* 8(a). Mobile Number */}
          <div className="flex-1">
            <Label className="flex items-center mb-1">8(a). Mobile Number <span className="text-blue-700 font-bold">(10-digit only.)</span> <RedDot /></Label>
            <Input 
              value={generalInfo.mobileNumber} 
              onChange={e => handleGeneralInfoChange("mobileNumber", e.target.value)} 
              required 
              placeholder="All future communication from college will be on this No." 
              disabled={mobileVerified} 
            />
            {/* OTP logic */}
            <div className="flex items-center gap-2 mt-2">
              {!mobileVerified && !mobileOtpSent && (
                <Button type="button" size="sm" onClick={() => setMobileOtpSent(true)}>Send OTP</Button>
              )}
              {mobileOtpSent && !mobileVerified && (
                <>
                  <Input 
                    className="w-32" 
                    value={mobileOtp} 
                    onChange={e => setMobileOtp(e.target.value)} 
                    placeholder="Enter OTP" 
                    size={"sm" as any} 
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={() => { if (mobileOtp === "123456") setMobileVerified(true); }}
                  >
                    Verify OTP
                  </Button>
                </>
              )}
              {mobileVerified && <span className="text-green-600 font-semibold ml-2">Verified</span>}
            </div>
          </div>
          <div className="flex-1">
            <Label className="flex items-center mb-1">8(b). WhatsApp Number <RedDot /></Label>
            <div className="flex items-center gap-2">
              <Input 
                value={sameAsMobile ? generalInfo.mobileNumber : (generalInfo.whatsappNumber || "")} 
                onChange={e => handleGeneralInfoChange("whatsappNumber", e.target.value)} 
                required 
                disabled={sameAsMobile} 
                placeholder="WhatsApp Number" 
              />
              <Checkbox 
                checked={sameAsMobile} 
                onCheckedChange={checked => {
                  setSameAsMobile(!!checked);
                  if (checked) {
                    handleGeneralInfoChange("whatsappNumber", generalInfo.mobileNumber);
                  }
                }} 
                id="sameAsMobile" 
              />
              <Label htmlFor="sameAsMobile" className="text-xs">Same As Mobile Number</Label>
            </div>
          </div>
        </div>
        {/* 9. Are you a resident of Kolkata? */}
        <div>
          <Label className="flex items-center mb-1">9. Are you a resident of Kolkata? <RedDot /></Label>
          <Select 
            value={formData.isKolkataResident ? "Yes" : "No"} 
            onValueChange={val => handleInputChange("isKolkataResident", val === "Yes")}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      {/* Login Details Section */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-2">Login Details</h3>
        <p className="text-sm text-muted-foreground mb-4">The mobile number entered above in Sr. No. 8 (a) will be your login ID by default in order to access your profile on college website.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="flex items-center mb-1">10. Login Id <RedDot /></Label>
            <Input value={generalInfo.mobileNumber} disabled placeholder="Login Id" />
          </div>
          <div>
            <Label className="flex items-center mb-1">11. Password <RedDot /></Label>
            <Input 
              type="password" 
              value={generalInfo.password} 
              onChange={e => handleGeneralInfoChange("password", e.target.value)} 
              placeholder="Password (Max 10 Characters)" 
              maxLength={10} 
              required 
            />
          </div>
          <div>
            <Label className="flex items-center mb-1">12. Confirm Password <RedDot /></Label>
            <Input 
              type="password" 
              value={formData.confirmPassword || ""} 
              onChange={e => handleInputChange("confirmPassword", e.target.value)} 
              placeholder="Confirm Password (Max 10 Characters)" 
              maxLength={10} 
              required 
            />
          </div>
        </div>
      </Card>
      {/* Application To Section */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-2">Application To</h3>
        <p className="text-sm text-muted-foreground mb-4">Since you are applying to B.Com./B.A./B.Sc./BBA course, the selection will remain "Undergraduate".</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="flex items-center mb-1">13. Select Degree <RedDot /></Label>
            <Select 
              value={formData.degree || "Under Graduate"} 
              onValueChange={val => handleInputChange("degree", val)}
            >
              <SelectTrigger><SelectValue placeholder="Select Degree" /></SelectTrigger>
              <SelectContent>{DEGREES.map(degree => <SelectItem key={degree} value={degree}>{degree}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
}
