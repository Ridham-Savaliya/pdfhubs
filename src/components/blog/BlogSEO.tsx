import { useEffect } from "react";
import { BlogPost } from "@/data/blogPosts";

interface BlogSEOProps {
  post?: BlogPost;
  isListPage?: boolean;
}

export function BlogSEO({ post, isListPage }: BlogSEOProps) {
  useEffect(() => {
    const canonicalUrl = isListPage
      ? "https://www.pdfhubs.site/blog"
      : post ? `https://www.pdfhubs.site/blog/${post.slug}` : null;

    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }

    if (isListPage) {
      document.title = "PDF Tips & Tutorials Blog | PDFTools - Learn PDF Management";

      const metaTags = {
        description: "Expert PDF tips, tutorials, and guides. Learn how to merge, compress, convert, and manage PDF documents effectively. Free resources for students, professionals, and businesses.",
        keywords: "pdf tips, pdf tutorials, pdf guide, how to merge pdf, how to compress pdf, pdf management, document tips",
        "og:title": "PDF Tips & Tutorials Blog | PDFTools",
        "og:description": "Expert PDF tips, tutorials, and guides for effective document management.",
        "og:type": "website",
        "og:url": "https://www.pdfhubs.site/blog",
        "og:image": "https://www.pdfhubs.site/og-image.png",
        "twitter:card": "summary_large_image",
        "twitter:title": "PDF Tips & Tutorials Blog | PDFTools",
        "twitter:description": "Expert PDF tips, tutorials, and guides for effective document management."
      };

      Object.entries(metaTags).forEach(([name, content]) => {
        const isOg = name.startsWith("og:");
        const isTwitter = name.startsWith("twitter:");
        let meta = document.querySelector(
          isOg ? `meta[property="${name}"]` : `meta[name="${name}"]`
        );

        if (!meta) {
          meta = document.createElement("meta");
          if (isOg || isTwitter) {
            meta.setAttribute("property", name);
          } else {
            meta.setAttribute("name", name);
          }
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content);
      });

      // Add blog listing structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "PDFTools Blog",
        "description": "Expert PDF tips, tutorials, and guides for effective document management.",
        "url": "https://www.pdfhubs.site/blog",
        "publisher": {
          "@type": "Organization",
          "name": "PDFTools",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.pdfhubs.site/favicon.png"
          }
        }
      };

      let script = document.querySelector('script[data-blog-seo]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-blog-seo', 'true');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    } else if (post) {
      document.title = `${post.title} | PDFTools Blog`;

      const metaTags = {
        description: post.description,
        keywords: post.tags.join(", "),
        "og:title": post.title,
        "og:description": post.description,
        "og:type": "article",
        "og:url": `https://www.pdfhubs.site/blog/${post.slug}`,
        "og:image": "https://www.pdfhubs.site/og-image.png",
        "article:published_time": post.publishedAt,
        "article:author": post.author,
        "twitter:card": "summary_large_image",
        "twitter:title": post.title,
        "twitter:description": post.description
      };

      Object.entries(metaTags).forEach(([name, content]) => {
        const isOg = name.startsWith("og:");
        const isArticle = name.startsWith("article:");
        const isTwitter = name.startsWith("twitter:");
        let meta = document.querySelector(
          (isOg || isArticle) ? `meta[property="${name}"]` : `meta[name="${name}"]`
        );

        if (!meta) {
          meta = document.createElement("meta");
          if (isOg || isArticle || isTwitter) {
            meta.setAttribute("property", name);
          } else {
            meta.setAttribute("name", name);
          }
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content);
      });

      // Add article structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "image": "https://www.pdfhubs.site/og-image.png",
        "author": {
          "@type": "Organization",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "PDFTools",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.pdfhubs.site/favicon.png"
          }
        },
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.pdfhubs.site/blog/${post.slug}`
        }
      };

      let script = document.querySelector('script[data-blog-seo]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-blog-seo', 'true');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    return () => {
      const script = document.querySelector('script[data-blog-seo]');
      if (script) script.remove();
    };
  }, [post, isListPage]);

  return null;
}

