import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import Navigation from '@/components/dom/Navigation';
 
export async function generateStaticParams() {
  return ['en', 'fr'].map((locale) => ({locale}));
}
export const metadata = {
  title: 'Next.js + Three.js',
  description: 'A minimal starter for Nextjs + React-three-fiber and Threejs.',
}

async function getMessages(locale) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.log("locale : ", locale)
    notFound();
  }
}

export default async function RootLayout({ children, params : {locale} }) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navigation />
          <Layout>{children}</Layout>
          </NextIntlClientProvider>
      </body>
    </html>
  )
}
