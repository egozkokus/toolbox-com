
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoremGenerator = () => {
  const [output, setOutput] = useState("");
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const { toast } = useToast();

  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum"
  ];

  const generateParagraph = (wordCount: number) => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    
    let paragraph = words.join(' ');
    paragraph = paragraph.charAt(0).toUpperCase() + paragraph.slice(1);
    
    // Add some random periods
    const sentences = Math.floor(wordCount / 8) + 1;
    const sentenceLength = Math.floor(wordCount / sentences);
    
    for (let i = 1; i < sentences; i++) {
      const position = i * sentenceLength;
      if (position < paragraph.length) {
        paragraph = paragraph.substring(0, position) + '. ' + 
                   paragraph.charAt(position).toUpperCase() + 
                   paragraph.substring(position + 1);
      }
    }
    
    return paragraph + '.';
  };

  const generateLorem = () => {
    const generatedParagraphs = [];
    for (let i = 0; i < paragraphs; i++) {
      generatedParagraphs.push(generateParagraph(wordsPerParagraph));
    }
    setOutput(generatedParagraphs.join('\n\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Lorem ipsum text copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">Lorem Ipsum Generator</h1>
          <p className="text-gray-600">Generate placeholder text for your designs</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure your lorem ipsum generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paragraphs">Number of Paragraphs</Label>
                <Input
                  id="paragraphs"
                  type="number"
                  min="1"
                  max="20"
                  value={paragraphs}
                  onChange={(e) => setParagraphs(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="words">Words per Paragraph</Label>
                <Input
                  id="words"
                  type="number"
                  min="10"
                  max="200"
                  value={wordsPerParagraph}
                  onChange={(e) => setWordsPerParagraph(Math.max(10, parseInt(e.target.value) || 50))}
                />
              </div>
              <Button onClick={generateLorem} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Lorem Ipsum
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Text</CardTitle>
                    <CardDescription>
                      Your lorem ipsum placeholder text
                    </CardDescription>
                  </div>
                  {output && (
                    <Button onClick={copyToClipboard} variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-96 bg-gray-50"
                  placeholder="Generated lorem ipsum text will appear here..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoremGenerator;
