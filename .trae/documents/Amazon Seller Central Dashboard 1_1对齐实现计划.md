# Amazon Seller Central Dashboard 1:1对齐实现计划

## 一、修改范围

* **Dashboard.tsx**：主文件，实现所有UI对齐点

* **index.css**：辅助样式调整（如需要）

## 二、修改内容

### P0-1 灰底规则修正

* **修改位置**：Dashboard.tsx 第153行

* **修改内容**：移除根容器的`bg-[#F5F6F6]`，保留`animate-fade-in min-h-screen pb-8`

* **目的**：让灰底完全由`.amz-console`控制

### P0-2 标题颜色统一

* **修改位置**：所有卡片标题h3标签

* **修改内容**：将文字颜色统一为`#002E35`，字号13px，字重bold

* **涉及卡片**：

  * Actions（第195行）

  * Buyer Messages（第220行）

  * Seller News（第243行）

  * Global Snapshot（第270行）

  * Product Performance（第400行）

### P0-3 顶部问候区修改

* **修改位置**：Dashboard.tsx 第175-185行

* **修改内容**：

  * 将`Good afternoon, xxx`替换为中文问候语

  * 增加绿色"健康"状态pill

  * 标题颜色改为`#002E35`，字重semibold

### P0-4 新增两个按钮

* **修改位置**：Dashboard.tsx 第179-184行

* **修改内容**：在右侧状态胶囊旁边新增两个按钮

  * 按钮1：`发布演示`

  * 按钮2：`了解更多信息`

* **样式**：白底、1px边框#D5D9D9、圆角3px、高度31px、字号13px、文字颜色#002E35；hover背景#F7FAFA

### P0-5 "前往管理所有库存"入口

* **修改位置**：Dashboard.tsx 第563-567行

* **修改内容**：

  * 调整文字为中英文切换

  * 确保样式为13px，链接色#007185，hover underline

### P1 细节优化

* **Global Snapshot顶部优化**：

  * "Today so far"文字改为12px灰色

  * 右侧grid/gear图标hover效果优化

* **Global Snapshot小标题统一**：

  * 所有小标题改为12px uppercase、颜色#565959

* **分割线与卡片边框优化**：

  * 确保外边框#D5D9D9，内部分割线#E7EAEA

  * 调整间距更紧凑

## 三、实现思路

1. 使用`session.language`实现中英文切换
2. 严格遵循现有代码结构，不引入新依赖
3. 确保所有修改可复用i18n
4. 优先使用Tailwind CSS类，减少自定义CSS

## 四、修改后预期效果

* Dashboard页面背景色统一为`#F1F3F3`

* 所有卡片标题样式统一，颜色为`#002E35`

* 顶部问候区显示中文问候语和健康状态

* 新增两个功能按钮

* 底部链接文字和样式符合要求

* 细节优化提升整体视觉效果，更贴近真实Amazon Seller Central

## 五、验证方法

* 直接查看Dashboard页面，对比截图验证UI对齐

* 检查中英文切换是否正常

* 确认所有交互元素（按钮、链接）功能正常

