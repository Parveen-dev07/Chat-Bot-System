import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { getToken } from './utils/auth'
import { socket } from './socket/socket'

function App() {
  const [count, setCount] = useState(0)

  console.log("show token---->",getToken());


  useEffect(()=>{
    socket.connect()
  },[])
  

  return (
   


    <>
    <AppRoutes/>
    </>
  )
}

export default App
