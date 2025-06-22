// src/components/tools/BaseFormatter.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Copy, Download, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ERROR_CODES } from "@/lib/errorHandling";

interface BaseFormatterProps {
  title: string;
  subtitle: string;
  toolType: 'html' | 'sql' | 'xml' | 'json';
  backPath: string;
  placeholder: string;
  defaultValue?: string;
  formatFunction: (input: string) => { formatted: string; error?: string };
  fileExtension: string;
  mimeType: string;
  iconColor: string;
}

const BaseFormatter = ({
  title,
  subtitle,
  toolType,
  backPath,
  placeholder,
  defaultValue = "",
  formatFunction,
  fileExtension,
  mimeType,
  iconColor
}: BaseFormatterProps) => {
  const [input, setInput] = useState(defaultValue);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { logError, handleAsyncError, validateAndHandle } = useErrorHandler({
    context: `${toolType}-formatter`
  });

  const handleFormat = async () => {
    // Validate input
    if (!validateAndHandle(
      input,
      (val) => val.trim().length > 0,
      ERROR_CODES.EMPTY_INPUT,
      `אנא הכנס קוד ${toolType.toUpperCase()}`
    )) {
      return;
    }

    const result = await handleAsyncError(
      async () => {
        setError("");
        const formatResult = formatFunction(input);
        
        if (formatResult.error) {
          throw new Error(formatResult.error);
        }
        
        return formatResult.formatted;
      },
      ERROR_CODES.FORMATTING_FAILED
    );

    if (result) {
      setOutput(result);
      toast({ 
        title: "הצלחה!", 
        description: `קוד ${toolType.toUpperCase()} עוצב בהצלחה` 
      });
    } else {
      setError(`שגיאה בעיצוב ${toolType.toUpperCase()}`);
    }
  };

  const copyToClipboard = async () => {
    const result = await handleAsyncError(
      async () => {
        await navigator.clipboard.writeText(output);
        return true;
      },
      ERROR_CODES.CLIPBOARD_ACCESS_DENIED
    );

    if (result) {
      toast({ title: "הועתק!", description: "הקוד הועתק ללוח" });
    }
  };

  const downloadFile = async () => {
    const result = await handleAsyncError(
      async () => {
        const blob = new Blob([output], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `formatted.${fileExtension}`;
        link.click();
        URL.revokeObjectURL(url);
        return true;
      },
      ERROR_CODES.FILE_WRITE_ERROR
    );

    if (result) {
      toast({ 
        title: "הורד!", 
        description: `קובץ ${toolType.toUpperCase()} הורד בהצלחה` 
      });
    }
  };

  const resetFields = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader
          title={title}
          subtitle={subtitle}
          icon={<Code className={`h-16 w-16 ${iconColor}`} />}
          backPath={backPath}
          backLabel="חזרה לכלי מפתחים"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{toolType.toUpperCase()} לא מעוצב</CardTitle>
              <CardDescription>הדבק כאן את קוד ה-{toolType.toUpperCase()} שלך</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="min-h-96 font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleFormat} className="flex-1">
                  <Code className="h-4 w-4 mr-2" />
                  עצב {toolType.toUpperCase()}
                </Button>
                <Button onClick={resetFields} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{toolType.toUpperCase()} מעוצב</CardTitle>
              <CardDescription>הקוד המעוצב יופיע כאן</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={output}
                readOnly
                placeholder="הקוד המעוצב יופיע כאן..."
                className="min-h-96 font-mono text-sm bg-gray-50"
              />
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  העתק
                </Button>
                <Button onClick={downloadFile} variant="outline" disabled={!output}>
                  <Download className="h-4 w-4 mr-2" />
                  הורד
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BaseFormatter;