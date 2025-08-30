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
    const folders = fs.readdirSync(BLOG_DIR).filter(f => {
      const fullPath = path.join(BLOG_DIR, f)
      return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'page.tsx'))
    })
    blogPosts = folders.map(slug => ({
      url: `https://launch-print.com/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  }

  return [...staticPages, ...blogPosts]
}
