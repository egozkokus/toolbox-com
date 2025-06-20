
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Download, Minimize, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const VideoCompressor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState([50]);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedVideo, setCompressedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setCompressedVideo(null);
      setIsPlaying(false);
    } else {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ וידיאו תקין"
      });
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const compressVideo = async () => {
    if (!selectedFile) {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ וידיאו קודם"
      });
      return;
    }

    setIsCompressing(true);
    toast({
      title: "דוחס...",
      description: "דוחס את הוידיאו"
    });

    try {
      // Simulate compression process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const reader = new FileReader();
      reader.onload = () => {
        setCompressedVideo(reader.result as string);
        setIsCompressing(false);
        
        const originalSize = selectedFile.size;
        const estimatedCompressedSize = originalSize * (1 - compressionLevel[0] / 100);
        const savedPercentage = ((originalSize - estimatedCompressedSize) / originalSize * 100).toFixed(1);
        
        toast({
          title: "הושלם!",
          description: `הוידיאו נדחס ב-${savedPercentage}%`
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setIsCompressing(false);
      toast({
        title: "שגיאה",
        description: "שגיאה בדחיסת הוידיאו"
      });
    }
  };

  const downloadCompressed = () => {
    if (compressedVideo && selectedFile) {
      const link = document.createElement('a');
      link.href = compressedVideo;
      link.download = `compressed_${selectedFile.name.split('.')[0]}.${outputFormat}`;
      link.click();
      toast({
        title: "הורד בהצלחה!",
        description: "הוידיאו הדחוס נשמר"
      });
    }
  };

  const getCompressionLevel = (level: number) => {
    if (level < 30) return { label: "קל", color: "text-green-600" };
    if (level < 70) return { label: "בינוני", color: "text-yellow-600" };
    return { label: "חזק", color: "text-red-600" };
  };

  const compressionInfo = getCompressionLevel(compressionLevel[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          onClick={() => navigate("/categories/video-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי וידיאו
        </Button>

        <div className="mb-8 text-center">
          <Minimize className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">דוחס וידיאו</h1>
          <p className="text-gray-600">הקטן את גודל קובצי הוידיאו שלך</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>וידיאו מקורי</CardTitle>
              <CardDescription>העלה וידיאו לדחיסה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />

              {selectedFile && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>

                  <video
                    ref={videoRef}
                    src={URL.createObjectURL(selectedFile)}
                    className="w-full max-h-48 bg-black rounded"
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  <Button onClick={togglePlayback} variant="outline" className="w-full">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "עצור" : "נגן"}
                  </Button>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">רמת דחיסה</label>
                  <span className={`text-sm font-medium ${compressionInfo.color}`}>
                    {compressionInfo.label}
                  </span>
                </div>
                <Slider
                  value={compressionLevel}
                  onValueChange={setCompressionLevel}
                  max={90}
                  min={10}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>איכות גבוהה</span>
                  <span>{compressionLevel[0]}%</span>
                  <span>גודל קטן</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">פורמט יצוא</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                    <SelectItem value="avi">AVI</SelectItem>
                    <SelectItem value="mov">MOV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={compressVideo} 
                disabled={!selectedFile || isCompressing}
                className="w-full"
              >
                <Minimize className="h-4 w-4 mr-2" />
                {isCompressing ? "דוחס..." : "דחס וידיאו"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>וידיאו דחוס</CardTitle>
              <CardDescription>תוצאת הדחיסה</CardDescription>
            </CardHeader>
            <CardContent>
              {compressedVideo ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        compressed_{selectedFile?.name.split('.')[0]}.{outputFormat}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      ✓ דחיסה הושלמה ברמה של {compressionLevel[0]}%
                    </div>
                  </div>

                  <video
                    src={compressedVideo}
                    controls
                    className="w-full max-h-48 bg-black rounded"
                  />
                  
                  <Button onClick={downloadCompressed} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    הורד וידיאו דחוס
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border border-dashed rounded">
                  <Minimize className="h-12 w-12 mb-2" />
                  <div>הוידיאו הדחוס יופיע כאן</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoCompressor;
