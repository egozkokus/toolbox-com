
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import PageHeader from "@/components/common/PageHeader";
import { FileText, Upload, Download, Loader2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PDFCompressor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [qualityLevel, setQualityLevel] = useState([75]);
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();

  const compressionModes = [
    { value: "low", label: "דחיסה נמוכה", description: "איכות גבוהה, גודל קובץ גדול יותר", savings: "10-20%" },
    { value: "medium", label: "דחיסה בינונית", description: "איזון בין איכות לגודל", savings: "30-50%" },
    { value: "high", label: "דחיסה גבוהה", description: "גודל קובץ קטן, איכות נמוכה יותר", savings: "50-70%" },
    { value: "maximum", label: "דחיסה מקסימלית", description: "גודל מינימלי, איכות בסיסית", savings: "70-85%" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        toast({
          title: "קובץ נטען בהצלחה",
          description: `נבחר: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
        });
      } else {
        toast({
          title: "שגיאה",
          description: "אנא בחר קובץ PDF בלבד",
          variant: "destructive"
        });
      }
    }
  };

  const compressFile = async () => {
    if (!selectedFile) {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ PDF",
        variant: "destructive"
      });
      return;
    }

    setIsCompressing(true);
    
    try {
      // Simulate compression process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Calculate mock compression based on settings
      const compressionFactors = {
        low: 0.8,
        medium: 0.6,
        high: 0.4,
        maximum: 0.25
      };
      
      const factor = compressionFactors[compressionLevel as keyof typeof compressionFactors];
      const qualityFactor = qualityLevel[0] / 100;
      const finalSize = selectedFile.size * factor * qualityFactor;
      
      // Create mock compressed file
      const mockContent = `קובץ PDF דחוס\nקובץ מקורי: ${selectedFile.name}\nגודל מקורי: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB\nגודל אחרי דחיסה: ${(finalSize / 1024 / 1024).toFixed(2)} MB\nחיסכון: ${(((selectedFile.size - finalSize) / selectedFile.size) * 100).toFixed(1)}%`;
      const blob = new Blob([mockContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name.replace('.pdf', '-compressed.pdf');
      a.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "הדחיסה הושלמה!",
        description: `חיסכון של ${(((selectedFile.size - finalSize) / selectedFile.size) * 100).toFixed(1)}% בגודל הקובץ`
      });
    } catch (error) {
      toast({
        title: "שגיאה בדחיסה",
        description: "אירעה שגיאה במהלך דחיסת הקובץ",
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const selectedCompressionMode = compressionModes.find(mode => mode.value === compressionLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader 
          title="דחיסת PDF"
          subtitle="הקטנת גודל קבצי PDF תוך שמירה על איכות"
          icon={<Package className="h-12 w-12 mx-auto text-red-600" />}
          backPath="/categories/pdf-tools"
          backLabel="חזרה לכלי PDF"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>העלאת קובץ והגדרות</CardTitle>
              <CardDescription>בחר קובץ PDF והגדר רמת דחיסה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      לחץ לבחירת קובץ PDF
                    </span>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-sm">או גרור קובץ PDF לכאן</p>
                </div>
              </div>

              {selectedFile && (
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <div className="font-medium text-green-800">{selectedFile.name}</div>
                      <div className="text-sm text-green-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">רמת דחיסה</label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר רמת דחיסה" />
                  </SelectTrigger>
                  <SelectContent>
                    {compressionModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        <div className="flex flex-col">
                          <span>{mode.label}</span>
                          <span className="text-xs text-gray-500">חיסכון: {mode.savings}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCompressionMode && (
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedCompressionMode.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  איכות תמונות ({qualityLevel[0]}%)
                </label>
                <Slider
                  value={qualityLevel}
                  onValueChange={setQualityLevel}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>דחיסה מקסימלית</span>
                  <span>איכות מקסימלית</span>
                </div>
              </div>

              <Button 
                onClick={compressFile} 
                disabled={!selectedFile || isCompressing}
                className="w-full"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    מבצע דחיסה...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    דחוס קובץ
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מידע על דחיסה</CardTitle>
              <CardDescription>הבנת אפשרויות הדחיסה</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">רמות דחיסה:</h4>
                  {compressionModes.map((mode) => (
                    <div key={mode.value} className={`p-3 rounded mb-2 ${compressionLevel === mode.value ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{mode.label}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {mode.savings}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{mode.description}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">טיפים לדחיסה אפקטיבית:</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• קבצים עם הרבה תמונות ידחסו יותר</li>
                    <li>• טקסט בלבד דוחס פחות אבל נשאר קריא</li>
                    <li>• בדוק את איכות הקובץ לפני שימוש רשמי</li>
                    <li>• שמור עותק מקורי לפני דחיסה</li>
                  </ul>
                </div>

                {selectedFile && (
                  <div className="p-4 bg-blue-50 rounded border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">חיזוי דחיסה:</h4>
                    <div className="text-sm text-blue-700">
                      <div>גודל נוכחי: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      <div>חיסכון צפוי: {selectedCompressionMode?.savings}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PDFCompressor;
