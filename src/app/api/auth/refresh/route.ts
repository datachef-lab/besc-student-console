import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, generateTokens, getUserByEmail } from '@/lib/services/auth';
import { Student } from '@/types/academics/student';

export async function GET() {
    try {
        // Get refresh token from cookies
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        // No refresh token, return error
        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token provided' },
                { status: 401 }
            );
        }

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid refresh token' },
                { status: 401 }
            );
        }

        let user: Student | null = null;

        if (payload.isAdmin) {
            user = {
                id: 0,
                name: 'Admin',
                codeNumber: 'admin',
                institutionalemail: 'admin@example.com',
                email: 'admin@example.com',
                isAdmin: true,
                // Add required fields with default values
                mailingPinNo: '',
                resiPinNo: '',
                admissionYear: 0,
                oldcodeNumber: '',
                active: true,
                alumni: false,
                contactNo: '',
                imgFile: '',
                applicantSignature: '',
                sexId: 0,
                mailingAddress: '',
                phoneMobileNo: '',
                residentialAddress: '',
                resiPhoneMobileNo: '',
                religionId: 0,
                studentCategoryId: 0,
                motherTongueId: 0,
                dateOfBirth: new Date(),
                nationalityId: 0,
                rollNumber: '',
                bloodGroup: 0,
                eyePowerLeft: '',
                eyePowerRight: '',
                emrgnResidentPhNo: '',
                emrgnOfficePhNo: '',
                emrgnMotherMobNo: '',
                emrgnFatherMobNo: '',
                lastInstitution: '',
                lastInstitutionAddress: '',
                handicapped: 'NO',
                handicappedDetails: '',
                lsmedium: '',
                annualFamilyIncome: '',
                lastBoardUniversity: 0,
                institutionId: 0,
                fatherName: '',
                fatherOccupation: 0,
                fatherOffPhone: '',
                fatherMobNo: '',
                fatherEmail: '',
                motherName: '',
                motherOccupation: 0,
                motherOffPhone: '',
                motherMobNo: '',
                motherEmail: '',
                guardianName: '',
                guardianOccupation: 0,
                guardianOffAddress: '',
                guardianOffPhone: '',
                guardianMobNo: '',
                guardianEmail: '',
                admissioncodeno: '',
                placeofstay: '',
                placeofstaycontactno: '',
                placeofstayaddr: '',
                universityRegNo: '',
                admissiondate: new Date(),
                emercontactpersonnm: '',
                emerpersreltostud: '',
                emercontactpersonmob: '',
                emercontactpersonphr: '',
                emercontactpersonpho: '',
                leavingdate: new Date(),
                univregno: '',
                univlstexmrollno: '',
                communityid: 0,
                lspassedyr: 0,
                cuformno: '',
                chkrepeat: false,
                notes: '',
                fatherPic: '',
                motherPic: '',
                guardianPic: '',
                lastotherBoardUniversity: 0,
                boardresultid: 0,
                rfidno: '',
                specialisation: '',
                aadharcardno: '',
                leavingreason: '',
                localitytyp: '',
                rationcardtyp: '',
                fatheraadharno: '',
                motheraadharno: '',
                gurdianaadharno: '',
                issnglprnt: '',
                handicappedpercentage: '',
                disabilitycode: '',
                coursetype: null,
                whatsappno: '',
                alternativeemail: '',
                othernationality: '',
                pursuingca: '',
                abcid: '',
                apprid: '',
                // Add Nationality fields
                nationalityName: 'Admin',
                pos: 0,
                code: 'ADMIN'
            };
        } else {
            // Get user from database
            user = await getUserByEmail(payload.email);
            if (!user) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Failed to get user data' },
                { status: 500 }
            );
        }

        // Generate new tokens
        const tokens = generateTokens(user);

        // Set new refresh token cookie
        cookieStore.set('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/'
        });

        // Return new access token
        return NextResponse.json({
            accessToken: tokens.accessToken,
            user: user,
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            { error: 'An error occurred during token refresh' },
            { status: 500 }
        );
    }
} 