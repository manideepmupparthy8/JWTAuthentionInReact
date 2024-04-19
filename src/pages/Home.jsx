import { useState, useEffect } from 'react'
import axios from "axios"
import SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });

export default function Home() {
  
  const [username, setUsername] = useState("")
  const [isLoggedIn, setLoggedIn] = useState(false)
  
  useEffect (()=>{
    const checkLoggedInUser = async () =>{
      try{
        const accessToken = ls.get("accessToken");
        if (accessToken) {
          const config = {
            headers: {
              "Authorization":`Bearer ${accessToken}`
            }
          };
          const response = await axios.get("http://127.0.0.1:8000/api/user/", config)
          setLoggedIn(true)
          setUsername(response.data.username)
        }
        else{
          setLoggedIn(false);
          setUsername("");
        }
      }
      catch(error){
        setLoggedIn(false);
        setUsername("");
      }
    };
    checkLoggedInUser()
  }, [])

  const handleLogout = async () => {
    try{
      const accessToken = ls.get("accessToken");
      const refreshToken = ls.get("refreshToken");

      if(accessToken && refreshToken) {
        const config = {
          headers: {
            "Authorization":`Bearer ${accessToken}`
          }
        };
        await axios.post("http://127.0.0.1:8000/api/logout/", {"refresh":refreshToken}, config)
        ls.remove("accessToken");
        ls.remove("refreshToken");
        setLoggedIn(false);
        setUsername("");
        console.log("Log out successful!")
      }
    }
    catch(error){
      console.error("Failed to logout", error.response?.data || error.message)
    }
  }
  return (
    <div>
      {isLoggedIn ? (
        <>
      <h2>Hi, {username}. Thanks for logging in!</h2>
      <button onClick={handleLogout}>Logout</button>
      </>
      ):(
      <h2>Please Login</h2>
    )}
    </div>
  )
}
