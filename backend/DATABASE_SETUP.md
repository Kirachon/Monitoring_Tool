# Database Setup Guide

## ✅ COMPLETED - Docker PostgreSQL Setup

**The database is now running in Docker and fully configured!**

**Container Details:**
- Container Name: `hrms_postgres`
- Image: `postgres:14-alpine`
- Port: `5433` (host) → `5432` (container)
- Database: `hrms_db`
- User: `hrms_user`
- Password: `hrms_password_2024`

**Status:**
- ✅ Docker container running and healthy
- ✅ 16 migrations executed successfully
- ✅ 4 seed files executed successfully (roles, permissions, holidays, leave types, system config)
- ✅ Database fully operational

### Quick Commands

**Start the database:**
```bash
docker-compose up -d
```

**Stop the database:**
```bash
docker-compose down
```

**View logs:**
```bash
docker logs hrms_postgres
```

**Access PostgreSQL CLI:**
```bash
docker exec -it hrms_postgres psql -U hrms_user -d hrms_db
```

**Run migrations:**
```bash
cd backend && npx knex migrate:latest
```

**Run seeds:**
```bash
cd backend && npx knex seed:run
```

---

## Alternative: PostgreSQL Installation (Manual Setup)

### Windows

1. **Download PostgreSQL 14+**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer
   - Run the installer

2. **Installation Steps**
   - Choose installation directory
   - Select components: PostgreSQL Server, pgAdmin 4, Command Line Tools
   - Set data directory
   - Set password for postgres user (remember this!)
   - Set port: 5432 (default)
   - Complete installation

3. **Verify Installation**
   ```bash
   psql --version
   # Should show: psql (PostgreSQL) 14.x or higher
   ```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS

```bash
brew install postgresql@14
brew services start postgresql@14
```

---

## Database Creation

### Step 1: Connect to PostgreSQL

```bash
# Windows (using psql from Start Menu or Command Prompt)
psql -U postgres

# Linux/macOS
sudo -u postgres psql
```

### Step 2: Create Database and User

```sql
-- Create database
CREATE DATABASE hrms_dev;

-- Create user
CREATE USER hrms_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hrms_dev TO hrms_user;

-- Connect to the database
\c hrms_dev

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO hrms_user;

-- Exit
\q
```

### Step 3: Update Environment Variables

Edit `backend/.env`:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_dev
DB_USER=hrms_user
DB_PASSWORD=your_secure_password_here
```

---

## Run Migrations

### Step 1: Install Knex CLI (if not already installed)

```bash
cd backend
npm install -g knex
```

### Step 2: Run Migrations

```bash
# Run all migrations
npm run migrate:latest

# Or using knex directly
knex migrate:latest
```

### Step 3: Verify Migrations

```bash
# Check migration status
knex migrate:status

# Should show all migrations as "up"
```

---

## Seed Database

### Run All Seeds

```bash
# Run all seed files
npm run seed:run

# Or using knex directly
knex seed:run
```

### Verify Seed Data

```bash
# Connect to database
psql -U hrms_user -d hrms_dev

# Check roles
SELECT * FROM roles;

# Check permissions
SELECT * FROM permissions;

# Check holidays
SELECT * FROM holidays;

# Check leave types
SELECT * FROM leave_types;

# Exit
\q
```

---

## Migration Commands

```bash
# Run migrations
npm run migrate:latest

# Rollback last migration
npm run migrate:rollback

# Rollback all migrations
npm run migrate:rollback --all

# Check migration status
knex migrate:status

# Create new migration
knex migrate:make migration_name
```

---

## Seed Commands

```bash
# Run all seeds
npm run seed:run

# Create new seed
knex seed:make seed_name
```

---

## Database Schema

### Tables Created (22 total)

1. **roles** - System roles (Employee, Supervisor, HR Admin, System Admin)
2. **permissions** - Granular permissions
3. **role_permissions** - Role-permission mappings
4. **departments** - Organizational structure
5. **employees** - Employee master data
6. **users** - Authentication accounts
7. **user_roles** - User-role assignments
8. **sessions** - Active user sessions
9. **pass_slips** - Pass slip requests
10. **leave_types** - CSC leave types
11. **leave_requests** - Leave applications
12. **leave_balances** - Current leave balances
13. **leave_credits** - Leave credit transactions
14. **leave_monetization** - Terminal leave calculations
15. **certificate_templates** - Certificate templates
16. **certificates** - Generated certificates log
17. **digital_signatures** - Signatory signatures
18. **approval_workflows** - Workflow configurations
19. **approvals** - Approval history
20. **holidays** - Philippine holiday calendar
21. **system_config** - System configuration
22. **audit_logs** - Comprehensive audit trail

---

## Troubleshooting

### Connection Refused

**Problem:** `ECONNREFUSED` error when connecting to database

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   services.msc  # Check if PostgreSQL service is running
   
   # Linux
   sudo systemctl status postgresql
   
   # macOS
   brew services list
   ```

2. Check connection settings in `.env`
3. Verify firewall allows port 5432

### Authentication Failed

**Problem:** `password authentication failed for user "hrms_user"`

**Solution:**
1. Verify password in `.env` matches database user password
2. Recreate user with correct password:
   ```sql
   DROP USER IF EXISTS hrms_user;
   CREATE USER hrms_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE hrms_dev TO hrms_user;
   ```

### Migration Errors

**Problem:** Migration fails with foreign key constraint errors

**Solution:**
1. Rollback all migrations:
   ```bash
   knex migrate:rollback --all
   ```

2. Drop and recreate database:
   ```sql
   DROP DATABASE IF EXISTS hrms_dev;
   CREATE DATABASE hrms_dev;
   GRANT ALL PRIVILEGES ON DATABASE hrms_dev TO hrms_user;
   ```

3. Run migrations again:
   ```bash
   knex migrate:latest
   ```

---

## Production Deployment

### Security Checklist

- [ ] Use strong database password (minimum 16 characters)
- [ ] Enable SSL for database connections
- [ ] Restrict database access to application server only
- [ ] Set up regular automated backups
- [ ] Configure connection pooling appropriately
- [ ] Enable query logging for audit purposes
- [ ] Set up monitoring and alerts

### Backup Strategy

```bash
# Create backup
pg_dump -U hrms_user -d hrms_dev -F c -f hrms_backup_$(date +%Y%m%d).dump

# Restore backup
pg_restore -U hrms_user -d hrms_dev -c hrms_backup_20250106.dump
```

---

## Next Steps

After database setup is complete:

1. ✅ Verify all migrations ran successfully
2. ✅ Verify seed data is present
3. ✅ Test database connection from application
4. ✅ Proceed to Story 1.3 (User Authentication System)

---

**Database Schema Version:** 1.0.0  
**Last Updated:** 2025-01-06  
**Total Tables:** 22  
**Total Migrations:** 15

