import { dbPostgres } from "@/db";
import { otps, otpType } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

const OTP_EXPIRY_MINUTES = 15;

export async function generateOtp(type: typeof otpType.enumValues[number], recipient: string) {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Delete any existing OTPs for the same recipient and type to ensure only one is active
    await dbPostgres.delete(otps).where(and(eq(otps.recipient, recipient), eq(otps.type, type)));

    const [newOtp] = await dbPostgres
        .insert(otps)
        .values({
            otp: otpCode,
            recipient,
            type,
            expiresAt,
        })
        .returning();

    return newOtp.otp;
}

export async function verifyOtp(type: typeof otpType.enumValues[number], recipient: string, otp: string) {
    const [foundOtp] = await dbPostgres
        .select()
        .from(otps)
        .where(and(
            eq(otps.recipient, recipient),
            eq(otps.type, type),
            eq(otps.otp, otp)
        ))
        .orderBy(desc(otps.createdAt))
        .limit(1);

    if (!foundOtp) {
        return false; // OTP not found
    }

    if (foundOtp.expiresAt < new Date()) {
        // OTP expired, delete it
        await dbPostgres.delete(otps).where(eq(otps.id, foundOtp.id));
        return false; // OTP expired
    }

    // OTP is valid, delete it to prevent reuse
    await dbPostgres.delete(otps).where(eq(otps.id, foundOtp.id));

    return true; // OTP verified
}