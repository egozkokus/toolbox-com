import { useState, useCallback } from "react";
import { PDFDocument } from 'pdf-lib';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Merge, Download, FilePlus, X, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";

const PDFMerger = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).filter(file => file.type === 'application/pdf');
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      toast({
        title: "קבצים נוספו",
        description: `${newFiles.length} קבצי PDF נוספו לרשימה.`,
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const mergePdfs = useCallback(async () => {
    if (files.length < 2) {
      toast({
        title: "לא נבחרו מספיק קבצים",
        description: "יש לבחור לפחות שני קבצי PDF כדי למזג.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: "מתחיל מיזוג...", description: "התהליך עשוי לקחת מספר רגעים." });

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'merged-document.pdf');
      
      toast({ title: "המיזוג הסתיים בהצלחה!", description: "קובץ ה-PDF הממוזג מוכן להורדה." });

    } catch (error) {
      console.error("Error during PDF merging:", error);
      toast({ title: "שגיאה במיזוג", description: "אירעה שגיאה בעיבוד הקבצים.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }, [files, toast]);

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Button onClick={() => navigate("/categories/pdf-tools")} variant="outline" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        חזרה לכלי PDF
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>מיזוג קבצי PDF</CardTitle>
          <CardDescription>בחר מספר קבצי PDF ומזג אותם לקובץ אחד.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdf-upload">1. בחר קבצי PDF</Label>
            <Input id="pdf-upload" type="file" accept="application/pdf" multiple onChange={handleFileChange} />
          </div>

          {files.length > 0 && (
            <div>
              <Label>2. סדר הקבצים למיזוג</Label>
              <Card className="mt-2 p-4 max-h-60 overflow-y-auto">
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <span className="font-mono text-sm truncate pr-2">{index + 1}. {file.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          <Button onClick={mergePdfs} disabled={files.length < 2 || isProcessing} className="w-full">
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Merge className="h-4 w-4 mr-2" />
            )}
            {isProcessing ? "ממזג..." : "מזג קבצים"}
          </Button>

          <Alert>
            <Merge className="h-4 w-4" />
            <AlertTitle>שמירה על פרטיות</AlertTitle>
            <AlertDescription>
              כל המיזוג מתבצע ישירות בדפדפן. הקבצים שלך לא עוזבים את המחשב שלך, מה שמבטיח שהמידע שלך נשאר פרטי ובטוח.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFMerger;