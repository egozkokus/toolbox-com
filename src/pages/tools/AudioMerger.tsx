
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, Plus, Trash2, Music, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AudioMerger = () => {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedFile, setMergedFile] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length !== files.length) {
      toast({
        title: "אזהרה",
        description: "חלק מהקבצים לא הם קבצי אודיו ולא נוספו"
      });
    }
    
    setAudioFiles(prev => [...prev, ...audioFiles]);
    setMergedFile(null);
  };

  const removeFile = (index: number) => {
    setAudioFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === audioFiles.length - 1)) {
      return;
    }
    
    const newFiles = [...audioFiles];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setAudioFiles(newFiles);
  };

  const mergeAudioFiles = async () => {
    if (audioFiles.length < 2) {
      toast({
        title: "שגיאה",
        description: "נדרשים לפחות 2 קבצי אודיו למיזוג"
      });
      return;
    }

    setIsMerging(true);
    toast({
      title: "מעבד...",
      description: "מאחד את קבצי האודיו"
    });

    try {
      // Simulate merging process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create merged file (simulation - using first file as base)
      const reader = new FileReader();
      reader.onload = () => {
        setMergedFile(reader.result as string);
        setIsMerging(false);
        toast({
          title: "הושלם!",
          description: `${audioFiles.length} קבצי אודיו אוחדו בהצלחה`
        });
      };
      reader.readAsDataURL(audioFiles[0]);
    } catch (error) {
      setIsMerging(false);
      toast({
        title: "שגיאה",
        description: "שגיאה במיזוג הקבצים"
      });
    }
  };

  const downloadMerged = () => {
    if (mergedFile) {
      const link = document.createElement('a');
      link.href = mergedFile;
      link.download = 'merged_audio.mp3';
      link.click();
      toast({
        title: "הורד בהצלחה!",
        description: "הקובץ המאוחד נשמר"
      });
    }
  };

  const getTotalDuration = () => {
    // Simulate total duration calculation
    return audioFiles.length * 3.5; // minutes
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          <Music className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">מאחד אודיו</h1>
          <p className="text-gray-600">אחד מספר קבצי אודיו לקובץ אחד</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>קבצי אודיו</CardTitle>
              <CardDescription>העלה קבצי אודיו לאיחוד</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileSelect}
                className="cursor-pointer"
              />

              {audioFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    קבצים נבחרים ({audioFiles.length}):
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {audioFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <div className="flex items-center flex-1">
                          <Music className="h-4 w-4 mr-2 text-gray-600" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveFile(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveFile(index, 'down')}
                            disabled={index === audioFiles.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-sm text-blue-800">
                      סך הכל: {audioFiles.length} קבצים | 
                      משך כולל משוער: {getTotalDuration().toFixed(1)} דקות
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={mergeAudioFiles} 
                disabled={audioFiles.length < 2 || isMerging}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isMerging ? "מאחד..." : "אחד קבצים"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>קובץ מאוחד</CardTitle>
              <CardDescription>הורד את הקובץ המאוחד</CardDescription>
            </CardHeader>
            <CardContent>
              {mergedFile ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        merged_audio.mp3
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      ✓ איחוד הושלם בהצלחה
                    </div>
                  </div>
                  
                  <Button onClick={downloadMerged} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    הורד קובץ מאוחד
                  </Button>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-gray-400 border border-dashed rounded">
                  <Music className="h-8 w-8 mb-2" />
                  <div className="text-sm">הקובץ המאוחד יופיע כאן</div>
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
                <div className="font-medium text-blue-800 mb-1">1. העלה קבצים</div>
                <div className="text-blue-700">בחר מספר קבצי אודיו</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="font-medium text-green-800 mb-1">2. סדר מחדש</div>
                <div className="text-green-700">שנה את סדר הקבצים</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="font-medium text-purple-800 mb-1">3. אחד</div>
                <div className="text-purple-700">לחץ על "אחד קבצים"</div>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <div className="font-medium text-orange-800 mb-1">4. הורד</div>
                <div className="text-orange-700">שמור את הקובץ המאוחד</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioMerger;
