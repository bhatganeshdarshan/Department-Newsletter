import { createClient } from "@supabase/supabase-js";


const supabaseURL : string = 'https://phyeyoqcciwclxsomwcg.supabase.co';
const supabaseKey : string | undefined  = process.env.SUPABASE_KEY;
// console.log(supabaseKey);

export const supabase = createClient(supabaseURL,supabaseKey as string);