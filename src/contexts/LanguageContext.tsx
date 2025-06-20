
import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'site.title': 'Tools4Anything',
    'nav.tools': 'Tools',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'All-in-One Web Tools',
    'hero.subtitle': 'Discover powerful online tools for text processing, calculations, image editing, and development. Everything you need in one place, completely free.',
    'hero.search': 'Search tools...',
    'hero.stats.tools': 'Tools Available',
    'hero.stats.free': 'Free to Use',
    'hero.stats.available': 'Available',
    
    // Categories
    'categories.title': 'Choose Your Tool Category',
    'categories.text': 'Text Tools',
    'categories.text.desc': 'Transform and manipulate text with ease',
    'categories.calculators': 'Calculators',
    'categories.calculators.desc': 'Powerful calculators for every need',
    'categories.image': 'Image Tools',
    'categories.image.desc': 'Edit and optimize your images',
    'categories.video': 'Video Tools',
    'categories.video.desc': 'Create and edit videos professionally',
    'categories.audio': 'Audio Tools',
    'categories.audio.desc': 'Edit and process audio files',
    'categories.developer': 'Developer Tools',
    'categories.developer.desc': 'Essential tools for developers',
    'categories.generators': 'Generators',
    'categories.generators.desc': 'Generate passwords, hashes and more',
    
    // Common
    'common.back': 'Back',
    'common.back.home': 'Back to Home',
    'common.back.category': 'Back to Category',
    'common.explore': 'Explore Tools',
    'common.use': 'Use Tool',
    'common.download': 'Download',
    'common.copy': 'Copy',
    'common.reset': 'Reset',
    'common.generate': 'Generate',
    'common.upload': 'Upload',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.success': 'Success!',
    'common.error': 'Error',
    
    // Tools
    'tools.nameGenerator.title': 'Name Generator',
    'tools.nameGenerator.subtitle': 'Generate random names of different types',
    'tools.nameGenerator.settings': 'Name Settings',
    'tools.nameGenerator.settingsDesc': 'Configure parameters for name generation',
    'tools.nameGenerator.type': 'Name Type',
    'tools.nameGenerator.count': 'Number of Names',
    'tools.nameGenerator.includeLastName': 'Include Last Name',
    'tools.nameGenerator.generate': 'Generate Names',
    'tools.nameGenerator.generated': 'Generated Names',
    'tools.nameGenerator.generatedDesc': 'List of recently generated names',
    'tools.nameGenerator.copyAll': 'Copy All',
    'tools.nameGenerator.generateMore': 'Generate More',
    'tools.nameGenerator.clickToStart': 'Click "Generate Names" to start',
    'tools.nameGenerator.success': 'Names generated successfully!',
    'tools.nameGenerator.copied': 'Name copied to clipboard!',
    'tools.nameGenerator.copiedAll': 'All names copied to clipboard!',
    'tools.nameGenerator.types.hebrew': 'Hebrew Names',
    'tools.nameGenerator.types.english': 'English Names',
    'tools.nameGenerator.types.fantasy': 'Fantasy Names',
    
    // Footer
    'footer.categories': 'Tool Categories',
    'footer.popular': 'Popular Tools',
    'footer.support': 'Support',
    'footer.rights': '© 2024 Tools4Anything.com. All rights reserved.'
  },
  he: {
    // Header
    'site.title': 'כלים לכל דבר',
    'nav.tools': 'כלים',
    'nav.about': 'אודות',
    'nav.contact': 'צור קשר',
    
    // Hero
    'hero.title': 'כלי רשת הכל-בכל',
    'hero.subtitle': 'גלה כלים מקוונים חזקים לעיבוד טקסט, חישובים, עריכת תמונות ופיתוח. כל מה שאתה צריך במקום אחד, בחינם לחלוטין.',
    'hero.search': 'חפש כלים...',
    'hero.stats.tools': 'כלים זמינים',
    'hero.stats.free': 'חינם לשימוש',
    'hero.stats.available': 'זמין',
    
    // Categories
    'categories.title': 'בחר את קטגוריית הכלים שלך',
    'categories.text': 'כלי טקסט',
    'categories.text.desc': 'המר ועבד טקסט בקלות',
    'categories.calculators': 'מחשבונים',
    'categories.calculators.desc': 'מחשבונים חזקים לכל צורך',
    'categories.image': 'כלי תמונות',
    'categories.image.desc': 'ערוך ובצע אופטימיזציה לתמונות שלך',
    'categories.video': 'כלי וידאו',
    'categories.video.desc': 'צור וערוך סרטונים במקצועיות',
    'categories.audio': 'כלי אודיו',
    'categories.audio.desc': 'ערוך ועבד קבצי אודיו',
    'categories.developer': 'כלי מפתחים',
    'categories.developer.desc': 'כלים חיוניים למפתחים',
    'categories.generators': 'מחוללים',
    'categories.generators.desc': 'חולל סיסמאות, האשים ועוד',
    
    // Common
    'common.back': 'חזרה',
    'common.back.home': 'חזרה לדף הבית',
    'common.back.category': 'חזרה לקטגוריה',
    'common.explore': 'חקור כלים',
    'common.use': 'השתמש בכלי',
    'common.download': 'הורד',
    'common.copy': 'העתק',
    'common.reset': 'איפוס',
    'common.generate': 'חולל',
    'common.upload': 'העלה',
    'common.save': 'שמור',
    'common.cancel': 'ביטול',
    'common.success': 'הצלחה!',
    'common.error': 'שגיאה',
    
    // Tools
    'tools.nameGenerator.title': 'מחולל שמות',
    'tools.nameGenerator.subtitle': 'צור שמות אקראיים מסוגים שונים',
    'tools.nameGenerator.settings': 'הגדרות שמות',
    'tools.nameGenerator.settingsDesc': 'קבע את הפרמטרים ליצירת השמות',
    'tools.nameGenerator.type': 'סוג שמות',
    'tools.nameGenerator.count': 'כמות שמות',
    'tools.nameGenerator.includeLastName': 'כלול שם משפחה',
    'tools.nameGenerator.generate': 'צור שמות',
    'tools.nameGenerator.generated': 'שמות שנוצרו',
    'tools.nameGenerator.generatedDesc': 'רשימת השמות האחרונים שנוצרו',
    'tools.nameGenerator.copyAll': 'העתק הכל',
    'tools.nameGenerator.generateMore': 'צור עוד',
    'tools.nameGenerator.clickToStart': 'לחץ על "צור שמות" כדי להתחיל',
    'tools.nameGenerator.success': 'שמות נוצרו בהצלחה!',
    'tools.nameGenerator.copied': 'השם הועתק ללוח!',
    'tools.nameGenerator.copiedAll': 'כל השמות הועתקו ללוח!',
    'tools.nameGenerator.types.hebrew': 'שמות עבריים',
    'tools.nameGenerator.types.english': 'שמות אנגליים',
    'tools.nameGenerator.types.fantasy': 'שמות פנטזיה',
    
    // Footer
    'footer.categories': 'קטגוריות כלים',
    'footer.popular': 'כלים פופולריים',
    'footer.support': 'תמיכה',
    'footer.rights': '© 2024 Tools4Anything.com. כל הזכויות שמורות.'
  },
  es: {
    // Header
    'site.title': 'Herramientas Para Todo',
    'nav.tools': 'Herramientas',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    
    // Hero
    'hero.title': 'Herramientas Web Todo-en-Uno',
    'hero.subtitle': 'Descubre potentes herramientas en línea para procesamiento de texto, cálculos, edición de imágenes y desarrollo. Todo lo que necesitas en un lugar, completamente gratis.',
    'hero.search': 'Buscar herramientas...',
    'hero.stats.tools': 'Herramientas Disponibles',
    'hero.stats.free': 'Gratis de Usar',
    'hero.stats.available': 'Disponible',
    
    // Categories
    'categories.title': 'Elige Tu Categoría de Herramientas',
    'categories.text': 'Herramientas de Texto',
    'categories.text.desc': 'Transforma y manipula texto con facilidad',
    'categories.calculators': 'Calculadoras',
    'categories.calculators.desc': 'Calculadoras potentes para cada necesidad',
    'categories.image': 'Herramientas de Imagen',
    'categories.image.desc': 'Edita y optimiza tus imágenes',
    'categories.video': 'Herramientas de Video',
    'categories.video.desc': 'Crea y edita videos profesionalmente',
    'categories.audio': 'Herramientas de Audio',
    'categories.audio.desc': 'Edita y procesa archivos de audio',
    'categories.developer': 'Herramientas de Desarrollador',
    'categories.developer.desc': 'Herramientas esenciales para desarrolladores',
    'categories.generators': 'Generadores',
    'categories.generators.desc': 'Genera contraseñas, hashes y más',
    
    // Common
    'common.back': 'Volver',
    'common.back.home': 'Volver al Inicio',
    'common.back.category': 'Volver a Categoría',
    'common.explore': 'Explorar Herramientas',
    'common.use': 'Usar Herramienta',
    'common.download': 'Descargar',
    'common.copy': 'Copiar',
    'common.reset': 'Restablecer',
    'common.generate': 'Generar',
    'common.upload': 'Subir',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.success': '¡Éxito!',
    'common.error': 'Error',
    
    // Tools
    'tools.nameGenerator.title': 'Generador de Nombres',
    'tools.nameGenerator.subtitle': 'Genera nombres aleatorios de diferentes tipos',
    'tools.nameGenerator.settings': 'Configuración de Nombres',
    'tools.nameGenerator.settingsDesc': 'Configura los parámetros para la generación de nombres',
    'tools.nameGenerator.type': 'Tipo de Nombre',
    'tools.nameGenerator.count': 'Cantidad de Nombres',
    'tools.nameGenerator.includeLastName': 'Incluir Apellido',
    'tools.nameGenerator.generate': 'Generar Nombres',
    'tools.nameGenerator.generated': 'Nombres Generados',
    'tools.nameGenerator.generatedDesc': 'Lista de nombres generados recientemente',
    'tools.nameGenerator.copyAll': 'Copiar Todo',
    'tools.nameGenerator.generateMore': 'Generar Más',
    'tools.nameGenerator.clickToStart': 'Haz clic en "Generar Nombres" para comenzar',
    'tools.nameGenerator.success': '¡Nombres generados exitosamente!',
    'tools.nameGenerator.copied': '¡Nombre copiado al portapapeles!',
    'tools.nameGenerator.copiedAll': '¡Todos los nombres copiados al portapapeles!',
    'tools.nameGenerator.types.hebrew': 'Nombres Hebreos',
    'tools.nameGenerator.types.english': 'Nombres Ingleses',
    'tools.nameGenerator.types.fantasy': 'Nombres de Fantasía',
    
    // Footer
    'footer.categories': 'Categorías de Herramientas',
    'footer.popular': 'Herramientas Populares',
    'footer.support': 'Soporte',
    'footer.rights': '© 2024 Tools4Anything.com. Todos los derechos reservados.'
  },
  fr: {
    // Header
    'site.title': 'Outils Pour Tout',
    'nav.tools': 'Outils',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Outils Web Tout-en-Un',
    'hero.subtitle': 'Découvrez des outils en ligne puissants pour le traitement de texte, les calculs, l\'édition d\'images et le développement. Tout ce dont vous avez besoin en un seul endroit, entièrement gratuit.',
    'hero.search': 'Rechercher des outils...',
    'hero.stats.tools': 'Outils Disponibles',
    'hero.stats.free': 'Gratuit à Utiliser',
    'hero.stats.available': 'Disponible',
    
    // Categories
    'categories.title': 'Choisissez Votre Catégorie d\'Outils',
    'categories.text': 'Outils de Texte',
    'categories.text.desc': 'Transformez et manipulez le texte facilement',
    'categories.calculators': 'Calculatrices',
    'categories.calculators.desc': 'Calculatrices puissantes pour tous les besoins',
    'categories.image': 'Outils d\'Image',
    'categories.image.desc': 'Éditez et optimisez vos images',
    'categories.video': 'Outils Vidéo',
    'categories.video.desc': 'Créez et éditez des vidéos professionnellement',
    'categories.audio': 'Outils Audio',
    'categories.audio.desc': 'Éditez et traitez les fichiers audio',
    'categories.developer': 'Outils de Développeur',
    'categories.developer.desc': 'Outils essentiels pour les développeurs',
    'categories.generators': 'Générateurs',
    'categories.generators.desc': 'Générez des mots de passe, des hachages et plus',
    
    // Common
    'common.back': 'Retour',
    'common.back.home': 'Retour à l\'Accueil',
    'common.back.category': 'Retour à la Catégorie',
    'common.explore': 'Explorer les Outils',
    'common.use': 'Utiliser l\'Outil',
    'common.download': 'Télécharger',
    'common.copy': 'Copier',
    'common.reset': 'Réinitialiser',
    'common.generate': 'Générer',
    'common.upload': 'Téléverser',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.success': 'Succès !',
    'common.error': 'Erreur',
    
    // Tools
    'tools.nameGenerator.title': 'Générateur de Noms',
    'tools.nameGenerator.subtitle': 'Générez des noms aléatoires de différents types',
    'tools.nameGenerator.settings': 'Paramètres des Noms',
    'tools.nameGenerator.settingsDesc': 'Configurez les paramètres pour la génération de noms',
    'tools.nameGenerator.type': 'Type de Nom',
    'tools.nameGenerator.count': 'Nombre de Noms',
    'tools.nameGenerator.includeLastName': 'Inclure le Nom de Famille',
    'tools.nameGenerator.generate': 'Générer des Noms',
    'tools.nameGenerator.generated': 'Noms Générés',
    'tools.nameGenerator.generatedDesc': 'Liste des noms récemment générés',
    'tools.nameGenerator.copyAll': 'Copier Tout',
    'tools.nameGenerator.generateMore': 'Générer Plus',
    'tools.nameGenerator.clickToStart': 'Cliquez sur "Générer des Noms" pour commencer',
    'tools.nameGenerator.success': 'Noms générés avec succès !',
    'tools.nameGenerator.copied': 'Nom copié dans le presse-papiers !',
    'tools.nameGenerator.copiedAll': 'Tous les noms copiés dans le presse-papiers !',
    'tools.nameGenerator.types.hebrew': 'Noms Hébreux',
    'tools.nameGenerator.types.english': 'Noms Anglais',
    'tools.nameGenerator.types.fantasy': 'Noms de Fantaisie',
    
    // Footer
    'footer.categories': 'Catégories d\'Outils',
    'footer.popular': 'Outils Populaires',
    'footer.support': 'Support',
    'footer.rights': '© 2024 Tools4Anything.com. Tous droits réservés.'
  },
  de: {
    // Header
    'site.title': 'Werkzeuge Für Alles',
    'nav.tools': 'Werkzeuge',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    
    // Hero
    'hero.title': 'All-in-One Web-Tools',
    'hero.subtitle': 'Entdecken Sie leistungsstarke Online-Tools für Textverarbeitung, Berechnungen, Bildbearbeitung und Entwicklung. Alles was Sie brauchen an einem Ort, völlig kostenlos.',
    'hero.search': 'Werkzeuge suchen...',
    'hero.stats.tools': 'Verfügbare Werkzeuge',
    'hero.stats.free': 'Kostenlos zu Nutzen',
    'hero.stats.available': 'Verfügbar',
    
    // Categories
    'categories.title': 'Wählen Sie Ihre Werkzeug-Kategorie',
    'categories.text': 'Text-Werkzeuge',
    'categories.text.desc': 'Text einfach transformieren und bearbeiten',
    'categories.calculators': 'Rechner',
    'categories.calculators.desc': 'Leistungsstarke Rechner für jeden Bedarf',
    'categories.image': 'Bild-Werkzeuge',
    'categories.image.desc': 'Bearbeiten und optimieren Sie Ihre Bilder',
    'categories.video': 'Video-Werkzeuge',
    'categories.video.desc': 'Videos professionell erstellen und bearbeiten',
    'categories.audio': 'Audio-Werkzeuge',
    'categories.audio.desc': 'Audio-Dateien bearbeiten und verarbeiten',
    'categories.developer': 'Entwickler-Werkzeuge',
    'categories.developer.desc': 'Wesentliche Werkzeuge für Entwickler',
    'categories.generators': 'Generatoren',
    'categories.generators.desc': 'Passwörter, Hashes und mehr generieren',
    
    // Common
    'common.back': 'Zurück',
    'common.back.home': 'Zurück zur Startseite',
    'common.back.category': 'Zurück zur Kategorie',
    'common.explore': 'Werkzeuge Erkunden',
    'common.use': 'Werkzeug Verwenden',
    'common.download': 'Herunterladen',
    'common.copy': 'Kopieren',
    'common.reset': 'Zurücksetzen',
    'common.generate': 'Generieren',
    'common.upload': 'Hochladen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.success': 'Erfolg!',
    'common.error': 'Fehler',
    
    // Tools
    'tools.nameGenerator.title': 'Namens-Generator',
    'tools.nameGenerator.subtitle': 'Erstellen Sie zufällige Namen verschiedener Typen',
    'tools.nameGenerator.settings': 'Namen-Einstellungen',
    'tools.nameGenerator.settingsDesc': 'Parameter für die Namensgenerierung konfigurieren',
    'tools.nameGenerator.type': 'Namen-Typ',
    'tools.nameGenerator.count': 'Anzahl der Namen',
    'tools.nameGenerator.includeLastName': 'Nachnamen einschließen',
    'tools.nameGenerator.generate': 'Namen Generieren',
    'tools.nameGenerator.generated': 'Generierte Namen',
    'tools.nameGenerator.generatedDesc': 'Liste der zuletzt generierten Namen',
    'tools.nameGenerator.copyAll': 'Alle Kopieren',
    'tools.nameGenerator.generateMore': 'Mehr Generieren',
    'tools.nameGenerator.clickToStart': 'Klicken Sie auf "Namen Generieren", um zu beginnen',
    'tools.nameGenerator.success': 'Namen erfolgreich generiert!',
    'tools.nameGenerator.copied': 'Name in die Zwischenablage kopiert!',
    'tools.nameGenerator.copiedAll': 'Alle Namen in die Zwischenablage kopiert!',
    'tools.nameGenerator.types.hebrew': 'Hebräische Namen',
    'tools.nameGenerator.types.english': 'Englische Namen',
    'tools.nameGenerator.types.fantasy': 'Fantasy-Namen',
    
    // Footer
    'footer.categories': 'Werkzeug-Kategorien',
    'footer.popular': 'Beliebte Werkzeuge',
    'footer.support': 'Support',
    'footer.rights': '© 2024 Tools4Anything.com. Alle Rechte vorbehalten.'
  },
  ar: {
    // Header
    'site.title': 'أدوات لكل شيء',
    'nav.tools': 'الأدوات',
    'nav.about': 'حول',
    'nav.contact': 'اتصل بنا',
    
    // Hero
    'hero.title': 'أدوات ويب شاملة',
    'hero.subtitle': 'اكتشف أدوات قوية عبر الإنترنت لمعالجة النصوص والحسابات وتحرير الصور والتطوير. كل ما تحتاجه في مكان واحد، مجاناً بالكامل.',
    'hero.search': 'البحث عن الأدوات...',
    'hero.stats.tools': 'الأدوات المتاحة',
    'hero.stats.free': 'مجاني للاستخدام',
    'hero.stats.available': 'متاح',
    
    // Categories
    'categories.title': 'اختر فئة الأدوات الخاصة بك',
    'categories.text': 'أدوات النص',
    'categories.text.desc': 'حول ومعالجة النص بسهولة',
    'categories.calculators': 'الآلات الحاسبة',
    'categories.calculators.desc': 'آلات حاسبة قوية لكل حاجة',
    'categories.image': 'أدوات الصور',
    'categories.image.desc': 'حرر وحسن صورك',
    'categories.video': 'أدوات الفيديو',
    'categories.video.desc': 'أنشئ وحرر مقاطع الفيديو بمهنية',
    'categories.audio': 'أدوات الصوت',
    'categories.audio.desc': 'حرر ومعالج ملفات الصوت',
    'categories.developer': 'أدوات المطورين',
    'categories.developer.desc': 'أدوات أساسية للمطورين',
    'categories.generators': 'المولدات',
    'categories.generators.desc': 'إنشاء كلمات المرور والتشفير والمزيد',
    
    // Common
    'common.back': 'العودة',
    'common.back.home': 'العودة للرئيسية',
    'common.back.category': 'العودة للفئة',
    'common.explore': 'استكشاف الأدوات',
    'common.use': 'استخدام الأداة',
    'common.download': 'تحميل',
    'common.copy': 'نسخ',
    'common.reset': 'إعادة تعيين',
    'common.generate': 'إنشاء',
    'common.upload': 'رفع',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.success': 'نجح!',
    'common.error': 'خطأ',
    
    // Tools
    'tools.nameGenerator.title': 'مولد الأسماء',
    'tools.nameGenerator.subtitle': 'إنشاء أسماء عشوائية من أنواع مختلفة',
    'tools.nameGenerator.settings': 'إعدادات الأسماء',
    'tools.nameGenerator.settingsDesc': 'تكوين المعاملات لإنشاء الأسماء',
    'tools.nameGenerator.type': 'نوع الاسم',
    'tools.nameGenerator.count': 'عدد الأسماء',
    'tools.nameGenerator.includeLastName': 'تضمين الاسم الأخير',
    'tools.nameGenerator.generate': 'إنشاء أسماء',
    'tools.nameGenerator.generated': 'الأسماء المولدة',
    'tools.nameGenerator.generatedDesc': 'قائمة الأسماء المولدة مؤخراً',
    'tools.nameGenerator.copyAll': 'نسخ الكل',
    'tools.nameGenerator.generateMore': 'إنشاء المزيد',
    'tools.nameGenerator.clickToStart': 'انقر على "إنشاء أسماء" للبدء',
    'tools.nameGenerator.success': 'تم إنشاء الأسماء بنجاح!',
    'tools.nameGenerator.copied': 'تم نسخ الاسم للحافظة!',
    'tools.nameGenerator.copiedAll': 'تم نسخ جميع الأسماء للحافظة!',
    'tools.nameGenerator.types.hebrew': 'أسماء عبرية',
    'tools.nameGenerator.types.english': 'أسماء إنجليزية',
    'tools.nameGenerator.types.fantasy': 'أسماء خيالية',
    
    // Footer
    'footer.categories': 'فئات الأدوات',
    'footer.popular': 'الأدوات الشائعة',
    'footer.support': 'الدعم',
    'footer.rights': '© 2024 Tools4Anything.com. جميع الحقوق محفوظة.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
