'use client';

import {usePathname} from 'next-intl/client';
import Link from 'next-intl/link';


export default function NavigationLink({href, ...rest}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive}
      className={isActive ? 'inline-block py-3 px-2 transition-colors text-gray-300' : 'inline-block py-3 px-2 transition-colors text-gray-400 hover:text-gray-200'}
      href={href}
      {...rest}
    />
  );
}
