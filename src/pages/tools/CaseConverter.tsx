
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Type, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const CaseConverter = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { t } = useTranslation();

  const convertCases = () => {
    if (!input.trim()) return;

    const converted = {
      lowercase: input.toLowerCase(),
      uppercase: input.toUpperCase(),
      titlecase: input.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      camelcase: input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => 
        chr.toUpperCase()
      ),
      pascalcase: input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => 
        chr.toUpperCase()
      ).replace(/^./, (chr) => chr.toUpperCase()),
      snakecase: input.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_'),
      kebabcase: input.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'),
      alternating: input.split('').map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      ).join(''),
      reverse: input.split('').reverse().join('')
    };

    setResults(converted);
  };

  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: t("case_converter_page.toasts.copied_title"),
      description: t("case_converter_page.toasts.copied_desc", { type })
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Type className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">{t('case_converter_page.title')}</h1>
          <p className="text-gray-600">{t('case_converter_page.subtitle')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('case_converter_page.input_title')}</CardTitle>
              <CardDescription>
                {t('case_converter_page.input_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t('case_converter_page.placeholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-48"
              />
              <Button onClick={convertCases} className="w-full">
                {t('case_converter_page.convert_button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('case_converter_page.output_title')}</CardTitle>
              <CardDescription>
                {t('case_converter_page.output_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results).map(([type, value]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{type.replace(/case$/, ' Case')}</span>
                    <Button 
                      onClick={() => copyToClipboard(value, type)} 
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border text-sm font-mono">
                    {value || t('case_converter_page.result_placeholder')}
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

export default CaseConverter;
