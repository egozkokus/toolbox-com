
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const URLEncoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { toast } = useToast();
  const { t } = useTranslation();

  const processURL = () => {
    try {
      if (mode === "encode") {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
      }
    } catch (error) {
      toast({
        title: t("url_encoder_page.toasts.error_title"),
        description: t("url_encoder_page.toasts.error_desc")
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: t("url_encoder_page.toasts.copied_title"),
      description: t("url_encoder_page.toasts.copied_desc")
    });
  };

  const switchMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput("");
    setOutput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Link className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">{t('url_encoder_page.title')}</h1>
          <p className="text-gray-600">{t('url_encoder_page.subtitle')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('url_encoder_page.input_title')}</CardTitle>
                  <CardDescription>
                    {mode === 'encode'
                      ? t('url_encoder_page.input_desc_encode')
                      : t('url_encoder_page.input_desc_decode')}
                  </CardDescription>
                </div>
                <Button onClick={switchMode} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {mode === 'encode'
                    ? t('url_encoder_page.switch_to_decode')
                    : t('url_encoder_page.switch_to_encode')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={
                  mode === 'encode'
                    ? t('url_encoder_page.placeholders.encode')
                    : t('url_encoder_page.placeholders.decode')
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-32"
              />
              <Button onClick={processURL} className="w-full">
                {mode === 'encode'
                  ? t('url_encoder_page.buttons.encode')
                  : t('url_encoder_page.buttons.decode')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('url_encoder_page.output_title')}</CardTitle>
              <CardDescription>
                {mode === 'encode'
                  ? t('url_encoder_page.output_desc_encode')
                  : t('url_encoder_page.output_desc_decode')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={output}
                readOnly
                className="min-h-32 bg-gray-50"
                placeholder={t('url_encoder_page.placeholders.output')}
              />
              {output && (
                <Button onClick={copyToClipboard} variant="outline" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  {t('url_encoder_page.buttons.copy')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default URLEncoder;
