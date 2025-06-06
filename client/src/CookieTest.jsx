import React, { useState } from 'react';

const CookieTest = () => {
  const [result, setResult] = useState(null);
  const handleTest = async () => {
    const res = await fetch('http://localhost:3000/cookie-test', {
      method: 'GET',
      credentials: 'include', // svarbu, kad cookie būtų išsaugota
    });
    const data = await res.json();
    setResult(data);
  };
  return (
    <div style={{ padding: 40 }}>
      <button onClick={handleTest} style={{ fontSize: 18, padding: '10px 24px', borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 700 }}>
        Testuoti cookies
      </button>
      {result && (
        <pre style={{ marginTop: 24, background: '#f5f5f5', padding: 16, borderRadius: 8 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};

export default CookieTest;
