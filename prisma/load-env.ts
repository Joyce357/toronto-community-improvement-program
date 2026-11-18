// Side-effect module: loads .env.local before any other import reads process.env.
import { config } from 'dotenv'
config({ path: '.env.local' })
config()

