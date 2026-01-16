# Business Reports页面与Reports Sidebar修改计划

## 一、修改文件列表

### 1. 侧边栏相关

* `src/nav/sidebar.config.tsx` - 更新Reports侧边栏配置，添加完整菜单结构

* `src/components/Sidebar.tsx` - 修改侧边栏组件，添加顶部关闭行和调整样式

* `layouts/WithSidebarLayout.tsx` - 调整侧边栏宽度和样式

### 2. Business Reports页面

* `features/BusinessReports.tsx` - 完全重写Sales Dashboard页面，实现1:1复刻

* `features/SalesDashboard.module.css` - 新增Sales Dashboard专用样式文件

### 3. 其他相关

* `mock/salesDashboard.ts` - 补充mock数据（如有需要）

## 二、具体修改内容

### 1. Reports Sidebar修改

#### 1.1 侧边栏配置更新 (`src/nav/sidebar.config.tsx`)

* 扩展reportsSidebar配置，添加完整菜单结构：

  ```typescript
  { id: 'dashboards', label: 'Dashboards', path: '/app/business-reports', children: [{ id: 'sales-dashboard', label: 'Sales Dashboard', path: '/app/business-reports/sales-dashboard' }] },
  { id: 'business-reports', label: 'Business Reports', path: '/app/business-reports/by-date', children: [{ id: 'by-date', label: 'By Date', path: '/app/business-reports/by-date' }] },
  { id: 'sales-and-traffic', label: 'Sales and Traffic', path: '/app/business-reports/sales-traffic', children: [{ id: 'detail-page-sales', label: 'Detail Page Sales and Traffic', path: '/app/business-reports/by-date/detail-page-sales' }, { id: 'by-parent-item', label: '... By Parent Item', path: '/app/business-reports/sales-traffic/by-parent-item' }, { id: 'by-child-item', label: '... By Child Item', path: '/app/business-reports/sales-traffic/by-child-item' }] },
  { id: 'seller-performance', label: 'Seller Performance', path: '/app/business-reports/seller-performance' },
  { id: 'by-asin', label: 'By ASIN', path: '/app/business-reports/by-asin', children: [{ id: 'asin-detail-sales', label: 'Detail Page Sales and Traffic', path: '/app/business-reports/by-asin/detail-sales' }] },
  { id: 'other', label: 'Other', path: '/app/business-reports/other' },
  { id: 'sales-by-month', label: 'Sales and Orders by Month', path: '/app/business-reports/sales-by-month' }
  ```

#### 1.2 侧边栏组件修改 (`src/components/Sidebar.tsx`)

* 添加顶部关闭行："✕ CLOSE REPORTS MENU"（全大写，左对齐）

* 修改侧边栏样式：背景色#EEF0F3，固定宽度220px

* 调整二级菜单缩进为16px

* 更新激活状态样式

#### 1.3 布局修改 (`layouts/WithSidebarLayout.tsx`)

* 调整侧边栏宽度为220px

* 修改侧边栏背景色为#EEF0F3

* 添加侧边栏与内容区的分隔线

### 2. Sales Dashboard页面修改

#### 2.1 页面结构重写 (`features/BusinessReports.tsx`)

* 整体布局：左侧sidebar，右侧内容区

* 添加顶部信息通知条（两条）：

  * 第一条：Update for Sales（长文本说明）

  * 第二条：Performance Alerts说明，右侧有"Set Up Alerts"操作

* 页面标题与右侧按钮：

  * 标题"Sales Dashboard"，字号40~~44px，字重300~~400

  * 右侧按钮：Refresh（描边白底灰边）、Download（teal实心白字）、铃铛icon button

* Business Performance Insights卡片：

  * 方盒子样式：border 1px #D5DBDB，圆角2px

  * 标题行左侧显示"+"符号

  * 正文长段落，右下角有"Help improve this experience" + like/dislike图标

* 过滤器工具条：

  * 浅灰底#F2F3F3，外边框1px #D5DBDB

  * 三列：Date / Sales breakdown / Fulfillment channel

  * Date区域：下拉选择 + 两个日期输入

  * Sales breakdown与Fulfillment channel：紧凑下拉

  * Apply按钮：teal主按钮

* Sales Snapshot：

  * 标题行显示"Sales Snapshot" + taken at ... PST

  * 下方5列指标表格化布局

* Compare Sales：

  * 标题"Compare Sales"

  * 右侧有Graph view / Table view切换

  * 区块整体方盒子风格

#### 2.2 样式文件创建 (`features/SalesDashboard.module.css`)

* 添加Sales Dashboard专用样式

* 实现旧版Amazon风格：紧凑、方、灰边、低圆角、无阴影

* 定义所有组件样式，包括：

  * 信息通知条样式

  * 页面标题与按钮样式

  * Business Performance Insights卡片样式

  * 过滤器工具条样式

  * Sales Snapshot样式

  * Compare Sales样式

## 三、技术实现要点

### 1. 样式实现

* 优先使用CSS Modules，避免影响其他页面

* 实现旧版Amazon风格：

  * 边框：1px solid #D5DBDB

  * 圆角：2px

  * 背景色：白色或浅灰色

  * 无阴影或轻微阴影

  * 按钮样式：紧凑、方角

### 2. 布局实现

* 使用Flexbox实现左侧固定、右侧自适应的布局

* 侧边栏固定宽度220px，背景色#EEF0F3

* 内容区自适应宽度，添加适当内边距

### 3. 组件实现

* 完全重写BusinessReports组件，实现1:1复刻

* 使用现有mock数据，确保布局与文案一致

* 不引入新的大型UI框架，仅使用React + CSS Modules

## 四、预期效果

* Reports Sidebar：固定宽度220px，背景浅灰，支持分组与二级缩进，包含完整菜单结构

* Sales Dashboard页面：1:1复刻Seller Central旧版样式，包括布局、字号、间距、按钮样式、颜色、边框风格等

* 所有修改仅影响Business Reports相关页面，不影响其他页面

## 五、注意事项

1. 严格按照提供的截图实现，确保结构、样式一致
2. 不重构全站，仅修改指定页面和组件
3. 不修改登录注册页面
4. 不修改其他页面路由
5. 数据可mock，但布局与文案必须一致
6. 优先使用现有组件/样式体系，仅在必要时新增样式文件

