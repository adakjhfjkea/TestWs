const https = require('https');

const url = 'https://www.google.com/maps/place/L%C3%A0m+b%E1%BA%A3ng+hi%E1%BB%87u+-+H%E1%BB%99p+%C4%91%C3%A8n+Qu%E1%BA%A3ng+c%C3%A1o+G%C3%B2+N%E1%BB%95i/@10.9026059,106.633162,15z/data=!4m6!3m5!1s0x3174d7ed727e0875:0xb9b16db176cb9d!8m2!3d10.9026059!4d106.633162!16s%2Fg%2F11yvh073rl';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const descMatch = data.match(/<meta content="([^"]+)" itemprop="description"/i) || data.match(/<meta name="description" content="([^"]+)"/i);
    console.log("Description:", descMatch ? descMatch[1] : "Not found");
    
    const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
    console.log("Title:", titleMatch ? titleMatch[1] : "Not found");
    
    const ratingMatch = data.match(/([0-9.,]+)\s*(?:stars?|sao)/i) || data.match(/([0-9.,]+)\s*\\u2605/);
    console.log("Rating:", ratingMatch ? ratingMatch[1] : "Not found");
    
    const reviewMatch = data.match(/([0-9.,]+)\s*(?:reviews?|đánh giá)/i);
    console.log("Reviews:", reviewMatch ? reviewMatch[1] : "Not found");
  });
}).on('error', console.error);
