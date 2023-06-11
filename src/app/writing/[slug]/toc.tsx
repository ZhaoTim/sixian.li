'use client'
import { Link, linkStyle } from '@/components/link'
import { ArrowUpLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

export type Heading = { text: string; level: number }

export type TocProps = {
  headings: Heading[]
}

export function ToC({ headings }: TocProps) {
  const [ids, setIds] = useState<String[]>([])

  useEffect(() => {
    const headings = document.querySelectorAll('h2, h3, h4')
    setIds([...headings].map(h => h.id))
  }, [])

  return (
    <nav className="sticky z-20 w-full overflow-y-scroll p-6 md:top-32 md:w-32 lg:-ml-56 lg:w-56">
      <Link href="/writing" className="group mb-4 flex items-center gap-1">
        <ArrowUpLeft
          size={16}
          strokeWidth={1.5}
          className="transition-transform group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]"
        />
        Writing
      </Link>
      <ul className="group hidden text-zinc-500 lg:block">
        {headings.map((h, idx) => (
          <li key={idx} style={{ paddingInlineStart: `${h.level - 2}em` }}>
            {/* TODO: Use Link when URL hash handling is fixed 
            https://github.com/vercel/next.js/issues/44295#issuecomment-1457042542
        */}
            <a href={`#${ids[idx]}`} className={linkStyle}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
