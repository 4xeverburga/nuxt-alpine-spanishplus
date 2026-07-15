export const withTrailingSlash = (path: string) => path.endsWith('/') ? path : `${path}/`
