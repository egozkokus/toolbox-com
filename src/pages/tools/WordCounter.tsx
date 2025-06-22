
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const WordCounter = () => {
  const [text, setText] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    
    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs
    };
  }, [text]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title={t('word_counter_page.title')}
          subtitle={t('word_counter_page.subtitle')}
          icon={<FileText className="h-16 w-16 text-blue-600" />}
          backPath="/categories/text-tools"
          backLabel={t('word_counter_page.back')}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('word_counter_page.input_title')}</CardTitle>
                <CardDescription>
                  {t('word_counter_page.input_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t('word_counter_page.placeholder')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-96 resize-none"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('word_counter_page.stats_title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('word_counter_page.words')}:</span>
                  <span className="font-bold">{stats.words.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('word_counter_page.characters')}:</span>
                  <span className="font-bold">{stats.characters.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('word_counter_page.characters_no_spaces')}:</span>
                  <span className="font-bold">{stats.charactersNoSpaces.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('word_counter_page.sentences')}:</span>
                  <span className="font-bold">{stats.sentences.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('word_counter_page.paragraphs')}:</span>
                  <span className="font-bold">{stats.paragraphs.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {stats.words > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('word_counter_page.reading_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {t('word_counter_page.minutes_template', { count: Math.ceil(stats.words / 200) })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('word_counter_page.reading_desc')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;
