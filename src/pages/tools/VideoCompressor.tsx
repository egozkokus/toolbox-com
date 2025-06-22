import { useState, useRef, useEffect, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Film, Download, ArrowLeft, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

const VideoCompressor = () => {
  const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [crfValue, setCrfValue] = useState(28); // Constant Rate Factor: 18 (high quality) to 51 (low quality)

  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadFfmpeg = useCallback(async () => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => console.log(message));
    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setIsFfmpegLoaded(true);
  }, []);

  useEffect(() => {
    loadFfmpeg();
  }, [loadFfmpeg]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      setOriginalSize(file.size);
      setCompressedUrl(null);
      setCompressedSize(0);
      setProgress(0);
    }
  };

  const compressVideo = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    setProgress(0);
    toast({ title: "מתחיל דחיסה...", description: "זה עלול לקחת זמן, תלוי בגודל הסרטון." });

    const ffmpeg = ffmpegRef.current;
    const inputFileName = "input.mp4";
    const outputFileName = "output.mp4";

    await ffmpeg.writeFile(inputFileName, await fetchFile(originalFile));
    
    // CRF: Constant Rate Factor. 23 is default. Higher means more compression.
    const command = [
      '-i', inputFileName,
      '-vcodec', 'libx264',
      '-crf', crfValue.toString(),
      outputFileName
    ];

    await ffmpeg.exec(command);

    const data = await ffmpeg.readFile(outputFileName);
    const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }));
    setCompressedUrl(url);
    setCompressedSize((data as Uint8Array).byteLength);
    setIsProcessing(false);
    toast({ title: "הדחיסה הסתיימה!", description: "הסרטון שלך מוכן." });
  };

  const getCompressionPercentage = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };
  
  return (
    <div className="container mx-auto max-w-4xl p-4">
       <Button onClick={() => navigate("/categories/video-tools")} variant="outline" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי וידאו
       </Button>

      <Card>
        <CardHeader>
          <CardTitle>דחיסת וידאו</CardTitle>
          <CardDescription>הקטן את גודל קובץ הווידאו שלך באיכות טובה.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isFfmpegLoaded ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600">טוען את מנוע הווידאו... (קורה רק פעם אחת)</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input */}
                  <div className="space-y-4">
                      <Label htmlFor="video-upload">1. העלה קובץ וידאו</Label>
                      <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} />
                      {originalFile && <video src={URL.createObjectURL(originalFile)} controls className="w-full rounded-lg mt-2" />}
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                      <Label>2. בחר רמת דחיסה (CRF)</Label>
                      <Slider defaultValue={[crfValue]} max={51} min={18} step={1} onValueChange={(value) => setCrfValue(value[0])} />
                      <div className="flex justify-between text-xs text-gray-500">
                          <span>איכות גבוהה</span>
                          <span>גודל קטן</span>
                      </div>
                      <Alert variant="default">
                          <Percent className="h-4 w-4"/>
                          <AlertTitle>ערך נוכחי: {crfValue}</AlertTitle>
                          <AlertDescription>ערך נמוך יותר = איכות טובה יותר וקובץ גדול יותר. ערך מומלץ: 23-28.</AlertDescription>
                      </Alert>
                  </div>
              </div>
              
              <Button onClick={compressVideo} disabled={!originalFile || isProcessing} className="w-full">
                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Film className="h-4 w-4 mr-2" />}
                {isProcessing ? `דוחס... ${progress}%` : "דחוס וידאו"}
              </Button>
              
              {isProcessing && <Progress value={progress} className="w-full" />}
              
              {compressedUrl && (
                  <div className="space-y-4">
                      <h3 className="text-lg font-semibold">התוצאה שלך:</h3>
                      <video ref={videoRef} src={compressedUrl} controls className="w-full rounded-lg" />
                      <div className="flex justify-around p-4 bg-gray-50 rounded-lg">
                          <div>
                              <p className="text-sm text-gray-500">גודל מקורי</p>
                              <p className="text-lg font-bold">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <div>
                              <p className="text-sm text-gray-500">גודל חדש</p>
                              <p className="text-lg font-bold text-green-600">{(compressedSize / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <div>
                              <p className="text-sm text-gray-500">חיסכון</p>
                              <p className="text-lg font-bold text-blue-600">{getCompressionPercentage()}%</p>
                          </div>
                      </div>
                      <a href={compressedUrl} download={`compressed-${originalFile?.name}`}>
                          <Button className="w-full"><Download className="h-4 w-4 mr-2"/> הורד וידאו דחוס</Button>
                      </a>
                  </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoCompressor;