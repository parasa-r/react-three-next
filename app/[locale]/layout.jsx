import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import { Layout } from '@/components/dom/Layout'
import './global.css'

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'fr'}];
}

export const metadata = {
  title: 'Next.js + Three.js',
  description: 'A minimal starter for Nextjs + React-three-fiber and Threejs.',
}

export default async function RootLayout({children, params: {locale}}) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
            {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
            <Layout>{children}</Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
