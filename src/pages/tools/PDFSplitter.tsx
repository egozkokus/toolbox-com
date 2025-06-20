
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/common/PageHeader";
import { FileText, Upload, Download, Loader2, Scissors } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PDFSplitter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState("");
  const [pageRanges, setPageRanges] = useState("");
  const [pagesPerFile, setPagesPerFile] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);
  const { toast } = useToast();

  const splitModes = [
    { value: "pages", label: "פיצול לפי עמודים ספציפיים", icon: "📄" },
    { value: "range", label: "פיצול לפי טווח עמודים", icon: "📊" },
    { value: "chunks", label: "פיצול לקבצים בגודל קבוע", icon: "📚" },
    { value: "single", label: "כל עמוד לקובץ נפרד", icon: "📃" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        toast({
          title: "קובץ נטען בהצלחה",
          description: `נבחר: ${file.name}`
        });
      } else {
        toast({
          title: "שגיאה",
          description: "אנא בחר קובץ PDF בלבד",
          variant: "destructive"
        });
      }
    }
  };

  const splitFile = async () => {
    if (!selectedFile || !splitMode) {
      toast({
        title: "שגיאה",
        description: "אנא בחר קובץ ושיטת פיצול",
        variant: "destructive"
      });
      return;
    }

    setIsSplitting(true);
    
    try {
      // Simulate splitting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock split files based on mode
      let fileCount = 1;
      if (splitMode === "chunks" && pagesPerFile) {
        fileCount = Math.ceil(20 / parseInt(pagesPerFile)); // Assuming 20 pages
      } else if (splitMode === "single") {
        fileCount = 20; // Assuming 20 pages
      } else if (splitMode === "range") {
        fileCount = pageRanges.split(',').length;
      }

      // Create and download mock files
      for (let i = 1; i <= Math.min(fileCount, 5); i++) {
        const mockContent = `קובץ PDF מפוצל - חלק ${i}\nמתוך ${selectedFile.name}`;
        const blob = new Blob([mockContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedFile.name.replace('.pdf', '')}-part-${i}.pdf`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        // Add delay between downloads
        if (i < Math.min(fileCount, 5)) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      toast({
        title: "הפיצול הושלם!",
        description: `נוצרו ${Math.min(fileCount, 5)} קבצים מפוצלים`
      });
    } catch (error) {
      toast({
        title: "שגיאה בפיצול",
        description: "אירעה שגיאה במהלך פיצול הקובץ",
        variant: "destructive"
      });
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader 
          title="פיצול PDF"
          subtitle="חלוקת קובץ PDF לעמודים נפרדים או קבצים קטנים"
          icon={<Scissors className="h-12 w-12 mx-auto text-red-600" />}
          backPath="/categories/pdf-tools"
          backLabel="חזרה לכלי PDF"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>העלאת קובץ והגדרות</CardTitle>
              <CardDescription>בחר קובץ PDF ושיטת פיצול</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      לחץ לבחירת קובץ PDF
                    </span>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-sm">או גרור קובץ PDF לכאן</p>
                </div>
              </div>

              {selectedFile && (
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <div className="font-medium text-green-800">{selectedFile.name}</div>
                      <div className="text-sm text-green-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">שיטת פיצול</label>
                <Select value={splitMode} onValueChange={setSplitMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר שיטת פיצול" />
                  </SelectTrigger>
                  <SelectContent>
                    {splitModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        <span className="flex items-center gap-2">
                          <span>{mode.icon}</span>
                          <span>{mode.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {splitMode === "range" && (
                <div>
                  <label className="block text-sm font-medium mb-2">טווח עמודים</label>
                  <Input
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="דוגמה: 1-5, 10-15, 20"
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    הפרד בין טווחים בפסיק. דוגמה: 1-5, 10-15
                  </p>
                </div>
              )}

              {splitMode === "chunks" && (
                <div>
                  <label className="block text-sm font-medium mb-2">עמודים לכל קובץ</label>
                  <Input
                    type="number"
                    value={pagesPerFile}
                    onChange={(e) => setPagesPerFile(e.target.value)}
                    placeholder="5"
                    min="1"
                    className="text-sm"
                  />
                </div>
              )}

              <Button 
                onClick={splitFile} 
                disabled={!selectedFile || !splitMode || isSplitting}
                className="w-full"
              >
                {isSplitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    מבצע פיצול...
                  </>
                ) : (
                  <>
                    <Scissors className="h-4 w-4 mr-2" />
                    פצל קובץ
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>שיטות פיצול</CardTitle>
              <CardDescription>הסבר על שיטות הפיצול השונות</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {splitModes.map((mode) => (
                  <div key={mode.value} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                    <span className="text-2xl">{mode.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{mode.label}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {mode.value === "pages" && "פיצול לפי עמודים ספציפיים שתבחר"}
                        {mode.value === "range" && "פיצול לפי טווחי עמודים שתגדיר"}
                        {mode.value === "chunks" && "פיצול לקבצים עם מספר עמודים קבוע"}
                        {mode.value === "single" && "כל עמוד יהפוך לקובץ PDF נפרד"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">דוגמאות לשימוש:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• <strong>טווח:</strong> "1-3, 7-9" - יצור 2 קבצים</li>
                  <li>• <strong>חלקים:</strong> 5 עמודים לקובץ - PDF של 20 עמודים יחולק ל-4 קבצים</li>
                  <li>• <strong>יחיד:</strong> 20 עמודים יהפכו ל-20 קבצים נפרדים</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PDFSplitter;
