import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

const BLOG_DIR = path.join(process.cwd(), 'src/app/blog');

function getPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  return files.map(filename => {
    const filePath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(raw);
    return {
      slug: filename.replace(/\.md$/, ''),
      ...data,
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function BlogIndex() {
  const posts = getPosts();
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  return (
    <section className="py-24 bg-[var(--secondary)]">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-[var(--primary)] mb-10 uppercase border-b-4 border-[var(--primary)] pb-4">Blog</h1>
        <div className="mb-8 flex flex-wrap gap-2">
          {allTags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-[var(--primary)] text-[var(--secondary)] font-bold text-xs rounded">{tag}</span>
          ))}
        </div>
        <ul className="space-y-8">
          {posts.map(post => (
            <li key={post.slug} className="border-4 border-[var(--primary)] p-6">
              <Link href={`/blog/${post.slug}`} className="text-2xl font-bold text-[var(--primary)] hover:underline uppercase">
                {post.title}
              </Link>
              <div className="text-[var(--muted)] text-sm mb-2">{post.date} &mdash; {post.author}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {(post.tags || []).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-[var(--primary)] text-[var(--secondary)] text-xs font-bold rounded">{tag}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
