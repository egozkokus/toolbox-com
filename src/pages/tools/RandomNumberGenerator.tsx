
import { useState } from "react";
import { Dice6, Copy, RefreshCw } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const RandomNumberGenerator = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const { t } = useTranslation();

  const generateNumbers = () => {
    if (min >= max) {
      toast.error(t('random_number_generator_page.toasts.range_error'));
      return;
    }

    if (!allowDuplicates && (max - min + 1) < count) {
      toast.error(t('random_number_generator_page.toasts.duplicate_error'));
      return;
    }

    const numbers: number[] = [];
    const usedNumbers = new Set<number>();

    for (let i = 0; i < count; i++) {
      let randomNum: number;
      
      if (!allowDuplicates) {
        do {
          randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedNumbers.has(randomNum));
        usedNumbers.add(randomNum);
      } else {
        randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      
      numbers.push(randomNum);
    }

    setGeneratedNumbers(numbers);
    toast.success(t('random_number_generator_page.toasts.generated'));
  };

  const copyToClipboard = () => {
    const numbersText = generatedNumbers.join(", ");
    navigator.clipboard.writeText(numbersText);
    toast.success(t('random_number_generator_page.toasts.copied'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title={t('random_number_generator_page.title')}
          subtitle={t('random_number_generator_page.subtitle')}
          icon={<Dice6 className="h-16 w-16 text-indigo-600" />}
          backPath="/categories/generators"
          backLabel={t('random_number_generator_page.back')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('random_number_generator_page.settings_title')}</CardTitle>
              <CardDescription>{t('random_number_generator_page.settings_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min">{t('random_number_generator_page.min_label')}</Label>
                  <Input
                    id="min"
                    type="number"
                    value={min}
                    onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="max">{t('random_number_generator_page.max_label')}</Label>
                  <Input
                    id="max"
                    type="number"
                    value={max}
                    onChange={(e) => setMax(parseInt(e.target.value) || 100)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="count">{t('random_number_generator_page.count_label')}</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="1000"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="duplicates"
                  checked={allowDuplicates}
                  onCheckedChange={setAllowDuplicates}
                />
                <Label htmlFor="duplicates">{t('random_number_generator_page.allow_duplicates')}</Label>
              </div>

              <Button 
                onClick={generateNumbers} 
                className="w-full"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('random_number_generator_page.generate_button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('random_number_generator_page.results_title')}</CardTitle>
              <CardDescription>{t('random_number_generator_page.results_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedNumbers.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border min-h-[200px]">
                    <div className="flex flex-wrap gap-2">
                      {generatedNumbers.map((num, index) => (
                        <span
                          key={index}
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-mono"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyToClipboard} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {t('random_number_generator_page.copy')}
                    </Button>
                    <Button 
                      onClick={generateNumbers} 
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('random_number_generator_page.regenerate')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Dice6 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('random_number_generator_page.empty_prompt')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RandomNumberGenerator;
