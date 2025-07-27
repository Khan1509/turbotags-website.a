// Run manually when adding new pages
const urls = [
  'https://turbotags.app/',
  'https://turbotags.app/features',
  // Add all important URLs here
];

async function submit() {
  const response = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: "turbotags.app",
      key: "30d7e3ffb84440aaa89c9adbdae72fc2",
      keyLocation: "https://turbotags.app/30d7e3ffb84440aaa89c9adbdae72fc2.txt",
      urlList: urls
    })
  });
  console.log(await response.text());
}

submit();
