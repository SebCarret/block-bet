const env = process.env.NODE_ENV;

export const server = env === 'development' ? 'http://localhost:3000' : 'https://block-beth.vercel.app/';