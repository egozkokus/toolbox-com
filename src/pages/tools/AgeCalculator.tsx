import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const { t } = useTranslation();

  const [ageResult, setAgeResult] = useState({
    years: 0,
    months: 0,
    days: 0,
    totalDays: 0,
    totalWeeks: 0,
    totalMonths: 0,
    nextBirthday: ""
  });

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    
    if (birth > target) return;

    // Calculate exact age
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate totals
    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Calculate next birthday
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(target.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    setAgeResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      nextBirthday: String(daysUntilBirthday)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title={t('age_calculator_page.title')}
          subtitle={t('age_calculator_page.subtitle')}
          icon={<Calendar className="h-16 w-16 text-purple-600" />}
          backPath="/categories/calculators"
          backLabel={t('age_calculator_page.back')}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('age_calculator_page.date_info.title')}</CardTitle>
              <CardDescription>
                {t('age_calculator_page.date_info.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('age_calculator_page.date_info.birth_label')}
                </label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('age_calculator_page.date_info.as_of_label')}
                </label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>

              <Button onClick={calculateAge} className="w-full" disabled={!birthDate}>
                <Calendar className="h-4 w-4 mr-2" />
                {t('age_calculator_page.date_info.button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('age_calculator_page.results.title')}</CardTitle>
              <CardDescription>
                {t('age_calculator_page.results.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">
                  {t('age_calculator_page.results.exact_age')}
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {ageResult.years} {t('age_calculator_page.labels.years')}, {ageResult.months} {t('age_calculator_page.labels.months')}, {ageResult.days} {t('age_calculator_page.labels.days')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">
                    {t('age_calculator_page.results.total_days')}
                  </div>
                  <div className="text-lg font-bold text-blue-700">
                    {ageResult.totalDays.toLocaleString()}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">
                    {t('age_calculator_page.results.total_weeks')}
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    {ageResult.totalWeeks.toLocaleString()}
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">
                    {t('age_calculator_page.results.total_months')}
                  </div>
                  <div className="text-lg font-bold text-orange-700">
                    {ageResult.totalMonths.toLocaleString()}
                  </div>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg">
                  <div className="text-sm text-pink-600 font-medium">
                    {t('age_calculator_page.results.next_birthday')}
                  </div>
                  <div className="text-lg font-bold text-pink-700">
                    {t('age_calculator_page.days_template', {count: parseInt(ageResult.nextBirthday, 10) || 0})}
                  </div>
                </div>
              </div>

              {ageResult.totalDays > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('age_calculator_page.fun_facts_title')}</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      {t('age_calculator_page.fun_facts_lines.0', {hours: Math.floor(ageResult.totalDays * 24).toLocaleString()})}
                    </div>
                    <div>
                      {t('age_calculator_page.fun_facts_lines.1', {minutes: Math.floor(ageResult.totalDays * 24 * 60).toLocaleString()})}
                    </div>
                    <div>
                      {t('age_calculator_page.fun_facts_lines.2', {seconds: Math.floor(ageResult.totalDays * 24 * 60 * 60).toLocaleString()})}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;
