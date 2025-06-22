import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, FileAudio, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";

const AudioConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const audioFormats = [
    {
      value: 'mp3',
      label: t('audio_converter_page.formats.mp3.label'),
      description: t('audio_converter_page.formats.mp3.desc')
    },
    {
      value: 'wav',
      label: t('audio_converter_page.formats.wav.label'),
      description: t('audio_converter_page.formats.wav.desc')
    },
    {
      value: 'flac',
      label: t('audio_converter_page.formats.flac.label'),
      description: t('audio_converter_page.formats.flac.desc')
    },
    {
      value: 'aac',
      label: t('audio_converter_page.formats.aac.label'),
      description: t('audio_converter_page.formats.aac.desc')
    },
    {
      value: 'ogg',
      label: t('audio_converter_page.formats.ogg.label'),
      description: t('audio_converter_page.formats.ogg.desc')
    },
    {
      value: 'm4a',
      label: t('audio_converter_page.formats.m4a.label'),
      description: t('audio_converter_page.formats.m4a.desc')
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setConvertedFile(null);
    } else {
      toast({
        title: t('audio_converter_page.toasts.error_title'),
        description: t('audio_converter_page.toasts.invalid_file')
      });
    }
  };

  const convertAudio = async () => {
    if (!selectedFile) {
      toast({
        title: t('audio_converter_page.toasts.error_title'),
        description: t('audio_converter_page.toasts.no_file')
      });
      return;
    }

    setIsConverting(true);
    toast({
      title: t('audio_converter_page.toasts.processing_title'),
      description: t('audio_converter_page.converting', { format: outputFormat.toUpperCase() })
    });

    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create converted file URL (simulation)
      const reader = new FileReader();
      reader.onload = () => {
        setConvertedFile(reader.result as string);
        setIsConverting(false);
        toast({
          title: t('audio_converter_page.toasts.success_title'),
          description: t('audio_converter_page.toasts.success_desc')
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setIsConverting(false);
      toast({
        title: t('audio_converter_page.toasts.error_title'),
        description: t('audio_converter_page.toasts.convert_error')
      });
    }
  };

  const downloadConverted = () => {
    if (convertedFile && selectedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      link.download = `${selectedFile.name.split('.')[0]}.${outputFormat}`;
      link.click();
      toast({
        title: t('audio_converter_page.toasts.success_title'),
        description: t('audio_converter_page.toasts.downloaded')
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title={t('audio_converter_page.title')}
          subtitle={t('audio_converter_page.subtitle')}
          icon={<FileAudio className="h-16 w-16 text-blue-600" />}
          backPath="/categories/audio-tools"
          backLabel={t('audio_converter_page.back')}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('audio_converter_page.source_title')}</CardTitle>
              <CardDescription>{t('audio_converter_page.source_desc')}</CardDescription>
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
                    <FileAudio className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{t('audio_converter_page.format_label')}</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audioFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-gray-500">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={convertAudio} 
                disabled={!selectedFile || isConverting}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isConverting ? t('audio_converter_page.converting') : t('audio_converter_page.convert_button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('audio_converter_page.converted_title')}</CardTitle>
              <CardDescription>{t('audio_converter_page.converted_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {convertedFile ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {selectedFile?.name.split('.')[0]}.{outputFormat}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">{t('audio_converter_page.toasts.success_desc')}</div>
                  </div>
                  
                  <Button onClick={downloadConverted} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {t('audio_converter_page.download_button')}
                  </Button>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-gray-400 border border-dashed rounded">
                  <FileAudio className="h-8 w-8 mb-2" />
                  <div className="text-sm">{t('audio_converter_page.placeholder')}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('audio_converter_page.formats_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {audioFormats.map((format) => (
                <div key={format.value} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs text-gray-600">{format.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioConverter;
