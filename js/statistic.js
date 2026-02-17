const { createClient } = supabase;

const supabaseUrl = "https://gauilfvztemzztwncuku.supabase.co";
const supabaseKey = "sb_publishable_g7hW-cLcITvnV_PqY9CeVQ_fNpLlvaN";

const db = createClient(supabaseUrl, supabaseKey);

asyn function get