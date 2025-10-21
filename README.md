# ThinkMoss Launcher

ThinkMoss 启动器

## 注意事项

~~为了使用 GitHub CI 的免费额度，将 `@think/moss-browser` 二方包作为资源文件包含在本仓库中。~~

因含有原生平台依赖(playwright-core/sharp 等)，打包时请在对应平台架构的设备中编译，不建议进行交叉编译。

因 Electron 对 [ES Modules](https://www.electronjs.org/docs/latest/tutorial/esm) 的支持还不太好，目前 TypeScript 配置需使用 CommonJS 规范。

## 常用命令

```shell
# 安装依赖(自动本地安装 playwright 依赖至 .local-browsers 目录)
npm install

# 启动开发服务(main + preload + renderer)
npm run serve

# 编译当前平台架构应用
npm run build

# 编译 Windows 32位 免安装应用
npx electron-builder --win --ia32 --portable
```
