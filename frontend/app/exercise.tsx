import { useState } from "react"

export default function LightDarkButton() {
  const [isDark, setIsDark] = useState(false)

  return (
    <button onClick={() => setIsDark(!isDark)}>
      {isDark ? "Dark" : "Light"}
    </button>
  )
}
