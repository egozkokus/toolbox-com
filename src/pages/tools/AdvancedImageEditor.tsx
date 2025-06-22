import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import ImageUpload from "@/components/ImageEditor/ImageUpload";
import ImageControls from "@/components/ImageEditor/ImageControls";
import ImagePreview from "@/components/ImageEditor/ImagePreview";

const AdvancedImageEditor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string>("");
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [blur, setBlur] = useState([0]);
  const [rotation, setRotation] = useState([0]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setEditedImage("");
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        applyFilters(result);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: t('advanced_image_editor_page.toasts.error_title'),
        description: t('advanced_image_editor_page.toasts.error_desc'),
      });
    }
  };

  const applyFilters = (imageSrc: string = imagePreview) => {
    if (!imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = new (window as any).Image();

    img.onload = () => {
      if (!canvas || !ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation[0] * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
      
      ctx.filter = `
        brightness(${brightness[0]}%)
        contrast(${contrast[0]}%)
        saturate(${saturation[0]}%)
        blur(${blur[0]}px)
      `;
      
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      
      const editedDataUrl = canvas.toDataURL('image/png');
      setEditedImage(editedDataUrl);
    };

    img.src = imageSrc;
  };

  useEffect(() => {
    if (imagePreview) {
      applyFilters();
    }
  }, [brightness, contrast, saturation, blur, rotation, imagePreview]);

  const resetFilters = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setBlur([0]);
    setRotation([0]);
  };

  const downloadEdited = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.href = editedImage;
      link.download = `edited_${selectedFile?.name || 'image.png'}`;
      link.click();
      toast({
        title: t('advanced_image_editor_page.toasts.success_title'),
        description: t('advanced_image_editor_page.toasts.success_desc'),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader
          title={t('advanced_image_editor_page.title')}
          subtitle={t('advanced_image_editor_page.subtitle')}
          icon={<Palette className="h-16 w-16 text-purple-600" />}
          backPath="/categories/image-tools"
          backLabel={t('advanced_image_editor_page.back')}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <ImageUpload 
            onFileSelect={handleFileSelect}
            imagePreview={imagePreview}
          />

          <ImageControls
            brightness={brightness}
            setBrightness={setBrightness}
            contrast={contrast}
            setContrast={setContrast}
            saturation={saturation}
            setSaturation={setSaturation}
            blur={blur}
            setBlur={setBlur}
            rotation={rotation}
            setRotation={setRotation}
            onReset={resetFilters}
          />

          <ImagePreview
            editedImage={editedImage}
            onDownload={downloadEdited}
          />
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default AdvancedImageEditor;
