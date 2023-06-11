import '@/katex/katex.min.css'

import type { Metadata } from 'next'
import { allArticles } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { Mdx } from '@/components/mdx'
import { Balancer } from 'react-wrap-balancer'
import NextLink from 'next/link'
import { MyEmail } from '@/components/my-email'
import GithubSlugger from 'github-slugger'
import { ArrowUpLeft } from 'lucide-react'
import { Link, linkStyle } from '@/components/link'

export async function generateStaticParams() {
  return allArticles.map(article => ({
    slug: article.slug,
  }))
}

type ArticleProps = {
  params: {
    slug: string
  }
}
export async function generateMetadata({
  params,
}: ArticleProps): Promise<Metadata | undefined> {
  const article = allArticles.find(article => article.slug === params.slug)
  if (!article) {
    return
  }

  const { title, description, date, slug, lang } = article

  const ogImage = `https://sixian.li/og?title=${title}&lang=${lang}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: date,
      url: `https://sixian.li/writing/${slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Article({ params }: ArticleProps) {
  const article = allArticles.find(article => article.slug === params.slug)

  if (!article) {
    notFound()
  }

  const headings = getHeadings(article.body.raw)

  return (
    <>
      <nav className="sticky z-20 w-full p-6 md:top-32 md:w-32 lg:-ml-56 lg:w-56">
        <Link href="/writing" className="group mb-4 flex items-center gap-1">
          <ArrowUpLeft
            size={16}
            strokeWidth={1.5}
            className="transition-transform group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]"
          />
          Writing
        </Link>
        <ul className="group hidden text-zinc-500 lg:block">
          {headings.map(h => (
            <li key={h.id} style={{ paddingInlineStart: `${h.level - 2}em` }}>
              {/* TODO: Use Link when URL hash handling is fixed 
                  https://github.com/vercel/next.js/issues/44295#issuecomment-1457042542
              */}
              <a href={`#${h.id}`} className={linkStyle}>
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main className="w-full px-6 md:w-[60ch]">
        <div>
          <time
            dateTime={article.date}
            className="text-sm text-fg-secondary-color"
          >
            {new Date(article.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1 className="mb-5 mt-1 text-3xl font-bold dark:text-white">
            <Balancer>{article.title}</Balancer>
          </h1>
          <Mdx code={article.body.code} />
          <p className="prose mb-10 border-y border-dashed border-zinc-400 p-6 text-center font-sans dark:prose-invert md:p-8">
            欢迎通过{' '}
            <NextLink href="https://twitter.com/noworkforsixian">
              Twitter
            </NextLink>{' '}
            或<MyEmail>邮件</MyEmail>
            告诉我你的想法
            <br />
            Find me on{' '}
            <NextLink href="https://twitter.com/noworkforsixian">
              Twitter
            </NextLink>{' '}
            or write me an <MyEmail>email</MyEmail>
          </p>
        </div>
      </main>
    </>
  )
}

function getHeadings(
  content: string
): { text: string; id: string; level: number }[] {
  const slugger = new GithubSlugger()
  const headingRegex = /^(#+)\s+(.*)$/gm
  const headings = [...content.matchAll(headingRegex)].map(r => ({
    level: r[1].length,
    text: r[2],
    id: slugger.slug(r[2]),
  }))
  return headings
}
