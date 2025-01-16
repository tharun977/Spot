import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!error && data.user) {
    // Check if user is admin and create admin record if email ends with @admin.spot
    if (email.endsWith('@admin.spot')) {
      const { error: adminError } = await supabase
        .from('admins')
        .upsert({ 
          id: data.user.id,
          name: email.split('@')[0],
          username: email.split('@')[0]
        });
      
      if (adminError) console.error('Error creating admin:', adminError);
    }
  }

  return { data, error };
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}