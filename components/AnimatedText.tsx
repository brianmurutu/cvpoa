'use client'

import { useState, useEffect } from 'react'

const phrases = [
  "an AI-powered CV",
  "a tailored Cover Letter",
  "an ATS-ready Resume",
  "a winning profile"
]

export default function AnimatedText() {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((current) => (current + 1) % phrases.length)
        setFade(true)
      }, 500)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span 
      className={`gradient-text inline-block transition-all duration-500 min-w-[300px] sm:min-w-[400px] text-left ${
        fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {phrases[index]}
    </span>
  )
}
