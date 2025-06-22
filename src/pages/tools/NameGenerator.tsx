
import { useState } from "react";
import { User, Copy, RefreshCw, Settings } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const NameGenerator = () => {
  const { t } = useLanguage();
  const [nameType, setNameType] = useState("hebrew");
  const [count, setCount] = useState(10);
  const [includeLastName, setIncludeLastName] = useState(true);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);

  const nameData = {
    hebrew: {
      firstNames: [
        "יוסי", "שרה", "דוד", "מרים", "אמיר", "נועה", "משה", "רחל", "אברהם", "לאה",
        "דני", "תמר", "עמיר", "רינה", "מיכאל", "עדי", "יעקב", "אסתר", "אליעזר", "דינה"
      ],
      lastNames: [
        "כהן", "לוי", "ישראלי", "מזרחי", "אשכנזי", "ספרדי", "גולדברג", "רוזנברג", 
        "שטיין", "פרידמן", "וקנין", "בן דוד", "צדוק", "אברמוביץ", "שפירא"
      ]
    },
    english: {
      firstNames: [
        "John", "Sarah", "David", "Mary", "Michael", "Anna", "James", "Lisa", 
        "Robert", "Emma", "William", "Emily", "Daniel", "Jessica", "Matthew", "Ashley"
      ],
      lastNames: [
        "Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
        "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia"
      ]
    },
    fantasy: {
      firstNames: [
        "Aragorn", "Arwen", "Legolas", "Galadriel", "Thorin", "Tauriel", "Gandalf", "Elrond",
        "Boromir", "Eowyn", "Faramir", "Arya", "Tyrion", "Daenerys", "Jon", "Sansa"
      ],
      lastNames: [
        "Stormwind", "Brightblade", "Shadowmere", "Goldleaf", "Ironforge", "Dragonborn",
        "Nightwhisper", "Starfall", "Moonblade", "Fireborn", "Frostborn", "Earthshaker"
      ]
    }
  };

  const generateNames = () => {
    const names: string[] = [];
    const data = nameData[nameType as keyof typeof nameData];

    for (let i = 0; i < count; i++) {
      const firstName = data.firstNames[Math.floor(Math.random() * data.firstNames.length)];
      
      if (includeLastName) {
        const lastName = data.lastNames[Math.floor(Math.random() * data.lastNames.length)];
        names.push(`${firstName} ${lastName}`);
      } else {
        names.push(firstName);
      }
    }

    setGeneratedNames(names);
    toast.success(t('tools.nameGenerator.success'));
  };

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success(t('tools.nameGenerator.copied'));
  };

  const copyAllNames = () => {
    const allNames = generatedNames.join('\n');
    navigator.clipboard.writeText(allNames);
    toast.success(t('tools.nameGenerator.copiedAll'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title={t('tools.nameGenerator.title')}
          subtitle={t('tools.nameGenerator.subtitle')}
          icon={<User className="h-16 w-16 text-indigo-600" />}
          backPath="/categories/generators"
          backLabel={t('common.back.category')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('tools.nameGenerator.settings')}
              </CardTitle>
              <CardDescription>{t('tools.nameGenerator.settingsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nameType">{t('tools.nameGenerator.type')}</Label>
                <Select value={nameType} onValueChange={setNameType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hebrew">{t('tools.nameGenerator.types.hebrew')}</SelectItem>
                    <SelectItem value="english">{t('tools.nameGenerator.types.english')}</SelectItem>
                    <SelectItem value="fantasy">{t('tools.nameGenerator.types.fantasy')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="count">{t('tools.nameGenerator.count')}</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lastName"
                  checked={includeLastName}
                  onCheckedChange={(checked) => setIncludeLastName(checked === true)}
                />
                <Label htmlFor="lastName">{t('tools.nameGenerator.includeLastName')}</Label>
              </div>

              <Button onClick={generateNames} className="w-full" size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('tools.nameGenerator.generate')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.nameGenerator.generated')}</CardTitle>
              <CardDescription>{t('tools.nameGenerator.generatedDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedNames.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {generatedNames.map((name, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <span className="text-sm text-gray-700 flex-1">
                          {name}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyName(name)}
                          className="ml-2 flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyAllNames} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {t('tools.nameGenerator.copyAll')}
                    </Button>
                    <Button 
                      onClick={generateNames} 
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('tools.nameGenerator.generateMore')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('tools.nameGenerator.clickToStart')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NameGenerator;
