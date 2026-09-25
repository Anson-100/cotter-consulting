export function scrollToSection(id: string, reduceMotion = false) {
  const el = document.getElementById(id)
  if (!el) return

  const behavior: ScrollBehavior = reduceMotion ? "instant" : "smooth"
  el.scrollIntoView({ behavior, block: "start" })

  // After the scroll lands, nudge if the address bar threw it off
  const correct = () => {
    const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
    const drift = el.getBoundingClientRect().top - offset
    if (Math.abs(drift) > 2) el.scrollIntoView({ behavior, block: "start" })
  }

  if ("onscrollend" in window) {
    window.addEventListener("scrollend", correct, { once: true })
  } else {
    setTimeout(correct, 700)
  }
}
