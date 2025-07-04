
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Copy, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LineSorter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sortLines = () => {
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const sorted = lines.sort((a, b) => {
      return sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    });
    setOutput(sorted.join('\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: t('line_sorter_page.toasts.copied_title'),
      description: t('line_sorter_page.toasts.copied_desc')
    });
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
          {t('line_sorter_page.back')}
        </Button>

        <div className="mb-8 text-center">
          <ArrowUpDown className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">{t('line_sorter_page.title')}</h1>
          <p className="text-gray-600">{t('line_sorter_page.subtitle')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('line_sorter_page.input_title')}</CardTitle>
              <CardDescription>
                {t('line_sorter_page.input_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t('line_sorter_page.placeholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-48"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => setSortOrder("asc")} 
                  variant={sortOrder === "asc" ? "default" : "outline"}
                  className="flex-1"
                >
                  {t('line_sorter_page.az_button')}
                </Button>
                <Button 
                  onClick={() => setSortOrder("desc")} 
                  variant={sortOrder === "desc" ? "default" : "outline"}
                  className="flex-1"
                >
                  {t('line_sorter_page.za_button')}
                </Button>
              </div>
              <Button onClick={sortLines} className="w-full">
                {t('line_sorter_page.sort_button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('line_sorter_page.sorted_title')}</CardTitle>
              <CardDescription>
                {t('line_sorter_page.sorted_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={output}
                readOnly
                className="min-h-48 bg-gray-50"
                placeholder={t('line_sorter_page.sorted_placeholder')}
              />
              {output && (
                <Button onClick={copyToClipboard} variant="outline" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  {t('line_sorter_page.copy_button')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LineSorter;
