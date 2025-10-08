# 创建占位图片说明

由于项目中引用了图片路径但未包含实际图片文件，您需要创建占位图片或使用实际医疗图片。

## 方法一：使用在线占位图服务（开发测试）

您可以暂时修改 `src/static/mock/records.json` 中的图片路径，使用在线占位图：

```json
"images": [
  "https://via.placeholder.com/640x480/667eea/ffffff?text=Skin+Photo+1",
  "https://via.placeholder.com/640x480/764ba2/ffffff?text=Skin+Photo+2"
]
```

## 方法二：创建本地占位图片（推荐）

在 `src/static/mock/images/` 目录下创建以下图片：

### 使用 ImageMagick 创建（macOS/Linux）

```bash
cd src/static/mock/images/

# 皮肤检查图片
convert -size 640x480 xc:#667eea -gravity center \
  -pointsize 48 -fill white -annotate +0+0 "Skin Photo 1" \
  skin_01.jpg

convert -size 640x480 xc:#764ba2 -gravity center \
  -pointsize 48 -fill white -annotate +0+0 "Skin Photo 2" \
  skin_02.jpg

# X光图片
convert -size 800x600 xc:#2c3e50 -gravity center \
  -pointsize 48 -fill white -annotate +0+0 "Chest X-Ray" \
  xray_chest_01.jpg

# 血液检查报告
convert -size 640x480 xc:#e74c3c -gravity center \
  -pointsize 48 -fill white -annotate +0+0 "Blood Test" \
  blood_test_01.jpg

# 心电图
convert -size 800x400 xc:#16a085 -gravity center \
  -pointsize 48 -fill white -annotate +0+0 "ECG Chart" \
  ecg_01.jpg
```

### 使用在线工具手动创建

1. 访问 https://placeholder.com/
2. 生成以下尺寸的图片并保存：
   - 640x480 (skin_01.jpg, skin_02.jpg, blood_test_01.jpg)
   - 800x600 (xray_chest_01.jpg)
   - 800x400 (ecg_01.jpg)

## 方法三：使用真实示例图片

如果您有去标识化的医疗图片，请确保：
- 符合医疗数据隐私规定
- 图片格式为 JPEG
- 文件大小 < 2MB
- 文件名与 records.json 中的路径匹配

## 安装 ImageMagick（macOS）

```bash
brew install imagemagick
```

## 验证图片

创建完成后，检查文件：

```bash
ls -lh src/static/mock/images/
```

应该看到：
- skin_01.jpg
- skin_02.jpg
- xray_chest_01.jpg
- blood_test_01.jpg
- ecg_01.jpg
