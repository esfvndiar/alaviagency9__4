import React, { useState, useEffect, useRef, useCallback } from "react";
import Layout from "../components/Layout";
import { Filter, Search, X, ChevronRight } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
  tags: string[];
  year?: string;
  client?: string;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Digital Transformation Platform",
    description:
      "A comprehensive platform that streamlined operations for a Fortune 500 company, resulting in 35% increased efficiency.",
    category: "Web Application",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/work/digital-transformation",
    tags: ["React", "Node.js", "AWS", "Enterprise"],
    year: "2024",
    client: "Fortune 500 Company",
    featured: true,
  },
  {
    id: 2,
    title: "E-Commerce Redesign",
    description:
      "Complete overhaul of an e-commerce platform that increased conversion rates by 28% and improved user satisfaction.",
    category: "UX/UI Design",
    image:
      "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/work/ecommerce-redesign",
    tags: ["Figma", "React", "Shopify", "E-commerce"],
    year: "2023",
    client: "Fashion Retailer",
  },
  {
    id: 3,
    title: "AI-Powered Analytics Dashboard",
    description:
      "An intelligent analytics platform that provides real-time insights and predictive analysis for business decision-making.",
    category: "Data Visualization",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/work/analytics-dashboard",
    tags: ["Python", "TensorFlow", "D3.js", "AI/ML"],
    year: "2023",
    client: "Tech Startup",
    featured: true,
  },
  {
    id: 4,
    title: "Mobile Banking App",
    description:
      "A secure, intuitive mobile banking application that revolutionized how customers interact with their finances.",
    category: "Mobile App",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/work/mobile-banking",
    tags: ["React Native", "Swift", "Kotlin", "Fintech"],
    year: "2022",
    client: "Financial Institution",
  },
  {
    id: 5,
    title: "Healthcare Management System",
    description:
      "An integrated system that improved patient care coordination and reduced administrative overhead by 40%.",
    category: "Enterprise Solution",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/work/healthcare-system",
    tags: ["Angular", ".NET", "SQL", "Healthcare"],
    year: "2022",
    client: "Healthcare Provider",
  },
  {
    id: 6,
    title: "Sustainable Energy Platform",
    description:
      "A platform that helps organizations monitor and optimize their energy usage, promoting sustainability and cost savings.",
    category: "IoT Solution",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/work/sustainable-energy",
    tags: ["IoT", "React", "Node.js", "Sustainability"],
    year: "2021",
    client: "Energy Company",
  },
];

const categories = Array.from(
  new Set(PROJECTS.map((project) => project.category)),
);

const Work: React.FC = () => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(PROJECTS);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const featuredProjects = PROJECTS.filter((project) => project.featured);

  const filterRef = useRef<HTMLDivElement>(null);

  const filterProjects = useCallback(() => {
    let result = [...PROJECTS];

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((project) => project.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    setFilteredProjects(result);
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    filterProjects();
  }, [filterProjects]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleProjectHover = (entering: boolean, project?: Project) => {
    setIsCursorVisible(entering);
    if (project) {
      setSelectedProject(project);
    }
  };

  return (
    <Layout>
      {/* Custom cursor for project hover */}
      {isCursorVisible && selectedProject && (
        <div
          className="fixed pointer-events-none z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            opacity: isCursorVisible ? 1 : 0,
          }}
        >
          <div className="bg-zinc-900 text-white rounded-full px-4 py-2 flex items-center text-sm font-medium">
            <span>View Project</span>
            <ChevronRight className="ml-1 w-4 h-4" />
          </div>
        </div>
      )}

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-5xl mx-auto mb-24">
              <h1 className="font-space-grotesk text-6xl md:text-7xl font-medium mb-8 leading-tight">
                Crafting digital{" "}
                <span className="text-gradient">experiences</span> that inspire
                and engage
              </h1>
              <p className="text-xl md:text-2xl text-zinc-600 max-w-3xl">
                Explore our portfolio of innovative solutions that have
                transformed businesses and delighted users across industries.
              </p>
            </div>
          </ScrollReveal>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-24">
              <ScrollReveal>
                <h2 className="text-2xl font-space-grotesk font-medium mb-12 flex items-center">
                  <span className="w-12 h-[1px] bg-zinc-300 mr-4"></span>
                  Featured Work
                </h2>
              </ScrollReveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {featuredProjects.map((project, index) => (
                  <ScrollReveal key={project.id} delay={index * 150}>
                    <a
                      href={project.link}
                      className="group block relative"
                      onMouseEnter={() => handleProjectHover(true, project)}
                      onMouseLeave={() => handleProjectHover(false)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-zinc-500">
                            {project.year}
                          </span>
                          <span className="text-sm font-medium text-zinc-500">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-2xl font-medium mb-2 group-hover:text-gradient transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-zinc-600">{project.description}</p>
                      </div>
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {/* Filter and Search */}
          <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="relative w-full md:w-auto" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>{activeCategory}</span>
              </button>

              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg z-10 py-2 border border-zinc-100 dark:border-zinc-700">
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${activeCategory === "All" ? "text-blue-600 font-medium" : ""}`}
                    onClick={() => {
                      setActiveCategory("All");
                      setIsFilterOpen(false);
                    }}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${activeCategory === category ? "text-blue-600 font-medium" : ""}`}
                      onClick={() => {
                        setActiveCategory(category);
                        setIsFilterOpen(false);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-zinc-200"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No projects found</h3>
              <p className="text-zinc-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProjects.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 100}>
                  <a
                    href={project.link}
                    className="group block"
                    onMouseEnter={() => handleProjectHover(true, project)}
                    onMouseLeave={() => handleProjectHover(false)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-6">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-500">
                        {project.year}
                      </span>
                      <span className="text-sm font-medium text-zinc-500">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-medium mb-2 group-hover:text-gradient transition-colors duration-300">
                      {project.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded-full">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Work;
