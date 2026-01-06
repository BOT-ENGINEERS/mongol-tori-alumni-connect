// MySQL table type definitions converted from Supabase schema

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  current_education?: string;
  past_education?: string;
  is_alumni: boolean;
  is_advisor: boolean;
  company?: string;
  position?: string;
  semester?: string;
  team_role?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  type?: string;
  salary_range?: string;
  description?: string;
  requirements?: string;
  posted_by?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  content?: string;
  source?: string;
  source_url?: string;
  image_url?: string;
  is_external: boolean;
  published_at: string;
  created_at: string;
}

export interface Merchandise {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  is_digital: boolean;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: string;
  shipping_address?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  merchandise_id?: string;
  quantity: number;
  price: number;
}

// Insert types (without id and timestamps)
export interface ProfileInsert extends Omit<Profile, 'id' | 'created_at' | 'updated_at'> {}
export interface JobInsert extends Omit<Job, 'id' | 'created_at' | 'updated_at'> {}
export interface AchievementInsert extends Omit<Achievement, 'id' | 'created_at'> {}
export interface NewsInsert extends Omit<News, 'id' | 'created_at'> {}
export interface MerchandiseInsert extends Omit<Merchandise, 'id' | 'created_at'> {}

// Database tables namespace
export namespace Tables {
  export type profiles = Profile;
  export type user_roles = UserRole;
  export type jobs = Job;
  export type achievements = Achievement;
  export type news = News;
  export type merchandise = Merchandise;
  export type orders = Order;
  export type order_items = OrderItem;
}

export namespace TablesInsert {
  export type profiles = ProfileInsert;
  export type jobs = JobInsert;
  export type achievements = AchievementInsert;
  export type news = NewsInsert;
  export type merchandise = MerchandiseInsert;
}
