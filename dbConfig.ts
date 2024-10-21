import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types"

const supabaseURL : string = 'https://phyeyoqcciwclxsomwcg.supabase.co';
const supabaseKey : string | undefined  = process.env.SUPABASE_KEY;
// console.log(supabaseKey);

export const supabase = createClient<Database>(supabaseURL,supabaseKey as string);