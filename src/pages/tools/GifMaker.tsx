
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Image as ImageIcon, Download, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import VideoUpload from "@/components/VideoEditor/VideoUpload";

const GifMaker = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState([0]);
  const [endTime, setEndTime] = useState([5]);
  const [fps, setFps] = useState([10]);
  const [quality, setQuality] = useState([80]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    toast({ title: "הצלחה!", description: "הוידיאו הועלה בהצלחה" });
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setEndTime([Math.min(5, videoRef.current.duration)]);
    }
  };

  const createGif = () => {
    if (!selectedFile) {
      toast({ title: "שגיאה", description: "אנא בחר קובץ וידיאו תחילה" });
      return;
    }

    toast({ 
      title: "יוצר GIF...", 
      description: `יוצר GIF מ-${startTime[0].toFixed(1)}s עד ${endTime[0].toFixed(1)}s` 
    });

    // Simulate GIF creation
    setTimeout(() => {
      toast({ 
        title: "הצלחה!", 
        description: "הGIF נוצר בהצלחה" 
      });
    }, 3000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader
          title="יוצר GIF"
          subtitle="צור GIF מונפש מקטעי וידיאו"
          icon={<ImageIcon className="h-16 w-16 text-purple-600" />}
          backPath="/categories/video-tools"
          backLabel="חזרה לכלי וידיאו"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>העלאת וידיאו</CardTitle>
              <CardDescription>
                בחר קובץ וידיאו ליצירת GIF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <VideoUpload onFileSelect={handleFileSelect} />

              {videoUrl && (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full max-h-64 bg-black rounded"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                  />
                  
                  <div className="flex items-center space-x-4">
                    <Button onClick={togglePlayPause} size="sm">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm text-gray-600">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הגדרות GIF</CardTitle>
              <CardDescription>
                התאם את הגדרות הGIF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  זמן התחלה: {startTime[0].toFixed(1)}s
                </label>
                <Slider
                  value={startTime}
                  onValueChange={setStartTime}
                  max={duration}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  זמן סיום: {endTime[0].toFixed(1)}s
                </label>
                <Slider
                  value={endTime}
                  onValueChange={setEndTime}
                  max={duration}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  FPS: {fps[0]}
                </label>
                <Slider
                  value={fps}
                  onValueChange={setFps}
                  max={30}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
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
              </div>

              <div className="space-y-2">
                <Button onClick={createGif} disabled={!selectedFile} className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  צור GIF
                </Button>
                
                <Button 
                  onClick={() => toast({ title: "בקרוב", description: "הורדת GIF תהיה זמינה בקרוב" })}
                  variant="outline" 
                  className="w-full"
                  disabled={!selectedFile}
                >
                  <Download className="h-4 w-4 mr-2" />
                  הורד GIF
                </Button>
              </div>

              <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                <strong>טיפ:</strong> GIF קצר יותר ו-FPS נמוך יצרו קובץ קטן יותר.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GifMaker;
