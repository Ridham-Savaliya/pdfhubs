import type { Metadata } from 'next';
import { getBlogPostBySlug } from '@/data/blogPosts';
import BlogPostClient from './BlogPostClient';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | PDFHubs Blog`,
        description: post.description,
        keywords: post.tags.join(', '),
        alternates: {
            canonical: `https://pdfhubs.site/blog/${slug}`,
        }
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    return <BlogPostClient slug={slug} />;
}
