# 🏡 蛋蛋小屋

一个温暖亲切的个人展示网站，用代码、镜头和一点点好奇心搭建的线上空间。

## ✨ 网站特色

- 🎨 **温暖配色**：奶油白 + 燕麦棕 + 鼠尾草绿 + 暮霞粉
- ✍️ **手写字体**：马善政楷体增添亲切感
- 📸 **Polaroid相框**：独特的照片展示方式
- 💌 **明信片表单**：温馨的留言体验
- ✉️ **真实邮件**：访客留言直接发送到邮箱

## 🏠 五大区域

1. **门廊（首页）** - 欢迎页面，展示头像和快速导航
2. **客厅（关于我）** - 个人故事和时间轴
3. **工作桌（项目集）** - 项目展示和详情查看
4. **收藏架（兴趣角）** - Polaroid相框样式的兴趣展示
5. **留言簿（联系我）** - 明信片风格的联系表单

## 🚀 快速开始

### 1. 浏览网站
网站现在就可以使用了！所有功能都已就绪。

### 2. 配置邮件功能
为了让访客的留言能够发送到您的邮箱，需要配置 Resend API Key：

1. 注册 Resend 账号：https://resend.com
2. 获取 API Key
3. 在 Supabase 环境变量中配置 `RESEND_API_KEY`

**详细步骤请查看：** `docs/快速开始.md`

### 3. 自定义内容
编辑对应的组件文件，修改为您自己的信息：
- 首页：`src/components/sections/HomeSection.tsx`
- 关于我：`src/components/sections/AboutSection.tsx`
- 项目集：`src/components/sections/ProjectsSection.tsx`
- 兴趣角：`src/components/sections/InterestsSection.tsx`
- 联系我：`src/components/sections/ContactSection.tsx`

## 📚 文档

- **快速开始.md** - 快速配置和使用指南
- **邮件配置说明.md** - 邮件功能详细配置步骤
- **使用指南.md** - 完整的功能使用说明
- **网站说明.md** - 设计特点和功能介绍
- **项目总结.md** - 技术实现总结
- **功能清单.md** - 功能实现对照表

## 🛠️ 技术栈

- **前端框架**：React 18 + TypeScript
- **样式方案**：Tailwind CSS
- **UI组件**：shadcn/ui
- **后端服务**：Supabase Edge Functions
- **邮件服务**：Resend
- **构建工具**：Vite

## 📧 联系邮箱

1660296253@qq.com

## 📄 许可

2025 蛋蛋小屋

---

**祝您使用愉快！** 🎉✨
