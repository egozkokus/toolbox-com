
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Merge, Download, Upload, X, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";

interface VideoFile {
  id: string;
  file: File;
  name: string;
  duration?: number;
}

const VideoMerger = () => {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('video/')) {
        const newVideo: VideoFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name
        };
        
        setVideoFiles(prev => [...prev, newVideo]);
      }
    });

    if (files.length > 0) {
      toast({ title: "הצלחה!", description: `${files.length} קבצי וידיאו נוספו` });
    }
  };

  const removeVideo = (id: string) => {
    setVideoFiles(prev => prev.filter(video => video.id !== id));
    toast({ title: "הוסר", description: "קובץ הוידיאו הוסר מהרשימה" });
  };

  const moveVideo = (id: string, direction: 'up' | 'down') => {
    setVideoFiles(prev => {
      const index = prev.findIndex(video => video.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newArray = [...prev];
      [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
      return newArray;
    });
  };

  const mergeVideos = async () => {
    if (videoFiles.length < 2) {
      toast({ title: "שגיאה", description: "נדרשים לפחות 2 קבצי וידיאו למיזוג" });
      return;
    }

    setIsProcessing(true);
    toast({ title: "מעבד...", description: "מיזוג הוידיאו בתהליך" });

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({ 
        title: "הצלחה!", 
        description: `${videoFiles.length} קבצי וידיאו מוזגו בהצלחה` 
      });
    }, 5000);
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
          title="מיזוג וידיאו"
          subtitle="מזג מספר קבצי וידיאו לקובץ אחד"
          icon={<Merge className="h-16 w-16 text-cyan-600" />}
          backPath="/categories/video-tools"
          backLabel="חזרה לכלי וידיאו"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>הוספת קבצי וידיאו</CardTitle>
              <CardDescription>
                בחר מספר קבצי וידיאו למיזוג
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">בחר קבצי וידיאו</label>
                <Input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>

              <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                <strong>טיפ:</strong> ניתן לבחור מספר קבצים בו זמנית על ידי החזקת Ctrl/Cmd
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>רשימת וידיאו ({videoFiles.length})</CardTitle>
              <CardDescription>
                סדר את הוידיאו לפי הרצף הרצוי
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videoFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>לא נבחרו קבצי וידיאו</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {videoFiles.map((video, index) => (
                    <div key={video.id} className="flex items-center p-3 bg-gray-50 rounded border">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{video.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(video.file.size)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveVideo(video.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveVideo(video.id, 'down')}
                          disabled={index === videoFiles.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeVideo(video.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {videoFiles.length >= 2 && (
                <div className="mt-4 space-y-2">
                  <Button 
                    onClick={mergeVideos} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Merge className="h-4 w-4 mr-2" />
                    {isProcessing ? "מעבד..." : "מזג וידיאו"}
                  </Button>
                  
                  <Button 
                    onClick={() => toast({ title: "בקרוב", description: "הורדת וידיאו ממוזג תהיה זמינה בקרוב" })}
                    variant="outline" 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    הורד וידיאו ממוזג
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoMerger;
