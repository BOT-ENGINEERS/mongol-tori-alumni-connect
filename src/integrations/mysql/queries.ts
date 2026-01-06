import { query, execute } from './client';
import type { 
  Profile, Job, News, Merchandise, Achievement, 
  ProfileInsert, JobInsert, NewsInsert, MerchandiseInsert, AchievementInsert 
} from './types';

// Generate UUID v4
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Profile queries
export async function getProfiles() {
  return query<Profile>('SELECT * FROM profiles');
}

export async function getProfile(id: string) {
  const results = await query<Profile>('SELECT * FROM profiles WHERE id = ?', [id]);
  return results[0] || null;
}

export async function getProfileByUserId(userId: string) {
  const results = await query<Profile>('SELECT * FROM profiles WHERE user_id = ?', [userId]);
  return results[0] || null;
}

export async function createProfile(profile: ProfileInsert) {
  const id = generateUUID();
  const sql = `
    INSERT INTO profiles (id, user_id, full_name, email, phone, photo_url, linkedin_url, 
      facebook_url, instagram_url, current_education, past_education, is_alumni, is_advisor, 
      company, position, semester, team_role, bio, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  
  const values = [
    id, profile.user_id, profile.full_name, profile.email, profile.phone, 
    profile.photo_url, profile.linkedin_url, profile.facebook_url, 
    profile.instagram_url, profile.current_education, profile.past_education,
    profile.is_alumni || false, profile.is_advisor || false,
    profile.company, profile.position, profile.semester, profile.team_role, profile.bio
  ];
  
  await execute(sql, values);
  return getProfile(id);
}

export async function updateProfile(id: string, updates: Partial<ProfileInsert>) {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  
  const sql = `UPDATE profiles SET ${fields}, updated_at = NOW() WHERE id = ?`;
  await execute(sql, values);
  return getProfile(id);
}

export async function deleteProfile(id: string) {
  await execute('DELETE FROM profiles WHERE id = ?', [id]);
}

// Job queries
export async function getJobs() {
  return query<Job>('SELECT * FROM jobs WHERE is_active = true ORDER BY created_at DESC');
}

export async function getJob(id: string) {
  const results = await query<Job>('SELECT * FROM jobs WHERE id = ?', [id]);
  return results[0] || null;
}

export async function createJob(job: JobInsert) {
  const id = generateUUID();
  const sql = `
    INSERT INTO jobs (id, title, company, location, type, salary_range, description, 
      requirements, posted_by, created_at, updated_at, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
  `;
  
  const values = [
    id, job.title, job.company, job.location, job.type, 
    job.salary_range, job.description, job.requirements, 
    job.posted_by, job.is_active !== false
  ];
  
  await execute(sql, values);
  return getJob(id);
}

export async function updateJob(id: string, updates: Partial<JobInsert>) {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  
  const sql = `UPDATE jobs SET ${fields}, updated_at = NOW() WHERE id = ?`;
  await execute(sql, values);
  return getJob(id);
}

export async function deleteJob(id: string) {
  await execute('DELETE FROM jobs WHERE id = ?', [id]);
}

// News queries
export async function getNews() {
  return query<News>('SELECT * FROM news ORDER BY published_at DESC');
}

export async function getNewsItem(id: string) {
  const results = await query<News>('SELECT * FROM news WHERE id = ?', [id]);
  return results[0] || null;
}

export async function createNews(news: NewsInsert) {
  const id = generateUUID();
  const sql = `
    INSERT INTO news (id, title, content, source, source_url, image_url, is_external, published_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  
  const values = [
    id, news.title, news.content, news.source, news.source_url, 
    news.image_url, news.is_external || false, news.published_at || new Date().toISOString()
  ];
  
  await execute(sql, values);
  return getNewsItem(id);
}

export async function updateNews(id: string, updates: Partial<NewsInsert>) {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  
  const sql = `UPDATE news SET ${fields} WHERE id = ?`;
  await execute(sql, values);
  return getNewsItem(id);
}

export async function deleteNews(id: string) {
  await execute('DELETE FROM news WHERE id = ?', [id]);
}

// Merchandise queries
export async function getMerchandise() {
  return query<Merchandise>('SELECT * FROM merchandise WHERE is_active = true');
}

export async function getMerchandiseItem(id: string) {
  const results = await query<Merchandise>('SELECT * FROM merchandise WHERE id = ?', [id]);
  return results[0] || null;
}

export async function createMerchandise(merchandise: MerchandiseInsert) {
  const id = generateUUID();
  const sql = `
    INSERT INTO merchandise (id, name, description, price, image_url, category, is_digital, stock, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  
  const values = [
    id, merchandise.name, merchandise.description, merchandise.price, 
    merchandise.image_url, merchandise.category, merchandise.is_digital || false,
    merchandise.stock || 0, merchandise.is_active !== false
  ];
  
  await execute(sql, values);
  return getMerchandiseItem(id);
}

export async function updateMerchandise(id: string, updates: Partial<MerchandiseInsert>) {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  
  const sql = `UPDATE merchandise SET ${fields} WHERE id = ?`;
  await execute(sql, values);
  return getMerchandiseItem(id);
}

export async function deleteMerchandise(id: string) {
  await execute('DELETE FROM merchandise WHERE id = ?', [id]);
}

// Achievement queries
export async function getAchievements() {
  return query<Achievement>('SELECT * FROM achievements ORDER BY date DESC');
}

export async function getAchievement(id: string) {
  const results = await query<Achievement>('SELECT * FROM achievements WHERE id = ?', [id]);
  return results[0] || null;
}

export async function createAchievement(achievement: AchievementInsert) {
  const id = generateUUID();
  const sql = `
    INSERT INTO achievements (id, title, description, date, image_url, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  
  const values = [id, achievement.title, achievement.description, achievement.date, achievement.image_url];
  
  await execute(sql, values);
  return getAchievement(id);
}

export async function updateAchievement(id: string, updates: Partial<AchievementInsert>) {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  
  const sql = `UPDATE achievements SET ${fields} WHERE id = ?`;
  await execute(sql, values);
  return getAchievement(id);
}

export async function deleteAchievement(id: string) {
  await execute('DELETE FROM achievements WHERE id = ?', [id]);
}
