# Implementation Plan for Legal Entity Page

## Overview
Update the existing LegalEntity.tsx file to match the Amazon Seller Central style requirements with the specified page structure.

## Changes Required

### 1. Update LegalEntity.tsx
- Replace the current content with the new page structure
- Implement the header with title, breadcrumb, and edit button
- Create the tax status callout card with green styling and check icon
- Add the instruction paragraph
- Implement the read-only info blocks for legal business name and address
- Add the footer with back button

### 2. Ensure Proper Styling
- Use the existing design system classes (amz-*)
- Implement the required color scheme with green accents for the tax status card
- Use the existing Card and Button components from UI.tsx
- Maintain Amazon Seller Central typography and spacing

## Implementation Details

### Header Section
- Large page title: "Legal Entity"
- Breadcrumb: "Account Info"
- Top-right "Edit" button

### Tax Status Callout Card
- Green vertical accent + check icon
- Title: "Tax information is complete"
- Subtitle: "Your tax information has been validated successfully."
- Primary button: "Update Tax Information"
- Right-side link: "Tax interview help guide"
- Green border and rounded corners

### Instruction Paragraph
- Text explaining how to update legal entity information

### Read-only Info Blocks
- Block A: Legal business name (mock data)
- Block B: Place of establishment address (multi-line mock data)
- Light gray background, rounded corners, generous padding

### Footer
- Bottom-left "Back" button

## Files to Modify
- `features/LegalEntity.tsx` - Update the page content to match the requirements

## Expected Outcome
A fully functional Legal Entity page that matches the Amazon Seller Central style with all required components and styling.