CREATE TABLE allowed_emails (
  email text primary key,
  role text default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE allowed_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read allowed emails" ON allowed_emails FOR SELECT USING (true);
CREATE POLICY "Admin write allowed emails" ON allowed_emails FOR ALL USING (true);

CREATE TABLE announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Admin write announcements" ON announcements FOR ALL USING (true);
