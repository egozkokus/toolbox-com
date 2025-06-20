
import { useState } from "react";
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
      toast({ title: "Success!", description: "Barcode generated successfully" });
    } else {
      toast({ title: "Error", description: "Please enter text to generate barcode" });
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
          Back to Image Tools
        </Button>

        <div className="mb-8 text-center">
          <Hash className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">Barcode Generator</h1>
          <p className="text-gray-600">Generate barcodes from text or numbers</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input & Settings</CardTitle>
              <CardDescription>
                Enter text and select barcode type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text or Numbers</label>
                <Input
                  type="text"
                  placeholder="Enter text or numbers..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Barcode Type</label>
                <Select value={barcodeType} onValueChange={setBarcodeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select barcode type" />
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
                Generate Barcode
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Barcode</CardTitle>
              <CardDescription>
                Your barcode will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {barcodeUrl ? (
                <div className="space-y-4">
                  <img 
                    src={barcodeUrl} 
                    alt="Generated Barcode" 
                    className="mx-auto border rounded bg-white p-4"
                    onError={() => toast({ title: "Error", description: "Failed to generate barcode. Check your input." })}
                  />
                  <Button onClick={downloadBarcode} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Barcode
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  Barcode will appear here
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
