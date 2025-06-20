
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({
    global: false,
    ignoreCase: false,
    multiline: false
  });
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const testRegex = () => {
    if (!pattern.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הכנס ביטוי רגולרי"
      });
      return;
    }

    try {
      const flagString = 
        (flags.global ? 'g' : '') +
        (flags.ignoreCase ? 'i' : '') +
        (flags.multiline ? 'm' : '');
      
      const regex = new RegExp(pattern, flagString);
      setIsValid(true);
      setError("");

      if (flags.global) {
        const allMatches = Array.from(testString.matchAll(regex));
        setMatches(allMatches);
      } else {
        const match = testString.match(regex);
        setMatches(match ? [match] : []);
      }

      toast({
        title: "הושלם!",
        description: `נמצאו ${flags.global ? Array.from(testString.matchAll(regex)).length : (testString.match(regex) ? 1 : 0)} התאמות`
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "שגיאה בביטוי הרגולרי");
      setMatches([]);
      toast({
        title: "שגיאה",
        description: "ביטוי רגולרי לא תקין"
      });
    }
  };

  const commonPatterns = [
    { name: "אימייל", pattern: "[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}" },
    { name: "טלפון", pattern: "\\d{3}-\\d{3}-\\d{4}" },
    { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" },
    { name: "מספר", pattern: "\\d+" },
    { name: "מילה", pattern: "\\b\\w+\\b" },
    { name: "תאריך", pattern: "\\d{1,2}\\/\\d{1,2}\\/\\d{4}" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          onClick={() => navigate("/categories/developer-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי מפתחים
        </Button>

        <div className="mb-8 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">בודק ביטויים רגולריים</h1>
          <p className="text-gray-600">בדוק ופתח ביטויים רגולריים בקלות</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>ביטוי רגולרי</CardTitle>
              <CardDescription>הכנס את הביטוי הרגולרי שלך</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="הכנס ביטוי רגולרי כאן..."
                  className={`font-mono ${!isValid ? 'border-red-500' : ''}`}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="global"
                    checked={flags.global}
                    onCheckedChange={(checked) => setFlags(prev => ({ ...prev, global: !!checked }))}
                  />
                  <label htmlFor="global" className="text-sm">Global (g)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ignoreCase"
                    checked={flags.ignoreCase}
                    onCheckedChange={(checked) => setFlags(prev => ({ ...prev, ignoreCase: !!checked }))}
                  />
                  <label htmlFor="ignoreCase" className="text-sm">Ignore Case (i)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiline"
                    checked={flags.multiline}
                    onCheckedChange={(checked) => setFlags(prev => ({ ...prev, multiline: !!checked }))}
                  />
                  <label htmlFor="multiline" className="text-sm">Multiline (m)</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">טקסט לבדיקה</label>
                <Textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="הכנס טקסט לבדיקה..."
                  className="min-h-[150px]"
                />
              </div>

              <Button onClick={testRegex} className="w-full">
                <TestTube className="h-4 w-4 mr-2" />
                בדוק ביטוי רגולרי
              </Button>

              {matches.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">התאמות שנמצאו: {matches.length}</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {matches.map((match, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded border">
                        <div className="font-mono text-sm">
                          <Badge variant="secondary" className="mr-2">#{index + 1}</Badge>
                          "{match[0]}"
                        </div>
                        {match.index !== undefined && (
                          <div className="text-xs text-gray-600 mt-1">
                            מיקום: {match.index}-{match.index + match[0].length}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>דוגמאות נפוצות</CardTitle>
              <CardDescription>לחץ להעתקה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {commonPatterns.map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setPattern(item.pattern)}
                >
                  <div className="text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{item.pattern}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
