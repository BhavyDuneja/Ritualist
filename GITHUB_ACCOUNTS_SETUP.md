# GitHub Dual Account Setup Guide

## ✅ Setup Complete!

You now have SSH keys configured for both GitHub accounts on your PC.

## 📋 Your Accounts

### Personal Account
- **Email:** amanduneja2311@gmail.com
- **Username:** bhavyduneja
- **SSH Host:** `github.com-personal`
- **Key:** `~/.ssh/id_ed25519_personal`

### Professional Account
- **Email:** duneja8515@oak-group.org
- **Username:** duneja8515
- **SSH Host:** `github.com-professional`
- **Key:** `~/.ssh/id_ed25519_professional`

## 🔑 Add SSH Keys to GitHub

### Step 1: Copy Your Public Keys

**Personal Account Key:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPgOP6iESuEzMsNDEeuSFCmShdrdWAFjIUNmIXbhPnp0 amanduneja2311@gmail.com
```

**Professional Account Key:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIILVCBySIjLPnKbyNu0v3xnDPt3/FLz/fG8Og2BGqu/r duneja8515@oak-group.org
```

### Step 2: Add to GitHub

1. **For Personal Account (bhavyduneja):**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the personal account key above
   - Title: "Personal PC - Personal Account"
   - Click "Add SSH key"

2. **For Professional Account (duneja8515):**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the professional account key above
   - Title: "Personal PC - Professional Account"
   - Click "Add SSH key"

## 🚀 Using Different Accounts

### For Personal Repositories

When cloning or setting up a personal repo:
```bash
# Clone a personal repo
git clone git@github.com-personal:username/repo.git

# Or update existing remote
git remote set-url origin git@github.com-personal:username/repo.git

# Set git config for this repo
git config user.name "Bhavya Duneja"
git config user.email "amanduneja2311@gmail.com"
```

### For Professional Repositories

When cloning or setting up a professional repo:
```bash
# Clone a professional repo
git clone git@github.com-professional:username/repo.git

# Or update existing remote
git remote set-url origin git@github.com-professional:username/repo.git

# Set git config for this repo
git config user.name "Your Professional Name"
git config user.email "duneja8515@oak-group.org"
```

## ✅ Current Repository (Ritualist)

This repository is already configured for your **personal account**:
- Remote: `git@github.com-personal:BhavyDuneja/Ritualist.git`
- User: Bhavya Duneja
- Email: amanduneja2311@gmail.com

## 🧪 Test Your Setup

After adding keys to GitHub, test the connections:

```bash
# Test personal account
ssh -T git@github.com-personal

# Test professional account
ssh -T git@github.com-professional
```

You should see: "Hi bhavyduneja! You've successfully authenticated..." or similar.

## 📝 Quick Reference

| Account Type | SSH Host | Username | Email |
|-------------|----------|----------|-------|
| Personal | `github.com-personal` | bhavyduneja | amanduneja2311@gmail.com |
| Professional | `github.com-professional` | duneja8515 | duneja8515@oak-group.org |

## 🔄 Switching Between Accounts

No need to delete credentials! Just use the correct SSH host when cloning or updating remotes:
- Personal repos → `git@github.com-personal:...`
- Professional repos → `git@github.com-professional:...`

Each repository remembers which account to use automatically!

