import { useState, useCallback } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Download, Image as ImageIcon, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setOriginalImage(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setProcessedImageUrl(""); // Reset previous result
    } else {
      setOriginalImage(null);
      setOriginalImageUrl("");
      setProcessedImageUrl("");
      toast({
        title: "קובץ לא תקין",
        description: "אנא בחר קובץ תמונה בפורמט נתמך (PNG, JPG).",
        variant: "destructive",
      });
    }
  };

  const removeBackground = useCallback(async () => {
    if (!originalImage) {
      toast({
        title: "לא נבחרה תמונה",
        description: "יש לבחור תמונה לפני שמסירים את הרקע.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "מעבד תמונה...",
      description: "הסרת הרקע עשויה לקחת מספר רגעים. אנא המתן.",
    });

    try {
      const blob = await removeBackground(originalImage, {
        // Optional: Add configuration here
        // publicPath: '/assets/imgly/', // If you self-host the model files
        progress: (key, current, total) => {
          console.log(`Downloading ${key}: ${current} of ${total}`);
        },
      });
      const url = URL.createObjectURL(blob);
      setProcessedImageUrl(url);
      toast({
        title: "הצלחה!",
        description: "הרקע הוסר בהצלחה מהתמונה.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "שגיאה בעיבוד",
        description: "לא הצלחנו להסיר את הרקע. נסה שוב עם תמונה אחרת.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage, toast]);

  const downloadImage = () => {
    if (!processedImageUrl || !originalImage) return;
    const link = document.createElement("a");
    link.href = processedImageUrl;
    link.download = `no-bg-${originalImage.name.split('.')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button onClick={() => navigate("/categories/image-tools")} variant="outline" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי תמונות
        </Button>

        <div className="mb-8 text-center">
          <Wand2 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">הסרת רקע מתמונות</h1>
          <p className="text-gray-600">הסר רקע מתמונות באופן אוטומטי וישירות בדפדפן</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>1. העלאת תמונה</CardTitle>
              <CardDescription>בחר תמונה להסרת הרקע</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">בחר קובץ תמונה</Label>
              <Input id="image-upload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
              {originalImageUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">תצוגה מקדימה:</h3>
                  <img src={originalImageUrl} alt="Original" className="max-w-full rounded-lg border bg-gray-100" />
                </div>
              )}
              <Button onClick={removeBackground} disabled={!originalImage || isProcessing} className="w-full mt-4">
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? "מעבד..." : "הסר את הרקע"}
              </Button>
            </CardContent>
          </Card>

          {/* Output Card */}
          <Card>
            <CardHeader>
              <CardTitle>2. תוצאה</CardTitle>
              <CardDescription>התמונה לאחר הסרת הרקע</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-transparent bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px] rounded-lg overflow-hidden flex items-center justify-center">
                {processedImageUrl ? (
                  <img src={processedImageUrl} alt="Processed" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-center text-gray-400 p-4">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>התמונה המעובדת תופיע כאן</p>
                  </div>
                )}
              </div>
              <Button onClick={downloadImage} disabled={!processedImageUrl} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                הורד תמונה
              </Button>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-6">
          <Wand2 className="h-4 w-4" />
          <AlertTitle>איך זה עובד?</AlertTitle>
          <AlertDescription>
            הכלי משתמש בספריית קוד פתוח המריצה מודל בינה מלאכותית (AI) ישירות בדפדפן שלך. התמונה שלך לא נשלחת לשום שרת, והתהליך כולו מתבצע על המחשב שלך, מה שמבטיח פרטיות מלאה.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default BackgroundRemover;