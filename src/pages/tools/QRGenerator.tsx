
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const generateQR = () => {
    if (text.trim()) {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
      setQrUrl(qrApiUrl);
      toast({ 
        title: t('common.success'), 
        description: t("qr_generator_page.toasts.success_desc") 
      });
    } else {
      toast({ 
        title: t('common.error'), 
        description: t("qr_generator_page.toasts.empty_input") 
      });
    }
  };

  const downloadQR = () => {
    if (qrUrl) {
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = 'qrcode.png';
      link.click();
      toast({ 
        title: t('common.success'), 
        description: t("qr_generator_page.toasts.downloaded") 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate("/")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>

        <div className="mb-8 text-center">
          <QrCode className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('qr_generator_page.title')}</h1>
          <p className="text-gray-600">{t('qr_generator_page.subtitle')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('qr_generator_page.input_title')}</CardTitle>
              <CardDescription>
                {t('qr_generator_page.input_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">{t('qr_generator_page.text_label')}</Label>
                <Textarea
                  id="text"
                  placeholder={t('qr_generator_page.text_placeholder')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              <Button onClick={generateQR} className="w-full" disabled={!text.trim()}>
                <QrCode className="h-4 w-4 mr-2" />
                {t('qr_generator_page.generate_button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('qr_generator_page.generated_title')}</CardTitle>
              <CardDescription>
                {t('qr_generator_page.generated_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {qrUrl ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img 
                      src={qrUrl} 
                      alt="QR Code" 
                      className="mx-auto"
                      onError={() => {
                        toast({ 
                          title: t('common.error'), 
                          description: t("qr_generator_page.toasts.error_desc") 
                        });
                        setQrUrl("");
                      }}
                    />
                  </div>
                  <Button onClick={downloadQR} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {t('qr_generator_page.download_button')}
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  {t('qr_generator_page.placeholder')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
