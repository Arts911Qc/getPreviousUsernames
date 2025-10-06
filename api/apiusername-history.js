// Vercel serverless function
export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  const url = `https://users.roblox.com/v1/users/${userId}/username-history`;

  try {
    // Fetch directly from Roblox
    const response = await fetch(url, {
      headers: {
        "User-Agent": "VercelProxy"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from Roblox" });
    }

    const data = await response.json();

    // Optional: cache for 10 minutes to avoid multiple Roblox hits
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate");

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
