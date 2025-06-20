import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Download, Play, Pause, RotateCcw, Palette, Volume2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import VideoUpload from "@/components/VideoEditor/VideoUpload";

const VideoEditor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Effects and filters
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [blur, setBlur] = useState([0]);
  const [hue, setHue] = useState([0]);
  const [volume, setVolume] = useState([100]);
  const [playbackSpeed, setPlaybackSpeed] = useState([1]);
  
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
    }
  };

  const applyFilters = () => {
    if (videoRef.current) {
      const filterStyle = `
        brightness(${brightness[0]}%)
        contrast(${contrast[0]}%)
        saturate(${saturation[0]}%)
        blur(${blur[0]}px)
        hue-rotate(${hue[0]}deg)
      `;
      videoRef.current.style.filter = filterStyle;
      videoRef.current.volume = volume[0] / 100;
      videoRef.current.playbackRate = playbackSpeed[0];
    }
  };

  const resetFilters = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setBlur([0]);
    setHue([0]);
    setVolume([100]);
    setPlaybackSpeed([1]);
    
    if (videoRef.current) {
      videoRef.current.style.filter = 'none';
      videoRef.current.volume = 1;
      videoRef.current.playbackRate = 1;
    }
  };

  const exportVideo = () => {
    if (!selectedFile) {
      toast({ title: "שגיאה", description: "אנא בחר קובץ וידיאו תחילה" });
      return;
    }

    toast({ 
      title: "מעבד...", 
      description: "יוצא וידיאו עם האפקטים שנבחרו" 
    });

    // Simulate processing
    setTimeout(() => {
      toast({ 
        title: "הצלחה!", 
        description: "הוידיאו הערוך יוצא בהצלחה" 
      });
    }, 5000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [brightness, contrast, saturation, blur, hue, volume, playbackSpeed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <PageHeader
          title="עורך וידיאו מתקדם"
          subtitle="ערוך וידיאו עם אפקטים, פילטרים וכלים מתקדמים"
          icon={<Film className="h-16 w-16 text-red-600" />}
          backPath="/categories/video-tools"
          backLabel="חזרה לכלי וידיאו"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video Preview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>תצוגה מקדימה</CardTitle>
              <CardDescription>
                תצוגה בזמן אמת של הוידיאו עם האפקטים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <VideoUpload onFileSelect={handleFileSelect} />

              {videoUrl && (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full max-h-96"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button onClick={togglePlayPause} size="sm">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm text-gray-600">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <div className="flex-1">
                      <Slider
                        value={[currentTime]}
                        onValueChange={(value) => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = value[0];
                          }
                        }}
                        max={duration}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>כלי עריכה</CardTitle>
              <CardDescription>
                התאם אפקטים ופילטרים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="filters" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="filters">פילטרים</TabsTrigger>
                  <TabsTrigger value="audio">אודיו</TabsTrigger>
                  <TabsTrigger value="effects">אפקטים</TabsTrigger>
                </TabsList>

                <TabsContent value="filters" className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Palette className="h-4 w-4 mr-2" />
                      בהירות: {brightness[0]}%
                    </label>
                    <Slider
                      value={brightness}
                      onValueChange={setBrightness}
                      max={200}
                      min={0}
                      step={5}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      ניגודיות: {contrast[0]}%
                    </label>
                    <Slider
                      value={contrast}
                      onValueChange={setContrast}
                      max={200}
                      min={0}
                      step={5}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      רוויה: {saturation[0]}%
                    </label>
                    <Slider
                      value={saturation}
                      onValueChange={setSaturation}
                      max={200}
                      min={0}
                      step={5}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      גוון: {hue[0]}°
                    </label>
                    <Slider
                      value={hue}
                      onValueChange={setHue}
                      max={360}
                      min={0}
                      step={5}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="audio" className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Volume2 className="h-4 w-4 mr-2" />
                      עוצמת קול: {volume[0]}%
                    </label>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      min={0}
                      step={1}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      מהירות נגינה: {playbackSpeed[0]}x
                    </label>
                    <Slider
                      value={playbackSpeed}
                      onValueChange={setPlaybackSpeed}
                      max={2}
                      min={0.25}
                      step={0.25}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="effects" className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Zap className="h-4 w-4 mr-2" />
                      טשטוש: {blur[0]}px
                    </label>
                    <Slider
                      value={blur}
                      onValueChange={setBlur}
                      max={10}
                      min={0}
                      step={0.5}
                    />
                  </div>

                  <Button onClick={resetFilters} variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    איפוס פילטרים
                  </Button>
                </TabsContent>
              </Tabs>

              {selectedFile && (
                <div className="mt-6 space-y-2">
                  <Button onClick={exportVideo} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    יצא וידיאו ערוך
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

export default VideoEditor;
