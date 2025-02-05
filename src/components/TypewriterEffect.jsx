import { useState, useEffect } from "react"

const phrases = [
"Personaliza tu experiencia de aprendizaje.",
"Obtén recomendaciones basadas en tus intereses.",
"Únete a la comunidad Wise hoy mismo.",
"No olvides lo que sabes sobre Inglés.",
"¡Aprende algo nuevo cada día con Wise!",
"Pon a prueba tus conocimientos.",
]

const TypewriterEffect = () => {
const [phraseIndex, setPhraseIndex] = useState(0)
const [charIndex, setCharIndex] = useState(0)
const [isDeleting, setIsDeleting] = useState(false)

useEffect(() => {
    const timer = setTimeout(
    () => {
        if (!isDeleting && charIndex < phrases[phraseIndex].length) {
        setCharIndex(charIndex + 1)
        } else if (isDeleting && charIndex > 0) {
        setCharIndex(charIndex - 1)
        } else if (charIndex === 0 && isDeleting) {
        setIsDeleting(false)
        setPhraseIndex((phraseIndex + 1) % phrases.length)
        } else {
        setIsDeleting(true)
        setTimeout(() => {}, 3000) // Wait for 3 seconds before deleting
        }
    },
    isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timer)
}, [charIndex, isDeleting, phraseIndex])

return (
    <div className="typewriter-container abril-fatface-regular">
    <p className="typewriter-text">{phrases[phraseIndex].substring(0, charIndex)}</p>
    </div>
)
}

export default TypewriterEffect

