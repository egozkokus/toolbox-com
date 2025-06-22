
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, RefreshCw, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
      toast({
        title: t('password_generator_page.toasts.error_title'),
        description: t('password_generator_page.toasts.charset_error')
      });
      return;
    }

    let result = "";
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: t('password_generator_page.toasts.copied_title'),
      description: t('password_generator_page.toasts.copied_desc')
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">{t('password_generator_page.title')}</h1>
          <p className="text-gray-600">{t('password_generator_page.subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('password_generator_page.generate_title')}</CardTitle>
            <CardDescription>
              {t('password_generator_page.generate_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t('password_generator_page.length_label', { length: length[0] })}</Label>
              <Slider
                value={length}
                onValueChange={setLength}
                min={4}
                max={128}
                step={1}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                />
                <Label htmlFor="uppercase">{t('password_generator_page.uppercase')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                />
                <Label htmlFor="lowercase">{t('password_generator_page.lowercase')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                />
                <Label htmlFor="numbers">{t('password_generator_page.numbers')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                />
                <Label htmlFor="symbols">{t('password_generator_page.symbols')}</Label>
              </div>
            </div>

            <Button onClick={generatePassword} className="w-full" size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('password_generator_page.generate_button')}
            </Button>

            {password && (
              <div className="space-y-2">
                <Label>{t('password_generator_page.result_label')}</Label>
                <div className="flex gap-2">
                  <Input value={password} readOnly className="font-mono" />
                  <Button onClick={copyToClipboard} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordGenerator;
