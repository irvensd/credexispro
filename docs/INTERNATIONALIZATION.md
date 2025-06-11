# Internationalization (i18n)

## Overview

This document outlines the internationalization setup and usage in the CredExis Pro application. We use i18next for managing translations and language switching.

## Supported Languages

- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)

## Translation Structure

```
src/
└── i18n/
    ├── config.ts           # i18n configuration
    ├── locales/           # Translation files
    │   ├── en/
    │   │   ├── common.json
    │   │   ├── auth.json
    │   │   ├── clients.json
    │   │   └── tasks.json
    │   ├── es/
    │   ├── fr/
    │   ├── de/
    │   └── pt/
    └── hooks/             # Custom i18n hooks
        └── useTranslation.ts
```

## Usage Examples

### Basic Translation

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
};
```

### Translation with Variables

```typescript
const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('common.greeting', { name: 'John' })}</p>
      <p>{t('common.items', { count: 5 })}</p>
    </div>
  );
};
```

### Pluralization

```typescript
const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('common.items', { count: 1 })}</p>
      <p>{t('common.items', { count: 5 })}</p>
    </div>
  );
};
```

### Date and Number Formatting

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  const date = new Date();
  const number = 1234.56;

  return (
    <div>
      <p>{t('common.date', { date })}</p>
      <p>{t('common.number', { number })}</p>
    </div>
  );
};
```

## Language Switching

```typescript
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
      <button onClick={() => changeLanguage('de')}>Deutsch</button>
      <button onClick={() => changeLanguage('pt')}>Português</button>
    </div>
  );
};
```

## Translation Files Structure

### common.json
```json
{
  "welcome": "Welcome to CredExis Pro",
  "description": "Professional Credential Management System",
  "greeting": "Hello, {{name}}!",
  "items": {
    "one": "{{count}} item",
    "other": "{{count}} items"
  },
  "date": "{{date, date}}",
  "number": "{{number, number}}"
}
```

### auth.json
```json
{
  "login": {
    "title": "Login",
    "email": "Email",
    "password": "Password",
    "submit": "Sign In",
    "forgotPassword": "Forgot Password?",
    "noAccount": "Don't have an account?",
    "signUp": "Sign Up"
  },
  "register": {
    "title": "Register",
    "name": "Full Name",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "submit": "Create Account",
    "hasAccount": "Already have an account?",
    "signIn": "Sign In"
  }
}
```

## Best Practices

1. **Translation Keys**
   - Use nested keys for better organization
   - Use consistent naming conventions
   - Group related translations together
   - Use meaningful key names

2. **Variables**
   - Use named variables for better context
   - Provide default values when possible
   - Document variable usage

3. **Pluralization**
   - Use proper plural forms
   - Consider language-specific rules
   - Test with different numbers

4. **Date and Number Formatting**
   - Use locale-specific formats
   - Consider timezone differences
   - Use appropriate number formats

5. **Performance**
   - Lazy load translations
   - Cache translations
   - Use namespaces effectively

## Implementation Steps

1. Install dependencies:
   ```bash
   npm install i18next react-i18next i18next-browser-languagedetector
   ```

2. Configure i18next:
   ```typescript
   // src/i18n/config.ts
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import LanguageDetector from 'i18next-browser-languagedetector';

   i18n
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
       resources: {
         en: {
           common: require('./locales/en/common.json'),
           auth: require('./locales/en/auth.json'),
         },
         // Add other languages...
       },
       fallbackLng: 'en',
       interpolation: {
         escapeValue: false,
       },
     });

   export default i18n;
   ```

3. Wrap your app with I18nextProvider:
   ```typescript
   // src/App.tsx
   import { I18nextProvider } from 'react-i18next';
   import i18n from './i18n/config';

   const App = () => {
     return (
       <I18nextProvider i18n={i18n}>
         {/* Your app components */}
       </I18nextProvider>
     );
   };
   ```

## Testing

1. **Unit Tests**
   ```typescript
   import { renderHook } from '@testing-library/react-hooks';
   import { useTranslation } from 'react-i18next';

   describe('Translation', () => {
     it('should translate text', () => {
       const { result } = renderHook(() => useTranslation());
       expect(result.current.t('common.welcome')).toBe('Welcome to CredExis Pro');
     });
   });
   ```

2. **Integration Tests**
   ```typescript
   import { render, screen } from '@testing-library/react';
   import { I18nextProvider } from 'react-i18next';
   import i18n from './i18n/config';

   describe('Language Switching', () => {
     it('should switch language', () => {
       render(
         <I18nextProvider i18n={i18n}>
           <LanguageSwitcher />
         </I18nextProvider>
       );
       // Test language switching...
     });
   });
   ``` 