## 1. 布局结构调整

### 1.1 修改 MainLayout.tsx
- 为 Dashboard 路由添加特殊的宽度策略
- 实现：在 main 标签的 className 中，为 Dashboard 路由添加 `dashboard-container` 类
- 样式：`.dashboard-container { max-width: calc(100% - 200px); margin: 0 auto; }`

### 1.2 重构 Dashboard.tsx 布局
- 移除现有的三列布局，改为两列布局
- 左列：固定宽度 264px，包含 Actions 和 Communications 卡片
- 右列：自适应宽度，包含 Global Snapshot 和 Product Performance 卡片
- 中间间距：16px

## 2. 组件拆分与实现

### 2.1 提取通用卡片组件
- 创建统一的卡片样式，应用于所有 Dashboard 模块
- 样式：白色背景、1px 边框、8px 圆角、16px 内边距、无阴影

### 2.2 Actions 卡片
- 标题：Actions
- 右上角小圆点徽标数字
- 列表项：蓝色链接标题（13px）+ 灰色说明文字（12px，两行）

### 2.3 Communications 卡片
- 标题：Communications
- 内部包含两个区块：
  - Buyer Messages：标题（13px，600 权重）+ See all 链接 + 列表项
  - Seller News：标题（13px，600 权重）+ See all 链接 + 列表项

### 2.4 Global Snapshot 卡片（核心组件）
- 标题：Global Snapshot
- 右上角两个小图标按钮
- 内部使用 6 等宽竖列网格（grid-template-columns: repeat(6, 1fr)）
- 列间距：16px
- 每列之间有竖分割线（border-left: 1px solid #E3E6E6）
- 每列左右内边距：12px
- 列标题：12px，600 权重，右侧带下拉箭头
- 列内上下分区：
  - Sales 列：金额 + 小折线图（高度 44px，线宽 1px）
  - 其他列：上半区主指标 + 下半区次指标，中间有列内横分割线

### 2.5 Product Performance 卡片
- 标题：Product Performance
- 顶部控件行（同一行，不换行）：
  - 下拉：Active
  - 下拉：Frequently interacted
  - Search 输入框（宽 240px，高度 32px）
  - 搜索按钮/图标
  - 三点菜单按钮
- 表格：
  - 表头背景：#F7F8FA
  - 行高：44px
  - 列：Product details / Listing status / Sales / Units sold / Page views / Inventory / Price / Actions

## 3. 样式实现

### 3.1 颜色与字体
- 统一使用 Amazon Seller Central 风格的颜色方案
- 字体大小和权重严格按照要求实现
- Healthy 胶囊标签：淡绿背景，深绿文字，2px 8px 内边距，999px 圆角

### 3.2 响应式设计
- 确保 Dashboard 在小屏幕上有合适的响应式降级
- 保持其他页面的原有布局不变

## 4. 数据与交互

### 4.1 Mock 数据
- 使用现有 mock 数据，调整结构以适应新的布局
- 确保所有指标和数值都符合 Amazon Seller Central 风格

### 4.2 交互效果
- 添加适当的 hover 效果
- 实现平滑的过渡动画
- 确保所有控件都能正常交互

## 5. 禁止项严格遵守
- 不将 Global Snapshot 拆分为 6 个独立卡片
- 横分割线仅在列内出现，不贯穿全局
- 大数字使用正常字重（400-500）
- 移除所有不必要的阴影效果
- 仅修改 Dashboard 页面的宽度策略

## 6. 实现顺序

1. 修改 MainLayout.tsx，添加 Dashboard 特定的宽度策略
2. 重构 Dashboard.tsx 的整体布局结构
3. 实现通用卡片样式
4. 实现 Actions 卡片
5. 实现 Communications 卡片
6. 实现 Global Snapshot 卡片（核心组件）
7. 实现 Product Performance 卡片
8. 调整样式细节，确保像素级对齐
9. 测试响应式表现
10. 确保所有交互正常工作