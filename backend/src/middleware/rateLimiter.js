import rateLimit from "../config/upstash.js"

const rateLimiter = async (req, res, next) => {
    try {
        // Upstash bağlantısı yoksa rate limiting'i atla
        if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
            console.warn("Rate limiting disabled - Upstash credentials not configured");
            return next();
        }

        const { success } = await rateLimit.limit("my-limit-key")

        if (!success) {
            return res.status(429).json({
                message: "Too many request"
            })
        }

        next()
    } catch (error) {
        console.error("Rate limit error", error);
        // Hata durumunda rate limiting'i atla, uygulamayı çökertme
        next()
    }
}

export default rateLimiter;