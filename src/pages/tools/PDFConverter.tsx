import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileText, FileImage, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveAs } from "file-saver"; // ???? ?????, ???? ??: npm install file-saver @types/file-saver

// ????? ?-worker ???? pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

type ConversionFormat = "txt" | "png" | "jpg";

const PDFConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ConversionFormat>("png");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setFile(null);
      toast({
        title: "???? ?? ????",
        description: "??? ??? ???? PDF ????.",
        variant: "destructive",
      });
    }
  };

  const convertPdf = useCallback(async () => {
    if (!file) {
      toast({ title: "?? ???? ????", description: "?? ????? ???? PDF ?????.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    toast({ title: "????? ????...", description: `???? ?? ?-PDF ?????? ${format.toUpperCase()}.` });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

      if (format === 'txt') {
        await convertToText(pdf, file.name);
      } else {
        await convertToImages(pdf, file.name, format);
      }

      toast({ title: "????? ??????? ??????!", description: "????? ??? ???? ??????." });

    } catch (error) {
      console.error("Error during PDF conversion:", error);
      toast({ title: "????? ?????", description: "????? ????? ?????? ?-PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }, [file, format, toast]);

  const convertToText = async (pdf: pdfjsLib.PDFDocumentProxy, fileName: string) => {
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => ('str' in item ? item.str : '')).join(" ") + "\n\n";
    }
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${fileName.replace('.pdf', '')}.txt`);
  };

  const convertToImages = async (pdf: pdfjsLib.PDFDocumentProxy, fileName: string, imageFormat: 'png' | 'jpg') => {
    const zip = new JSZip();
    const mimeType = `image/${imageFormat}`;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // Scale for better quality
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const imageData = canvas.toDataURL(mimeType, 0.9); // 0.9 for JPG quality
        zip.file(`page_${i}.${imageFormat}`, imageData.split(',')[1], { base64: true });
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${fileName.replace('.pdf', '')}_images.zip`);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Button onClick={() => navigate("/categories/pdf-tools")} variant="outline" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        ???? ???? PDF
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>???? ???? PDF</CardTitle>
          <CardDescription>??? PDF ????? ???? ?? ?????? (PNG/JPG) ?????? ??????.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdf-upload">1. ??? ???? PDF</Label>
            <Input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>

          <div className="space-y-2">
            <Label>2. ??? ????? ????</Label>
            <Select onValueChange={(value: ConversionFormat) => setFormat(value)} defaultValue={format}>
              <SelectTrigger>
                <SelectValue placeholder="??? ?????..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png"><FileImage className="h-4 w-4 inline-block mr-2" />PNG</SelectItem>
                <SelectItem value="jpg"><FileImage className="h-4 w-4 inline-block mr-2" />JPG</SelectItem>
                <SelectItem value="txt"><FileText className="h-4 w-4 inline-block mr-2" />Text (TXT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={convertPdf} disabled={!file || isProcessing} className="w-full">
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isProcessing ? "????..." : `??? ????? ?-${format.toUpperCase()}`}
          </Button>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>?????? ???????</AlertTitle>
            <AlertDescription>
              ?? ?????? ??????? ?????? ?? ????? ???. ?????? ??? ?? ?????? ???? ???, ?? ?????? ?????? ???? ???????? ??????.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFConverter;