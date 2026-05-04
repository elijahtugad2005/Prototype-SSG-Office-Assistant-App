#!/bin/bash

# Shirio SSG Office Assistant - GitHub Pages Deployment Script
# This script automates the deployment process

echo "🚀 Starting deployment to GitHub Pages..."
echo ""

# Step 1: Check if there are uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Uncommitted changes detected. Committing..."
    git add .
    read -p "Enter commit message (or press Enter for default): " commit_msg
    commit_msg=${commit_msg:-"Update: Deploy to GitHub Pages"}
    git commit -m "$commit_msg"
    echo "✅ Changes committed"
    echo ""
else
    echo "✅ No uncommitted changes"
    echo ""
fi

# Step 2: Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main || git push origin master
if [ $? -eq 0 ]; then
    echo "✅ Pushed to GitHub successfully"
    echo ""
else
    echo "❌ Failed to push to GitHub"
    echo "Please check your git configuration and try again"
    exit 1
fi

# Step 3: Build and deploy
echo "🔨 Building and deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your site will be live in 2-6 minutes at:"
    echo "   https://elijahtugad2005.github.io/Prototype-SSG-Office-Assistant-App/"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Wait a few minutes for GitHub Pages to process"
    echo "   2. Clear your browser cache"
    echo "   3. Visit your site and test all features"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo "Please check the error messages above"
    exit 1
fi
