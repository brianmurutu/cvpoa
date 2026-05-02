const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function grantAccess() {
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) {
    console.error("User list error:", userError);
    return;
  }
  const targetUser = users.users.find(u => u.email === 'murutubrian@gmail.com');
  if (!targetUser) {
    console.log("User not found!");
    return;
  }
  console.log("Found user:", targetUser.id);
  
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase.from('access_grants').insert({
    user_id: targetUser.id,
    plan_id: 'business',
    reference: 'manual_grant_' + Date.now(),
    expires_at: expiresAt
  });
  
  if (error) console.error("Grant error:", error);
  else console.log("Grant inserted successfully!");
}

grantAccess();
