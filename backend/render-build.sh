#!/bin/bash
# Render build script for HRMS Backend
# This script installs dependencies and Chromium for Puppeteer

echo "Installing Node.js dependencies..."
npm install

echo "Installing Chromium for Puppeteer..."
apt-get update
apt-get install -y chromium

echo "Build completed successfully!"

