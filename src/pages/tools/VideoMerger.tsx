import { useState, useRef, useEffect, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Merge, Download, FilePlus, X, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const VideoMerger = () => {
    const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [files, setFiles] = useState<File[]>([]);
    const [mergedUrl, setMergedUrl] = useState<string | null>(null);
    
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
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(selectedFiles)]);
            setMergedUrl(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const mergeVideos = async () => {
        if (files.length < 2) {
            toast({ title: "לא נבחרו מספיק קבצים", description: "יש לבחור לפחות שני סרטונים.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        toast({ title: "מתחיל מיזוג...", description: "התהליך עלול להיות ארוך אם הסרטונים שונים בפורמט." });

        const ffmpeg = ffmpegRef.current;
        const fileNames: string[] = [];
        let fileListStr = "";

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = `input${i}.${file.name.split('.').pop()}`;
            fileNames.push(fileName);
            fileListStr += `file '${fileName}'\n`;
            await ffmpeg.writeFile(fileName, await fetchFile(file));
        }

        await ffmpeg.writeFile('filelist.txt', fileListStr);

        // This command attempts to concatenate the files.
        // It's safer because it re-encodes, handling different formats/resolutions.
        // For same-codec files, a faster (but less safe) command exists.
        const command = [
            '-f', 'concat',
            '-safe', '0',
            '-i', 'filelist.txt',
            '-c', 'copy', // Using stream copy for speed, assumes compatible codecs
            'output.mp4'
        ];
        
        try {
            await ffmpeg.exec(command);
            const data = await ffmpeg.readFile('output.mp4');
            const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }));
            setMergedUrl(url);
            toast({ title: "המיזוג הסתיים בהצלחה!" });
        } catch (error) {
            console.error(error);
            toast({ title: "שגיאה במיזוג", description: "נסה שוב. ייתכן שהסרטונים אינם תואמים למיזוג מהיר.", variant: "destructive" });
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
                    <CardTitle>מיזוג וידאו</CardTitle>
                    <CardDescription>אחד מספר סרטונים לקובץ וידאו אחד רציף.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!isFfmpegLoaded ? (
                         <div className="flex flex-col items-center justify-center p-8">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                            <p className="text-gray-600">טוען את מנוע הווידאו...</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="video-upload">1. בחר קבצי וידאו</Label>
                                <Input id="video-upload" type="file" accept="video/*" multiple onChange={handleFileChange} />
                            </div>
                            
                            {files.length > 0 && (
                                <div>
                                    <Label>2. רשימת הסרטונים למיזוג</Label>
                                    <div className="mt-2 p-4 border rounded-md max-h-60 overflow-y-auto">
                                        {files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md mb-2">
                                                <span className="font-mono text-sm truncate pr-2">{index + 1}. {file.name}</span>
                                                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button onClick={mergeVideos} disabled={files.length < 2 || isProcessing} className="w-full">
                                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Merge className="h-4 w-4 mr-2" />}
                                {isProcessing ? `ממזג... ${progress}%` : "מזג סרטונים"}
                            </Button>

                            {isProcessing && <Progress value={progress} className="w-full" />}
                            
                            {mergedUrl && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">הסרטון הממוזג:</h3>
                                    <video src={mergedUrl} controls className="w-full rounded-lg" />
                                    <a href={mergedUrl} download="merged-video.mp4">
                                        <Button className="w-full"><Download className="h-4 w-4 mr-2"/> הורד סרטון ממוזג</Button>
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

export default VideoMerger;