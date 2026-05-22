import { GlobeIcon, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const language = i18n.resolvedLanguage === 'en' ? 'en' : 'id';

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLanguageChange = async (nextLanguage: 'en' | 'id') => {
    await i18n.changeLanguage(nextLanguage);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 text-sm font-semibold tracking-[0.08em] uppercase text-[#504533] hover:text-[#1c1c15] transition-colors"
        aria-label={t('common.languageSelection')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <GlobeIcon className="size-4" />
        <span>{language.toUpperCase()}</span>
        <ChevronDown
          className={[
            'size-4 transition-transform',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      <div
        className={[
          'absolute top-full right-0 mt-2 min-w-28 rounded-lg border border-[#d4c4ac] bg-white shadow-lg transition',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        ].join(' ')}
        role="menu"
      >
        <button
          type="button"
          onClick={() => void handleLanguageChange('en')}
          role="menuitem"
          className={`block w-full px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide transition-colors ${
            language === 'en'
              ? 'bg-[#f4b400] text-[#1c1c15]'
              : 'text-[#504533] hover:bg-[#f7f4e9]'
          }`}
        >
          {t('common.languages.en')}
        </button>
        <button
          type="button"
          onClick={() => void handleLanguageChange('id')}
          role="menuitem"
          className={`block w-full px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide transition-colors border-t border-[#d4c4ac] ${
            language === 'id'
              ? 'bg-[#f4b400] text-[#1c1c15]'
              : 'text-[#504533] hover:bg-[#f7f4e9]'
          }`}
        >
          {t('common.languages.id')}
        </button>
      </div>
    </div>
  );
}
