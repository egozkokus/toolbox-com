import { useState, useRef, useEffect, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Clapperboard, Download, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

const GifMaker = () => {
    const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [gifUrl, setGifUrl] = useState<string | null>(null);

    const [startTime, setStartTime] = useState("00:00:00");
    const [endTime, setEndTime] = useState("00:00:05");
    const [fps, setFps] = useState(15);
    const [width, setWidth] = useState(480);

    const ffmpegRef = useRef(new FFmpeg());
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
            setGifUrl(null);
            setProgress(0);
        }
    };

    const createGif = async () => {
        if (!originalFile) return;

        setIsProcessing(true);
        setProgress(0);
        toast({ title: "מתחיל ליצור GIF...", description: "התהליך עלול לקחת זמן." });

        const ffmpeg = ffmpegRef.current;
        const inputFileName = "input." + originalFile.name.split('.').pop();
        const outputFileName = "output.gif";

        await ffmpeg.writeFile(inputFileName, await fetchFile(originalFile));
        
        // Command to create a high-quality GIF
        const vf_complex = `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;

        const command = [
            '-ss', startTime,
            '-to', endTime,
            '-i', inputFileName,
            '-vf', vf_complex,
            outputFileName
        ];
        
        try {
            await ffmpeg.exec(command);
            const data = await ffmpeg.readFile(outputFileName);
            const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'image/gif' }));
            setGifUrl(url);
            toast({ title: "ה-GIF נוצר בהצלחה!" });
        } catch (error) {
            console.error(error);
            toast({ title: "שגיאה ביצירת GIF", description: "נסה לשנות את הזמנים או את הפרמטרים.", variant: "destructive" });
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
                    <CardTitle>יצירת GIF מסרטון</CardTitle>
                    <CardDescription>הפוך קטעי וידאו לקבצי GIF מונפשים.</CardDescription>
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
                                <div className="space-y-4">
                                    <video src={URL.createObjectURL(originalFile)} controls className="w-full rounded-lg" />
                                    
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
                                    
                                    <div className="space-y-2">
                                        <Label>הגדרות GIF <SlidersHorizontal className="inline-block h-4 w-4 ml-1"/></Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <div>
                                                <Label className="text-xs">קצב פריימים (FPS): {fps}</Label>
                                                <Slider defaultValue={[fps]} max={30} min={5} step={1} onValueChange={(v) => setFps(v[0])} />
                                            </div>
                                            <div>
                                                <Label className="text-xs">רוחב (px): {width}</Label>
                                                <Slider defaultValue={[width]} max={1000} min={100} step={10} onValueChange={(v) => setWidth(v[0])} />
                                            </div>
                                        </div>
                                    </div>

                                    <Button onClick={createGif} disabled={isProcessing} className="w-full">
                                        {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Clapperboard className="h-4 w-4 mr-2" />}
                                        {isProcessing ? `יוצר... ${progress}%` : "צור GIF"}
                                    </Button>
                                    
                                    {isProcessing && <Progress value={progress} className="w-full" />}
                                </div>
                            )}
                            
                            {gifUrl && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">ה-GIF שלך מוכן:</h3>
                                    <img src={gifUrl} alt="Generated GIF" className="w-full rounded-lg border bg-gray-100" />
                                    <a href={gifUrl} download="generated-animation.gif">
                                        <Button className="w-full"><Download className="h-4 w-4 mr-2"/> הורד GIF</Button>
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

export default GifMaker;