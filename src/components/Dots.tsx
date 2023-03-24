import { useState, useEffect } from "react"

export function Dots() {
	const [text, setText] = useState<string>('')

	useEffect(() => {
		const id = setInterval(
			() => setText(prev => prev.length === 3 ? '' : prev + '.'),
			300
		)
		return () => clearInterval(id)
	}, [])

	return <span>{text}</span>
}