
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const ColorPicker = () => {
  const [color, setColor] = useState("#3b82f6");
  const { toast } = useToast();
  const { t } = useTranslation();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: t("color_picker_page.toasts.copied_title"),
      description: t("color_picker_page.toasts.copied_desc", { value })
    });
  };

  const colorFormats = [
    { label: "HEX", value: color },
    { label: "RGB", value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "" },
    { label: "RGBA", value: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` : "" },
    { label: "HSL", value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Palette className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">{t('color_picker_page.title')}</h1>
          <p className="text-gray-600">{t('color_picker_page.subtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('color_picker_page.selector_title')}</CardTitle>
              <CardDescription>
                {t('color_picker_page.selector_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="colorPicker">{t('color_picker_page.picker_label')}</Label>
                <input
                  id="colorPicker"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-32 border-2 border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hexInput">{t('color_picker_page.hex_label')}</Label>
                <Input
                  id="hexInput"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#000000"
                />
              </div>
              <div 
                className="w-full h-16 rounded border border-gray-300"
                style={{ backgroundColor: color }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('color_picker_page.values_title')}</CardTitle>
              <CardDescription>
                {t('color_picker_page.values_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {colorFormats.map((format) => (
                <div key={format.label} className="space-y-2">
                  <Label>{format.label}</Label>
                  <div className="flex gap-2">
                    <Input value={format.value} readOnly />
                    <Button 
                      onClick={() => copyToClipboard(format.value)} 
                      variant="outline"
                      size="icon"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
