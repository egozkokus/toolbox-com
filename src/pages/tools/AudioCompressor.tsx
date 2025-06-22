import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Volume2, Gauge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";

const AudioCompressor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState([50]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      setCompressedFile(null);
      setCompressedSize(0);
    } else {
      toast({
        title: t('audio_compressor_page.toasts.error_title'),
        description: t('audio_compressor_page.toasts.invalid_file')
      });
    }
  };

  const compressAudio = async () => {
    if (!selectedFile) {
      toast({
        title: t('audio_compressor_page.toasts.error_title'),
        description: t('audio_compressor_page.toasts.no_file')
      });
      return;
    }

    setIsCompressing(true);
    toast({
      title: t('audio_compressor_page.toasts.processing_title'),
      description: t('audio_compressor_page.toasts.processing_desc')
    });

    try {
      // Simulate compression process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Calculate compressed size based on compression level
      const reductionFactor = compressionLevel[0] / 100;
      const newSize = originalSize * (1 - reductionFactor * 0.8);
      setCompressedSize(newSize);
      
      const reader = new FileReader();
      reader.onload = () => {
        setCompressedFile(reader.result as string);
        setIsCompressing(false);
        toast({
          title: t('audio_compressor_page.toasts.success_title'),
          description: t('audio_compressor_page.toasts.success_desc', {
            percent: (((originalSize - newSize) / originalSize) * 100).toFixed(1)
          })
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setIsCompressing(false);
      toast({
        title: t('audio_compressor_page.toasts.error_title'),
        description: t('audio_compressor_page.toasts.compress_error')
      });
    }
  };

  const downloadCompressed = () => {
    if (compressedFile && selectedFile) {
      const link = document.createElement('a');
      link.href = compressedFile;
      link.download = `compressed_${selectedFile.name}`;
      link.click();
      toast({
        title: t('audio_compressor_page.toasts.success_title'),
        description: t('audio_compressor_page.toasts.downloaded')
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionQuality = (level: number) => {
    if (level < 30) return { label: t('audio_compressor_page.quality.high'), color: 'text-green-600' };
    if (level < 70) return { label: t('audio_compressor_page.quality.medium'), color: 'text-yellow-600' };
    return { label: t('audio_compressor_page.quality.max'), color: 'text-red-600' };
  };

  const quality = getCompressionQuality(compressionLevel[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title={t('audio_compressor_page.title')}
          subtitle={t('audio_compressor_page.subtitle')}
          icon={<Volume2 className="h-16 w-16 text-green-600" />}
          backPath="/categories/audio-tools"
          backLabel={t('audio_compressor_page.back')}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
          <CardTitle>{t('audio_compressor_page.upload_title')}</CardTitle>
          <CardDescription>{t('audio_compressor_page.upload_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />

              {selectedFile && (
                <div className="p-3 bg-gray-50 rounded border">
                  <div className="flex items-center">
                    <Volume2 className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t('audio_compressor_page.original_size')}: {formatFileSize(originalSize)}
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">{t('audio_compressor_page.level_label')}</label>
                  <span className={`text-sm font-medium ${quality.color}`}>
                    {quality.label}
                  </span>
                </div>
                <Slider
                  value={compressionLevel}
                  onValueChange={setCompressionLevel}
                  max={90}
                  min={10}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{t('audio_compressor_page.quality.high')}</span>
                  <span>{compressionLevel[0]}%</span>
                  <span>{t('audio_compressor_page.quality.max')}</span>
                </div>
              </div>

              <Button 
                onClick={compressAudio} 
                disabled={!selectedFile || isCompressing}
                className="w-full"
              >
                <Gauge className="h-4 w-4 mr-2" />
                {isCompressing ? t('audio_compressor_page.compressing') : t('audio_compressor_page.compress_button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('audio_compressor_page.results_title')}</CardTitle>
              <CardDescription>{t('audio_compressor_page.results_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {compressedFile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="text-sm text-blue-600 font-medium">{t('audio_compressor_page.original_size')}</div>
                      <div className="text-lg font-bold">{formatFileSize(originalSize)}</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <div className="text-sm text-green-600 font-medium">{t('audio_compressor_page.compressed_size')}</div>
                      <div className="text-lg font-bold">{formatFileSize(compressedSize)}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-sm text-gray-600">{t('audio_compressor_page.ratio')}</div>
                    <div className="text-2xl font-bold text-green-600">
                      {(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('audio_compressor_page.ratio')}: {(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <Button onClick={downloadCompressed} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {t('audio_compressor_page.download_button')}
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border border-dashed rounded">
                  <Gauge className="h-12 w-12 mb-2" />
                  <div>{t('audio_compressor_page.placeholder')}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('audio_compressor_page.guide_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {t('audio_compressor_page.guide_items', { returnObjects: true })?.map((item: string, idx: number) => (
                <div key={idx} className={`p-3 rounded ${idx === 0 ? 'bg-green-50' : idx === 1 ? 'bg-yellow-50' : 'bg-red-50'}`}> 
                  <div className={`font-medium ${idx === 0 ? 'text-green-800' : idx === 1 ? 'text-yellow-800' : 'text-red-800'}`}>{item}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioCompressor;
