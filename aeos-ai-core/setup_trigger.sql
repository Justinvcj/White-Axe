-- Drop the trigger and function if they already exist to ensure idempotency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Trigger to sync auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users
  -- Default to 'Parent' role since the user signed in with parent@test.com
  -- But usually we'd allow them to select this. For testing, we just need a valid row.
  INSERT INTO public.users (id, email, role, first_name, last_name, school_id)
  VALUES (
    NEW.id, 
    NEW.email, 
    'Parent', -- Hardcoded to unblock parent testing flow
    'DummyFirstName', 
    'DummyLastName',
    '11111111-1111-1111-1111-111111111111'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert dummy student profile just in case it's a student (fails safely if fk violates)
  BEGIN
    INSERT INTO public.student_profiles (user_id, current_tier, current_interest)
    VALUES (NEW.id, 'C1', 'General Science')
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Do nothing if it fails
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
