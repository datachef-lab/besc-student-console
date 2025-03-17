import DocumentContent from "@/components/documents/DocumentContent";
import { scanDocs } from "@/lib/services/docs";

export const metadata = {
  title: "Documents",
};

export default async function DocumentsPage() {
  const scannedDocs = await scanDocs("191017-11-0592", "", "BCOM");

  return <DocumentContent scannedDocs={scannedDocs} />;
}
