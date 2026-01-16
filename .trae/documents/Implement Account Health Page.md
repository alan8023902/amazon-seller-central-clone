# Implementation Plan for Account Health Page

## Overview
I'll implement the Account Health page according to the exact specifications, updating both the component and sidebar configuration.

## Step 1: Rewrite AccountHealth Component
Completely rewrite `/features/AccountHealth.tsx` to match the specified structure:

1. **Page Header**
   - Title: "Account Health"
   - Intro paragraph with emergency contact link

2. **Top Section**
   - Center banner: "Account Health Assurance" with shield/check icon and "See what it takes to qualify" link
   - Right-side help card: "Need help?" with description and "Contact Us" button

3. **3-Column Layout**
   - **Left Card**: "Customer Service Performance"
     - Order Defect Rate with target and comparison table
     - Breakdown of metrics (Negative feedback, A-to-z Guarantee claims, Chargeback claims)
     - "View details" link
   
   - **Middle Card**: "Policy Compliance"
     - Top-right "Healthy" status pill
     - Account Health Rating with score (982) and horizontal scale bar
     - All Issues list with right-aligned counts
     - "View all(0)" link
   
   - **Right Card**: "Shipping Performance"
     - Top-right "Seller Fulfilled" dropdown
     - Metrics list with right-aligned values and targets
     - "View details" and "View shipping eligibilities here" links

## Step 2: Update Sidebar Configuration
Add the Performance section to `/src/nav/sidebar.config.tsx`:

1. Create a `performanceSidebar` configuration
2. Add Account Health as a submenu under Performance
3. Update the `getSidebarByPath` function to handle the new route
4. Add the route to App.tsx under WithSidebarLayout

## Step 3: Ensure Style Compliance
- Use white cards with light gray borders and subtle rounding
- Apply minimal shadows and consistent whitespace
- Maintain consistent typography
- Use mock numbers/text as specified

## Files to Modify
1. `/features/AccountHealth.tsx` - Rewrite the component
2. `/src/nav/sidebar.config.tsx` - Add Performance section
3. `/App.tsx` - Update routing to use WithSidebarLayout for Performance route

## Expected Outcome
A fully functional Account Health page that matches Amazon Seller Central's design, accessible via Performance → Account Health in the sidebar.