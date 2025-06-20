
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const generateQR = () => {
    if (text.trim()) {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
      setQrUrl(qrApiUrl);
      toast({ 
        title: t('common.success'), 
        description: "QR code generated successfully!" 
      });
    } else {
      toast({ 
        title: t('common.error'), 
        description: "Please enter text or URL" 
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
        description: "QR code downloaded successfully!" 
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">QR Code Generator</h1>
          <p className="text-gray-600">Create QR codes for any text or URL</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                Enter text, URL, or any content to generate QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Text or URL</Label>
                <Textarea
                  id="text"
                  placeholder="Enter your text or URL here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              <Button onClick={generateQR} className="w-full" disabled={!text.trim()}>
                <QrCode className="h-4 w-4 mr-2" />
                {t('common.generate')} QR Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated QR Code</CardTitle>
              <CardDescription>
                Your QR code will appear here
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
                          description: "Failed to generate QR code" 
                        });
                        setQrUrl("");
                      }}
                    />
                  </div>
                  <Button onClick={downloadQR} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {t('common.download')} QR Code
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  QR code will appear here
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
