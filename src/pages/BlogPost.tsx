import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Tag,
  User,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";
import { cmsClient, type BlogPost as BlogPostType } from "../lib/cms";
import { useAnalytics } from "../utils/analytics";
import ScrollReveal from "../components/ScrollReveal";
import OptimizedImage from "../components/OptimizedImage";
import Layout from "../components/Layout";

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const fetchedPost = await cmsClient.getBlogPost(slug);

        if (!fetchedPost) {
          setError("Post not found");
          return;
        }

        setPost(fetchedPost);

        // Fetch related posts
        const allPosts = await cmsClient.getRelatedPosts(20);
        const related = allPosts
          .filter(
            (p: BlogPostType) =>
              p.id !== fetchedPost.id &&
              (p.category === fetchedPost.category ||
                p.tags.some((tag: string) => fetchedPost.tags.includes(tag))),
          )
          .slice(0, 3);

        setRelatedPosts(related);

        // Track page view
        analytics.track("blog_post_viewed", {
          post_id: fetchedPost.id,
          post_title: fetchedPost.title,
          post_category: fetchedPost.category,
          reading_time: fetchedPost.readingTime,
        });

        // Update SEO meta tags
        updateSEOTags(fetchedPost);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, analytics]);

  const updateSEOTags = (post: BlogPostType) => {
    // Update page title
    document.title = `${post.seo.title} | ALAVI Blog`;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", post.seo.description);

    // Update Open Graph tags
    const ogTags = [
      { property: "og:title", content: post.seo.title },
      { property: "og:description", content: post.seo.description },
      { property: "og:image", content: post.featuredImage },
      { property: "og:type", content: "article" },
      { property: "article:author", content: post.author.name },
      { property: "article:published_time", content: post.publishedAt },
      { property: "article:modified_time", content: post.updatedAt },
      { property: "article:section", content: post.category },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // Add article tags
    post.tags.forEach((tag) => {
      const tagMeta = document.createElement("meta");
      tagMeta.setAttribute("property", "article:tag");
      tagMeta.setAttribute("content", tag);
      document.head.appendChild(tagMeta);
    });
  };

  const sharePost = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          analytics.track("blog_post_shared", {
            platform: "copy",
            post_id: post?.id,
          });
          return;
        } catch (err) {
          console.error("Failed to copy URL:", err);
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      analytics.track("blog_post_shared", { platform, post_id: post?.id });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back to Blog */}
            <ScrollReveal>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </ScrollReveal>

            {/* Category */}
            {post.category && (
              <ScrollReveal delay={100}>
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full mb-4">
                  {post.category}
                </span>
              </ScrollReveal>
            )}

            {/* Title */}
            <ScrollReveal delay={200}>
              <h1 className="text-fluid-4xl font-display font-bold mb-6 text-zinc-900 dark:text-white">
                {post.title}
              </h1>
            </ScrollReveal>

            {/* Excerpt */}
            <ScrollReveal delay={300}>
              <p className="text-fluid-lg text-zinc-700 dark:text-zinc-300 mb-8">
                {post.excerpt}
              </p>
            </ScrollReveal>

            {/* Meta Information */}
            <ScrollReveal delay={400}>
              <div className="flex flex-wrap items-center gap-6 text-zinc-600 dark:text-zinc-400 mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Share Buttons */}
            <ScrollReveal delay={500}>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Share:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => sharePost("twitter")}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sharePost("facebook")}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sharePost("linkedin")}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sharePost("copy")}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-green-100 dark:hover:bg-green-900 text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Featured Image */}
            <ScrollReveal delay={600}>
              <div className="aspect-video rounded-xl overflow-hidden mb-12">
                <OptimizedImage
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </article>

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </ScrollReveal>

            {/* Tags */}
            {post.tags.length > 0 && (
              <ScrollReveal delay={200}>
                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-700">
                  <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Author Bio */}
            {post.author.bio && (
              <ScrollReveal delay={300}>
                <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                  <div className="flex items-start gap-4">
                    {post.author.avatar && (
                      <OptimizedImage
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">
                        About {post.author.name}
                      </h3>
                      <p className="text-zinc-700 dark:text-zinc-300">
                        {post.author.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal>
                <h2 className="text-fluid-2xl font-display font-bold text-center mb-12 text-zinc-900 dark:text-white">
                  Related Articles
                </h2>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <ScrollReveal key={relatedPost.id} delay={index * 100}>
                    <article className="group bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-zinc-200 dark:border-zinc-700">
                      <div className="aspect-video overflow-hidden">
                        <OptimizedImage
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        {relatedPost.category && (
                          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full mb-3">
                            {relatedPost.category}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <Link to={`/blog/${relatedPost.slug}`}>
                            {relatedPost.title}
                          </Link>
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                          <span>{formatDate(relatedPost.publishedAt)}</span>
                          <span>{relatedPost.readingTime} min read</span>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPostPage;
