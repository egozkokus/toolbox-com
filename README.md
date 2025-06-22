
# כלי יוטיליטי מתקדמים

## סקירת הפרויקט

**URL**: https://lovable.dev/projects/6893de67-6d82-4cbb-822c-0a1c83d656e4

זהו פרויקט של כלי יוטיליטי מתקדמים הכולל מגוון רחב של כלים לעבודה עם טקסט, תמונות, אודיו, וידיאו ועוד.

## דרישות מערכת

- Node.js (גרסה 16 או גבוהה יותר) - [התקנה עם nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm או yarn

## הוראות התקנה והפעלה

### פיתוח מקומי

```sh
# שלב 1: שכפול המאגר
git clone <YOUR_GIT_URL>

# שלב 2: מעבר לתיקיית הפרויקט
cd <YOUR_PROJECT_NAME>

# שלב 3: התקנת תלויות (חובה לפני בנייה!)
npm install

# שלב 4: הפעלת שרת הפיתוח
npm run dev
```

### בנייה לייצור

```sh
# וודא שהתלויות מותקנות
npm install

# בנה את הפרויקט
npm run build

# תצוגה מקדימה של הבנייה
npm run preview
```

## אפשרויות עריכה

### שימוש ב-Lovable

בקר ב[פרויקט Lovable](https://lovable.dev/projects/6893de67-6d82-4cbb-822c-0a1c83d656e4) והתחל לכתוב הנחיות.

השינויים שנעשו דרך Lovable יישמרו אוטומטית במאגר.

### עריכה מקומית

אם אתה רוצה לעבוד מקומית עם הכלי שלך:

1. שכפל את המאגר ועבור לתיקיית הפרויקט
2. הפעל `npm install` להתקנת התלויות
3. הפעל `npm run dev` להתחלת שרת הפיתוח
4. ערוך את הקבצים והדחף שינויים

### עריכה ישירה ב-GitHub

- נווט לקבצים הרצויים
- לחץ על כפתור "Edit" (סמל עיפרון) בחלק העליון הימני
- בצע שינויים ושמור

### שימוש ב-GitHub Codespaces

- נווט לעמוד הראשי של המאגר
- לחץ על כפתור "Code" (כפתור ירוק)
- בחר בכרטיסייה "Codespaces"
- לחץ "New codespace" להפעלת סביבת עבודה חדשה

## טכנולוגיות

הפרויקט בנוי עם:

- **Vite** - כלי בנייה מהיר
- **TypeScript** - שפת תכנות מסוגה
- **React** - ספריית UI
- **shadcn-ui** - רכיבי UI מתקדמים
- **Tailwind CSS** - CSS framework
- **Lucide React** - אייקונים
- **React Router** - ניתוב
- **Tanstack Query** - ניהול מצב

## פריסה

פתח את [Lovable](https://lovable.dev/projects/6893de67-6d82-4cbb-822c-0a1c83d656e4) ולחץ על Share → Publish.

## התחברות דומיין מותאם אישית

כן, אפשר!

לחיבור דומיין, נווט ל-Project > Settings > Domains ולחץ Connect Domain.

קרא עוד: [הגדרת דומיין מותאם](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## פתרון בעיות

### שגיאות בנייה

- וודא ש-`npm install` הופעל לפני `npm run build`
- בדוק שגרסת Node.js תואמת (16+)
- נקה cache: `npm cache clean --force`

### שגיאות פיתוח

- הפעל מחדש את שרת הפיתוח: `npm run dev`
- בדוק את קונסול הדפדפן לשגיאות
- וודא שכל הייבואים קיימים

### הסרת תג Lovable

פתח את הגדרות הפרויקט והפעל את האפשרות "Hide 'Lovable' Badge".

קרא עוד ב[FAQ](https://docs.lovable.dev/faq#how-do-i-remove-the-lovable-badge-from-my-app).

## מבנה הפרויקט

```
src/
├── components/         # רכיבים משותפים
├── pages/             # עמודי האפליקציה
│   ├── categories/    # עמודי קטגוריות
│   └── tools/         # כלי יוטיליטי ספציפיים
├── contexts/          # React contexts
├── hooks/             # React hooks מותאמים
└── lib/               # פונקציות עזר
```

## תרומה

1. צור fork של המאגר
2. צור branch חדש לתכונה שלך
3. בצע commit לשינויים
4. דחף ל-branch
5. פתח Pull Request

## רישיון

פרויקט זה מופץ תחת רישיון MIT.
"# toolbox-com" 
