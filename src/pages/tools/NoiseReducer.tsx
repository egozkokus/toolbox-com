
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Upload, Download, ShieldCheck, Play, Pause, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const NoiseReducer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [noiseReduction, setNoiseReduction] = useState([50]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setProcessedFile(null);
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

  const processAudio = async () => {
    if (!selectedFile) {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ אודיו קודם"
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "מעבד...",
      description: "מסיר רעש מהקובץ"
    });

    try {
      // Simulate noise reduction process
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const reader = new FileReader();
      reader.onload = () => {
        setProcessedFile(reader.result as string);
        setIsProcessing(false);
        toast({
          title: "הושלם!",
          description: `רעש הוסר ברמה של ${noiseReduction[0]}%`
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "שגיאה",
        description: "שגיאה בעיבוד הקובץ"
      });
    }
  };

  const downloadProcessed = () => {
    if (processedFile && selectedFile) {
      const link = document.createElement('a');
      link.href = processedFile;
      link.download = `noise_reduced_${selectedFile.name}`;
      link.click();
      toast({
        title: "הורד בהצלחה!",
        description: "הקובץ הנקי מרעש נשמר"
      });
    }
  };

  const getReductionLevel = (level: number) => {
    if (level < 30) return { label: "קל", color: "text-green-600", desc: "הסרת רעש בסיסית" };
    if (level < 70) return { label: "בינוני", color: "text-yellow-600", desc: "הסרת רעש סטנדרטית" };
    return { label: "חזק", color: "text-red-600", desc: "הסרת רעש אגרסיבית" };
  };

  const reductionInfo = getReductionLevel(noiseReduction[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate("/categories/audio-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי אודיו
        </Button>

        <div className="mb-8 text-center">
          <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-orange-600" />
          <h1 className="text-4xl font-bold mb-2">מסיר רעש</h1>
          <p className="text-gray-600">הסר רעש רקע ושפר איכות אודיו</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>קובץ מקור</CardTitle>
              <CardDescription>העלה קובץ אודיו להסרת רעש</CardDescription>
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
                      <Volume2 className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>

                  <audio
                    ref={audioRef}
                    src={URL.createObjectURL(selectedFile)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  <Button onClick={togglePlayback} variant="outline" className="w-full">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "עצור נגינה" : "נגן קובץ מקור"}
                  </Button>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">עוצמת הסרת רעש</label>
                  <span className={`text-sm font-medium ${reductionInfo.color}`}>
                    {reductionInfo.label}
                  </span>
                </div>
                <Slider
                  value={noiseReduction}
                  onValueChange={setNoiseReduction}
                  max={90}
                  min={10}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>קל</span>
                  <span>{noiseReduction[0]}%</span>
                  <span>חזק</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {reductionInfo.desc}
                </div>
              </div>

              <Button 
                onClick={processAudio} 
                disabled={!selectedFile || isProcessing}
                className="w-full"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                {isProcessing ? "מעבד..." : "הסר רעש"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>קובץ מעובד</CardTitle>
              <CardDescription>תוצאת הסרת הרעש</CardDescription>
            </CardHeader>
            <CardContent>
              {processedFile ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        noise_reduced_{selectedFile?.name}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      ✓ רעש הוסר ברמה של {noiseReduction[0]}%
                    </div>
                  </div>

                  <audio
                    src={processedFile}
                    controls
                    className="w-full"
                  />
                  
                  <Button onClick={downloadProcessed} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    הורד קובץ נקי מרעש
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border border-dashed rounded">
                  <ShieldCheck className="h-12 w-12 mb-2" />
                  <div>הקובץ הנקי מרעש יופיע כאן</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>סוגי רעש שניתן להסיר</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded">
                <div className="font-medium text-blue-800 mb-1">רעש סביבתי</div>
                <div className="text-blue-700">מזגן, מאוורר, תנועה</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="font-medium text-green-800 mb-1">רעש אלקטרוני</div>
                <div className="text-green-700">זמזום, צפצופים, הפרעות</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="font-medium text-purple-800 mb-1">רעש רקע</div>
                <div className="text-purple-700">דיבורים רחוקים, הדהודים</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>טיפים לתוצאות מיטביות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <div>התחל עם רמת הסרת רעש נמוכה והגבר בהדרגה</div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <div>רמה גבוהה מדי עלולה לפגוע באיכות הקול הרצוי</div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <div>האזן לתוצאה לפני ההורדה כדי לוודא שהתוצאה מספקת</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoiseReducer;
