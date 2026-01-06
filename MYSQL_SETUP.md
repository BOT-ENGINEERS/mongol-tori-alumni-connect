# MySQL Setup Guide for Mongol-Tori Alumni Connect

This guide will help you set up MySQL with your Vite React application using XAMPP.

## Step 1: Prepare XAMPP

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL module
   - Ensure it shows "Running" (green)

2. **Access phpMyAdmin**
   - Open browser and go to: `http://localhost/phpmyadmin`
   - You should see phpMyAdmin dashboard

## Step 2: Create Database and Tables

1. **Create Database**
   - In phpMyAdmin, click "New" in left sidebar
   - Database name: `alumni_connect`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

2. **Import Schema**
   - Click on the `alumni_connect` database
   - Go to "Import" tab
   - Upload file: `supabase/mysql_schema.sql`
   - Click "Import"
   - You should see success message with tables created

## Step 3: Configure Environment Variables

The `.env` file has been updated with MySQL settings:

```env
VITE_DB_HOST=localhost
VITE_DB_USER=root
VITE_DB_PASSWORD=
VITE_DB_NAME=alumni_connect
```

**Note:** If your XAMPP MySQL has a password, update `VITE_DB_PASSWORD` accordingly.

## Step 4: Install Dependencies

Run this command in the project root:

```bash
npm install mysql2
```

Or if you're using bun:

```bash
bun add mysql2
```

## Step 5: Update and Test the Application

All admin pages have been updated to use MySQL:
- ✅ Authentication (Login/Signup)
- ✅ News Management
- ✅ Jobs Management
- ✅ Achievements Management
- ✅ Merchandise Management
- ✅ Members Management
- ✅ Alumni Management

Start your development server:

```bash
npm run dev
```

## File Structure

Your MySQL integration files are located at:
```
src/integrations/mysql/
├── client.ts      # Database connection pooling
├── types.ts       # TypeScript type definitions
├── queries.ts     # Query functions (CRUD operations)
└── auth.ts        # Authentication functions
```

## Available Database Functions

### Profile Management
- `getProfiles()` - Get all profiles
- `getProfile(id)` - Get single profile
- `createProfile(data)` - Create new profile
- `updateProfile(id, updates)` - Update profile
- `deleteProfile(id)` - Delete profile

### Jobs Management
- `getJobs()` - Get all active jobs
- `getJob(id)` - Get single job
- `createJob(data)` - Create new job
- `updateJob(id, updates)` - Update job
- `deleteJob(id)` - Delete job

### News Management
- `getNews()` - Get all news
- `getNewsItem(id)` - Get single news
- `createNews(data)` - Create new news
- `updateNews(id, updates)` - Update news
- `deleteNews(id)` - Delete news

### Merchandise Management
- `getMerchandise()` - Get all merchandise
- `getMerchandiseItem(id)` - Get single item
- `createMerchandise(data)` - Create new item
- `updateMerchandise(id, updates)` - Update item
- `deleteMerchandise(id)` - Delete item

### Achievement Management
- `getAchievements()` - Get all achievements
- `getAchievement(id)` - Get single achievement
- `createAchievement(data)` - Create new achievement
- `updateAchievement(id, updates)` - Update achievement
- `deleteAchievement(id)` - Delete achievement

### Authentication
- `signUp(email, password, fullName)` - Register new user
- `signIn(email, password)` - Login user
- `signOut()` - Logout user
- `getCurrentUser()` - Get current user from session

## Important Notes

### Password Security
⚠️ **Development Only**: The authentication uses basic base64 encoding. For production, implement proper password hashing using `bcrypt`:

```bash
npm install bcrypt
```

### Database Connection
- The client uses a connection pool for better performance
- Connections are automatically released after queries
- Maximum 10 concurrent connections (configurable in `client.ts`)

### UUID Generation
- The app generates UUID v4 values locally
- No need for database-generated IDs

### Timestamps
- `created_at` and `updated_at` are automatically managed
- Use MySQL `NOW()` function for current timestamp

## Troubleshooting

### Connection Failed
- Ensure XAMPP MySQL is running
- Check `.env` file has correct credentials
- Verify database `alumni_connect` exists

### Import Error
- Check if `mysql2` is installed: `npm list mysql2`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Restart dev server after npm install

### Query Errors
- Check browser console for detailed error messages
- Verify table names and column names in `queries.ts`
- Ensure all required fields are provided when creating records

## Next Steps

1. **Test Authentication**
   - Visit http://localhost:5173/auth
   - Create a test account
   - Login with those credentials

2. **Access Admin Panel**
   - Navigate to http://localhost:5173/admin
   - Add sample news, jobs, achievements, merchandise
   - Test edit and delete functionality

3. **Production Deployment**
   - Use a production MySQL server (AWS RDS, PlanetScale, etc.)
   - Implement bcrypt for password hashing
   - Set up environment variables securely
   - Add input validation and error handling
   - Implement proper authentication middleware

## Migration from Supabase

If you had existing data in Supabase:
1. Export data as CSV from Supabase
2. Convert column names to match MySQL schema
3. Import into MySQL using phpMyAdmin
4. Verify data integrity

For questions or issues, check the console for error messages and review the query functions in `src/integrations/mysql/queries.ts`.
