import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import React from 'react';

const BLOG_DIR = path.join(process.cwd(), 'src/app/blog');

type BlogPost = {
  title: string;
  date: string;
  author: string;
  tags?: string[];
  content: string;
};

function getPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    title: data.title || '',
    date: data.date || '',
    author: data.author || '',
    tags: data.tags || [],
    content,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return notFound();

  return (
    <section className="py-24 bg-[var(--secondary)]">
      <div className="container mx-auto px-6 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-[var(--primary)] mb-6 uppercase border-b-4 border-[var(--primary)] pb-4">{post.title}</h1>
        <div className="text-[var(--muted)] text-sm mb-4">{post.date} &mdash; {post.author}</div>
        <div className="flex flex-wrap gap-2 mb-6">
          {(post.tags || []).map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-[var(--primary)] text-[var(--secondary)] text-xs font-bold rounded">{tag}</span>
          ))}
        </div>
        <article className="prose prose-lg text-[var(--primary)]">
          {post.content.split('\n').map((line: string, i: number) => (
            <p key={i}>{line}</p>
          ))}
        </article>
      </div>
    </section>
  );
}
