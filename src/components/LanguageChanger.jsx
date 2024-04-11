'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '@/next-i18next.config';
import { useEffect, useState } from 'react';

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  // const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const [currentLocale, setCurrentLocale] = useState('');

  useEffect(() => {
    setCurrentLocale(i18n.language);
    console.log('currentLocale ef', currentLocale);
  }, [i18n.language]);


  console.log('currentLocale', currentLocale, currentPathname);

  const handleChange = e => {
    const newLocale = e.target.value;

    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push('/' + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  return (
    <div className="ml-4 mr-4 flex items-center text-gray-600">
      <select onChange={handleChange} value={currentLocale} className="h-6">
        <option value="en">English</option>
        <option value="ru">Русский</option>
        <option value="zh">简体中文</option>
      </select>
    </div>
  );
}