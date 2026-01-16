## Implementation Plan: Global Snapshot Component

### 1. File to Modify
- **d:\amazon-seller-central-clone\features\Dashboard.tsx** - Complete rewrite of the Global Snapshot component

### 2. Key Changes to Implement

#### A. Card Container
- Update border: #D5D9D9 (from #E3E6E6)
- Increase border-radius: 12px (from 8px)
- Adjust padding: 16px 20px (from 16px)
- Remove any shadow effects

#### B. Title Bar
- Change title color: #007185 (Amazon teal)
- Update control icons to use proper Expand/Sliders icons
- Increase hit area: 32x32px per icon
- Ensure vertical alignment

#### C. Grid Layout & Dividers
- Implement full-height vertical dividers: 1px #D5D9D9
- Add horizontal divider across all columns: 1px #D5D9D9
- Ensure perfect column alignment
- Update padding: 12px 16px per column

#### D. Typography System
- **Column Titles**: 12px, font-weight 600, #007185
- **Main Numbers**: 26px, font-weight 700, #007185
- **Secondary Text**: 12px, #565959
- **Links**: #007185, hover underline

#### E. Content Structure (Per Column)
1. **Sales**: $49.95 + "Today so far" + improved sparkline (black line, 2px width)
2. **Open Orders**: 6 + "Total Count" + FBM/FBA breakdown
3. **Buyer Messages**: 0 + "Cases requiring attention" + Inventory Performance Index (left-aligned 400 + "Current")
4. **Featured Offer %**: 100% + "2 days ago" + Global Promotions Sales (no data + Learn More)
5. **Seller Feedback**: Star rating + 5.00 (16px+) + "Past Year (2)" link + Ad Sales $0.00
6. **Payments**: $228.31 + "Total Balance" + Ad Impressions 0

#### F. Visual Fixes
- Remove spaces in currency formatting ("$49.95" not "$ 49.95")
- Standardize chevron icons: 12px, right-aligned
- Ensure all text baselines align across columns

### 3. Implementation Approach
1. Rewrite the Global Snapshot component from scratch
2. Use consistent Tailwind CSS classes for all elements
3. Implement proper grid layout with consistent dividers
4. Update helper components (StarRating, TinySparkline) to match requirements
5. Ensure all content matches the exact structure described
6. Verify pixel-perfect alignment across all columns

### 4. Expected Result
A Global Snapshot component that matches the real Amazon Seller Central screenshot 1:1, with correct layout, colors, typography, and content structure.