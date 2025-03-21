import { promises as fs } from "fs";
import path from "path";

const DOCS_PATH = process.env.DOCS_PATH!;

type Stream = "BCOM" | "BA" | "BSC" | "MCOM" | "MA" | "BBA";

export type ScanDoc = {
    filePath: string;
    semester: number | null;
    type: string;
};

export async function scanDocs(rollNumber: string, registrationNumber: string, stream: Stream) {
    const docsArr: ScanDoc[] = [];

    for (let y = 2017; y <= new Date().getFullYear(); y++) {
        // 1. Scan for the marksheets
        for (let sem = 1; sem <= 6; sem++) {
            const filePath = path.join(DOCS_PATH, `${y}/${stream}/${sem}/${rollNumber}.pdf`);
            if (await fileExists(filePath)) {
                docsArr.push({ filePath, semester: sem, type: "MARKSHEET" });
            }
        }

        // 2. Scan for the degree certificates (Check all folders for rollNumber.pdf)
        const degreePath = path.join(DOCS_PATH, `DEGREE CERTIFICATES`);
        await scanFolderForFile(degreePath, rollNumber, "DEGREE CERTIFICATES", docsArr);

        // 3. Scan for the registration certificates (Check all folders for rollNumber.pdf)
        const regPath = path.join(DOCS_PATH, `REGISTRATION CERTIFICATES`);
        await scanFolderForFile(regPath, rollNumber, "REGISTRATION CERTIFICATES", docsArr);
    }

    return docsArr;
}

// Utility function to check if a file exists
async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// Utility function to scan folders for the given rollNumber.pdf
async function scanFolderForFile(basePath: string, rollNumber: string, type: "MARKSHEET" | "DEGREE CERTIFICATES" | "REGISTRATION CERTIFICATES", docsArr: ScanDoc[]) {
    try {
        const folders = await fs.readdir(basePath); // List all subdirectories
        for (const folder of folders) {
            const filePath = path.join(basePath, folder, `${rollNumber}.pdf`);
            if (await fileExists(filePath)) {
                docsArr.push({ filePath, semester: null, type: `${type} (${folder})` });
            }
        }
    } catch (error) {
        console.log(`Error accessing ${basePath}:`, error);
    }
}


export async function getFile(filePath: string) {
    try {
        const fileBuffer = await fs.readFile(filePath);
        return fileBuffer;
    } catch (error) {
        console.log(error);
        // throw new Error("File not found or unreadable.");
        return null;
    }
}