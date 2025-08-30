
import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BLOG_DIR = path.join(process.cwd(), 'src/app/blog')

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    {
      url: 'https://launch-print.com/',
      lastModified: new Date(),
  changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: 'https://launch-print.com/pricing',
      lastModified: new Date(),
  changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://launch-print.com/about',
      lastModified: new Date(),
  changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: 'https://launch-print.com/blog',
      lastModified: new Date(),
  changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  let blogPosts: MetadataRoute.Sitemap = []
  if (fs.existsSync(BLOG_DIR)) {
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'))
    blogPosts = files.map(filename => {
      const slug = filename.replace(/\.md$/, '')
      return {
        url: `https://launch-print.com/blog/${slug}`,
        lastModified: new Date(),
  changeFrequency: 'monthly' as const,
        priority: 0.6,
      }
    })
  }

  return [...staticPages, ...blogPosts]
}
