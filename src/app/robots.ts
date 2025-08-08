import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/handler/',
        '/user-profiles/',
        '/chat-rooms/',
        '/admin/',
      ],
    },
    sitemap: 'https://your-domain.com/sitemap.xml',
  }
}
