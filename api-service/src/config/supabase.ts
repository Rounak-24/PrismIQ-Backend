import { createClient } from "@supabase/supabase-js"
import { env } from "node:process"
import { config } from "dotenv"
config()

export const supabase = createClient(
    env.SUPABASE_URL as string,
    env.SUPABASE_API_KEY as string
)

