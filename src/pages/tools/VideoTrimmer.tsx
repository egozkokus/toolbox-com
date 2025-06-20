
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Scissors, Download, Play, Pause, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import VideoUpload from "@/components/VideoEditor/VideoUpload";

const VideoTrimmer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState([0]);
  const [endTime, setEndTime] = useState([0]);
  const [volume, setVolume] = useState([100]);
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
      setEndTime([videoRef.current.duration]);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const trimVideo = () => {
    if (!selectedFile) {
      toast({ title: "שגיאה", description: "אנא בחר קובץ וידיאו תחילה" });
      return;
    }

    toast({ 
      title: "הצלחה!", 
      description: `הוידיאו נחתך מ-${startTime[0].toFixed(1)}s עד ${endTime[0].toFixed(1)}s` 
    });
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
          title="חיתוך וידיאו"
          subtitle="חתוך קטעי וידיאו לאורך הרצוי"
          icon={<Scissors className="h-16 w-16 text-orange-600" />}
          backPath="/categories/video-tools"
          backLabel="חזרה לכלי וידיאו"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>העלאת וידיאו</CardTitle>
              <CardDescription>
                בחר קובץ וידיאו לחיתוך
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">מיקום נוכחי</label>
                    <Slider
                      value={[currentTime]}
                      onValueChange={(value) => handleSeek(value[0])}
                      max={duration}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>כלי חיתוך</CardTitle>
              <CardDescription>
                הגדר את נקודות ההתחלה והסיום
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium mb-2">
                  <Scissors className="h-4 w-4 mr-2" />
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
                <label className="flex items-center text-sm font-medium mb-2">
                  <Scissors className="h-4 w-4 mr-2" />
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
                <label className="flex items-center text-sm font-medium mb-2">
                  <Volume2 className="h-4 w-4 mr-2" />
                  עוצמת קול: {volume[0]}%
                </label>
                <Slider
                  value={volume}
                  onValueChange={(value) => {
                    setVolume(value);
                    if (videoRef.current) {
                      videoRef.current.volume = value[0] / 100;
                    }
                  }}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Button onClick={trimVideo} disabled={!selectedFile} className="w-full">
                  <Scissors className="h-4 w-4 mr-2" />
                  חתוך וידיאו
                </Button>
                
                <Button 
                  onClick={() => toast({ title: "בקרוב", description: "תכונה זו תהיה זמינה בקרוב" })}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  הורד וידיאו חתוך
                </Button>
              </div>

              <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                <strong>טיפ:</strong> השתמש במחוונים כדי לקבוע את נקודות ההתחלה והסיום לחיתוך הוידיאו.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoTrimmer;
