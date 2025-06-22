import { useState, useCallback } from "react";
import { PDFDocument } from 'pdf-lib';
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, GitCommitHorizontal, Download, FilePlus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";

const PDFSplitter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      // Preview number of pages
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setNumPages(pdf.getPageCount());
        toast({ title: "קובץ נטען", description: `הקובץ "${selectedFile.name}" מכיל ${pdf.getPageCount()} עמודים.` });
      } catch (e) {
        setFile(null);
        setNumPages(0);
        toast({ title: "שגיאה בקריאת הקובץ", variant: "destructive" });
      }
    } else {
      setFile(null);
      setNumPages(0);
    }
  };

  const splitPdf = useCallback(async () => {
    if (!file) {
      toast({ title: "לא נבחר קובץ", description: "יש לבחור קובץ PDF תחילה.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    toast({ title: "מתחיל פיצול...", description: "התהליך עשוי לקחת מספר רגעים." });

    try {
      const zip = new JSZip();
      const originalPdfBytes = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(originalPdfBytes);

      for (let i = 0; i < originalPdf.getPageCount(); i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
        newPdf.addPage(copiedPage);
        const newPdfBytes = await newPdf.save();
        zip.file(`page_${i + 1}.pdf`, newPdfBytes);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${file.name.replace('.pdf', '')}-split.zip`);
      
      toast({ title: "הפיצול הסתיים בהצלחה!", description: "קובץ ה-ZIP עם כל העמודים מוכן להורדה." });

    } catch (error) {
      console.error("Error during PDF splitting:", error);
      toast({ title: "שגיאה בפיצול", description: "אירעה שגיאה בעיבוד הקובץ.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }, [file, toast]);

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Button onClick={() => navigate("/categories/pdf-tools")} variant="outline" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        חזרה לכלי PDF
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>פיצול קובץ PDF</CardTitle>
          <CardDescription>הפוך כל עמוד בקובץ PDF לקובץ נפרד.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdf-upload">1. בחר קובץ PDF</Label>
            <Input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>

          {file && (
            <Alert variant="default">
              <FilePlus className="h-4 w-4" />
              <AlertTitle>{file.name}</AlertTitle>
              <AlertDescription>
                הקובץ מכיל <strong>{numPages}</strong> עמודים. כל עמוד יהפוך לקובץ PDF נפרד.
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={splitPdf} disabled={!file || isProcessing} className="w-full">
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <GitCommitHorizontal className="h-4 w-4 mr-2" />
            )}
            {isProcessing ? "מפצל..." : `פצל והורד (${numPages} קבצים)`}
          </Button>

          <Alert>
            <Download className="h-4 w-4" />
            <AlertTitle>הורדה מאובטחת</AlertTitle>
            <AlertDescription>
              לאחר הפיצול, כל הקבצים החדשים יאוגדו בקובץ ZIP אחד וירדו ישירות למחשב שלך. שום מידע לא נשמר או נשלח מהדפדפן.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFSplitter;