import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import ScrollReveal from "../components/ScrollReveal";
import OptimizedImage from "../components/OptimizedImage";
import { cmsClient, Project } from "../lib/cms";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Tag,
  TrendingUp,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAnalytics } from "../utils/analytics";

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const analytics = useAnalytics();

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const fetchedProject = await cmsClient.getProject(slug);

        if (!fetchedProject) {
          setError("Project not found");
          return;
        }

        setProject(fetchedProject);

        // Fetch related projects
        const allProjects = await cmsClient.getProjects(20);
        const related = allProjects
          .filter(
            (p) =>
              p.id !== fetchedProject.id &&
              (p.category === fetchedProject.category ||
                p.tags.some((tag) => fetchedProject.tags.includes(tag))),
          )
          .slice(0, 3);

        setRelatedProjects(related);

        // Track page view
        analytics.track("project_viewed", {
          project_id: fetchedProject.id,
          project_title: fetchedProject.title,
          project_category: fetchedProject.category,
          client: fetchedProject.client,
        });

        // Update SEO meta tags
        updateSEOTags(fetchedProject);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, analytics]);

  const updateSEOTags = (project: Project) => {
    // Update page title
    document.title = `${project.title} | ALAVI Portfolio`;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", project.description);

    // Update Open Graph tags
    const ogTags = [
      { property: "og:title", content: project.title },
      { property: "og:description", content: project.description },
      { property: "og:image", content: project.featuredImage },
      { property: "og:type", content: "website" },
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
  };

  const nextImage = () => {
    if (project && project.gallery.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.gallery.length);
    }
  };

  const prevImage = () => {
    if (project && project.gallery.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + project.gallery.length) % project.gallery.length,
      );
    }
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

  if (error || !project) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Back to Work */}
            <ScrollReveal>
              <Link
                to="/work"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Work
              </Link>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Project Info */}
              <div>
                {/* Category */}
                <ScrollReveal delay={100}>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full mb-4">
                    {project.category}
                  </span>
                </ScrollReveal>

                {/* Title */}
                <ScrollReveal delay={200}>
                  <h1 className="text-fluid-4xl font-display font-bold mb-6 text-zinc-900 dark:text-white">
                    {project.title}
                  </h1>
                </ScrollReveal>

                {/* Description */}
                <ScrollReveal delay={300}>
                  <p className="text-fluid-lg text-zinc-700 dark:text-zinc-300 mb-8">
                    {project.description}
                  </p>
                </ScrollReveal>

                {/* Project Meta */}
                <ScrollReveal delay={400}>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                        Client
                      </h3>
                      <p className="text-zinc-900 dark:text-white font-medium">
                        {project.client}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                        Year
                      </h3>
                      <p className="text-zinc-900 dark:text-white font-medium">
                        {project.year}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Technologies */}
                <ScrollReveal delay={500}>
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Action Buttons */}
                <ScrollReveal delay={600}>
                  <div className="flex flex-wrap gap-4">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        onClick={() =>
                          analytics.track("project_link_clicked", {
                            project_id: project.id,
                            type: "live",
                          })
                        }
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live Site
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg transition-colors"
                        onClick={() =>
                          analytics.track("project_link_clicked", {
                            project_id: project.id,
                            type: "github",
                          })
                        }
                      >
                        <Github className="w-4 h-4" />
                        View Code
                      </a>
                    )}
                  </div>
                </ScrollReveal>
              </div>

              {/* Featured Image */}
              <ScrollReveal delay={700}>
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                  <OptimizedImage
                    src={project.featuredImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      {project.gallery.length > 0 && (
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal>
                <h2 className="text-fluid-2xl font-display font-bold text-center mb-12 text-zinc-900 dark:text-white">
                  Project Gallery
                </h2>
              </ScrollReveal>

              {/* Main Gallery Image */}
              <ScrollReveal delay={200}>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
                  <OptimizedImage
                    src={project.gallery[currentImageIndex]}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  {project.gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                    {currentImageIndex + 1} / {project.gallery.length}
                  </div>
                </div>
              </ScrollReveal>

              {/* Thumbnail Navigation */}
              {project.gallery.length > 1 && (
                <ScrollReveal delay={300}>
                  <div className="flex gap-4 justify-center overflow-x-auto pb-4">
                    {project.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-blue-500 scale-105"
                            : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
                        }`}
                      >
                        <OptimizedImage
                          src={image}
                          alt={`${project.title} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Project Details */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-fluid-2xl font-display font-bold mb-8 text-zinc-900 dark:text-white">
                Project Overview
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                <p>{project.longDescription}</p>
              </div>
            </ScrollReveal>

            {/* Tags */}
            {project.tags.length > 0 && (
              <ScrollReveal delay={300}>
                <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700">
                  <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
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
          </div>
        </div>
      </section>

      {/* Results & Metrics */}
      {project.results.length > 0 && (
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal>
                <h2 className="text-fluid-2xl font-display font-bold text-center mb-12 text-zinc-900 dark:text-white">
                  Results & Impact
                </h2>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {project.results.map((result, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4 mx-auto">
                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        {result.value}
                      </h3>
                      <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                        {result.metric}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                        {result.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {project.testimonial && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-900 p-8 lg:p-12 rounded-2xl text-center">
                  <Quote className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
                  <blockquote className="text-fluid-lg text-zinc-700 dark:text-zinc-300 mb-8 italic">
                    "{project.testimonial.quote}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {project.testimonial.author}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {project.testimonial.position} at{" "}
                      {project.testimonial.company}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal>
                <h2 className="text-fluid-2xl font-display font-bold text-center mb-12 text-zinc-900 dark:text-white">
                  Related Projects
                </h2>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject, index) => (
                  <ScrollReveal key={relatedProject.id} delay={index * 100}>
                    <article className="group bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-zinc-200 dark:border-zinc-700">
                      <div className="aspect-video overflow-hidden">
                        <OptimizedImage
                          src={relatedProject.featuredImage}
                          alt={relatedProject.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full mb-3">
                          {relatedProject.category}
                        </span>
                        <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <Link to={`/work/${relatedProject.slug}`}>
                            {relatedProject.title}
                          </Link>
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-4">
                          {relatedProject.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                          <span>{relatedProject.client}</span>
                          <span>{relatedProject.year}</span>
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

export default ProjectDetail;
