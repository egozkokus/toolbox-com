
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Video, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import VideoUpload from "@/components/VideoEditor/VideoUpload";

const VideoConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [quality, setQuality] = useState([80]);
  const [resolution, setResolution] = useState("original");
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const formats = [
    { value: "mp4", label: "MP4" },
    { value: "avi", label: "AVI" },
    { value: "mov", label: "MOV" },
    { value: "wmv", label: "WMV" },
    { value: "webm", label: "WebM" },
    { value: "mkv", label: "MKV" }
  ];

  const resolutions = [
    { value: "original", label: "רזולוציה מקורית" },
    { value: "720p", label: "720p (HD)" },
    { value: "1080p", label: "1080p (Full HD)" },
    { value: "480p", label: "480p" },
    { value: "360p", label: "360p" }
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    toast({ title: "הצלחה!", description: "הוידיאו הועלה בהצלחה" });
  };

  const convertVideo = async () => {
    if (!selectedFile) {
      toast({ title: "שגיאה", description: "אנא בחר קובץ וידיאו תחילה" });
      return;
    }

    setIsConverting(true);
    toast({ 
      title: "מתחיל המרה...", 
      description: `ממיר ל-${outputFormat.toUpperCase()} באיכות ${quality[0]}%` 
    });

    // Simulate conversion
    setTimeout(() => {
      setIsConverting(false);
      toast({ 
        title: "הצלחה!", 
        description: `הוידיאו הומר בהצלחה ל-${outputFormat.toUpperCase()}` 
      });
    }, 8000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader
          title="ממיר וידיאו"
          subtitle="המר וידיאו בין פורמטים שונים"
          icon={<Video className="h-16 w-16 text-green-600" />}
          backPath="/categories/video-tools"
          backLabel="חזרה לכלי וידיאו"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>העלאת וידיאו</CardTitle>
              <CardDescription>
                בחר קובץ וידיאו להמרה
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <VideoUpload onFileSelect={handleFileSelect} />

              {selectedFile && (
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">פרטי קובץ</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>שם:</strong> {selectedFile.name}</div>
                    <div><strong>גודל:</strong> {formatFileSize(selectedFile.size)}</div>
                    <div><strong>סוג:</strong> {selectedFile.type}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הגדרות המרה</CardTitle>
              <CardDescription>
                בחר פורמט יעד והגדרות איכות
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">פורמט יעד</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">רזולוציה</label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resolutions.map(res => (
                      <SelectItem key={res.value} value={res.value}>
                        {res.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  איכות: {quality[0]}%
                </label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={20}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                  איכות גבוהה = קובץ גדול יותר
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={convertVideo} 
                  disabled={!selectedFile || isConverting}
                  className="w-full"
                >
                  <Video className="h-4 w-4 mr-2" />
                  {isConverting ? "ממיר..." : "המר וידיאו"}
                </Button>
                
                <Button 
                  onClick={() => toast({ title: "בקרוב", description: "הורדת וידיאו מומר תהיה זמינה בקרוב" })}
                  variant="outline" 
                  className="w-full"
                  disabled={!selectedFile || isConverting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  הורד וידיאו מומר
                </Button>
              </div>

              <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                <strong>טיפ:</strong> פורמטים כמו MP4 ו-WebM מתאימים לאינטרנט, AVI ו-MOV לעריכה.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoConverter;
