export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const query = url.searchParams.get("q");
  
  if (!query) {
    return new Response(JSON.stringify({ error: "Missing ?q= parameter" }), {
      status: 400,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  const SERPAPI_KEY = context.env.SERPAPI_KEY;
  const params = new URLSearchParams({
    engine: "google_shopping",
    q: query,
    num: "8",
    api_key: SERPAPI_KEY
  });

  try {
    const resp = await fetch("https://serpapi.com/search.json?" + params.toString());
    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
