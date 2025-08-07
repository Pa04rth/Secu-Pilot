// dashboard>page.tsx
'use client'
import { useState } from "react"
export default function ScanForm() {
    const [url, setUrl] = useState('');
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value); // Update state as user types
    };
  
    const handleSubmit = async () => {
      // use `url` here to send to your backend
      console.log('Scanning:', url);
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Enter a URL"
          value={url}              
          onChange={handleChange} 
        />
        <button onClick={handleSubmit}>Scan</button>
      </div>
    );
  }