import { NextRequest, NextResponse } from 'next/server';
import { generateTokens, setAuthCookies, getUserByUid } from '@/lib/services/auth';

// export async function POST(req: NextRequest) {
//     try {
//         const { email, password } = await req.json();

//         // Validate input
//         if (!email || !password) {
//             return NextResponse.json(
//                 { error: 'Email and password are required' },
//                 { status: 400 }
//             );
//         }

//         // Get user by email
//         const user = await getUserByEmail(email);
//         if (!user) {
//             return NextResponse.json(
//                 { error: 'Invalid email or password' },
//                 { status: 401 }
//             );
//         }

//         // User is disabled
//         if (user.disabled) {
//             return NextResponse.json(
//                 { error: 'Your account has been disabled' },
//                 { status: 403 }
//             );
//         }

//         // Check if password is correct
//         const isPasswordValid = await verifyPassword(password, user.password || '');

//         if (!isPasswordValid) {
//             return NextResponse.json(
//                 { error: 'Invalid email or password' },
//                 { status: 401 }
//             );
//         }

//         // Generate tokens
//         const tokens = generateTokens(user);

//         // Set cookies
//         setAuthCookies(tokens);

//         // Return user data and access token (access token to be stored in app state)
//         return NextResponse.json({
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 isAdmin: user.isAdmin,
//                 picture: user.picture
//             },
//             accessToken: tokens.accessToken,
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         return NextResponse.json(
//             { error: 'An error occurred during login' },
//             { status: 500 }
//         );
//     }
// } 



export async function POST(req: NextRequest) {
    try {
        const { uid, password } = await req.json();

        if (!uid || !password) {
            return NextResponse.json({ error: 'UID and password are required' }, { status: 400 });
        }

        console.log(`Login attempt for UID: ${uid}`);

        // Normal login flow
        try {
            const user = await getUserByUid(uid);
            console.log(`User found for UID ${uid}:`, user ? "Yes" : "No");

            if (!user) {
                return NextResponse.json({ error: 'Invalid UID or password' }, { status: 401 });
            }

            // Simple password check for development
            if (password !== "123") {
                return NextResponse.json({ error: 'Invalid UID or password' }, { status: 401 });
            }

            console.log("Login successful for user:", user.name);
            const tokens = generateTokens(user);

            const response = setAuthCookies(tokens);
            return NextResponse.json({
                user: {
                    id: user.id,
                    name: user.name,
                    uid: user.codeNumber,
                    email: user.institutionalemail,
                },
                accessToken: tokens.accessToken,
            }, response);
        } catch (error) {
            console.error("Error during getUserByUid:", error);
            return NextResponse.json({ error: 'User lookup failed' }, { status: 500 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
    }
}