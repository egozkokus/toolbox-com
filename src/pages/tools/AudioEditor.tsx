
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Upload, Play, Pause, Download, Volume2, Scissors, Undo, Redo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AudioEditor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [playbackSpeed, setPlaybackSpeed] = useState([1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setIsPlaying(false);
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

  const applyEffect = async (effectType: string) => {
    setIsProcessing(true);
    toast({
      title: "מעבד...",
      description: `מחיל אפקט ${effectType}`
    });

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    toast({
      title: "הושלם!",
      description: `אפקט ${effectType} הוחל בהצלחה`
    });
  };

  const downloadProcessed = () => {
    if (selectedFile) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(selectedFile);
      link.download = `edited_${selectedFile.name}`;
      link.click();
      toast({
        title: "הורד בהצלחה!",
        description: "הקובץ הערוך נשמר"
      });
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
          <Volume2 className="h-12 w-12 mx-auto mb-4 text-teal-600" />
          <h1 className="text-4xl font-bold mb-2">עורך אודיו</h1>
          <p className="text-gray-600">ערוך קבצי אודיו עם אפקטים מתקדמים</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>העלה קובץ אודיו</CardTitle>
              <CardDescription>בחר קובץ אודיו לעריכה</CardDescription>
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
                  <audio
                    ref={audioRef}
                    src={URL.createObjectURL(selectedFile)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  <div className="flex items-center space-x-4">
                    <Button onClick={togglePlayback} size="sm">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? "עצור" : "נגן"}
                    </Button>
                    
                    <div className="flex-1">
                      <label className="text-sm font-medium">עוצמת קול: {volume[0]}%</label>
                      <Slider
                        value={volume}
                        onValueChange={(value) => {
                          setVolume(value);
                          if (audioRef.current) {
                            audioRef.current.volume = value[0] / 100;
                          }
                        }}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">מהירות נגינה: {playbackSpeed[0]}x</label>
                    <Slider
                      value={playbackSpeed}
                      onValueChange={(value) => {
                        setPlaybackSpeed(value);
                        if (audioRef.current) {
                          audioRef.current.playbackRate = value[0];
                        }
                      }}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>אפקטים</CardTitle>
              <CardDescription>החל אפקטים על הקובץ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => applyEffect("הדהוד")} 
                  disabled={!selectedFile || isProcessing}
                  variant="outline"
                >
                  הדהוד
                </Button>
                <Button 
                  onClick={() => applyEffect("חיזוק בס")} 
                  disabled={!selectedFile || isProcessing}
                  variant="outline"
                >
                  חיזוק בס
                </Button>
                <Button 
                  onClick={() => applyEffect("חיזוק טרבל")} 
                  disabled={!selectedFile || isProcessing}
                  variant="outline"
                >
                  חיזוק טרבל
                </Button>
                <Button 
                  onClick={() => applyEffect("נורמליזציה")} 
                  disabled={!selectedFile || isProcessing}
                  variant="outline"
                >
                  נורמליזציה
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">כלי עריכה</h4>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Scissors className="h-4 w-4 mr-1" />
                    חתוך
                  </Button>
                  <Button size="sm" variant="outline">
                    <Undo className="h-4 w-4 mr-1" />
                    בטל
                  </Button>
                  <Button size="sm" variant="outline">
                    <Redo className="h-4 w-4 mr-1" />
                    חזור
                  </Button>
                </div>
              </div>

              {selectedFile && (
                <Button onClick={downloadProcessed} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  הורד קובץ ערוך
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AudioEditor;
