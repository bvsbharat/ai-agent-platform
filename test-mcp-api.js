// Using built-in fetch API (Node.js 18+)

async function testMCPAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/mcps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: 'https://knhgkaawjfqqwmsgmxns.supabase.co/rest/v1/mcps?select=*&active=eq.true&order=company_id.asc.nullslast&limit=10&offset=0',
        authToken: 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IlU2NFI2Vm96MzROUE1xcCsiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2tuaGdrYWF3amZxcXdtc2dteG5zLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmMjIzOTE0ZS03MzAxLTQ5YTctYjUyNC02NDk1NGYwZTdhZjkiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUwODI5Njc5LCJpYXQiOjE3NTA4MjYwNzksImVtYWlsIjoidWliaGFyYXRAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKWmJVeHZmenBsd1pmTjI3eVRFRDdsLTlVWk15cFJDTmVXR1RqZVljZDZqbXlGUEpEMD1zOTYtYyIsImVtYWlsIjoidWliaGFyYXRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IkJoYXJhdCIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJCaGFyYXQiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKWmJVeHZmenBsd1pmTjI3eVRFRDdsLTlVWk15cFJDTmVXR1RqZVljZDZqbXlGUEpEMD1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTExNDUxNzY4NTY4MTkxNTQ1NTk0Iiwic3ViIjoiMTExNDUxNzY4NTY4MTkxNTQ1NTk0In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3NTA4NzA3MDV9XSwic2Vzc2lvbl9pZCI6ImNjNzUzZGQ1LTNkNzktNDNjYS04ZThhLTU5OGZiNWE5ZjJmNSIsImlzX2Fub255bW91cyI6ZmFsc2V9.WP04ntKWeLvbhTuB-VV57jSv-VLi1u9atekGp5UeF4k'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing MCP API:', error);
  }
}

testMCPAPI();