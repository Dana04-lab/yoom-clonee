const tokenProvider = async (userId: string): Promise<string> => {
    const res = await fetch(`/api/token?userId=${userId}`);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Token fetch failed:", res.status, errorText);
      throw new Error("Token fetch failed");
    }
  
    const data = await res.json();
    return data.token;
  };
  
  export default tokenProvider;
  