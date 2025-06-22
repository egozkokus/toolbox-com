// src/constants/tools.ts

export const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
  'INNER JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'AND', 'OR', 
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 
  'ALTER', 'DROP', 'TABLE', 'INDEX', 'AS', 'ON', 'LIMIT', 
  'OFFSET', 'UNION', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 
  'END', 'WITH', 'ASC', 'DESC', 'NULL', 'NOT NULL', 'PRIMARY KEY',
  'FOREIGN KEY', 'REFERENCES', 'CASCADE', 'CONSTRAINT', 'DEFAULT',
  'UNIQUE', 'CHECK', 'IN', 'BETWEEN', 'LIKE', 'EXISTS'
];

export const DEFAULT_PLACEHOLDERS = {
  css: `/* הדבק את קוד ה-CSS שלך כאן */
.button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
}`,
  
  js: `// הדבק את קוד ה-JavaScript שלך כאן
function greetUser(name) {
  // This is a greeting function
  console.log('Hello, ' + name + '!');
  return name;
}`,
  
  html: `<!-- הדבק את קוד ה-HTML שלך כאן -->
<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
  </body>
</html>`,
  
  sql: `-- הדבק כאן שאילתת SQL
SELECT users.name, users.email, orders.order_date, orders.total 
FROM users 
JOIN orders ON users.id = orders.user_id 
WHERE orders.total > 100 
ORDER BY orders.order_date DESC 
LIMIT 10`,
  
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<!-- הדבק כאן קוד XML -->
<users>
  <user id="1">
    <name>John Doe</name>
    <email>john@example.com</email>
  </user>
</users>`,
  
  json: `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true,
  "roles": ["admin", "user"]
}`
};

export const TOAST_MESSAGES = {
  success: {
    minify: (type: string, percentage: number) => ({
      title: "הושלם!",
      description: `${type.toUpperCase()} הוקטן ב-${percentage.toFixed(1)}%`
    }),
    format: (type: string) => ({
      title: "הצלחה!",
      description: `קוד ${type.toUpperCase()} עוצב בהצלחה`
    }),
    copy: {
      title: "הועתק!",
      description: "הקוד הועתק ללוח"
    },
    download: {
      title: "הורד בהצלחה!",
      description: "הקובץ נשמר"
    }
  },
  error: {
    emptyInput: (type: string) => ({
      title: "שגיאה",
      description: `אנא הכנס קוד ${type.toUpperCase()}`,
      variant: "destructive" as const
    }),
    processing: (type: string) => ({
      title: "שגיאה",
      description: `שגיאה בעיבוד ${type.toUpperCase()}`,
      variant: "destructive" as const
    })
  }
};