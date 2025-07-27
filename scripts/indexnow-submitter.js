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
      key: "a9a8c9d7d2164bdcaf882d56136d207e",
      keyLocation: "https://turbotags.app/a9a8c9d7d2164bdcaf882d56136d207e.txt",
      urlList: urls
    })
  });
  console.log(await response.text());
}

submit();
