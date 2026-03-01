import { useState, useEffect, useRef } from 'react';
import type { NewsItem } from '@/components/NewsCard';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export function useNews(category: string) {
    const [articles, setArticles] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Keep track of previous articles so we don't clear them on error
    const prevArticles = useRef<NewsItem[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchNews = async () => {
            if (!API_KEY) {
                console.warn("VITE_NEWS_API_KEY is missing in env. Cannot fetch live news.");
                if (isMounted) setLoading(false);
                return;
            }

            try {
                // Determine API endpoint category
                let catParam = '';
                if (category !== 'All' && category !== 'Top News') {
                    // Map generic categories to NewsAPI accepted categories if needed
                    const apiCategory = category.toLowerCase() === 'technology' ? 'technology' :
                        category.toLowerCase() === 'business' ? 'business' :
                            category.toLowerCase() === 'science' ? 'science' : 'general';
                    catParam = `&category=${apiCategory}`;
                }

                const url = `https://newsapi.org/v2/top-headlines?country=us${catParam}&apiKey=${API_KEY}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`NewsAPI returned status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === "ok" && data.articles) {
                    const mappedArticles: NewsItem[] = data.articles
                        .filter((art: any) => art.title && art.title !== "[Removed]")
                        .map((art: any, index: number) => {
                            const date = new Date(art.publishedAt);
                            const hoursAgo = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
                            const timeStr = hoursAgo <= 0 ? "Just now" : `${hoursAgo}h ago`;

                            return {
                                id: `newsapi-${category}-${index}-${date.getTime()}`,
                                title: art.title,
                                description: art.description || "Read more about this story...",
                                category: category === 'All' ? 'Top News' : category,
                                timeAgo: timeStr,
                                createdAt: date,
                                image: art.urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80',
                                imageAlt: art.title,
                                content: art.content || art.description || "Content unavailable. Click to read more on the source site.",
                                url: art.url
                            } as NewsItem;
                        });

                    if (isMounted) {
                        setArticles(mappedArticles);
                        prevArticles.current = mappedArticles;
                        setError(null);
                    }
                } else {
                    throw new Error(data.message || "Failed to fetch news from API");
                }
            } catch (err: any) {
                console.error("News Fetch Error:", err);
                if (isMounted) {
                    // Retain old news on failure! "If API fails, keep old news. Do not crash app."
                    setArticles(prevArticles.current);
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        setLoading(true);
        fetchNews();

        // Refresh every 1 hour (3600000ms)
        const intervalId = setInterval(fetchNews, 3600000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [category]);

    return { articles, loading, error };
}
