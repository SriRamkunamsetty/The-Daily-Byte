import {
    db,
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from "@/lib/firebase";
import type { NewsItem } from "@/components/NewsCard";
import type { UserRole } from "@/context/AppContext";

// 1. Articles
export async function fetchArticles(): Promise<NewsItem[]> {
    try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const articles: NewsItem[] = [];
        snap.forEach((doc) => {
            const data = doc.data();
            articles.push({
                id: doc.id,
                title: data.title,
                description: data.description,
                category: data.category,
                timeAgo: data.timeAgo,
                image: data.image,
                imageAlt: data.imageAlt,
                content: data.content,
                // Convert Firestore timestamp to JS Date if it exists
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            });
        });
        return articles;
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
}

export async function createArticle(post: Omit<NewsItem, "id" | "createdAt" | "timeAgo">): Promise<void> {
    const newDocRef = doc(collection(db, "articles"));
    await setDoc(newDocRef, {
        ...post,
        timeAgo: "Just now",
        createdAt: serverTimestamp(),
    });
}

// 2. Users & Roles
export async function initializeUserRecord(userId: string, email: string, displayName: string, photoURL: string) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // Create new user with default 'user' role
        await setDoc(userRef, {
            email,
            displayName,
            photoURL,
            role: "user",
            createdAt: serverTimestamp(),
        });
        return "user";
    }

    return userSnap.data()?.role || "user";
}

export async function getUserRole(userId: string): Promise<UserRole> {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        return snap.data()?.role as UserRole;
    }
    return "user";
}

// 3. Favorites
export async function getUserFavorites(userId: string): Promise<Set<string>> {
    const favsRef = collection(db, "users", userId, "favorites");
    const snap = await getDocs(favsRef);
    const ids = new Set<string>();
    snap.forEach(doc => ids.add(doc.id));
    return ids;
}

export async function toggleFavoriteInDb(userId: string, articleId: string, isCurrentlyFav: boolean) {
    const favRef = doc(db, "users", userId, "favorites", articleId);
    if (isCurrentlyFav) {
        await deleteDoc(favRef);
    } else {
        await setDoc(favRef, { savedAt: serverTimestamp() });
    }
}
