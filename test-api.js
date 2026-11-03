// test-api.js
const fs = require('fs');
const path = require('path');

// Liest die .env.local Datei manuell aus
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
} catch (e) {
  console.log("Konnte .env.local nicht automatisch einlesen.");
}

async function test() {
  const apiKey = process.env.DREAMPRINT_API_KEY;
  const shopId = process.env.DREAMPRINT_SHOP_ID;

  console.log("Teste mit Shop-ID:", shopId);

  const res = await fetch('https://api.dream-print.de/v1/shop/products', {
    headers: {
      'Authorization': `Bearer ${apiKey ? apiKey.trim() : ''}`,
      'X-DreamPrint-Shop-Id': shopId ? shopId.trim() : '',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();