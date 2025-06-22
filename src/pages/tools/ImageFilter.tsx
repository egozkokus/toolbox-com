import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Download, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ImageFilter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filteredImage, setFilteredImage] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [blur, setBlur] = useState(0);
  const [imagePreview, setImagePreview] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const filters = [
    { value: "none", label: "No Filter" },
    { value: "grayscale", label: "Grayscale" },
    { value: "sepia", label: "Sepia" },
    { value: "invert", label: "Invert" },
    { value: "custom", label: "Custom (Brightness/Contrast/Blur)" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setFilteredImage("");
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({ title: "Error", description: "Please select a valid image file" });
    }
  };

  const applyFilter = () => {
    if (!selectedFile || !imagePreview) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = new (window as any).Image();

    img.onload = () => {
      if (!canvas || !ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply CSS filters
      let filterString = "";
      
      switch (selectedFilter) {
        case "grayscale":
          filterString = "grayscale(100%)";
          break;
        case "sepia":
          filterString = "sepia(100%)";
          break;
        case "invert":
          filterString = "invert(100%)";
          break;
        case "custom":
          filterString = `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`;
          break;
        default:
          filterString = "none";
      }
      
      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);
      
      const filteredDataUrl = canvas.toDataURL('image/png');
      setFilteredImage(filteredDataUrl);
      
      toast({ title: "Success!", description: "Filter applied successfully" });
    };

    img.src = imagePreview;
  };

  const downloadFiltered = () => {
    if (filteredImage) {
      const link = document.createElement('a');
      link.href = filteredImage;
      link.download = `filtered_${selectedFile?.name || 'image.png'}`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate("/categories/image-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Image Tools
        </Button>

        <div className="mb-8 text-center">
          <Image className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">Image Filter</h1>
          <p className="text-gray-600">Apply filters and effects to images</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Filter Settings</CardTitle>
              <CardDescription>
                Select an image and choose filter options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Filter Type</label>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedFilter === "custom" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Brightness: {brightness}%
                    </label>
                    <Input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contrast: {contrast}%
                    </label>
                    <Input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Blur: {blur}px
                    </label>
                    <Input
                      type="range"
                      min="0"
                      max="10"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              <Button onClick={applyFilter} disabled={!selectedFile} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Apply Filter
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filtered Result</CardTitle>
              <CardDescription>
                Preview and download filtered image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredImage ? (
                <div className="space-y-4">
                  <img 
                    src={filteredImage} 
                    alt="Filtered" 
                    className="max-w-full h-auto border rounded"
                  />
                  <Button onClick={downloadFiltered} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Filtered Image
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  Filtered image will appear here
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageFilter;
