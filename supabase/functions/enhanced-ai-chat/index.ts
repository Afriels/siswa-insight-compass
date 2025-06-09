
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, adminMode, internetSearch, dbAccess, userRole, userId, aiProvider = 'openai' } = await req.json();

    let response = '';
    let searchResults = [];
    let dbOperations = [];

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Internet search with Perplexity if enabled
    if (internetSearch && perplexityApiKey) {
      try {
        const searchResponse = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant for school counseling (BK). Provide relevant, current information about counseling techniques, student psychology, and educational best practices. Respond in Indonesian.'
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.2,
            top_p: 0.9,
            max_tokens: 1000,
            return_images: false,
            return_related_questions: false,
            search_recency_filter: 'month',
          }),
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const searchContent = searchData.choices[0]?.message?.content || '';
          searchResults.push({
            title: 'Internet Search Result',
            content: searchContent
          });
        }
      } catch (error) {
        console.error('Perplexity search error:', error);
      }
    }

    // Database operations if enabled and user is admin/counselor
    if (dbAccess && (userRole === 'admin' || userRole === 'counselor')) {
      try {
        // Example database queries based on message content
        if (message.toLowerCase().includes('siswa') || message.toLowerCase().includes('student')) {
          const { data: students, error } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('role', 'student')
            .limit(5);

          if (!error && students) {
            dbOperations.push(`Found ${students.length} students in database`);
          }
        }

        if (message.toLowerCase().includes('konsultasi') || message.toLowerCase().includes('consultation')) {
          const { data: consultations, error } = await supabase
            .from('consultations')
            .select('*')
            .limit(5);

          if (!error && consultations) {
            dbOperations.push(`Found ${consultations.length} recent consultations`);
          }
        }

        if (message.toLowerCase().includes('perilaku') || message.toLowerCase().includes('behavior')) {
          const { data: behaviors, error } = await supabase
            .from('behavior_records')
            .select('*')
            .limit(5);

          if (!error && behaviors) {
            dbOperations.push(`Found ${behaviors.length} behavior records`);
          }
        }
      } catch (error) {
        console.error('Database operation error:', error);
      }
    }

    // Generate AI response with selected provider
    const systemPrompt = `You are an enhanced AI assistant for BK Connect, a school counseling application. 
      
Context:
- User Role: ${userRole}
- Admin Mode: ${adminMode}
- Internet Search: ${internetSearch}
- Database Access: ${dbAccess}
- Search Results: ${JSON.stringify(searchResults)}
- Database Operations: ${JSON.stringify(dbOperations)}

You have access to:
${adminMode ? '- Full administrative functions including database modifications' : '- Standard counseling assistance'}
${internetSearch ? '- Real-time internet search capabilities' : ''}
${dbAccess ? '- Direct database access for queries and updates' : ''}

Respond in Indonesian. Be helpful, professional, and provide actionable advice for school counseling scenarios.
If you have search results or database information, incorporate them naturally into your response.`;

    if (aiProvider === 'gemini' && geminiApiKey) {
      // Use Gemini API
      try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\n\nUser message: ${message}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          }),
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          response = geminiData.candidates[0]?.content?.parts[0]?.text || 'Maaf, tidak dapat memproses permintaan Anda saat ini.';
        } else {
          response = 'Terjadi kesalahan saat menghubungi Gemini AI. Silakan coba lagi.';
        }
      } catch (error) {
        console.error('Gemini API error:', error);
        response = 'Terjadi kesalahan saat menghubungi Gemini AI. Silakan coba lagi.';
      }
    } else if (openAIApiKey) {
      // Use OpenAI API
      try {
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          response = aiData.choices[0]?.message?.content || 'Maaf, tidak dapat memproses permintaan Anda saat ini.';
        } else {
          response = 'Terjadi kesalahan saat menghubungi OpenAI. Silakan coba lagi.';
        }
      } catch (error) {
        console.error('OpenAI API error:', error);
        response = 'Terjadi kesalahan saat menghubungi OpenAI. Silakan coba lagi.';
      }
    } else {
      response = 'API key tidak ditemukan. Menggunakan respons default.';
    }

    return new Response(JSON.stringify({ 
      response, 
      searchResults, 
      dbOperations,
      aiProvider: aiProvider 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'Maaf, terjadi kesalahan sistem. Silakan coba lagi nanti.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
