## 修复计划

### 1. Global Snapshot 表格边框修复
- **修改位置**：`features/Dashboard.tsx`
- **修改内容**：为 Global Snapshot 网格添加左右边框
- **实现方式**：在网格容器上添加 `border-x border-[#E3E6E6]` 类

### 2. Product Performance 相关修复
- **修改位置**：`features/Dashboard.tsx`
- **修改内容**：
  - 为 Action 列的下拉框添加按钮轮廓
  - 移除 Go to Manage All Inventory 后面的 >
  - 为 Go to Manage All Inventory 添加按钮框
  - 在 Product Performance 标题下添加 "Last 30 days" 小字
  - 添加圆形感叹号提示图标

### 3. Header 店铺名修复
- **修改位置**：`layouts/MainLayout.tsx`
- **修改内容**：
  - 修复店铺名显示，改为 "EnShZhiXun | United States"
  - 确保店铺名和地区都可以独立切换

### 4. Healthy 状态修复
- **修改位置**：`features/Dashboard.tsx`
- **修改内容**：
  - 将 Healthy 文本颜色改为 #507F00
  - 在 Healthy 后面添加 >

### 5. Global Snapshot 折线图修复
- **修改位置**：`features/Dashboard.tsx`
- **修改内容**：修复横坐标显示，改为 Jan1, 4, 7

### 6. 其他 UI 元素修复
- **修改位置**：`features/Dashboard.tsx`
- **修改内容**：
  - 为 Shipment performance, Buyer Messages, Seller News 添加垂直三点图标
  - 将 See All 移到标题下方，左对齐，字体变小
  - 在欢迎语行添加 Launch Tour 和 Learn More 按钮

### 7. 实现顺序
1. 修复 Global Snapshot 表格边框和折线图
2. 修复 Product Performance 相关元素
3. 修复 Header 店铺名
4. 修复 Healthy 状态
5. 修复其他 UI 元素
6. 测试所有修复是否符合要求

### 8. 预期结果
- 所有 9 个修改点都得到修复
- 页面布局符合 Amazon Seller Central 风格
- 代码没有编译错误
- 页面响应式表现良好