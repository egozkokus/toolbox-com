import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Download, Image as ImageIcon, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setOriginalImage(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setProcessedImageUrl(""); // Reset previous result
    } else {
      setOriginalImage(null);
      setOriginalImageUrl("");
      setProcessedImageUrl("");
      toast({
        title: t('background_remover_page.toasts.invalid_title'),
        description: t('background_remover_page.toasts.invalid_desc'),
        variant: 'destructive',
      });
    }
  };

  const removeBackground = useCallback(async () => {
    if (!originalImage) {
      toast({
        title: t('background_remover_page.toasts.no_image_title'),
        description: t('background_remover_page.toasts.no_image_desc'),
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: t('background_remover_page.toasts.processing_title'),
      description: t('background_remover_page.toasts.processing_desc'),
    });

    try {
      const blob = await removeBackground(originalImage, {
        // Optional: Add configuration here
        // publicPath: '/assets/imgly/', // If you self-host the model files
        progress: (key, current, total) => {
          console.log(`Downloading ${key}: ${current} of ${total}`);
        },
      });
      const url = URL.createObjectURL(blob);
      setProcessedImageUrl(url);
      toast({
        title: t('background_remover_page.toasts.success_title'),
        description: t('background_remover_page.toasts.success_desc'),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t('background_remover_page.toasts.error_title'),
        description: t('background_remover_page.toasts.error_desc'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage, toast]);

  const downloadImage = () => {
    if (!processedImageUrl || !originalImage) return;
    const link = document.createElement("a");
    link.href = processedImageUrl;
    link.download = `no-bg-${originalImage.name.split('.')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button onClick={() => navigate("/categories/image-tools")} variant="outline" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('background_remover_page.back')}
        </Button>

        <div className="mb-8 text-center">
          <Wand2 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">{t('background_remover_page.title')}</h1>
          <p className="text-gray-600">{t('background_remover_page.subtitle')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('background_remover_page.upload_card.title')}</CardTitle>
              <CardDescription>{t('background_remover_page.upload_card.desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">{t('background_remover_page.upload_card.label')}</Label>
              <Input id="image-upload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
              {originalImageUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">{t('background_remover_page.upload_card.preview_label')}</h3>
                  <img src={originalImageUrl} alt="Original" className="max-w-full rounded-lg border bg-gray-100" />
                </div>
              )}
              <Button onClick={removeBackground} disabled={!originalImage || isProcessing} className="w-full mt-4">
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? t('background_remover_page.upload_card.processing') : t('background_remover_page.upload_card.button')}
              </Button>
            </CardContent>
          </Card>

          {/* Output Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('background_remover_page.result_card.title')}</CardTitle>
              <CardDescription>{t('background_remover_page.result_card.desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-transparent bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px] rounded-lg overflow-hidden flex items-center justify-center">
                {processedImageUrl ? (
                  <img src={processedImageUrl} alt="Processed" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-center text-gray-400 p-4">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>{t('background_remover_page.result_card.placeholder')}</p>
                  </div>
                )}
              </div>
              <Button onClick={downloadImage} disabled={!processedImageUrl} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {t('background_remover_page.result_card.download')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-6">
          <Wand2 className="h-4 w-4" />
          <AlertTitle>{t('background_remover_page.alert.title')}</AlertTitle>
          <AlertDescription>
            {t('background_remover_page.alert.desc')}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default BackgroundRemover;