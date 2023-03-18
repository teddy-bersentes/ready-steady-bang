export const background = <T>(fn: () => Promise<T>): void => {
	return void fn().catch((err) => {
		console.error(
			'Background Error:',
			err
		)
	})
}