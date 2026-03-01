const admin = require('firebase-admin');
const NewsAPI = require('newsapi');
require('dotenv').config();

// Initialize Firebase Admin (Handles GitHub Secret or Local File)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require("./serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

async function syncNews(category) {
    try {
        console.log(`🚀 Starting sync for: ${category}`);

        // Enterprise Date Filtering: Only headlines from the last 24 hours for "Daily" relevance
        // Use UTC for consistency across environments (India vs GitHub servers)
        const date = new Date();
        date.setHours(date.getHours() - 24);
        const fromDate = date.toISOString().split('T')[0];

        const response = await newsapi.v2.topHeadlines({
            category: category,
            language: 'en',
            country: 'us',
            from: fromDate
        });

        // Strict check for API limits or empty results
        if (!response || !response.articles || response.articles.length === 0) {
            console.log(`⚠️ No new articles found for ${category}.`);
            return;
        }

        const batch = db.batch();
        const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";
        let addedCount = 0;

        response.articles.forEach((article) => {
            if (!article.title || article.title === "[Removed]") return;

            // Duplicate Prevention: Unique ID based on the title (Base64)
            // Replacements ensure DocID is Firestore-safe (no slashes)
            const base64Title = Buffer.from(article.title).toString('base64');
            const docId = base64Title.replace(/\//g, '_').replace(/\+/g, '-').substring(0, 50);
            const docRef = db.collection('news').doc(docId);

            batch.set(docRef, {
                title: article.title,
                description: article.description || "Read the full story on the original site.",
                url: article.url,
                imageUrl: article.urlToImage || fallbackImage,
                category: category,
                source: article.source.name || "Global Desk",
                publishedAt: article.publishedAt,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                addedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true }); // Merge true prevents overwriting manual metadata if any

            addedCount++;
        });

        await batch.commit();
        console.log(`✅ Successfully synced ${addedCount} articles for ${category}!`);
    } catch (error) {
        console.error(`❌ Error syncing ${category}:`, error.message);
    }
}

// Run the sync for specific categories
async function main() {
    const categories = ['technology', 'business', 'science', 'health'];
    for (const cat of categories) {
        await syncNews(cat);
    }
}

main().then(() => {
    console.log("🏁 News Sync Sequence Complete.");
    process.exit(0);
}).catch(err => {
    console.error("🔥 Fatal Sync Error:", err);
    process.exit(1);
});
