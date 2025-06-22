import { useState, useRef, useEffect, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Film, Download, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ConversionFormat = "mp4" | "webm" | "avi" | "gif";

const formatDetails: Record<ConversionFormat, { mimeType: string; extension: string }> = {
    mp4: { mimeType: 'video/mp4', extension: 'mp4' },
    webm: { mimeType: 'video/webm', extension: 'webm' },
    avi: { mimeType: 'video/avi', extension: 'avi' },
    gif: { mimeType: 'image/gif', extension: 'gif' },
};

const VideoConverter = () => {
    const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const [outputFormat, setOutputFormat] = useState<ConversionFormat>("mp4");

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
            setConvertedUrl(null);
            setProgress(0);
        }
    };

    const convertVideo = async () => {
        if (!originalFile) return;

        setIsProcessing(true);
        setProgress(0);
        toast({ title: "מתחיל המרה...", description: `ממיר לפורמט ${outputFormat.toUpperCase()}. זה עלול לקחת זמן.` });

        const ffmpeg = ffmpegRef.current;
        const inputFileName = "input." + originalFile.name.split('.').pop();
        const outputFileName = "output." + formatDetails[outputFormat].extension;

        await ffmpeg.writeFile(inputFileName, await fetchFile(originalFile));
        
        const commands: Record<ConversionFormat, string[]> = {
            mp4: ['-i', inputFileName, '-vcodec', 'libx264', '-acodec', 'aac', outputFileName],
            webm: ['-i', inputFileName, '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-c:a', 'libopus', outputFileName],
            avi: ['-i', inputFileName, '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', '-c:a', 'aac', '-b:a', '128k', outputFileName],
            gif: ['-i', inputFileName, '-vf', 'fps=15,scale=480:-1:flags=lanczos', '-c:v', 'gif', outputFileName],
        };

        await ffmpeg.exec(commands[outputFormat]);

        const data = await ffmpeg.readFile(outputFileName);
        const mimeType = formatDetails[outputFormat].mimeType;
        const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: mimeType }));
        
        setConvertedUrl(url);
        setIsProcessing(false);
        toast({ title: "ההמרה הסתיימה!", description: "הקובץ שלך מוכן." });
    };

    return (
        <div className="container mx-auto max-w-4xl p-4">
            <Button onClick={() => navigate("/categories/video-tools")} variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזרה לכלי וידאו
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>המרת וידאו</CardTitle>
                    <CardDescription>המר קבצי וידאו לפורמטים שונים כמו MP4, WEBM, AVI, ואפילו GIF.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!isFfmpegLoaded ? (
                        <div className="flex flex-col items-center justify-center p-8">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                            <p className="text-gray-600">טוען את מנוע הווידאו... (קורה רק פעם אחת)</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <Label htmlFor="video-upload">1. העלה קובץ וידאו</Label>
                                <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} />
                            </div>

                            <div className="space-y-4">
                                <Label>2. בחר פורמט יעד</Label>
                                <Select onValueChange={(value: ConversionFormat) => setOutputFormat(value)} defaultValue={outputFormat}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="בחר פורמט..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mp4">MP4</SelectItem>
                                        <SelectItem value="webm">WEBM</SelectItem>
                                        <SelectItem value="avi">AVI</SelectItem>
                                        <SelectItem value="gif">GIF (אנימציה)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <Button onClick={convertVideo} disabled={!originalFile || isProcessing} className="w-full">
                                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                                {isProcessing ? `ממיר... ${progress}%` : `המר ל-${outputFormat.toUpperCase()}`}
                            </Button>
                            
                            {isProcessing && <Progress value={progress} className="w-full" />}
                            
                            {convertedUrl && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">התוצאה שלך:</h3>
                                    {outputFormat === 'gif' ? (
                                        <img src={convertedUrl} alt="Converted GIF" className="w-full rounded-lg border"/>
                                    ) : (
                                        <video src={convertedUrl} controls className="w-full rounded-lg" />
                                    )}
                                    <a href={convertedUrl} download={`converted-${originalFile?.name.split('.')[0]}.${formatDetails[outputFormat].extension}`}>
                                        <Button className="w-full"><Download className="h-4 w-4 mr-2"/> הורד קובץ</Button>
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

export default VideoConverter;