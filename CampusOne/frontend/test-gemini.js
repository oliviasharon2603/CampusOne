import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'YOUR_API_KEY_HERE';
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + apiKey;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello" }] }]
    })
  });
  console.log("STATUS:", res.status);
  const data = await res.json();
  console.log("RESPONSE:", JSON.stringify(data, null, 2));
}
run();
