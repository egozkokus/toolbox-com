import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // התוסף שיטען את קבצי התרגום מהשרת (או מהתיקייה הציבורית)
  .use(HttpApi)
  // התוסף שיזהה את שפת המשתמש
  .use(LanguageDetector)
  // החיבור ל-React
  .use(initReactI18next)
  .init({
    // שפת ברירת מחדל אם שפת המשתמש לא זמינה
    fallbackLng: 'en',
    // תמיכה בפורמט JSON v3 (הסטנדרט)
    supportedLngs: ['en', 'he'], // הוסף כאן את כל השפות שתרצה לתמוך בהן
    debug: true, // הפעל במצב פיתוח כדי לראות לוגים בקונסול
    
    // הגדרות עבור react-i18next
    react: {
      useSuspense: true, // מאפשר שימוש ב-React Suspense בזמן טעינת התרגומים
    },

    // הגדרות עבור ה-backend שטוען את הקבצים
    backend: {
      // הנתיב לקבצי התרגום. {{lng}} יוחלף בקוד השפה (en, he)
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;