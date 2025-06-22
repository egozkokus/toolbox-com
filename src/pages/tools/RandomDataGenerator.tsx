
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shuffle, Copy, Download, Dice6 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const RandomDataGenerator = () => {
  const [dataType, setDataType] = useState("names");
  const [count, setCount] = useState(10);
  const [generatedData, setGeneratedData] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const dataTypes = {
    names: {
      label: "שמות",
      generator: () => {
        const firstNames = ["אמיר", "נועה", "דוד", "שרה", "יוסף", "רחל", "אברהם", "מרים", "משה", "לאה"];
        const lastNames = ["כהן", "לוי", "ישראלי", "מזרחי", "אשכנזי", "ספרדי", "גולדברג", "רוזנברג", "שטיין", "פרידמן"];
        return firstNames[Math.floor(Math.random() * firstNames.length)] + " " + 
               lastNames[Math.floor(Math.random() * lastNames.length)];
      }
    },
    emails: {
      label: "אימיילים",
      generator: () => {
        const domains = ["gmail.com", "yahoo.com", "hotmail.com", "walla.co.il", "012.net.il"];
        const name = Math.random().toString(36).substring(2, 10);
        return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
      }
    },
    phones: {
      label: "טלפונים",
      generator: () => {
        const prefix = ["050", "052", "053", "054", "055", "058"];
        const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
        return `${prefix[Math.floor(Math.random() * prefix.length)]}-${number}`;
      }
    },
    addresses: {
      label: "כתובות",
      generator: () => {
        const streets = ["הרצל", "בן גוריון", "דיזנגוף", "רוטשילד", "אלנבי", "יפו", "קינג ג'ורג'", "בגין"];
        const cities = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "פתח תקווה", "נתניה", "רחובות", "הרצליה"];
        const number = Math.floor(Math.random() * 200) + 1;
        return `${streets[Math.floor(Math.random() * streets.length)]} ${number}, ${cities[Math.floor(Math.random() * cities.length)]}`;
      }
    },
    lorem: {
      label: "טקסט לורם",
      generator: () => {
        const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"];
        const length = Math.floor(Math.random() * 10) + 5;
        return Array.from({length}, () => words[Math.floor(Math.random() * words.length)]).join(' ') + '.';
      }
    },
    numbers: {
      label: "מספרים",
      generator: () => {
        return Math.floor(Math.random() * 1000000).toString();
      }
    },
    uuids: {
      label: "UUIDs",
      generator: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    },
    passwords: {
      label: "סיסמאות",
      generator: () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        const length = Math.floor(Math.random() * 8) + 8;
        return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      }
    }
  };

  const generateData = () => {
    const generator = dataTypes[dataType as keyof typeof dataTypes].generator;
    const data = Array.from({length: count}, () => generator());
    setGeneratedData(data);
    
    toast({
      title: "הושלם!",
      description: `נוצרו ${count} פריטים של ${dataTypes[dataType as keyof typeof dataTypes].label}`
    });
  };

  const copyAllData = () => {
    const text = generatedData.join('\n');
    navigator.clipboard.writeText(text);
    toast({
      title: "הועתק!",
      description: "כל הנתונים הועתקו ללוח"
    });
  };

  const downloadData = () => {
    const text = generatedData.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `random-${dataType}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "הורד בהצלחה!",
      description: "הקובץ נשמר"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          onClick={() => navigate("/categories/generators")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לגנרטורים
        </Button>

        <div className="mb-8 text-center">
          <Dice6 className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h1 className="text-4xl font-bold mb-2">מחולל נתונים אקראיים</h1>
          <p className="text-gray-600">צור נתונים אקראיים לבדיקות ופיתוח</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות</CardTitle>
              <CardDescription>בחר סוג נתונים וכמות</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">סוג נתונים</label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(dataTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">כמות</label>
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="1000"
                />
              </div>

              <Button onClick={generateData} className="w-full">
                <Shuffle className="h-4 w-4 mr-2" />
                צור נתונים
              </Button>

              {generatedData.length > 0 && (
                <div className="flex space-x-2">
                  <Button onClick={copyAllData} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    העתק הכל
                  </Button>
                  <Button onClick={downloadData} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    הורד
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>נתונים שנוצרו</CardTitle>
              <CardDescription>
                {generatedData.length > 0 && (
                  <Badge variant="secondary">{generatedData.length} פריטים</Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedData.length > 0 ? (
                <Textarea
                  value={generatedData.join('\n')}
                  readOnly
                  className="min-h-[400px] font-mono text-sm"
                />
              ) : (
                <div className="h-[400px] flex items-center justify-center text-gray-400 border border-dashed rounded">
                  הנתונים שיווצרו יופיעו כאן
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RandomDataGenerator;
