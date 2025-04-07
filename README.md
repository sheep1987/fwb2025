# 富文本编辑系统

## 项目介绍

这是一个基于 TinyMCE 的富文本编辑系统，支持富文本内容的创建、编辑、删除和导出功能。系统使用 Node.js 和 Express 作为后端，MySQL 作为数据库存储，提供了完整的内容管理解决方案。

## 功能特点

- 富文本编辑：基于 TinyMCE 的所见即所得编辑器
- 内容管理：支持创建、编辑、删除和查看富文本内容
- 分类管理：按项目类型对内容进行分类
- 内容搜索：支持按标题搜索和项目类型筛选
- 数据导出：支持将选中内容导出为 CSV 格式
- 响应式设计：适配各种屏幕尺寸，包括桌面和移动设备

## 技术栈

- **前端**：
  - HTML5、CSS3、JavaScript (ES6+)
  - TinyMCE 富文本编辑器
  - SheetJS 用于 CSV 导出功能

- **后端**：
  - Node.js
  - Express 框架
  - MySQL 数据库

## 项目结构
├── public/ # 静态资源目录
│ ├── css/ # 样式文件
│ │ ├── common.css # 公共样式
│ │ ├── editor.css # 编辑器相关样式
│ │ ├── history.css # 历史记录页面样式
│ │ └── view.css # 内容查看页面样式
│ ├── tinymce/ # TinyMCE 编辑器资源
│ ├── index.html # 内容编辑页面
│ ├── history.html # 内容列表页面
│ └── view.html # 内容查看页面
├── config.js # 数据库配置
├── server.js # 服务器入口文件
├── package.json # 项目依赖
├── .gitignore # Git 忽略文件
└── README.md # 项目说明文档

## 安装与运行

### 前提条件

- Node.js (v12.0.0 以上)
- MySQL (v5.7 以上)

### 安装步骤

1. 克隆项目

```bash
git clone <项目仓库URL>
cd <项目目录>
```

2. 安装依赖

```bash
npm install
```

3. 配置数据库

编辑 `config.js` 文件，设置正确的数据库连接信息：

```javascript
// 数据库连接配置
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'toubiao'
};
```

4. 启动服务器

```bash
npm start
```

5. 访问应用

打开浏览器，访问 http://localhost:85

## 使用指南

### 创建内容

1. 访问首页 (index.html)
2. 填写标题和选择项目类型
3. 使用富文本编辑器编写内容
4. 点击"保存内容"按钮

### 查看内容列表

1. 从首页点击"查看历史记录"或直接访问 history.html
2. 可以使用搜索框按标题搜索内容
3. 可以使用项目类型下拉菜单筛选内容

### 导出内容

1. 在历史记录页面 (history.html) 选择要导出的内容
2. 点击"导出 CSV"按钮
3. 系统会生成并下载包含所选内容的 CSV 文件

### 删除内容

1. 在历史记录页面，点击内容行上的"删除"按钮
2. 在确认对话框中确认删除操作

## 开发说明

### API 端点

- `GET /api/get-contents` - 获取所有内容列表
- `GET /api/get-content/:id` - 获取指定 ID 的内容详情
- `POST /api/save-content` - 保存新内容
- `POST /api/update-content` - 更新现有内容
- `DELETE /api/delete-content/:id` - 删除指定 ID 的内容

## 许可证

[MIT License](LICENSE)
