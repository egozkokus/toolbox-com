import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, Download, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

type VideoFilter = "none" | "grayscale" | "sepia" | "invert" | "brightness" | "contrast";

const filterDetails: Record<VideoFilter, { label: string; vf: string }> = {
    none: { label: 'ללא פילטר', vf: '' },
    grayscale: { label: 'שחור-לבן', vf: 'format=gray' },
    sepia: { label: 'ספיה', vf: 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131' },
    invert: { label: 'היפוך צבעים', vf: 'negate' },
    brightness: { label: 'בהירות', vf: 'eq=brightness=0.2' },
    contrast: { label: 'ניגודיות (קונטרסט)', vf: 'eq=contrast=1.5' },
};

const VideoEditor = () => {
    const [loaded, setLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [editedUrl, setEditedUrl] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<VideoFilter>("none");
    const [loadError, setLoadError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");

    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const ffmpeg = ffmpegRef.current;
        
        ffmpeg.on("log", ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
            console.log(message);
        });
        
        ffmpeg.on("progress", ({ progress }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            // נסיון פשוט יותר לטעינת FFmpeg
            await ffmpeg.load();
            setLoaded(true);
            console.log("FFmpeg loaded!");
        } catch (error) {
            console.error("FFmpeg load error:", error);
            setLoadError("לא הצליח לטעון את FFmpeg. נסה לרענן את הדף.");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                setStatusMessage("הקובץ גדול מדי - גודל מקסימלי 50MB");
                return;
            }
            
            setOriginalFile(file);
            setEditedUrl(null);
            setProgress(0);
            setStatusMessage("");
        }
    };

    const applyFilter = async () => {
        if (!originalFile || selectedFilter === 'none') {
            setStatusMessage("יש לבחור קובץ וידאו ופילטר להחלה");
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setStatusMessage("מעבד את הסרטון...");

        const ffmpeg = ffmpegRef.current;

        try {
            // כתיבת הקובץ
            await ffmpeg.writeFile("input.mp4", await fetchFile(originalFile));
            
            // הפעלת הפילטר
            await ffmpeg.exec([
                '-i', 'input.mp4',
                '-vf', filterDetails[selectedFilter].vf,
                '-preset', 'ultrafast',
                'output.mp4'
            ]);
            
            // קריאת התוצאה
            const data = await ffmpeg.readFile('output.mp4');
            const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
            
            setEditedUrl(url);
            setStatusMessage("הסרטון מוכן!");
            
        } catch (error) {
            console.error('Processing error:', error);
            setStatusMessage("שגיאה בעיבוד הסרטון");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-4">
            <Card>
                <CardHeader>
                    <CardTitle>עורך וידאו - החלת פילטרים</CardTitle>
                    <CardDescription>
                        העלה סרטון קצר ובחר פילטר
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {loadError ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {loadError}
                                <br />
                                <Button 
                                    onClick={() => window.location.reload()} 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2"
                                >
                                    רענן את הדף
                                </Button>
                            </AlertDescription>
                        </Alert>
                    ) : !loaded ? (
                        <div className="flex flex-col items-center justify-center p-8">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                            <p className="text-gray-600">טוען את מנוע הווידאו...</p>
                            <p ref={messageRef} className="text-xs text-gray-500 mt-2"></p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <Label htmlFor="video-upload">בחר סרטון (עד 50MB)</Label>
                                <Input 
                                    id="video-upload" 
                                    type="file" 
                                    accept="video/*" 
                                    onChange={handleFileChange} 
                                />
                            </div>

                            {statusMessage && (
                                <Alert>
                                    <AlertDescription>{statusMessage}</AlertDescription>
                                </Alert>
                            )}

                            {originalFile && (
                                <>
                                    <div className="space-y-2">
                                        <Label>תצוגה מקדימה:</Label>
                                        <video 
                                            src={URL.createObjectURL(originalFile)} 
                                            controls 
                                            className="w-full rounded-lg shadow-md max-h-64" 
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label>בחר פילטר:</Label>
                                        <Select 
                                            onValueChange={(value: VideoFilter) => setSelectedFilter(value)} 
                                            defaultValue={selectedFilter}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="בחר פילטר..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(filterDetails).map(([key, {label}]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <Button 
                                        onClick={applyFilter} 
                                        disabled={isProcessing || selectedFilter === 'none'} 
                                        className="w-full"
                                    >
                                        {isProcessing ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Wand2 className="h-4 w-4 mr-2" />
                                        )}
                                        {isProcessing ? `מעבד... ${progress}%` : "החל פילטר"}
                                    </Button>
                                    
                                    {isProcessing && (
                                        <Progress value={progress} className="w-full" />
                                    )}
                                </>
                            )}
                            
                            {editedUrl && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">הסרטון המעובד:</h3>
                                    <video 
                                        src={editedUrl} 
                                        controls 
                                        className="w-full rounded-lg shadow-md max-h-64" 
                                    />
                                    <a 
                                        href={editedUrl} 
                                        download={`filtered-${originalFile?.name}`}
                                    >
                                        <Button className="w-full">
                                            <Download className="h-4 w-4 mr-2" />
                                            הורד סרטון
                                        </Button>
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

export default VideoEditor;