import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}




const  ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export function ThemeProvider({children}:{children: ReactNode}){
    // Initialize state lazily: check localStorage first, then fallback to system preference
    const [theme , setTheme] = useState <Theme>(()=>{
        const storedtheme = localStorage.getItem('theme') as Theme ;
        if(storedtheme) return storedtheme;
        return window.matchMedia('(prefers-color-scheme:dark').matches ? 'dark' : 'light'
    })

    useEffect(()=>{

        const root = window.document.documentElement;
        if(theme === 'dark'){
            root.classList.add('dark');

        }else{
            root.classList.remove('dark');      
          }
          localStorage.setItem('theme', theme);
    },[theme])
    const toggleTheme = ()=>{
        setTheme((prev)=> prev === 'light' ? 'dark' : 'light')
    }


    return (
        <ThemeContext.Provider value={{theme , toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}



export function useTheme(){
    const context  = useContext(ThemeContext);
    if(context === undefined){
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context;
}

