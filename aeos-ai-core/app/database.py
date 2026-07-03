import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env
load_dotenv()

# We use the Service Role Key here to bypass RLS, 
# as this AI Core backend is a trusted environment.
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
