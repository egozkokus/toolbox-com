
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Copy, Download, RotateCcw, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";

const MarkdownConverter = () => {
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

> זהו ציטוט

| עמודה 1 | עמודה 2 |
|---------|---------|
| תא 1    | תא 2    |
| תא 3    | תא 4    |`);

  const [html, setHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const convertToHTML = () => {
    try {
      let htmlOutput = markdown
        // Headers
        .replace(/^### (.*)/gm, '<h3>$1</h3>')
        .replace(/^## (.*)/gm, '<h2>$1</h2>')
        .replace(/^# (.*)/gm, '<h1>$1</h1>')
        
        // Bold and Italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Code blocks
        .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        
        // Blockquotes
        .replace(/^> (.*)/gm, '<blockquote>$1</blockquote>')
        
        // Lists
        .replace(/^\- (.*)/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.*)/gm, '<li>$1. $2</li>')
        
        // Tables (basic)
        .replace(/\|(.+)\|/g, (match, content) => {
          const cells = content.split('|').map((cell: string) => cell.trim());
          return '<tr>' + cells.map((cell: string) => `<td>${cell}</td>`).join('') + '</tr>';
        })
        
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

      // Wrap in paragraphs
      htmlOutput = '<p>' + htmlOutput + '</p>';
      
      // Clean up empty paragraphs and fix structure
      htmlOutput = htmlOutput
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, '$1')
        .replace(/<p>(<pre>.*?<\/pre>)<\/p>/gs, '$1')
        .replace(/<p>(<blockquote>.*?<\/blockquote>)<\/p>/g, '$1')
        .replace(/<p>(<tr>.*?<\/tr>)<\/p>/g, '<table>$1</table>')
        .replace(/<p>(<li>.*?<\/li>)<\/p>/g, '<ul>$1</ul>')
        .replace(/<\/li><br><li>/g, '</li><li>');

      setHtml(htmlOutput);
      toast({ title: "הצלחה!", description: "Markdown הומר ל-HTML בהצלחה" });
    } catch (err) {
      toast({ title: "שגיאה", description: "שגיאה בהמרת Markdown ל-HTML" });
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    toast({ title: "הועתק!", description: "HTML הועתק ללוח" });
  };

  const downloadHTML = () => {
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Converted from Markdown</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6;
        }
        pre { 
            background: #f4f4f4; 
            padding: 10px; 
            border-radius: 4px; 
            overflow-x: auto;
        }
        code { 
            background: #f4f4f4; 
            padding: 2px 4px; 
            border-radius: 2px; 
        }
        blockquote {
            border-left: 4px solid #ddd;
            margin: 0;
            padding-left: 16px;
            color: #666;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
        }
        ul, ol {
            padding-right: 20px;
        }
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
    link.download = 'converted.html';
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "הורד!", description: "קובץ HTML הורד בהצלחה" });
  };

  const resetFields = () => {
    setMarkdown("");
    setHtml("");
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader
          title="המרת Markdown ל-HTML"
          subtitle="המר טקסט Markdown לקוד HTML מעוצב"
          icon={<FileText className="h-16 w-16 text-indigo-600" />}
          backPath="/categories/developer-tools"
          backLabel="חזרה לכלי מפתחים"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Markdown</CardTitle>
              <CardDescription>הדבק כאן את טקסט ה-Markdown שלך</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="הדבק כאן Markdown..."
                className="min-h-96 font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={convertToHTML} className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  המר ל-HTML
                </Button>
                <Button onClick={resetFields} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HTML
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? "קוד" : "תצוגה"}
                </Button>
              </CardTitle>
              <CardDescription>
                {showPreview ? "תצוגה מקדימה של התוצאה" : "קוד HTML שנוצר"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showPreview ? (
                <div 
                  className="min-h-96 p-4 border rounded bg-white prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <Textarea
                  value={html}
                  readOnly
                  placeholder="HTML יופיע כאן..."
                  className="min-h-96 font-mono text-sm bg-gray-50"
                />
              )}
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" disabled={!html}>
                  <Copy className="h-4 w-4 mr-2" />
                  העתק HTML
                </Button>
                <Button onClick={downloadHTML} variant="outline" disabled={!html}>
                  <Download className="h-4 w-4 mr-2" />
                  הורד HTML
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarkdownConverter;
