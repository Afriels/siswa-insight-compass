-- Create academic interest test template with questions for IPA, IPS, and Bahasa
INSERT INTO psychology_test_templates (title, description, category, duration_minutes, instructions, is_active)
VALUES (
  'Tes Minat Akademik',
  'Tes untuk mengidentifikasi minat siswa terhadap bidang IPA, IPS, atau Bahasa',
  'Academic Interest',
  30,
  'Jawablah setiap pertanyaan dengan jujur sesuai dengan minat dan preferensi Anda. Tidak ada jawaban benar atau salah.',
  true
);

-- Get the template ID for questions (will be generated automatically)
-- Insert questions for academic interest test
INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya lebih suka mempelajari fenomena alam dan cara kerjanya',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  1,
  '{"ipa": [1, 2, 3, 4, 5], "ips": [0, 0, 0, 0, 0], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya tertarik untuk memahami masalah sosial dan ekonomi masyarakat',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  2,
  '{"ipa": [0, 0, 0, 0, 0], "ips": [1, 2, 3, 4, 5], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya senang membaca novel dan puisi',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  3,
  '{"ipa": [0, 0, 0, 0, 0], "ips": [0, 0, 0, 0, 0], "bahasa": [1, 2, 3, 4, 5]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya lebih suka menyelesaikan soal matematika yang menantang',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  4,
  '{"ipa": [1, 2, 3, 4, 5], "ips": [0, 0, 0, 0, 0], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya tertarik mempelajari sejarah dan budaya berbagai negara',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  5,
  '{"ipa": [0, 0, 0, 0, 0], "ips": [1, 2, 3, 4, 5], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya suka menulis cerita atau artikel',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  6,
  '{"ipa": [0, 0, 0, 0, 0], "ips": [0, 0, 0, 0, 0], "bahasa": [1, 2, 3, 4, 5]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya tertarik melakukan eksperimen di laboratorium',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  7,
  '{"ipa": [1, 2, 3, 4, 5], "ips": [0, 0, 0, 0, 0], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya suka menganalisis data statistik dan grafik',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  8,
  '{"ipa": [0, 1, 1, 2, 3], "ips": [1, 2, 3, 4, 5], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya tertarik mempelajari tata bahasa dan struktur kalimat',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  9,
  '{"ipa": [0, 0, 0, 0, 0], "ips": [0, 0, 0, 0, 0], "bahasa": [1, 2, 3, 4, 5]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya senang belajar tentang biologi dan kehidupan makhluk hidup',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  10,
  '{"ipa": [1, 2, 3, 4, 5], "ips": [0, 0, 0, 0, 0], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya tertarik memahami sistem politik dan pemerintahan',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  11,
  '{"ipa": [0, 0, 0, 0, 0], "ips": [1, 2, 3, 4, 5], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya suka menginterpretasi makna dalam karya sastra',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  12,
  '{"ipa": [0, 0, 0, 0, 0], "ips": [0, 0, 0, 0, 0], "bahasa": [1, 2, 3, 4, 5]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya tertarik mempelajari kimia dan reaksi-reaksi kimia',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  13,
  '{"ipa": [1, 2, 3, 4, 5], "ips": [0, 0, 0, 0, 0], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya suka mempelajari geografi dan kebudayaan daerah',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  14,
  '{"ipa": [0, 0, 0, 0, 0], "ips": [1, 2, 3, 4, 5], "bahasa": [0, 0, 0, 0, 0]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';

INSERT INTO psychology_test_questions (test_template_id, question_text, question_type, options, order_index, scoring_config)
SELECT 
  id as test_template_id,
  'Saya tertarik belajar bahasa asing dan budayanya',
  'likert',
  '["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]'::jsonb,
  15,
  '{"ipa": [0, 0, 0, 0, 0], "ips": [0, 0, 1, 1, 2], "bahasa": [1, 2, 3, 4, 5]}'::jsonb
FROM psychology_test_templates WHERE title = 'Tes Minat Akademik';