export const convertUnixNanoToDate = (unixNano: number): Date => {
  const milliseconds = Number(unixNano / 1_000_000) // Convert to milliseconds

  return new Date(milliseconds)
}
