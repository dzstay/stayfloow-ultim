import { CurrencyProvider } from '@/context/currency-context';
import { LanguageProvider } from '@/context/language-context';

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </LanguageProvider>
  );
}
