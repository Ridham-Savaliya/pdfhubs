import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSEO } from "@/components/blog/BlogSEO";
import { blogPosts, BlogPost } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Building2, ArrowLeft } from "lucide-react";

type Category = 'all' | BlogPost['category'];

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Articles', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'how-to', label: 'How-To Guides', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'tips', label: 'Tips & Tricks', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'industry', label: 'Industry Guides', icon: <Building2 className="w-4 h-4" /> },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <BlogSEO isListPage />
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              PDF Tips & <span className="text-primary">Tutorials</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Expert guides, tips, and tutorials to help you master PDF management. 
              From basic operations to advanced techniques.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="container mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                {category.icon}
                {category.label}
                {category.id !== 'all' && (
                  <span className="text-xs opacity-70">
                    ({blogPosts.filter(p => p.category === category.id).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <section className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found in this category.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="container mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Try Our PDF Tools?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Put these tips into practice with our free online PDF tools. 
              No signup required, instant results.
            </p>
            <Button asChild size="lg">
              <Link to="/">Explore All Tools</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
