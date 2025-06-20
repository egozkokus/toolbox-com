
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# כותרת ראשית

## כותרת משנית

זהו **טקסט מודגש** ו*טקסט נטוי*.

### רשימה:
- פריט 1
- פריט 2
- פריט 3

### רשימה ממוספרת:
1. פריט ראשון
2. פריט שני
3. פריט שלישי

### קישור
[Google](https://www.google.com)

### קוד
\`\`\`javascript
console.log('Hello World!');
\`\`\`
`);

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simple markdown to HTML converter
  const markdownToHtml = (text: string) => {
    return text
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^\- (.*)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*)/gm, '<li>$1. $2</li>')
      .replace(/\n/g, '<br>');
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.md';
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "הצלחה!", description: "קובץ Markdown הורד בהצלחה" });
  };

  const downloadHtml = () => {
    const html = markdownToHtml(markdown);
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 4px; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 2px; }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.html';
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "הצלחה!", description: "קובץ HTML הורד בהצלחה" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          onClick={() => navigate("/categories/text-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי טקסט
        </Button>

        <div className="mb-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">עורך Markdown</h1>
          <p className="text-gray-600">ערוך וצפה ב-Markdown בזמן אמת</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>עורך Markdown</CardTitle>
                <CardDescription>כתוב Markdown וצפה בתוצאה</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'edit' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('edit')}
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  עריכה
                </Button>
                <Button
                  variant={activeTab === 'preview' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('preview')}
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  תצוגה מקדימה
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {activeTab === 'edit' ? (
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="כתוב כאן Markdown..."
                  className="min-h-96 font-mono"
                />
              ) : (
                <div 
                  className="min-h-96 p-4 border rounded prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
                />
              )}
              
              <div className="flex gap-4">
                <Button onClick={downloadMarkdown} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  הורד MD
                </Button>
                <Button onClick={downloadHtml} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  הורד HTML
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarkdownEditor;
