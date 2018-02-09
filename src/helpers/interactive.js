let interactive = true

// Travis sets this variable
export const isCI = process.env.CI !== undefined && process.env.CI === "true"

export const setInteractive = i => (interactive = i.toString() === "true")

export const isInteractive = () => !isCI && interactive
