
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Sun, Contrast, Palette, Waves, RotateCcw } from "lucide-react";

interface ImageControlsProps {
  brightness: number[];
  setBrightness: (value: number[]) => void;
  contrast: number[];
  setContrast: (value: number[]) => void;
  saturation: number[];
  setSaturation: (value: number[]) => void;
  blur: number[];
  setBlur: (value: number[]) => void;
  rotation: number[];
  setRotation: (value: number[]) => void;
  onReset: () => void;
}

const ImageControls = ({
  brightness, setBrightness,
  contrast, setContrast,
  saturation, setSaturation,
  blur, setBlur,
  rotation, setRotation,
  onReset
}: ImageControlsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>כלי עריכה</CardTitle>
        <CardDescription>התאם את הפילטרים והאפקטים</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium mb-2">
            <Sun className="h-4 w-4 mr-2" />
            בהירות: {brightness[0]}%
          </label>
          <Slider
            value={brightness}
            onValueChange={setBrightness}
            max={200}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium mb-2">
            <Contrast className="h-4 w-4 mr-2" />
            ניגודיות: {contrast[0]}%
          </label>
          <Slider
            value={contrast}
            onValueChange={setContrast}
            max={200}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium mb-2">
            <Palette className="h-4 w-4 mr-2" />
            רוויה: {saturation[0]}%
          </label>
          <Slider
            value={saturation}
            onValueChange={setSaturation}
            max={200}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium mb-2">
            <Waves className="h-4 w-4 mr-2" />
            טשטוש: {blur[0]}px
          </label>
          <Slider
            value={blur}
            onValueChange={setBlur}
            max={10}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium mb-2">
            <RotateCcw className="h-4 w-4 mr-2" />
            סיבוב: {rotation[0]}°
          </label>
          <Slider
            value={rotation}
            onValueChange={setRotation}
            max={360}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          איפוס פילטרים
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImageControls;
