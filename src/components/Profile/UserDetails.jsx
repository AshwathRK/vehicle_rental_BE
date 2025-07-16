import axios from 'axios';
import React, { useEffect, useState } from 'react'

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function UserDetails() {

  const [useInfo, setuseInfo] = useState([]);

  // Get tokens form the local storage
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');
  
  useEffect(() => {
    const checkAuth = async () => {
      // debugger
      try {
        const res = await axios.get(`${serverUrl}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Device-Id': deviceId
          }
        });
        if (res.status === 200) {
          setuseInfo(res.data.user);
        }
      } catch (err) {
        console.log(err?.response?.data?.message || "Not logged in");
      }
    };
    checkAuth();
  }, []);

  console.log(useInfo)

  return (
    <div>UserDetails</div>
  )
}
