
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const BarcodeGenerator = () => {
  const [text, setText] = useState("");
  const [barcodeType, setBarcodeType] = useState("code128");
  const [barcodeUrl, setBarcodeUrl] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const barcodeTypes = [
    { value: "code128", label: "Code 128" },
    { value: "ean13", label: "EAN-13" },
    { value: "ean8", label: "EAN-8" },
    { value: "upc", label: "UPC-A" },
    { value: "code39", label: "Code 39" },
    { value: "codabar", label: "Codabar" }
  ];

  const generateBarcode = () => {
    if (text.trim()) {
      // Using a free barcode API service
      const barcodeApiUrl = `https://bwipjs-api.metafloor.com/?bcid=${barcodeType}&text=${encodeURIComponent(text)}&scale=3&includetext`;
      setBarcodeUrl(barcodeApiUrl);
      toast({
        title: t('barcode_generator_page.toasts.success_title'),
        description: t('barcode_generator_page.toasts.success_desc')
      });
    } else {
      toast({
        title: t('barcode_generator_page.toasts.error_title'),
        description: t('barcode_generator_page.toasts.error_desc')
      });
    }
  };

  const downloadBarcode = () => {
    if (barcodeUrl) {
      const link = document.createElement('a');
      link.href = barcodeUrl;
      link.download = `barcode_${barcodeType}.png`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <Button 
          onClick={() => navigate("/categories/image-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('barcode_generator_page.back')}
        </Button>

        <div className="mb-8 text-center">
          <Hash className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">{t('barcode_generator_page.title')}</h1>
          <p className="text-gray-600">{t('barcode_generator_page.subtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('barcode_generator_page.input_title')}</CardTitle>
              <CardDescription>
                {t('barcode_generator_page.input_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('barcode_generator_page.text_label')}</label>
                <Input
                  type="text"
                  placeholder={t('barcode_generator_page.text_ph')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('barcode_generator_page.type_label')}</label>
                <Select value={barcodeType} onValueChange={setBarcodeType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('barcode_generator_page.type_ph')} />
                  </SelectTrigger>
                  <SelectContent>
                    {barcodeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateBarcode} className="w-full">
                {t('barcode_generator_page.generate_button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('barcode_generator_page.output_title')}</CardTitle>
              <CardDescription>
                {t('barcode_generator_page.output_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {barcodeUrl ? (
                <div className="space-y-4">
                  <img 
                    src={barcodeUrl} 
                    alt="Generated Barcode" 
                    className="mx-auto border rounded bg-white p-4"
                    onError={() =>
                      toast({
                        title: t('barcode_generator_page.toasts.error_title'),
                        description: t('barcode_generator_page.toasts.fail_desc')
                      })
                    }
                  />
                  <Button onClick={downloadBarcode} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {t('barcode_generator_page.download_button')}
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  {t('barcode_generator_page.placeholder')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;
