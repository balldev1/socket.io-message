'use client'
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  useEffect(() => {
    // เชื่อมต่อกับเซิร์ฟเวอร์
    const socketIo:any = io();

    // รับข้อความตอบกลับจากเซิร์ฟเวอร์
    socketIo.on('response', (data) => {
      setResponse(data);
    });

    // ทำความสะอาดการเชื่อมต่อเมื่อคอมโพเนนต์ถูกทำลาย
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      // ส่งข้อความไปยังเซิร์ฟเวอร์
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
      <div >
        <h1>Socket.IO </h1>
        <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="text-black"
        />
        <button onClick={sendMessage}>Send</button>
        <p>Response: {response}</p>
      </div>
  );
}
