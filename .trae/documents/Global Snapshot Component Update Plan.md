## Global Snapshot Component Update Plan

### 1. Container & Header Updates
- **Outer Card**: Update to white background, 1px light gray border, smaller border radius, minimal shadow
- **Title Row**: Make "Global Snapshot" text left-aligned and more compact
- **Icon Buttons**: Replace current buttons with 28×28 square buttons with 1px border, small radius, dark gray icons, 8px spacing

### 2. Grid Layout Changes
- **Column Count**: Change from 6 to 8 columns
- **Columns**: Sales, Open Orders, Buyer Messages, Featured Offer %, Seller Feedback, Payments, Ad Sales, Ad Impressions
- **Dividers**: Add 1px vertical dividers between columns
- **Padding**: Make column padding more compact

### 3. Column Content Updates
- **Sales**: Update sparkline to dark line + dot markers, smaller axis text
- **Open Orders**: Structure as 6 + "Total Count", then 3 rows with right-aligned values
- **Buyer Messages**: 0 + "Cases requiring attention", then Inventory Performance Index with dropdown + 400 + "Current"
- **Featured Offer %**: 100% + "2 days ago", then Global Promotions Sales with "No data available" + "Learn More"
- **Seller Feedback**: Orange stars + 5.00, then "Past Year (2)"
- **Ad Sales & Ad Impressions**: Create as independent columns with compact content

### 4. Typography & Visuals
- **Colors**: Update large numbers to deeper teal/green (Amazon style)
- **Font Weights**: Reduce boldness
- **Secondary Text**: Make smaller, grayer, tighter spacing

### 5. Component Updates
- **TinySparkline**: Update line color to dark gray/black, add dot markers, adjust axis text
- **Grid Container**: Update to 8 columns with proper dividers

### 6. Files to Modify
- `features/Dashboard.tsx`: Update Global Snapshot component
- `features/Dashboard.tsx`: Update TinySparkline component

### 7. Key CSS Classes to Update
- Grid container: `grid grid-cols-1 lg:grid-cols-8 gap-0`
- Column borders: `border-r border-[#E3E6E6]`
- Card header: `flex justify-between items-center mb-2`
- Button styles: `w-[28px] h-[28px] border border-[#D5D9D9] rounded-sm text-[#565959]`
- Sparkline line: `stroke-[#0F1111] strokeWidth="2"`

This plan will ensure the Global Snapshot component matches the reference image exactly, with pixel-perfect alignment, spacing, and visual style.