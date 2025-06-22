import { useState, useRef, useEffect, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Scissors, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const VideoTrimmer = () => {
    const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
    const [startTime, setStartTime] = useState("00:00:00");
    const [endTime, setEndTime] = useState("00:00:10");

    const ffmpegRef = useRef(new FFmpeg());
    const originalVideoRef = useRef<HTMLVideoElement>(null);
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
            setTrimmedUrl(null);
            setProgress(0);
            
            // Set default end time based on video duration
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const duration = video.duration;
                const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
                const minutes = Math.floor((duration / 60) % 60).toString().padStart(2, '0');
                const hours = Math.floor(duration / 3600).toString().padStart(2, '0');
                setEndTime(`${hours}:${minutes}:${seconds}`);
            };
            video.src = URL.createObjectURL(file);
        }
    };

    const trimVideo = async () => {
        if (!originalFile) return;

        setIsProcessing(true);
        setProgress(0);
        toast({ title: "מתחיל חיתוך...", description: "התהליך עלול לקחת זמן." });

        const ffmpeg = ffmpegRef.current;
        const inputFileName = "input." + originalFile.name.split('.').pop();
        const outputFileName = "output.mp4";

        await ffmpeg.writeFile(inputFileName, await fetchFile(originalFile));
        
        // Command: -ss [start_time] -i [input] -to [end_time] -c copy
        // '-c copy' is used for fast, lossless trimming. It doesn't re-encode the video.
        const command = [
            '-ss', startTime,
            '-i', inputFileName,
            '-to', endTime,
            '-c', 'copy',
            outputFileName
        ];
        
        try {
            await ffmpeg.exec(command);
            const data = await ffmpeg.readFile(outputFileName);
            const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }));
            setTrimmedUrl(url);
            toast({ title: "החיתוך הסתיים בהצלחה!" });
        } catch (error) {
            console.error(error);
            toast({ title: "שגיאה בחיתוך", description: "ייתכן שפורמט הזמן שגוי או שהקובץ פגום.", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-4">
            <Button onClick={() => navigate("/categories/video-tools")} variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזרה לכלי וידאו
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>חיתוך וידאו</CardTitle>
                    <CardDescription>חתוך קטעים מסרטוני וידאו בקלות ובמהירות.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!isFfmpegLoaded ? (
                        <div className="flex flex-col items-center justify-center p-8">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                            <p className="text-gray-600">טוען את מנוע הווידאו...</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <Label htmlFor="video-upload">1. העלה קובץ וידאו</Label>
                                <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} />
                            </div>

                            {originalFile && (
                                <>
                                    <video ref={originalVideoRef} src={URL.createObjectURL(originalFile)} controls className="w-full rounded-lg" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="start-time">זמן התחלה</Label>
                                            <Input id="start-time" type="text" value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="HH:MM:SS" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end-time">זמן סיום</Label>
                                            <Input id="end-time" type="text" value={endTime} onChange={e => setEndTime(e.target.value)} placeholder="HH:MM:SS" />
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            <Button onClick={trimVideo} disabled={!originalFile || isProcessing} className="w-full">
                                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Scissors className="h-4 w-4 mr-2" />}
                                {isProcessing ? `מעבד... ${progress > 0 ? progress + '%' : ''}` : "חתוך וידאו"}
                            </Button>
                            
                            {isProcessing && progress > 0 && <Progress value={progress} className="w-full" />}
                            
                            {trimmedUrl && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">הסרטון החתוך:</h3>
                                    <video src={trimmedUrl} controls className="w-full rounded-lg" />
                                    <a href={trimmedUrl} download={`trimmed-${originalFile?.name}`}>
                                        <Button className="w-full"><Download className="h-4 w-4 mr-2"/> הורד סרטון חתוך</Button>
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

export default VideoTrimmer;