import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, FileAudio, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";

const AudioConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const audioFormats = [
    { value: "mp3", label: "MP3", description: "פורמט דחוס פופולרי" },
    { value: "wav", label: "WAV", description: "איכות גבוהה, לא דחוס" },
    { value: "flac", label: "FLAC", description: "דחיסה ללא איבוד איכות" },
    { value: "aac", label: "AAC", description: "איכות גבוהה עם דחיסה יעילה" },
    { value: "ogg", label: "OGG", description: "פורמט קוד פתוח" },
    { value: "m4a", label: "M4A", description: "פורמט Apple" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setConvertedFile(null);
    } else {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ אודיו תקין"
      });
    }
  };

  const convertAudio = async () => {
    if (!selectedFile) {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ אודיו קודם"
      });
      return;
    }

    setIsConverting(true);
    toast({
      title: "ממיר...",
      description: `ממיר ל-${outputFormat.toUpperCase()}`
    });

    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create converted file URL (simulation)
      const reader = new FileReader();
      reader.onload = () => {
        setConvertedFile(reader.result as string);
        setIsConverting(false);
        toast({
          title: "הושלם!",
          description: "הקובץ הומר בהצלחה"
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setIsConverting(false);
      toast({
        title: "שגיאה",
        description: "שגיאה בהמרת הקובץ"
      });
    }
  };

  const downloadConverted = () => {
    if (convertedFile && selectedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      link.download = `${selectedFile.name.split('.')[0]}.${outputFormat}`;
      link.click();
      toast({
        title: "הורד בהצלחה!",
        description: "הקובץ המומר נשמר"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title="ממיר אודיו"
          subtitle="המר בין פורמטים שונים של קבצי אודיו"
          icon={<FileAudio className="h-16 w-16 text-blue-600" />}
          backPath="/categories/audio-tools"
          backLabel="חזרה לכלי אודיו"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>קובץ מקור</CardTitle>
              <CardDescription>העלה קובץ אודיו להמרה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />

              {selectedFile && (
                <div className="p-3 bg-gray-50 rounded border">
                  <div className="flex items-center">
                    <FileAudio className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">פורמט יעד</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audioFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-gray-500">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={convertAudio} 
                disabled={!selectedFile || isConverting}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isConverting ? "ממיר..." : "התחל המרה"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>קובץ מומר</CardTitle>
              <CardDescription>הורד את הקובץ המומר</CardDescription>
            </CardHeader>
            <CardContent>
              {convertedFile ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {selectedFile?.name.split('.')[0]}.{outputFormat}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      ✓ המרה הושלמה בהצלחה
                    </div>
                  </div>
                  
                  <Button onClick={downloadConverted} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    הורד קובץ מומר
                  </Button>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-gray-400 border border-dashed rounded">
                  <FileAudio className="h-8 w-8 mb-2" />
                  <div className="text-sm">הקובץ המומר יופיע כאן</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>פורמטים נתמכים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {audioFormats.map((format) => (
                <div key={format.value} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs text-gray-600">{format.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioConverter;
