-- supabase/seed.sql

-- 1) Dashboard metrics
INSERT INTO dashboard_metrics (metric_key, metric_value) VALUES
  ('pending_files', 12),
  ('accepted_files', 87),
  ('denied_files', 5),
  ('points_earned', 152);

-- 2) Sidebar nav items
INSERT INTO nav_items (label, icon_name) VALUES
  ('Dashboard','ChevronRight'),
  ('All Files','FileText'),
  ('Achievements','Award'),
  ('Notes','FileIcon');

-- 3) Account menu items
INSERT INTO account_items (label, class_name) VALUES
  ('Profile', NULL),
  ('Settings', NULL),
  ('Logout','text-red-600');

-- 4) Stats cards
INSERT INTO stats (label, count, delta, icon_name, bg) VALUES
  ('Pending Files',12,'+3 today','FileText','bg-yellow-50'),
  ('Accepted Files',87,'+14 this week','CheckCircle','bg-green-50'),
  ('Denied Files',5,'-2 vs last week','XCircle','bg-red-50'),
  ('Points Earned',152,'+18 this week','Award','bg-purple-50');

-- 5) Recent files
INSERT INTO recent_files (name, topic, date, status) VALUES
  ('Annual_Report_2024.pdf','Annual Statements','2024-04-10','Accepted'),
  ('Q1_Financial_Report.xlsx','Financial Reports','2024-04-18','Pending'),
  ('Tax_Compliance_2024.docx','Tax Documents','2024-04-20','Denied');

-- 6) Recent activity
INSERT INTO activities (text, when_text, icon_name) VALUES
  ('You uploaded Annual_Report_2024.pdf', 'about 1 year ago', 'UploadCloud'),
  ('Admin approved Annual_Report_2024.pdf', 'about 1 year ago', 'CheckCircle'),
  ('You earned the Consistent Contributor badge', 'about 1 year ago', 'Award');

-- 7) Upcoming deadlines
INSERT INTO deadlines (label, info, delta) VALUES
  ('Annual Report Submission','3 files required','11 months left'),
  ('Q2 Financial Report','2 files required','10 months left'),
  ('Tax Documentation','1 file required','12 months left');


INSERT INTO categories (title) VALUES
  ('Annual Statements'),
  ('Projects');

-- Insere subcategorias ligadas às categories
INSERT INTO subcategories (category_id, title) VALUES
  ((SELECT id FROM categories WHERE title = 'Annual Statements'), 'Financial Statements'),
  ((SELECT id FROM categories WHERE title = 'Annual Statements'), 'Audit Reports'),
  ((SELECT id FROM categories WHERE title = 'Projects'),           'Project Alpha');
