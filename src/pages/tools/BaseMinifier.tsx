// src/components/tools/BaseMinifier.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Minimize2, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ERROR_CODES } from "@/lib/errorHandling";
import { useTranslation } from "react-i18next";

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
  const { logError, handleAsyncError, validateAndHandle } = useErrorHandler({
    context: `${toolType}-minifier`
  });
  const { t } = useTranslation();

  const handleMinify = async () => {
    // Validate input
    if (
      !validateAndHandle(
        input,
        (val) => val.trim().length > 0,
        ERROR_CODES.EMPTY_INPUT,
        t('base_minifier_page.toasts.error_desc', { tool: toolType.toUpperCase() })
      )
    ) {
      return;
    }

    const result = await handleAsyncError(
      async () => {
        const minifiedResult = minifyFunction(input);
        
        if (!minifiedResult) {
          throw new Error('Minification returned empty result');
        }
        
        return minifiedResult;
      },
      ERROR_CODES.MINIFICATION_FAILED
    );

    if (result) {
      setMinified(result);
      
      const originalSize = new Blob([input]).size;
      const minifiedSize = new Blob([result]).size;
      const savedPercentage = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
      
      toast({
        title: t('base_minifier_page.toasts.success_title'),
        description: t('base_minifier_page.toasts.minify_success', {
          tool: toolType.toUpperCase(),
          percent: savedPercentage
        })
      });
    }
  };

  const copyToClipboard = async () => {
    const result = await handleAsyncError(
      async () => {
        await navigator.clipboard.writeText(minified);
        return true;
      },
      ERROR_CODES.CLIPBOARD_ACCESS_DENIED
    );

    if (result) {
      toast({
        title: t('base_minifier_page.toasts.success_title'),
        description: t('base_minifier_page.toasts.copied')
      });
    }
  };

  const downloadFile = async () => {
    const result = await handleAsyncError(
      async () => {
        const blob = new Blob([minified], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `minified.${fileExtension}`;
        a.click();
        URL.revokeObjectURL(url);
        return true;
      },
      ERROR_CODES.FILE_WRITE_ERROR
    );

    if (result) {
      toast({
        title: t('base_minifier_page.toasts.success_title'),
        description: t('base_minifier_page.toasts.downloaded')
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader 
          title={title}
          subtitle={subtitle}
          icon={<Minimize2 className={`h-12 w-12 mx-auto ${iconColor}`} />}
          backPath={backPath}
          backLabel={t('base_minifier_page.back')}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('base_minifier_page.original_title', { tool: toolType.toUpperCase() })}</CardTitle>
              <CardDescription>{t('base_minifier_page.original_desc', { tool: toolType.toUpperCase() })}</CardDescription>
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
                {t('base_minifier_page.minify_button', { tool: toolType.toUpperCase() })}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('base_minifier_page.minified_title', { tool: toolType.toUpperCase() })}</CardTitle>
              <CardDescription>{t('base_minifier_page.minified_desc')}</CardDescription>
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
                      {t('base_minifier_page.copy_button')}
                    </Button>
                    <Button onClick={downloadFile} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      {t('base_minifier_page.download_button')}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  {t('base_minifier_page.minified_desc')}
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