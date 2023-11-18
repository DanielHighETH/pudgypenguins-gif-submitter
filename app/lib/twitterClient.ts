import Twitter from 'twitter-api-v2'

export const client = new Twitter({
    appKey: process.env.APP_KEY as string,
    appSecret: process.env.APP_SECRET as string,
    accessToken: process.env.ACCESS_TOKEN as string,
    accessSecret: process.env.ACCESS_SECRET as string,
})