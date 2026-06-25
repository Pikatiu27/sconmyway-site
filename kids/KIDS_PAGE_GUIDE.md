# Kids Page Guide

本文件是 `今天带娃去哪儿？ / Kids Finder` 的唯一维护说明。以后调整页面、扩展城市、筛选活动、修改自动更新逻辑时，优先按本文执行。

## 1. 页面定位

- 面向 Sydney / Melbourne 家长，在手机上快速查找本周亲子活动。
- 不是完整活动数据库，而是每周精选 8 条可靠、适合孩子、信息清楚的活动。
- 首页必须 answer-first：打开后马上知道“这周带娃去哪儿”。
- 同一个网页支持 Sydney / Melbourne 城市切换和中文 / English 切换。
- 每个城市主推荐固定 8 条活动，底部 `More` 折叠区只放额外 3-5 条链接。
- 分享链接应定位到具体城市、语言和被分享的活动卡片。

## 2. 视觉与排版

- 沿用 SConmyway industry 页面的轻量结构感，但 kids 页面更可爱。
- 手机优先：所有字号、按钮、间距先按竖屏手机判断。
- 马卡龙色、轻贴纸、手帐感、轻悬浮卡片。
- Sticker 不能遮挡城市切换、语言切换、标题或按钮。
- 顶部保持简洁，不放解释性长文。
- 顶部浏览量必须弱于品牌副标题。
- 主标题固定：中文 `今天带娃去哪儿？`；英文 `Where to take the kids today?`

## 3. 更新周期

- 每周五 Sydney/Melbourne 当地时间 0:00 自动更新并推送上线。
- 1:00 做补偿检查；如果 0:00 没成功，再重试。
- 页面显示的是发布周期，不随用户点击当天滚动。
- 周期固定为本周五到下一个周五，使用 `periodStart` / `periodEnd`。
- 自动校验必须确认周期是 Friday-to-Friday。

## 4. 内容排序规则

每周更新时必须重新筛选整周内容：

1. 删除已经结束的活动。
2. 新增最新活动。
3. 新活动、单日活动、短期活动放在前排。
4. 仍在持续的长期展览、长期开放项目往后放。
5. 每个城市保留 8 条主推荐。
6. `More` 区保留 3-5 条链接，不无限增加。

## 5. 活动筛选逻辑

优先选择：

- 本周五到下周五期间明确可参加。
- 适合儿童、亲子、家庭、学校假期、图书馆、手作、户外、展览、开放日。
- 时间、地点、主办方和链接足够清楚。
- 官方来源优先，社媒和生活方式媒体只作线索。
- 尽量覆盖不同区域和不同类型。
- 不编造时间、地点、票价或年龄限制；缺失时写“以官网为准 / Check official page”。

避免选择：

- 日期不明或已经结束。
- 成人向、酒吧、夜生活、18+、赌博、纯商业促销。
- 只有社媒截图、没有主办方页面或官方报名页的活动。

## 6. 卡片结构

```text
Tag
Title
Summary
Time / Location / Price
Official / Map / Share
Reference
```

要求：

- 三个按钮在手机上必须保持一行。
- 按钮顺序固定：`官网 / 导航 / 分享`，英文为 `Official / Map / Share`。
- `Official` 打开官网或可信官方页。
- `Map` 打开 Google Maps 搜索或导航。
- `Share` 复制深链接，朋友打开后定位到该活动。

## 7. 双语规则

- 中文自然、简洁，像给朋友发消息。
- 英文页面必须全英文，包括 `Reference`、按钮、标签和错误状态。
- 英文 `.en` 内容不得夹中文。
- 中英内容不必逐字翻译，但事实必须一致。

## 8. 信息来源分级

### A 级：官方、优先抓取

- City / Council 官方活动页。
- City / Council 单个活动详情页。
- 图书馆、博物馆、美术馆、公园、botanic garden、state government 官方页。
- Bunnings 官方活动预约页。
- 消防局、开放日、公共服务机构官方活动页。

Sydney 重点：City of Sydney, Inner West, Burwood, Ryde, Strathfield, Cumberland, Bayside, Northern Beaches, Darling Harbour, Sydney Olympic Park, Australian Museum, State Library NSW, Art Gallery NSW, Botanic Gardens, Centennial Parklands, Harry Potter: The Exhibition Sydney, Inner West Council Last Laps。

Melbourne 重点：City of Melbourne, Yarra, Port Phillip, Stonnington, Boroondara, Darebin, Merri-bek, Moonee Valley, Maribyrnong, Hobsons Bay, Brimbank, Wyndham, Kingston, Banyule, Museums Victoria, ACMI, NGV, State Library Victoria, Fed Square, Royal Botanic Gardens Victoria, Melbourne Museum, Zoos Victoria, Puffing Billy, CERES, Collingwood Children's Farm。

### B/C/D 级：补充线索

- Eventbrite, Humanitix, AllEvents, Time Out, Concrete Playground, Broadsheet, Secret Sydney / Secret Melbourne。
- ellaslist, Mamma Knows Melbourne, Kiddiehood, Busy City Kids, Melbourne with Kidz, Little Melbourne, What's On 4 Kids。
- Instagram, Facebook Events, 小红书, newsletter, flyer, community noticeboard。

B/C/D 级只用于发现线索，入选前必须回到官方页、官方报名页或主办方页面核验。

## 9. 自动更新与校验

- Workflow 使用 UTC 多时间槽覆盖 AEST / AEDT，再由脚本 gate 判断本地小时。
- 自动任务必须 UTF-8 读写，防止中文乱码破坏 JSON。
- 生成后校验 JSON 可解析。
- 校验英文页面无中文泄漏。
- 写入 Friday-to-Friday 周期。
- 删除上一周期过期活动，新增最新活动。
- 记录 OpenAI API token 到 `TOKEN_USAGE.md`。
- 确认写入、提交、推送都成功，不能静默失败。

## 10. Token、分享和访问

- 页面访问、朋友打开分享链接、点击官网、点击地图，不消耗 OpenAI token。
- 只有自动更新脚本调用 OpenAI API 时才消耗 API token。
- `TOKEN_USAGE.md` 只记录自动更新 API token，不记录 Codex/ChatGPT 对话 token。
- 顶部浏览量目前是本地浏览器计数，不是全站真实访问统计。
- 分享链接应包含城市、语言和活动锚点，例如 `?city=sydney&lang=zh&event=sydney-01`。

## 11. 本地与部署

当前本地 kids 工作目录：

```text
C:\Users\silin\Documents\Codex\sconmyway-site\kids
```

公开链接：

```text
https://pikatiu27.github.io/sconmyway-site/kids/
```

维护原则：

- 本地先改 kids 目录。
- 明确要求推送时，再提交并推送。
- 不要误改 industry 目录。
- 提交时只 stage kids 相关文件、kids workflow 和 kids updater，避开 unrelated 文件。

## 12. 调用 Codex 的推荐提示词

```text
请按 KIDS_PAGE_GUIDE.md 维护“今天带娃去哪儿？”页面。保持手机优先、马卡龙手帐风、Sydney/Melbourne 城市切换、中英双语、8 条主推荐、More 折叠链接、官网/导航/分享按钮顺序。每周五凌晨 0:00 更新新一周全部内容：删除过期活动，新增最新活动，新活动放前排，仍在持续的活动往后放。内容筛选优先官方来源，社媒和亲子媒体只作补充线索；英文页面必须全英文。先保存本地，不要推送 GitHub，除非我明确要求部署。
```