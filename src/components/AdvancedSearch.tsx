import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, Filter, X, Clock, TrendingUp, Sparkles } from "lucide-react";
import { useAnalytics } from "../utils/analytics";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: "page" | "blog" | "project" | "service";
  relevance: number;
  category: string;
}

interface SearchFilters {
  type: string[];
  tags: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  sortBy: "relevance" | "date" | "popularity";
}

interface AdvancedSearchProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  placeholder = "Search everything...",
  showFilters = true,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    tags: [],
    dateRange: {},
    sortBy: "relevance",
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const analytics = useAnalytics();

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          if (!searchQuery.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
          }

          setIsLoading(true);

          try {
            // Simulate AI-powered search
            await new Promise((resolve) => setTimeout(resolve, 300));

            const mockResults: SearchResult[] = [
              {
                id: "1",
                title: `Advanced ${searchQuery} Solutions`,
                type: "service",
                excerpt: `Comprehensive ${searchQuery} services tailored to your business needs.`,
                relevance: 0.95,
                category: "Services",
              },
              {
                id: "2",
                title: `${searchQuery} Case Study`,
                type: "project",
                excerpt: `Successful implementation of ${searchQuery} for enterprise client.`,
                relevance: 0.87,
                category: "Portfolio",
              },
              {
                id: "3",
                title: `Understanding ${searchQuery}`,
                type: "blog",
                excerpt: `Deep dive into ${searchQuery} best practices and implementation strategies.`,
                relevance: 0.82,
                category: "Blog",
              },
            ];

            setResults(mockResults);

            // Track search
            analytics.track("search_performed", {
              query: searchQuery,
              results_count: mockResults.length,
              search_type: "advanced",
            });
          } catch (error) {
            console.error("Search failed:", error);
            setResults([]);
          } finally {
            setIsLoading(false);
          }
        }, 300);
      };
    })(),
    [analytics, setResults, setIsLoading],
  );

  // Load recent and popular searches
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recent-searches") || "[]");
    setRecentSearches(recent.slice(0, 5));

    // Mock popular searches - in production, fetch from analytics
    setPopularSearches([
      "web design",
      "ui/ux",
      "branding",
      "development",
      "seo",
    ]);
  }, []);

  // Handle search input
  const handleSearchInput = (value: string) => {
    setQuery(value);
    setShowResults(true);
    debouncedSearch(value);
  };

  // Handle search submission
  const handleSubmit = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem("recent-searches") || "[]");
    const updated = [
      finalQuery,
      ...recent.filter((q: string) => q !== finalQuery),
    ].slice(0, 10);
    localStorage.setItem("recent-searches", JSON.stringify(updated));
    setRecentSearches(updated.slice(0, 5));

    // Track search submission
    analytics.track("search_submitted", {
      query: finalQuery,
      filters,
      source: "advanced_search",
    });

    onSearch?.(finalQuery, filters);
    setShowResults(false);
  };

  // Handle filter changes
  const updateFilter = (
    key: keyof SearchFilters,
    value: string[] | string | Record<string, Date>,
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (query) {
      debouncedSearch(query);
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowResults(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const resultTypeIcons = {
    page: "📄",
    blog: "📝",
    project: "🚀",
    service: "⚙️",
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Clear button */}
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowResults(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters Toggle */}
      {showFilters && (
        <button
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className="mt-2 inline-flex items-center gap-2 px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
          {(filters.type.length > 0 || filters.tags.length > 0) && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
              {filters.type.length + filters.tags.length}
            </span>
          )}
        </button>
      )}

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Content Type
              </label>
              <div className="space-y-2">
                {["page", "blog", "project", "service"].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.type, type]
                          : filters.type.filter((t) => t !== type);
                        updateFilter("type", newTypes);
                      }}
                      className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                      {resultTypeIcons[type as keyof typeof resultTypeIcons]}{" "}
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    type: [],
                    tags: [],
                    dateRange: {},
                    sortBy: "relevance",
                  })
                }
                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-300 dark:border-zinc-600 rounded-md transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
          {/* No query state */}
          {!query && (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Recent Searches
                    </span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          handleSubmit(search);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Popular Searches
                  </span>
                </div>
                <div className="space-y-1">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSubmit(search);
                      }}
                      className="block w-full text-left px-2 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && results.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {results.length} results found
                </span>
              </div>
              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleSubmit(result.title)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">
                        {resultTypeIcons[result.type]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                          {result.title}
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                          {result.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded">
                            {result.category}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {Math.round(result.relevance * 100)}% match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query && results.length === 0 && !isLoading && (
            <div className="p-4 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No results found for "{query}"
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
