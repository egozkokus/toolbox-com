
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TextDiff = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [differences, setDifferences] = useState<string[]>([]);
  const navigate = useNavigate();

  const compareTexts = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const diffs: string[] = [];

    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        diffs.push(`Line ${i + 1}:`);
        if (line1) diffs.push(`- ${line1}`);
        if (line2) diffs.push(`+ ${line2}`);
        diffs.push('');
      }
    }

    setDifferences(diffs);
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
          Back to Text Tools
        </Button>

        <div className="mb-8 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">Text Diff</h1>
          <p className="text-gray-600">Compare two texts and find differences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Text 1</CardTitle>
              <CardDescription>
                Enter the first text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter first text here..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="min-h-64"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text 2</CardTitle>
              <CardDescription>
                Enter the second text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter second text here..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="min-h-64"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Differences</CardTitle>
              <CardDescription>
                Comparison results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={compareTexts} className="w-full">
                Compare Texts
              </Button>
              <div className="bg-gray-50 p-4 rounded min-h-64 font-mono text-sm">
                {differences.length > 0 ? (
                  differences.map((diff, index) => (
                    <div key={index} className={
                      diff.startsWith('-') ? 'text-red-600' :
                      diff.startsWith('+') ? 'text-green-600' :
                      diff.startsWith('Line') ? 'font-bold text-blue-600' : ''
                    }>
                      {diff}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">Differences will appear here...</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TextDiff;
