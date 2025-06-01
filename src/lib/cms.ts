// Headless CMS Integration (Strapi/Contentful/Sanity)
interface CMSConfig {
  apiUrl: string;
  apiKey?: string;
  preview?: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  readingTime: number;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  featuredImage: string;
  gallery: string[];
  category: string;
  tags: string[];
  client: string;
  year: string;
  url?: string;
  github?: string;
  technologies: string[];
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  pricing: {
    basic: { price: string; features: string[] };
    premium: { price: string; features: string[] };
    enterprise: { price: string; features: string[] };
  };
  process: {
    step: number;
    title: string;
    description: string;
  }[];
}

// CMS API Response Types
interface CMSImageData {
  data?: {
    attributes: {
      url: string;
    };
  };
}

interface CMSAuthorData {
  data?: {
    attributes: {
      name: string;
      bio: string;
      avatar: CMSImageData;
    };
  };
}

interface CMSTagData {
  data?: Array<{
    attributes: {
      name: string;
    };
  }>;
}

interface CMSCategoryData {
  data?: {
    attributes: {
      name: string;
    };
  };
}

interface CMSBlogPostItem {
  id: string;
  attributes: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: CMSImageData;
    author: CMSAuthorData;
    publishedAt: string;
    updatedAt: string;
    tags: CMSTagData;
    category: CMSCategoryData;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
  };
}

interface CMSProjectItem {
  id: string;
  attributes: {
    title: string;
    slug: string;
    description: string;
    longDescription: string;
    featuredImage: CMSImageData;
    gallery?: {
      data?: Array<{
        attributes: {
          url: string;
        };
      }>;
    };
    category: CMSCategoryData;
    tags: CMSTagData;
    client: string;
    year: string;
    url?: string;
    github?: string;
    technologies?: string[];
    results?: Array<{
      metric: string;
      value: string;
      description: string;
    }>;
    testimonial?: {
      quote: string;
      author: string;
      position: string;
      company: string;
    };
  };
}

interface CMSServiceItem {
  id: string;
  attributes: {
    title: string;
    slug: string;
    description: string;
    longDescription: string;
    icon: string;
    features?: string[];
    pricing?: {
      basic: { price: string; features: string[] };
      premium: { price: string; features: string[] };
      enterprise: { price: string; features: string[] };
    };
    process?: Array<{
      step: number;
      title: string;
      description: string;
    }>;
  };
}

class CMSClient {
  private config: CMSConfig;

  constructor(config: CMSConfig) {
    this.config = config;
  }

  // Blog Posts
  async getBlogPosts(limit = 10, offset = 0): Promise<BlogPost[]> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/blog-posts?populate=*&pagination[limit]=${limit}&pagination[start]=${offset}&sort=publishedAt:desc`,
        {
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch blog posts");

      const data = await response.json();
      return this.transformBlogPosts(data.data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  }

  async getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`,
        {
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch blog post");

      const data = await response.json();
      return data.data.length > 0 ? this.transformBlogPost(data.data[0]) : null;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }
  }

  async getRelatedPosts(limit = 10): Promise<BlogPost[]> {
    return this.getBlogPosts(limit);
  }

  // Projects
  async getProjects(limit = 10): Promise<Project[]> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/projects?populate=*&pagination[limit]=${limit}&sort=year:desc`,
        {
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch projects");

      const data = await response.json();
      return this.transformProjects(data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }

  async getProject(slug: string): Promise<Project | null> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/projects?filters[slug][$eq]=${slug}&populate=*`,
        {
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch project");

      const data = await response.json();
      return data.data.length > 0 ? this.transformProject(data.data[0]) : null;
    } catch (error) {
      console.error("Error fetching project:", error);
      return null;
    }
  }

  // Services
  async getServices(): Promise<Service[]> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/services?populate=*`,
        {
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch services");

      const data = await response.json();
      return this.transformServices(data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  private transformBlogPosts(data: CMSBlogPostItem[]): BlogPost[] {
    return data.map((item) => this.transformBlogPost(item));
  }

  private transformBlogPost(item: CMSBlogPostItem): BlogPost {
    return {
      id: item.id,
      title: item.attributes.title,
      slug: item.attributes.slug,
      excerpt: item.attributes.excerpt,
      content: item.attributes.content,
      featuredImage: item.attributes.featuredImage?.data?.attributes?.url || "",
      author: {
        name: item.attributes.author?.data?.attributes?.name || "ALAVI Team",
        avatar:
          item.attributes.author?.data?.attributes?.avatar?.data?.attributes
            ?.url || "",
        bio: item.attributes.author?.data?.attributes?.bio || "",
      },
      publishedAt: item.attributes.publishedAt,
      updatedAt: item.attributes.updatedAt,
      tags: item.attributes.tags?.data?.map((tag) => tag.attributes.name) || [],
      category: item.attributes.category?.data?.attributes?.name || "",
      seo: {
        title: item.attributes.seoTitle || item.attributes.title,
        description: item.attributes.seoDescription || item.attributes.excerpt,
        keywords: item.attributes.seoKeywords || [],
      },
      readingTime: this.calculateReadingTime(item.attributes.content),
    };
  }

  private transformProjects(data: CMSProjectItem[]): Project[] {
    return data.map((item) => this.transformProject(item));
  }

  private transformProject(item: CMSProjectItem): Project {
    return {
      id: item.id,
      title: item.attributes.title,
      slug: item.attributes.slug,
      description: item.attributes.description,
      longDescription: item.attributes.longDescription,
      featuredImage: item.attributes.featuredImage?.data?.attributes?.url || "",
      gallery:
        item.attributes.gallery?.data?.map((img) => img.attributes.url) || [],
      category: item.attributes.category?.data?.attributes?.name || "",
      tags: item.attributes.tags?.data?.map((tag) => tag.attributes.name) || [],
      client: item.attributes.client,
      year: item.attributes.year,
      url: item.attributes.url,
      github: item.attributes.github,
      technologies: item.attributes.technologies || [],
      results: item.attributes.results || [],
      testimonial: item.attributes.testimonial,
    };
  }

  private transformServices(data: CMSServiceItem[]): Service[] {
    return data.map((item) => ({
      id: item.id,
      title: item.attributes.title,
      slug: item.attributes.slug,
      description: item.attributes.description,
      longDescription: item.attributes.longDescription,
      icon: item.attributes.icon,
      features: item.attributes.features || [],
      pricing: item.attributes.pricing || {
        basic: { price: "", features: [] },
        premium: { price: "", features: [] },
        enterprise: { price: "", features: [] },
      },
      process: item.attributes.process || [],
    }));
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

// Initialize CMS client
export const cmsClient = new CMSClient({
  apiUrl: import.meta.env.VITE_CMS_API_URL || "http://localhost:1337",
  apiKey: import.meta.env.VITE_CMS_API_KEY,
  preview: import.meta.env.DEV,
});

export type { BlogPost, Project, Service };
export default cmsClient;
