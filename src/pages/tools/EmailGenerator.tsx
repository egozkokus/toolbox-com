
import { useState } from "react";
import { Mail, Copy, RefreshCw, Settings } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const EmailGenerator = () => {
  const [domain, setDomain] = useState("gmail.com");
  const [count, setCount] = useState(10);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [generatedEmails, setGeneratedEmails] = useState<string[]>([]);

  const commonDomains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
    "walla.co.il", "012.net.il", "nana.co.il", "bezeqint.net"
  ];

  const generateEmails = () => {
    const emails: string[] = [];
    const firstNames = [
      "יוסי", "שרה", "דוד", "מרים", "אמיר", "נועה", "משה", "רחל", "אברהם", "לאה",
      "daniel", "sarah", "david", "mary", "john", "anna", "mike", "lisa", "alex", "emma"
    ];
    
    const lastNames = [
      "כהן", "לוי", "ישראלי", "מזרחי", "אשכנזי", "cohen", "levi", "israeli", "smith", "johnson"
    ];

    const currentDomain = customDomain || domain;

    for (let i = 0; i < count; i++) {
      let username = "";
      
      // Generate username
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const patterns = [
        `${firstName}.${lastName}`,
        `${firstName}${lastName}`,
        `${firstName}_${lastName}`,
        `${firstName}${lastName.charAt(0)}`,
        firstName
      ];
      
      username = patterns[Math.floor(Math.random() * patterns.length)];
      
      // Add numbers if enabled
      if (includeNumbers) {
        const randomNum = Math.floor(Math.random() * 999);
        username += randomNum;
      }
      
      // Add symbols if enabled
      if (includeSymbols) {
        const symbols = [".", "_", "-"];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        username += symbol + Math.floor(Math.random() * 99);
      }
      
      const email = `${username.toLowerCase()}@${currentDomain}`;
      emails.push(email);
    }

    setGeneratedEmails(emails);
    toast.success("כתובות אימייל נוצרו בהצלחה!");
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("האימייל הועתק ללוח!");
  };

  const copyAllEmails = () => {
    const allEmails = generatedEmails.join('\n');
    navigator.clipboard.writeText(allEmails);
    toast.success("כל האימיילים הועתקו ללוח!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title="מחולל כתובות אימייל"
          subtitle="צור כתובות אימייל אקראיות לבדיקות ופיתוח"
          icon={<Mail className="h-16 w-16 text-indigo-600" />}
          backPath="/categories/generators"
          backLabel="חזרה לגנרטורים"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                הגדרות אימייל
              </CardTitle>
              <CardDescription>קבע את הפרמטרים ליצירת האימיילים</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="domain">דומיין</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commonDomains.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customDomain">דומיין מותאם אישית (אופציונלי)</Label>
                <Input
                  id="customDomain"
                  placeholder="example.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="count">כמות אימיילים</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                  />
                  <Label htmlFor="numbers">כלול מספרים</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                  />
                  <Label htmlFor="symbols">כלול סמלים</Label>
                </div>
              </div>

              <Button onClick={generateEmails} className="w-full" size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                צור אימיילים
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>אימיילים שנוצרו</CardTitle>
              <CardDescription>רשימת האימיילים האחרונים שנוצרו</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedEmails.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {generatedEmails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <code className="text-sm font-mono text-gray-700 flex-1 break-all">
                          {email}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyEmail(email)}
                          className="ml-2 flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyAllEmails} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      העתק הכל
                    </Button>
                    <Button 
                      onClick={generateEmails} 
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      צור עוד
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>לחץ על "צור אימיילים" כדי להתחיל</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailGenerator;
