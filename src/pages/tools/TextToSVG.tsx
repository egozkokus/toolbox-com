
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Download, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const TextToSVG = () => {
  const [text, setText] = useState("טקסט לדוגמה");
  const [fontSize, setFontSize] = useState([24]);
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [svgOutput, setSvgOutput] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateSVG = () => {
    if (!text.trim()) {
      toast({ title: "שגיאה", description: "אנא הכנס טקסט" });
      return;
    }

    const svg = `<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" />
      <text x="50%" y="50%" font-family="${fontFamily}" font-size="${fontSize[0]}" fill="${color}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;

    setSvgOutput(svg);
  };

  const downloadSVG = () => {
    if (!svgOutput) return;

    const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'text.svg';
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "הצלחה!", description: "קובץ SVG הורד בהצלחה" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate("/categories/text-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי טקסט
        </Button>

        <div className="mb-8 text-center">
          <FileImage className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">המרת טקסט ל-SVG</h1>
          <p className="text-gray-600">הפוך טקסט לתמונת SVG</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות הטקסט</CardTitle>
              <CardDescription>התאם את המראה של הטקסט</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">טקסט</label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="הכנס את הטקסט שלך כאן..."
                  className="min-h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  גודל גופן: {fontSize[0]}px
                </label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={72}
                  min={8}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">צבע טקסט</label>
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">צבע רקע</label>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>

              <Button onClick={generateSVG} className="w-full">
                יצור SVG
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>תצוגה מקדימה</CardTitle>
              <CardDescription>תצוגה מקדימה של קובץ ה-SVG</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {svgOutput ? (
                <div className="space-y-4">
                  <div 
                    className="border rounded p-4 bg-white"
                    dangerouslySetInnerHTML={{ __html: svgOutput }}
                  />
                  <Button onClick={downloadSVG} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    הורד SVG
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  תצוגה מקדימה תופיע כאן
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TextToSVG;
