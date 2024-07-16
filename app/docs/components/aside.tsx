'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDEBAR } from './sidebar';

function Aside() {
    let pathName = usePathname();
    return (
        <aside
            id="aside"
            className="
        hidden

        fixed
        top-20
        left-0
        lg:inset-0

        w-full
        h-full

        self-end
        bg-white

        backdrop-blur
        dark:supports-backdrop-blur:bg-gray-900/70

        lg:sticky
        lg:block
        lg:w-64
        lg:h-auto
        lg:bg-transparent
        lg:dark:bg-transparent
      "
        >
            <nav
                className="

          px-4
          py-20

          overflow-auto

          lg:sticky
          lg:h-screen
          lg:block
          lg:pl-0
          lg:pr-6

          dark:bg-transparent
        "
                aria-label="Categories"
            >
                <ul className="space-y-6 pl-1">
                    {SIDEBAR.map((item) => (
                        <li key={item.title}>
                            <h5
                                className="
                  block
                  
                  ml-3
                  mb-2
            
                  tracking-wide

                  text-md
                  text-slate-900
                  font-bold

                  dark:text-white
                "
                            >
                                {item.title}
                            </h5>
                            {Boolean(item.children?.length) && (
                                <ul className="space-y-1">
                                    {item.children?.map(({ title, slug }) => (
                                        <li key={slug}>
                                            <Link href={slug} 
                                                aria-current={`${pathName === slug ? 'page' : 'false'
                                                        }`}
                                                    className={`
                            flex
                            align-middle
                            justify-between

                            py-1
                            px-3

                            text-sm
                            text-slate-500
                            dark:text-slate-400
                            dark:hover:text-blue-600

                            rounded

                            outline-none
                            focus-visible:ring-2
                            focus-visible:ring-blue-600
                            dark:focus-visible:ring-blue-600/50
                            hover:underline

                            aria-current-page:bg-blue-50
                            aria-current-page:text-blue-800

                            dark:aria-current-page:text-blue-500
                            dark:aria-current-page:bg-blue-600/10
                            ${pathName === slug ? ' text-gray-950 font-semibold' : ''}
                          `}
                                                >
                                                    {title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Aside;