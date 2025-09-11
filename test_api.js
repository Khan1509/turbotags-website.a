// Simple test script to verify API validation and enforcement
import fetch from 'node-fetch';

async function testAPI() {
  const testCases = [
    {
      name: "YouTube Tags & Hashtags",
      data: {
        prompt: "gaming content for beginners",
        platform: "youtube",
        contentFormat: "long_video",
        region: "global",
        language: "english",
        task: "tags_and_hashtags"
      }
    },
    {
      name: "YouTube Short Video Titles",
      data: {
        prompt: "quick cooking tips",
        platform: "youtube",
        contentFormat: "short",
        region: "global", 
        language: "english",
        task: "titles"
      }
    },
    {
      name: "Instagram Hashtags",
      data: {
        prompt: "fitness motivation",
        platform: "instagram",
        contentFormat: "post",
        region: "global",
        language: "english", 
        task: "tags_and_hashtags"
      }
    },
    {
      name: "Test with Missing Parameters (should use defaults)",
      data: {
        prompt: "travel content"
        // Missing all other parameters - should use defaults
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`📄 Request:`, JSON.stringify(testCase.data, null, 2));
    
    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });
      
      const result = await response.json();
      console.log(`✅ Status: ${response.status}`);
      
      // Validate response structure
      if (result.titles) {
        console.log(`📝 Titles count: ${result.titles.length} (should be 5-7)`);
        result.titles.forEach((title, i) => {
          console.log(`  ${i+1}. "${title.text}" (${title.trend_percentage}% trend, ${title.text.length} chars)`);
          if (testCase.data.platform === 'youtube' && testCase.data.contentFormat === 'short') {
            if (!title.text.includes('#shorts')) {
              console.log(`    ⚠️  Missing #shorts tag!`);
            }
          }
        });
      }
      
      if (result.tags) {
        console.log(`🏷️  Tags count: ${result.tags.length} (should be 15-20)`);
      }
      
      if (result.hashtags) {
        console.log(`#️⃣ Hashtags count: ${result.hashtags.length} (should be 15-20)`);
      }
      
    } catch (error) {
      console.log(`❌ Error:`, error.message);
    }
  }
}

testAPI().catch(console.error);