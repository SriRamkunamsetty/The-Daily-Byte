import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NewsItem } from '@/components/NewsCard';

export function useNews(category: string) {
    const [articles, setArticles] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        let q;

        if (category === 'All' || category === 'Top News') {
            q = query(
                collection(db, 'news'),
                orderBy('timestamp', 'desc'),
                limit(20)
            );
        } else {
            q = query(
                collection(db, 'news'),
                where('category', '==', category.toLowerCase()),
                orderBy('timestamp', 'desc'),
                limit(20)
            );
        }

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const newsData: NewsItem[] = [];
                snapshot.forEach((doc) => {
                    newsData.push({ id: doc.id, ...doc.data() } as NewsItem);
                });
                setArticles(newsData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching news:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [category]);

    return { articles, loading, error };
}
