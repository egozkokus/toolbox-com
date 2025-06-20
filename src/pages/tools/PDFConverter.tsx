
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/common/PageHeader";
import { FileText, Upload, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PDFConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const supportedFormats = [
    { value: "docx", label: "Word Document (.docx)", icon: "📄" },
    { value: "txt", label: "Text File (.txt)", icon: "📝" },
    { value: "html", label: "HTML File (.html)", icon: "🌐" },
    { value: "rtf", label: "Rich Text Format (.rtf)", icon: "📋" },
    { value: "odt", label: "OpenDocument Text (.odt)", icon: "📃" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        toast({
          title: "קובץ נטען בהצלחה",
          description: `נבחר: ${file.name}`
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

  const convertFile = async () => {
    if (!selectedFile || !outputFormat) {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ ופורמט יעד",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock converted file
      const mockContent = `התוכן שהומר מקובץ ${selectedFile.name}\nזהו תוכן לדוגמה בלבד.`;
      const blob = new Blob([mockContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${outputFormat}`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "ההמרה הושלמה!",
        description: "הקובץ המומר הורד למחשב שלך"
      });
    } catch (error) {
      toast({
        title: "שגיאה בהמרה",
        description: "אירעה שגיאה במהלך ההמרה",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader 
          title="מהמר PDF"
          subtitle="המר קבצי PDF לפורמטים שונים"
          icon={<FileText className="h-12 w-12 mx-auto text-red-600" />}
          backPath="/categories/developer-tools"
          backLabel="חזרה לכלי מפתחים"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>העלה קובץ PDF</CardTitle>
              <CardDescription>בחר את קובץ ה-PDF שברצונך להמיר</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      לחץ לבחירת קובץ
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
                <label className="block text-sm font-medium mb-2">פורמט יעד</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר פורמט לההמרה" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <span className="flex items-center gap-2">
                          <span>{format.icon}</span>
                          <span>{format.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={convertFile} 
                disabled={!selectedFile || !outputFormat || isConverting}
                className="w-full"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    מבצע המרה...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    המר קובץ
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>פורמטים נתמכים</CardTitle>
              <CardDescription>פורמטים שניתן להמיר אליהם</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supportedFormats.map((format) => (
                  <div key={format.value} className="flex items-center p-3 bg-gray-50 rounded">
                    <span className="text-2xl mr-3">{format.icon}</span>
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-sm text-gray-600">
                        {format.value === "docx" && "עבור עריכה במיקרוסופט וורד"}
                        {format.value === "txt" && "טקסט פשוט ללא עיצוב"}
                        {format.value === "html" && "עבור פרסום באינטרנט"}
                        {format.value === "rtf" && "פורמט עשיר עם עיצוב"}
                        {format.value === "odt" && "עבור LibreOffice ו-OpenOffice"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">הערה חשובה:</h4>
                <p className="text-yellow-700 text-sm">
                  זהו כלי הדגמה. באפליקציה אמיתית תידרש אינטגרציה עם שירותי המרה מקצועיים 
                  כמו PDF.js, pdf2pic או שירותי ענן להמרות מתקדמות.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PDFConverter;
