
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Copy, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TextReverser = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const reverseText = () => {
    if (!input.trim()) {
      toast({ 
        title: t('common.error'), 
        description: "Please enter some text to reverse" 
      });
      return;
    }
    const reversed = input.split('').reverse().join('');
    setOutput(reversed);
    toast({ 
      title: t('common.success'), 
      description: "Text reversed successfully!" 
    });
  };

  const reverseWords = () => {
    if (!input.trim()) {
      toast({ 
        title: t('common.error'), 
        description: "Please enter some text to reverse" 
      });
      return;
    }
    const reversed = input.split(' ').reverse().join(' ');
    setOutput(reversed);
    toast({ 
      title: t('common.success'), 
      description: "Words reversed successfully!" 
    });
  };

  const reverseLines = () => {
    if (!input.trim()) {
      toast({ 
        title: t('common.error'), 
        description: "Please enter some text to reverse" 
      });
      return;
    }
    const reversed = input.split('\n').reverse().join('\n');
    setOutput(reversed);
    toast({ 
      title: t('common.success'), 
      description: "Lines reversed successfully!" 
    });
  };

  const copyToClipboard = async () => {
    if (!output) {
      toast({ 
        title: t('common.error'), 
        description: "No text to copy" 
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(output);
      toast({ 
        title: t('common.success'), 
        description: "Text copied to clipboard!" 
      });
    } catch (err) {
      toast({ 
        title: t('common.error'), 
        description: "Failed to copy text" 
      });
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
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
          <RotateCcw className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Text Reverser</h1>
          <p className="text-gray-600">Reverse text, words, or lines in multiple ways</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>
                Enter text to reverse in different ways
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-48 resize-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button onClick={reverseText} variant="default" className="text-sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reverse Characters
                </Button>
                <Button onClick={reverseWords} variant="outline" className="text-sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reverse Words
                </Button>
                <Button onClick={reverseLines} variant="outline" className="text-sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reverse Lines
                </Button>
              </div>
              <Button onClick={clearAll} variant="destructive" className="w-full">
                Clear All
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reversed Text</CardTitle>
              <CardDescription>
                Your reversed text will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={output}
                readOnly
                className="min-h-48 bg-gray-50 resize-none"
                placeholder="Reversed text will appear here..."
              />
              {output && (
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    {t('common.copy')} Result
                  </Button>
                  <Button 
                    onClick={() => setInput(output)} 
                    variant="outline"
                    title="Use output as new input"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        {input && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Text Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{input.length}</div>
                  <div className="text-sm text-gray-600">Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{input.split(' ').filter(word => word.length > 0).length}</div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{input.split('\n').length}</div>
                  <div className="text-sm text-gray-600">Lines</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{input.split('\n\n').length}</div>
                  <div className="text-sm text-gray-600">Paragraphs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TextReverser;
