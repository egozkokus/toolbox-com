import React from 'react';

// הגדרת ה-props שהרכיב יכול לקבל
interface PageHeaderProps {
  icon: React.ElementType; // מקבל את האייקון כרכיב
  title: string;
  description: string;
}

// export const PageHeader = ({ icon: Icon, title, description }: PageHeaderProps) => {
const PageHeader = ({ icon: Icon, title, description }: PageHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground">
        {description}
      </p>
      <hr className="mt-6" />
    </div>
  );
};

// שימוש ב-export default כדי למנוע את השגיאות הקודמות
export default PageHeader;