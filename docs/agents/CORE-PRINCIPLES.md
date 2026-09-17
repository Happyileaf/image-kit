# 核心原则与技术边界

> 本文件为 [AGENTS.md](../../AGENTS.md) 的展开说明，描述 image-kit 项目的产品核心原则与服务器/浏览器职责边界。

## 优先级

> **隐私理念 > 技术便利 > 精确数据统计**

---

## 四条核心原则

### 1. 图片永远不离开用户设备

所有图片处理必须在浏览器本地完成。

禁止将以下任何数据发送到服务器、第三方 API 或远程处理服务：

* 图片文件
* Blob / ArrayBuffer / Base64
* 图片内容
* 文件名
* EXIF / 图片元数据
* 中间处理结果
* 最终处理结果

### 2. 不允许服务端兜底

如果某项功能无法可靠地在浏览器本地实现：

> **宁可不做，也不能上传图片到服务器处理。**

可以选择：

* 降低功能范围
* 使用 WASM / Web Worker / WebGPU 等本地技术
* 标记为 Coming Soon
* 暂不实现

### 3. 无需登录

不需要：

* 注册
* 登录
* 用户账户
* 用户资料

打开即可使用。

### 4. 默认不追踪用户

不要默认引入：

* Analytics SDK
* 用户 ID
* Fingerprint
* Tracking Cookie
* 第三方行为追踪

如果只是需要了解网站整体访问量，优先使用 CDN / Server 的基础访问日志。

**不为了精确 UV 而牺牲隐私。**

---

## 技术边界

### 服务器职责

服务器只负责提供：

* HTML
* CSS
* JavaScript
* WASM
* 本地模型及其他静态资源

服务器不得参与：

* 图片上传
* 图片处理
* 图片存储
* 图片分析

### 数据流规则

允许：

```text
Browser → Server：获取网站资源
Browser → Browser：图片处理
Browser → User：下载结果
```

禁止：

```text
Browser → Server：上传图片
Server → Server：处理图片
Server → Browser：返回处理结果
```
