
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { action, payload } = await req.json()

  const service_key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  const supabase_url = Deno.env.get("SUPABASE_URL")
  if (!service_key || !supabase_url) {
    return new Response(
      JSON.stringify({ error: "Supabase secret not set" }), 
      { status: 500 }
    )
  }

  const headers = { 'apiKey': service_key, 'Authorization': `Bearer ${service_key}`, 'Content-Type': 'application/json' }

  if (action === "create") {
    // Add user via Supabase Auth Admin API
    const res = await fetch(`${supabase_url}/auth/v1/admin/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
        user_metadata: {
          full_name: payload.full_name,
          role: payload.role
        }
      })
    })
    const data = await res.json()
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.msg || data.error_description || "Failed to create user" }), { status: 400 })
    }
    return new Response(JSON.stringify({ user: data }))
  }

  if (action === "delete") {
    // Hapus user di Supabase Auth Admin API
    if (!payload || !payload.id) return new Response(JSON.stringify({ error: "User id required" }), { status: 400 })
    const res = await fetch(`${supabase_url}/auth/v1/admin/users/${payload.id}`, {
      method: "DELETE",
      headers,
    })
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to delete user" }), { status: 400 })
    }
    return new Response(JSON.stringify({ success: true }))
  }

  return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 })
})
