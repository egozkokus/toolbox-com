// src/components/tools/BaseMinifier.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Minimize2, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";

interface BaseMinifierProps {
  title: string;
  subtitle: string;
  toolType: 'css' | 'js' | 'html';
  backPath: string;
  placeholder: string;
  minifyFunction: (input: string) => string;
  fileExtension: string;
  mimeType: string;
  iconColor: string;
}

const BaseMinifier = ({
  title,
  subtitle,
  toolType,
  backPath,
  placeholder,
  minifyFunction,
  fileExtension,
  mimeType,
  iconColor
}: BaseMinifierProps) => {
  const [input, setInput] = useState("");
  const [minified, setMinified] = useState("");
  const { toast } = useToast();

  const handleMinify = () => {
    if (!input.trim()) {
      toast({
        title: "שגיאה",
        description: `אנא הכנס קוד ${toolType.toUpperCase()}`,
        variant: "destructive"
      });
      return;
    }

    try {
      const result = minifyFunction(input);
      setMinified(result);
      
      const originalSize = new Blob([input]).size;
      const minifiedSize = new Blob([result]).size;
      const savedPercentage = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
      
      toast({
        title: "הושלם!",
        description: `${toolType.toUpperCase()} הוקטן ב-${savedPercentage}%`
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: `שגיאה בהקטנת ${toolType.toUpperCase()}`,
        variant: "destructive"
      });
      console.error(error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(minified);
    toast({
      title: "הועתק!",
      description: "הקוד המוקטן הועתק ללוח"
    });
  };

  const downloadFile = () => {
    const blob = new Blob([minified], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minified.${fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "הורד בהצלחה!",
      description: "הקובץ נשמר"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader 
          title={title}
          subtitle={subtitle}
          icon={<Minimize2 className={`h-12 w-12 mx-auto ${iconColor}`} />}
          backPath={backPath}
          backLabel="חזרה לכלי מפתחים"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>קוד {toolType.toUpperCase()} מקורי</CardTitle>
              <CardDescription>הדבק את קוד ה-{toolType.toUpperCase()} שלך כאן</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="min-h-[300px] font-mono text-sm"
              />
              
              <Button onClick={handleMinify} className="w-full">
                <Minimize2 className="h-4 w-4 mr-2" />
                הקטן {toolType.toUpperCase()}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{toolType.toUpperCase()} מוקטן</CardTitle>
              <CardDescription>הקוד המוקטן יופיע כאן</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {minified ? (
                <>
                  <Textarea
                    value={minified}
                    readOnly
                    className="min-h-[300px] font-mono text-sm bg-gray-50"
                  />
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      העתק
                    </Button>
                    <Button onClick={downloadFile} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      הורד
                    </Button>
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  הקוד המוקטן יופיע כאן
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BaseMinifier;