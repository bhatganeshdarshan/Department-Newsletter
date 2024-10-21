"use client"
import { useState ,useEffect } from 'react';
import NewsletterFormComponent from '../components/newsletter-form';

export default function Home(){
  const [darkMode, setDarkMode] = useState(true); 

  useEffect(
    ()=>{
      if(darkMode){
        document.body.classList.add('dark');
      }else{
        document.body.classList.remove('dark');
      }

      return ()=>{
        document.body.classList.remove('dark');
      };

    }
    ,[darkMode]
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>
      <NewsletterFormComponent darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
    </div>
  );
}