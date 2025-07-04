// הוספנו את useState לייבוא
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-react';

// זהו custom hook קטן לניהול ערכת הנושא
const useTheme = () => {
    // קורא את ערכת הנושא מהזיכרון המקומי, או משתמש בערכת הנושא של המערכת
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        localStorage.setItem('theme', theme);
    }, [theme]);

    return [theme, setTheme];
};


const ThemeSwitcher = () => {
    const [theme, setTheme] = useTheme();

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ThemeSwitcher;