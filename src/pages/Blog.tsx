// Blog page with Coming Soon functionality
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ScrollReveal from "../components/ScrollReveal";
import OptimizedImage from "../components/OptimizedImage";
import { cmsClient, BlogPost } from "../lib/cms";
import {
  Search,
  Calendar,
  Clock,
  Tag,
  User,
  ArrowRight,
  Filter,
  BookOpen,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { useAnalytics } from "../utils/analytics";

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const postsPerPage = 9;
  const analytics = useAnalytics();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await cmsClient.getBlogPosts(100);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Remove analytics from dependencies to prevent infinite loop

  // Track page view when posts are loaded
  useEffect(() => {
    if (!loading) {
      analytics.track("blog_page_viewed", { posts_count: posts.length });
    }
  }, [loading, posts.length, analytics]);

  // Get unique categories and tags
  const categories = useMemo(() => {
    const cats = posts.map((post) => post.category).filter(Boolean);
    return [...new Set(cats)];
  }, [posts]);

  const tags = useMemo(() => {
    const allTags = posts.flatMap((post) => post.tags);
    return [...new Set(allTags)];
  }, [posts]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchTerm === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "" || post.category === selectedCategory;
      const matchesTag = selectedTag === "" || post.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [posts, searchTerm, selectedCategory, selectedTag]);

  // Paginate filtered posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    analytics.track("blog_search", { search_term: e.target.value });
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1);
    analytics.track("blog_filter_category", { category });
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
    setCurrentPage(1);
    analytics.track("blog_filter_tag", { tag });
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
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Show Coming Soon when no posts are available
  if (posts.length === 0) {
    return (
      <Layout>
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"></div>
          <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-fluid-4xl font-display font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                    Insights & Ideas
                  </span>
                </h1>
                <p className="text-fluid-lg text-zinc-700 dark:text-zinc-300 mb-8">
                  Discover the latest trends, insights, and best practices in
                  digital design and development.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-fluid-3xl font-display font-bold mb-4 text-zinc-900 dark:text-white">
                    Coming Soon
                  </h2>
                  <p className="text-fluid-lg text-zinc-600 dark:text-zinc-400 mb-8">
                    We're currently working on exciting articles and insights
                    for you. Our blog will soon be filled with valuable content
                    about design, development, and digital trends.
                  </p>
                </div>

                {/* Feature Preview Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <ScrollReveal delay={0.1}>
                    <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                        Design Insights
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Latest trends and best practices in UI/UX design
                      </p>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.2}>
                    <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                        Tech Tutorials
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Step-by-step guides for modern development
                      </p>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.3}>
                    <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <Tag className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                        Case Studies
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Insights into our projects and success stories
                      </p>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Newsletter Signup */}
                <ScrollReveal delay={0.4}>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-700 rounded-2xl p-8">
                    <h3 className="text-fluid-xl font-semibold mb-4 text-zinc-900 dark:text-white">
                      Get Notified
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                      Be the first to know when our blog goes live and don't
                      miss out on valuable insights.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                        Notify Me
                      </button>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Back to Home */}
                <ScrollReveal delay={0.5}>
                  <div className="mt-12">
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      Back to Home
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"></div>
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-fluid-4xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  Insights & Ideas
                </span>
              </h1>
              <p className="text-fluid-lg text-zinc-700 dark:text-zinc-300 mb-8">
                Discover the latest trends, insights, and best practices in
                digital design and development.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-zinc-200 dark:border-zinc-700">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-600 dark:text-zinc-400">
                {filteredPosts.length} article
                {filteredPosts.length !== 1 ? "s" : ""} found
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <ScrollReveal>
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg mb-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold mb-3 text-zinc-900 dark:text-white">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryFilter(category)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedCategory === category
                              ? "bg-blue-600 text-white"
                              : "bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-zinc-600"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="font-semibold mb-3 text-zinc-900 dark:text-white">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {tags.slice(0, 20).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagFilter(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTag === tag
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-zinc-600"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                  No articles found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post, index) => (
                  <ScrollReveal key={post.id} delay={index * 100}>
                    <article className="group bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-zinc-200 dark:border-zinc-700">
                      {/* Featured Image */}
                      <div className="aspect-video overflow-hidden">
                        <OptimizedImage
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.publishedAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readingTime} min read
                          </div>
                        </div>

                        {/* Category */}
                        {post.category && (
                          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full mb-3">
                            {post.category}
                          </span>
                        )}

                        {/* Title */}
                        <h2 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs rounded"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Author & Read More */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-zinc-400" />
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              {post.author.name}
                            </span>
                          </div>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                          >
                            Read more
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
