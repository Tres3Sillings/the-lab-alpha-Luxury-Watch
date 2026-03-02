import React from 'react';

export default function BlankPage() {
  const items = Array.from({ length: 200 }, (_, i) => `Item ${i + 1}`);

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <h1>Blank Page Test</h1>
      <p>If you can scroll this page, it means the basic routing and page rendering is working.</p>
      <ul>
        {items.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
