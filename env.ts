import dotenv from 'dotenv'

dotenv.config()

const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  REPLY_TO_ANY: process.env.REPLY_TO_ANY === "true"
}

export default env
