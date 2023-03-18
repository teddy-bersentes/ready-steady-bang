type Times = {
	start: number
	ready: number
	steady: number
	bang: number
}

const seconds = (n: number) => n * 1000

export const unix = (): number => Date.now()

export const generateBangTime = (steadyTime: number) => {
	const maxDelay = seconds(6)
	const minDelay = seconds(1)
	return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay + steadyTime
}

export const generateTimes = (): Times => {
	const startTime = unix()
	const readyTime = startTime + seconds(2)
	const steadyTime = readyTime + seconds(2)
	const bangTime = generateBangTime(steadyTime)

	return {
		start: startTime,
		ready: readyTime,
		steady: steadyTime,
		bang: bangTime
	}
}
