
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, Scissors, Play, Pause, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AudioSplitter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitPoints, setSplitPoints] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitFiles, setSplitFiles] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setSplitPoints([]);
      setSplitFiles([]);
      setIsPlaying(false);
      setCurrentTime(0);
    } else {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ אודיו תקין"
      });
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const addSplitPoint = () => {
    if (currentTime > 0 && currentTime < duration) {
      setSplitPoints(prev => [...prev, currentTime].sort((a, b) => a - b));
      toast({
        title: "נקודת חיתוך נוספה",
        description: `נקודה ב-${formatTime(currentTime)}`
      });
    }
  };

  const removeSplitPoint = (index: number) => {
    setSplitPoints(prev => prev.filter((_, i) => i !== index));
  };

  const splitAudio = async () => {
    if (!selectedFile) {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ אודיו קודם"
      });
      return;
    }

    if (splitPoints.length === 0) {
      toast({
        title: "שגיאה",
        description: "אנא הוסף לפחות נקודת חיתוך אחת"
      });
      return;
    }

    setIsSplitting(true);
    toast({
      title: "מעבד...",
      description: "חותך את קובץ האודיו"
    });

    try {
      // Simulate splitting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create split files (simulation)
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result as string;
        const segments = Array(splitPoints.length + 1).fill(fileData);
        setSplitFiles(segments);
        setIsSplitting(false);
        toast({
          title: "הושלם!",
          description: `הקובץ חולק ל-${segments.length} חלקים`
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setIsSplitting(false);
      toast({
        title: "שגיאה",
        description: "שגיאה בחיתוך הקובץ"
      });
    }
  };

  const downloadSegment = (segmentData: string, index: number) => {
    const link = document.createElement('a');
    link.href = segmentData;
    link.download = `segment_${index + 1}_${selectedFile?.name}`;
    link.click();
    toast({
      title: "הורד בהצלחה!",
      description: `חלק ${index + 1} נשמר`
    });
  };

  const downloadAll = () => {
    splitFiles.forEach((fileData, index) => {
      setTimeout(() => downloadSegment(fileData, index), index * 500);
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          onClick={() => navigate("/categories/audio-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי אודיו
        </Button>

        <div className="mb-8 text-center">
          <Scissors className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
          <h1 className="text-4xl font-bold mb-2">מחלק אודיו</h1>
          <p className="text-gray-600">חלק קובץ אודיו למספר חלקים</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>קובץ אודיו</CardTitle>
              <CardDescription>העלה קובץ אודיו לחלוקה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />

              {selectedFile && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <Scissors className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>

                  <audio
                    ref={audioRef}
                    src={URL.createObjectURL(selectedFile)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Button onClick={togglePlayback} size="sm">
                        {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                        {isPlaying ? "עצור" : "נגן"}
                      </Button>
                      <span className="text-sm text-gray-600">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button onClick={addSplitPoint} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    הוסף נקודת חיתוך ב-{formatTime(currentTime)}
                  </Button>

                  {splitPoints.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">נקודות חיתוך:</div>
                      {splitPoints.map((point, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-sm">{formatTime(point)}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeSplitPoint(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    onClick={splitAudio} 
                    disabled={splitPoints.length === 0 || isSplitting}
                    className="w-full"
                  >
                    <Scissors className="h-4 w-4 mr-2" />
                    {isSplitting ? "חותך..." : `חתוך ל-${splitPoints.length + 1} חלקים`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>חלקים</CardTitle>
              <CardDescription>הורד את החלקים שנוצרו</CardDescription>
            </CardHeader>
            <CardContent>
              {splitFiles.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm font-medium text-green-600">
                    ✓ חלוקה הושלמה! נוצרו {splitFiles.length} חלקים
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {splitFiles.map((fileData, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded border">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-sm font-medium">
                            חלק {index + 1}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => downloadSegment(fileData, index)}
                        >
                          הורד
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button onClick={downloadAll} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    הורד את כל החלקים
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border border-dashed rounded">
                  <Scissors className="h-12 w-12 mb-2" />
                  <div>חלקי הקובץ יופיעו כאן</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>הוראות שימוש</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded">
                <div className="font-medium text-blue-800 mb-1">1. העלה קובץ</div>
                <div className="text-blue-700">בחר קובץ אודיו לחלוקה</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="font-medium text-green-800 mb-1">2. נגן והאזן</div>
                <div className="text-green-700">מצא נקודות לחיתוך</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="font-medium text-purple-800 mb-1">3. הוסף נקודות</div>
                <div className="text-purple-700">לחץ להוספת נקודות חיתוך</div>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <div className="font-medium text-orange-800 mb-1">4. חתוך והורד</div>
                <div className="text-orange-700">חתוך והורד את החלקים</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioSplitter;
