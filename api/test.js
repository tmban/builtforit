export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({ 
      status: "NO KEY", 
      message: "ANTHROPIC_API_KEY environment variable is not set" 
    });
  }

  return res.status(200).json({ 
    status: "KEY EXISTS",
    keyStart: apiKey.slice(0, 10) + "...",
    keyLength: apiKey.length,
    startsCorrectly: apiKey.startsWith("sk-ant-")
  });
}
