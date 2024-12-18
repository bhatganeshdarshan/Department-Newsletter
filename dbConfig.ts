require('dotenv').config(); 

import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseURL: string = 'https://phyeyoqcciwclxsomwcg.supabase.co';
const supabaseKey: any = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseURL, supabaseKey);
