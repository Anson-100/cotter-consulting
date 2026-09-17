"use client"

import { useState, useEffect } from "react"

const Greeting = () => {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const getGreeting = () => {
      const hours = new Date().getHours()

      if (hours < 12) {
        setGreeting("Good morning")
      } else if (hours < 18) {
        setGreeting("Good afternoon")
      } else {
        setGreeting("Good evening")
      }
    }

    getGreeting()
    const interval = setInterval(getGreeting, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!greeting) return null

  return (
    <p className="text-base font-semibold text-succulent dark:text-succulent tracking-tight">
      {greeting}
    </p>
  )
}

export default Greeting
