'use client'; // This must be a client component to use hooks and handle events

import { useState } from 'react';

export default function NotificationSenderPage() {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/v1/notifications/send', { // It calls our NEW API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, body }),
      });

      if (response.ok) {
        setStatus('Notification sent successfully!');
      } else {
        const errorData = await response.json();
        setStatus(`Failed to send: ${errorData.error}`);
      }
    } catch (error) {
      setStatus('An error occurred.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Send Push Notification</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Body:</label>
          <input type="text" value={body} onChange={(e) => setBody(e.target.value)} required />
        </div>
        <button type="submit">Send Notification</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}