
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, Image as ImageIcon, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const BackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [processedImage, setProcessedImage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setProcessedImage("");
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ תמונה תקין"
      });
    }
  };

  const removeBackground = async () => {
    if (!selectedFile || !originalImage) {
      toast({
        title: "שגיאה",
        description: "אנא בחר תמונה קודם"
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "מעבד...",
      description: "מסיר רקע מהתמונה (זה יכול לקחת כמה שניות)"
    });

    try {
      // Create a simple background removal simulation
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = new Image();

      img.onload = () => {
        if (!canvas || !ctx) return;
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple background removal based on edge detection
        // This is a basic implementation for demonstration
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Simple background detection (this is very basic)
          // In a real app, you'd use AI/ML models
          const isBackground = (r > 200 && g > 200 && b > 200) || 
                             (r < 50 && g < 50 && b < 50);
          
          if (isBackground) {
            data[i + 3] = 0; // Make transparent
          }
        }
        
        // Put processed image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to data URL
        const processedDataUrl = canvas.toDataURL('image/png');
        setProcessedImage(processedDataUrl);
        
        setIsProcessing(false);
        toast({
          title: "הושלם!",
          description: "הרקע הוסר מהתמונה"
        });
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "שגיאה",
        description: "שגיאה בעיבוד התמונה"
      });
    }
  };

  const downloadProcessed = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `no-background-${selectedFile?.name || 'image.png'}`;
      link.click();
      toast({
        title: "הצלחה!",
        description: "התמונה ללא רקע הורדה בהצלחה"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          onClick={() => navigate("/categories/image-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי תמונות
        </Button>

        <div className="mb-8 text-center">
          <Wand2 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">הסרת רקע מתמונות</h1>
          <p className="text-gray-600">הסר רקע מתמונות באופן אוטומטי</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>העלה תמונה</CardTitle>
              <CardDescription>בחר תמונה להסרת רקע</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />

              {originalImage && (
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <Button 
                    onClick={removeBackground} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        מעבד...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        הסר רקע
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>תמונה מעובדת</CardTitle>
              <CardDescription>התמונה ללא רקע</CardDescription>
            </CardHeader>
            <CardContent>
              {processedImage ? (
                <div className="space-y-4">
                  <div className="aspect-square bg-transparent bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px] rounded-lg overflow-hidden">
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <Button onClick={downloadProcessed} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    הורד תמונה
                  </Button>
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center text-gray-400 border border-dashed rounded-lg">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <div>התמונה המעובדת תופיע כאן</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>טיפים</CardTitle>
              <CardDescription>לקבלת תוצאות טובות יותר</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-medium text-blue-800 mb-2">טיפים לשימוש:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• השתמש בתמונות באיכות גבוהה</li>
                  <li>• רקע חד ובהיר עובד הכי טוב</li>
                  <li>• הימנע מרקע מורכב</li>
                  <li>• תמונות עם ניגודיות טובה</li>
                </ul>
              </div>

              <div className="p-3 bg-yellow-50 rounded">
                <h4 className="font-medium text-yellow-800 mb-2">הערה:</h4>
                <p className="text-yellow-700 text-sm">
                  זוהי גרסת הדגמה פשוטה. לתוצאות מקצועיות, 
                  השתמש בכלי AI מתקדמים כמו Remove.bg או Background Eraser.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default BackgroundRemover;
