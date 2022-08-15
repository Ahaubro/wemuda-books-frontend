export function tryLoginFromStorageAsync(): Promise<void> {
  console.debug('Trying to log in')

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.debug('Logged in!')
      resolve()
    }, 2000)
  })
}
