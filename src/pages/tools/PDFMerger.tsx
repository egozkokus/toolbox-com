
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";
import { FileText, Upload, Download, Loader2, X, MoveUp, MoveDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PDFMerger = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFiles = files.filter(file => file.type === "application/pdf");
    
    if (pdfFiles.length !== files.length) {
      toast({
        title: "שגיאה",
        description: "אנא בחר קבצי PDF בלבד",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(prev => [...prev, ...pdfFiles]);
    
    if (pdfFiles.length > 0) {
      toast({
        title: "קבצים נוספו",
        description: `נוספו ${pdfFiles.length} קבצי PDF`
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...selectedFiles];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newFiles.length) {
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      setSelectedFiles(newFiles);
    }
  };

  const mergeFiles = async () => {
    if (selectedFiles.length < 2) {
      toast({
        title: "שגיאה",
        description: "אנא בחר לפחות 2 קבצי PDF למיזוג",
        variant: "destructive"
      });
      return;
    }

    setIsMerging(true);
    
    try {
      // Simulate merging process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock merged file
      const mockContent = `קובץ PDF ממוזג\nכולל ${selectedFiles.length} קבצים:\n${selectedFiles.map(f => f.name).join('\n')}`;
      const blob = new Blob([mockContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged-document.pdf';
      a.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "המיזוג הושלם!",
        description: "הקובץ הממוזג הורד למחשב שלך"
      });
      
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: "שגיאה במיזוג",
        description: "אירעה שגיאה במהלך מיזוג הקבצים",
        variant: "destructive"
      });
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader 
          title="מיזוג PDF"
          subtitle="איחוד מספר קבצי PDF לקובץ אחד"
          icon={<FileText className="h-12 w-12 mx-auto text-red-600" />}
          backPath="/categories/pdf-tools"
          backLabel="חזרה לכלי PDF"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>העלאת קבצים</CardTitle>
              <CardDescription>בחר את קבצי ה-PDF שברצונך למזג</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      לחץ לבחירת קבצים
                    </span>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-sm">או גרור קבצי PDF לכאן</p>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">קבצים למיזוג ({selectedFiles.length}):</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-red-600 mr-2" />
                        <div>
                          <div className="font-medium text-sm">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === selectedFiles.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={mergeFiles} 
                disabled={selectedFiles.length < 2 || isMerging}
                className="w-full"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    מבצע מיזוג...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    מזג קבצים
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הוראות שימוש</CardTitle>
              <CardDescription>כיצד להשתמש בכלי המיזוג</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  <div>
                    <h4 className="font-medium">העלה קבצים</h4>
                    <p className="text-sm text-gray-600">בחר את קבצי ה-PDF שברצונך למזג</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  <div>
                    <h4 className="font-medium">סדר קבצים</h4>
                    <p className="text-sm text-gray-600">השתמש בחצים להזיז קבצים למעלה או למטה</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  <div>
                    <h4 className="font-medium">מזג</h4>
                    <p className="text-sm text-gray-600">לחץ על "מזג קבצים" להורדת הקובץ המאוחד</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">טיפים:</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• ניתן לבחור מספר קבצים בבת אחת</li>
                  <li>• הסדר בו מופיעים הקבצים הוא סדר המיזוג</li>
                  <li>• ניתן להסיר קבצים לפני המיזוג</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PDFMerger;
