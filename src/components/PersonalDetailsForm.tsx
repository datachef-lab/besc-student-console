import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CalendarIcon, 
  MailIcon, 
  PhoneIcon, 
  UserIcon, 
  LockIcon,
  GlobeIcon,
  UsersIcon,
  MapPinIcon,
  GraduationCapIcon
} from 'lucide-react';

const PersonalDetailsForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    nationality: '',
    category: '',
    parentsGujarati: '',
    gender: '',
    mobileNumber: '',
    whatsappNumber: '',
    residentKolkata: '',
    loginId: '',
    password: '',
    confirmPassword: '',
    degree: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
     setFormData((prevData) => ({ ...prevData, [id]: value }));
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Personal Details Form</h2>
          <p className="text-lg text-gray-600">Please fill in your details carefully</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-12 drop-shadow-xl">
          {/* Personal Details Section */}
          <div className=" bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 ">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
              <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 group">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Applicant&apos;s First Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <Label htmlFor="middleName" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Applicant&apos;s Middle Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="middleName"
                    placeholder="Enter middle name"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Applicant&apos;s Last Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Email</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <Label htmlFor="dobDay" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Date of birth</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                    <Input 
                      id="dobDay" 
                      placeholder="Day" 
                      value={formData.dobDay} 
                      onChange={handleInputChange} 
                      className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                    />
                  </div>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                    <Input 
                      id="dobMonth" 
                      placeholder="Month" 
                      value={formData.dobMonth} 
                      onChange={handleInputChange} 
                      className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                    />
                  </div>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                    <Input 
                      id="dobYear" 
                      placeholder="Year" 
                      value={formData.dobYear} 
                      onChange={handleInputChange} 
                      className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Information Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 ">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
              <UsersIcon className="h-6 w-6 text-blue-600 mr-2" />
              Other Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 group">
                <Label htmlFor="nationality" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Nationality</Label>
                <div className="relative">
                  <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="nationality"
                    placeholder="Enter nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Select Category</Label>
                <div className="relative">
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
                    <SelectTrigger className="w-full pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="sc">SC</SelectItem>
                      <SelectItem value="st">ST</SelectItem>
                      <SelectItem value="obca">OBC-A</SelectItem>
                      <SelectItem value="obcb">OBC-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="parentsGujarati" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Is either of your parents Gujarati?</Label>
                <div className="relative">
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Select onValueChange={(value) => handleSelectChange('parentsGujarati', value)} value={formData.parentsGujarati}>
                    <SelectTrigger className="w-full pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Select Your Gender</Label>
                <div className="relative">
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Select onValueChange={(value) => handleSelectChange('gender', value)} value={formData.gender}>
                    <SelectTrigger className="w-full pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Mobile Number (10-digit only)</Label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="mobileNumber"
                    placeholder="Enter mobile number"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="whatsappNumber" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">WhatsApp Number</Label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="whatsappNumber"
                    placeholder="Enter WhatsApp number"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="residentKolkata" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Are you a resident of Kolkata?</Label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Select onValueChange={(value) => handleSelectChange('residentKolkata', value)} value={formData.residentKolkata}>
                    <SelectTrigger className="w-full pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="degree" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Select Degree</Label>
                <div className="relative">
                  <GraduationCapIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Select onValueChange={(value) => handleSelectChange('degree', value)} value={formData.degree}>
                    <SelectTrigger className="w-full pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      {/* Add other degree options as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Login Details Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 ">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
              <LockIcon className="h-6 w-6 text-blue-600 mr-2" />
              Login Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 group">
                <Label htmlFor="loginId" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Login ID</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="loginId"
                    placeholder="Enter Login ID"
                    value={formData.loginId}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Password</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Confirm Password</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-auto mt-8 py-6 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md  "
          >
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;