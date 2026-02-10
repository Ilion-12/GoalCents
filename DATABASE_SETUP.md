# 🔧 Database Setup Instructions

## Issue
Getting **406 (Not Acceptable)** and **Check Constraint** errors when saving budgets.

## Solution

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"

### Step 2: Run the Fix Script
1. Open the file `SUPABASE_FIX.sql` in this project
2. Copy ALL the SQL commands from that file
3. Paste them into the Supabase SQL Editor
4. Click "Run" or press Ctrl+Enter

### Step 3: Verify the Fix
After running the script, verify it worked:

**Check 1: Timeframe Constraint**
- The `budgets` table should now accept 'week' and 'month' values

**Check 2: RLS Policies**
- All three tables (`budgets`, `expenses`, `savings_goal`) should have policies visible in:
  - Supabase Dashboard → Authentication → Policies

### Step 4: Test the App
1. Refresh your app in the browser
2. Try setting a budget
3. Should work without errors now! ✅

## What the Fix Does

### 1. Fixes Timeframe Constraint
- Drops the old constraint that was rejecting 'week' and 'month'
- Creates a new constraint that allows these values

### 2. Sets Up Row Level Security (RLS)
- Enables RLS on all tables (budgets, expenses, savings_goal)
- Creates policies that allow users to access their data
- Currently set to `true` for testing (you can make them more strict later)

## Alternative: Disable RLS (Quick Fix)

If you want a quick fix for testing only:

```sql
-- Run this to disable RLS on all tables
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goal DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning**: This is NOT recommended for production! Only use for local testing.

## Need Help?
If you still get errors after running the SQL script:
1. Check the browser console for detailed error messages
2. Make sure you're logged in with a valid user
3. Verify the SQL script ran without errors in Supabase
