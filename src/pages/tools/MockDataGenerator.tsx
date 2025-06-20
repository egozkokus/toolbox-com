
import { useState } from "react";
import { Database, Copy, Download } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const MockDataGenerator = () => {
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState("json");
  const [fields, setFields] = useState({
    id: true,
    name: true,
    email: true,
    phone: false,
    address: false,
    age: false,
    company: false,
    date: false
  });
  const [generatedData, setGeneratedData] = useState("");

  const names = ["אברהם כהן", "שרה לוי", "דוד יוסף", "רחל אברהם", "משה דוד", "מרים שמואל", "יעקב אהרון", "לאה יצחק"];
  const companies = ["טכנולוגיות אלפא", "חברת בטא", "סטארט-אפ גמא", "מערכות דלתא", "פתרונות זטא"];
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "company.co.il"];

  const generateRandomData = () => {
    const selectedFields = Object.entries(fields).filter(([_, selected]) => selected).map(([field, _]) => field);
    
    if (selectedFields.length === 0) {
      toast.error("יש לבחור לפחות שדה אחד");
      return;
    }

    const data = [];
    
    for (let i = 0; i < count; i++) {
      const record: any = {};
      
      selectedFields.forEach(field => {
        switch (field) {
          case 'id':
            record.id = i + 1;
            break;
          case 'name':
            record.name = names[Math.floor(Math.random() * names.length)];
            break;
          case 'email':
            const name = names[Math.floor(Math.random() * names.length)].split(' ')[0];
            const domain = domains[Math.floor(Math.random() * domains.length)];
            record.email = `${name.toLowerCase()}${Math.floor(Math.random() * 1000)}@${domain}`;
            break;
          case 'phone':
            record.phone = `05${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
            break;
          case 'address':
            record.address = `רחוב הדוגמה ${Math.floor(Math.random() * 100) + 1}, תל אביב`;
            break;
          case 'age':
            record.age = Math.floor(Math.random() * 50) + 18;
            break;
          case 'company':
            record.company = companies[Math.floor(Math.random() * companies.length)];
            break;
          case 'date':
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));
            record.date = date.toISOString().split('T')[0];
            break;
        }
      });
      
      data.push(record);
    }

    let output = "";
    switch (format) {
      case "json":
        output = JSON.stringify(data, null, 2);
        break;
      case "csv":
        const headers = selectedFields.join(",");
        const rows = data.map(record => 
          selectedFields.map(field => `"${record[field]}"`).join(",")
        );
        output = headers + "\n" + rows.join("\n");
        break;
      case "sql":
        const tableName = "mock_data";
        const columns = selectedFields.join(", ");
        const values = data.map(record => 
          `(${selectedFields.map(field => `'${record[field]}'`).join(", ")})`
        );
        output = `INSERT INTO ${tableName} (${columns}) VALUES\n${values.join(",\n")};`;
        break;
    }

    setGeneratedData(output);
    toast.success("נתוני דמה נוצרו בהצלחה!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedData);
    toast.success("הנתונים הועתקו ללוח!");
  };

  const downloadData = () => {
    const blob = new Blob([generatedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("הקובץ הורד בהצלחה!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader
          title="מחולל נתוני דמה"
          subtitle="צור נתוני דמה למטרות בדיקה ופיתוח"
          icon={<Database className="h-16 w-16 text-indigo-600" />}
          backPath="/categories/generators"
          backLabel="חזרה לגנרטורים"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>הגדרות</CardTitle>
              <CardDescription>בחר את השדות והפורמט</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="count">כמות רשומות</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="1000"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                />
              </div>

              <div>
                <Label>פורמט פלט</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">שדות לכלול</Label>
                <div className="space-y-2 mt-2">
                  {Object.entries(fields).map(([field, checked]) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={checked}
                        onCheckedChange={(value) => 
                          setFields(prev => ({ ...prev, [field]: !!value }))
                        }
                      />
                      <Label htmlFor={field} className="text-sm">
                        {field === 'id' && 'מזהה'}
                        {field === 'name' && 'שם'}
                        {field === 'email' && 'אימייל'}
                        {field === 'phone' && 'טלפון'}
                        {field === 'address' && 'כתובת'}
                        {field === 'age' && 'גיל'}
                        {field === 'company' && 'חברה'}
                        {field === 'date' && 'תאריך'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={generateRandomData} className="w-full" size="lg">
                <Database className="h-4 w-4 mr-2" />
                צור נתונים
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>נתוני דמה</CardTitle>
              <CardDescription>הנתונים שנוצרו</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedData ? (
                <div className="space-y-4">
                  <Textarea
                    value={generatedData}
                    readOnly
                    className="min-h-[400px] font-mono text-sm"
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyToClipboard} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      העתק
                    </Button>
                    <Button 
                      onClick={downloadData} 
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      הורד
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>לחץ על "צור נתונים" כדי להתחיל</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MockDataGenerator;
