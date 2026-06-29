# Kids Page Guide

本文件是 `今天带娃去哪儿？ / Kids Finder` 的唯一维护说明。以后调整页面、扩展城市、筛选活动、修改自动更新逻辑时，优先按本文执行。

## 1. 页面定位

- 面向 Sydney / Melbourne 家长，在手机上快速查找本周亲子活动。
- 不是完整活动数据库，而是每周精选 8 条可靠、适合孩子、信息清楚的活动。
- 首页必须 answer-first：打开后马上知道“这周带娃去哪儿”。
- 同一个网页支持 Sydney / Melbourne 城市切换和中文 / English 切换。
- 每个城市主推荐固定 8 条活动，底部 `More` 折叠区只放额外 3-5 条链接。
- `More` 不是装饰区；每周也必须更新，链接必须可打开，并来自本周检索候选或可靠官方入口。
- 分享链接应定位到具体城市、语言和被分享的活动卡片。
- 页面可以扩展成 `Events / Playgrounds` 双 tab：Events 解决“本周有什么活动”，Playgrounds 解决“今天临时去哪儿放电”。

## 2. 视觉与排版

- 沿用 SConmyway industry 页面的轻量结构感，但 kids 页面更可爱。
- 手机优先：所有字号、按钮、间距先按竖屏手机判断。
- 马卡龙色、轻贴纸、手帐感、轻悬浮卡片；卡片可用小贴纸标注 `免费 / 需确认 / 室内 / 户外 / 幼儿友好 / 周末` 等快速判断信息。
- Sticker 不能遮挡城市切换、语言切换、标题或按钮。
- Sydney / Melbourne 城市切换优先使用明显的 segmented control，而不是很小的下拉框。
- 顶部保持简洁，不放解释性长文。
- 顶部浏览量必须弱于品牌副标题。
- 主标题固定：中文 `今天带娃去哪儿？`；英文 `Where to take the kids today?`
- `More` 区可以分成 `本周候选 / More this week` 和 `备用入口 / Backup sources` 两组，仍保持折叠。
- 如果运行时数据加载失败，页面必须显示 HTML fallback，并用很轻的提示提醒用户出发前确认官网。
- Playgrounds tab 使用同一套马卡龙手帐视觉，但信息密度可以更偏地点库：区域筛选、设施标签和半日组合必须比长正文更突出。
- Playgrounds 视觉应接近“亲子旅行手账”：轻胶带、stamp、地图/路线感、可爱 sticker，但当前版本不放图片，优先保证文字信息清楚。
- 配色不仅是装饰，也要帮助用户定位：城市切换用 city 色，内容类型切换用 view 色；Events、Playgrounds 不要共用同一种高亮色。
- Playground 卡片颜色按信息类别分配：water play 偏浅蓝，nature/park 偏浅绿，indoor/gallery 偏淡紫，fenced/toddler 偏粉，big kids/adventure 偏桃橙，half-day/backup 偏柠檬黄。
- 卡片的 `官网 / Official` 主按钮可以轻微跟随卡片 accent；`地图 / Map` 和 `分享 / Share` 保持白底，避免手机上一排按钮显得太花。

## 3. 当前页面信息架构

第一屏顺序固定：

1. Header：品牌名、弱浏览量、语言切换。
2. Hero：主标题 `今天带娃去哪儿？` / `Where to take the kids today?`。
3. Finder controls：当前选择摘要 + 城市切换 + 内容类型切换。
4. Week meta：Friday-to-Friday 更新周期。
5. Content：根据当前城市和内容类型显示 Events 或 Playgrounds。

顶部层级规则：

- Header 不放城市切换；城市切换只放在 Finder controls。
- 内容类型切换只放在 Finder controls，不再放到日期下面或内容列表上方。
- Finder controls 必须同时回答两个问题：`我在哪个城市？`、`我在看活动还是游乐场？`
- 当前选择摘要必须实时显示：中文 `当前：悉尼 · 本周活动`，英文 `Now showing: Sydney · Events`。
- 无 URL 分享参数时，页面默认必须是 `Sydney / 悉尼` + `Events / 本周活动`；不要用上一次浏览留下的 localStorage 覆盖默认首页。
- 只有分享链接或深链接参数可以覆盖默认，例如 `?city=melbourne&view=playgrounds`。
- 主标题必须一行显示，中文不要断成两行；字号服务于定位，不做夸张 hero。
- 左上品牌副标题保持中性：`活动 · 游乐场 · 一键导航`，不要写 `本周 8 条`，避免切到 Playgrounds 时误导。
- 语言切换可以在 Header 右侧；它是辅助设置，视觉权重低于城市和内容类型。

Finder controls 结构：

```text
当前：Sydney/Melbourne · 本周活动/游乐场
[ Sydney | Melbourne ]
[ 本周活动/Events | 游乐场/Playgrounds ]
```

不要再出现：

- 顶部 header 一个城市切换，标题下面另一个类型切换的分裂结构。
- `按地区找 playground` 这类解释性提示块。
- 地区标题下面的泛泛说明句。
- Playground 小卡图片或假图片；当前版本以文字精准信息为主。

## 4. 更新周期

- 每周五 Sydney/Melbourne 当地时间 0:00 自动更新并推送上线。
- 1:00 做补偿检查；如果 0:00 没成功，再重试。
- 页面显示的是发布周期，不随用户点击当天滚动。
- 周期固定为本周五到下一个周五，使用 `periodStart` / `periodEnd`。
- 自动校验必须确认周期是 Friday-to-Friday。
- 每周更新必须重新检索、重新筛选、重新生成内容，不能只复用上周静态 DATA 或只改日期。

## 5. 内容排序规则

每周更新时必须重新筛选整周内容：

1. 删除已经结束的活动。
2. 新增最新活动。
3. 新活动、单日活动、短期活动放在前排。
4. 仍在持续的长期展览、长期开放项目往后放。
5. 每个城市保留 8 条主推荐。
6. `More` 区保留 3-5 条有效链接，不无限增加，不放失效、空白或长期无人维护的入口。
7. 每周保留候选池报告，记录 8 条主推荐之外的候选和来源，方便追溯为什么入选或未入选。

## 6. 活动筛选逻辑

优先选择：

- 本周五到下周五期间明确可参加。
- 适合儿童、亲子、家庭、学校假期、图书馆、手作、户外、展览、开放日。
- 时间、地点、主办方和链接足够清楚。
- 官方来源优先，社媒和生活方式媒体只作线索。
- 社媒、群聊、newsletter 或线下海报发现的短期活动，要按“线索 → 官方核验 → 入选”的流程处理；不能因为截图热度高就直接写入页面。
- 如果线索指向某个 suburb、town square、library、park、pool、fire station、festival 或 council 地点，优先反查对应 council、venue、主办方、ticketing 或 official event page。
- 尽量覆盖不同区域和不同类型。
- 不编造时间、地点、票价或年龄限制；缺失时写“以官网为准 / Check official page”。

避免选择：

- 日期不明或已经结束。
- 成人向、酒吧、夜生活、18+、赌博、纯商业促销。
- 只有社媒截图、没有主办方页面或官方报名页的活动。

## 7. 卡片结构

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

## 8. 双语规则

- 中文自然、简洁，像给朋友发消息。
- 英文页面必须全英文，包括 `Reference`、按钮、标签和错误状态。
- 英文 `.en` 内容不得夹中文。
- 中英内容不必逐字翻译，但事实必须一致。

## 9. 信息来源分级

### A 级：官方、优先抓取

- City / Council 官方活动页。
- City / Council 单个活动详情页。
- 图书馆、博物馆、美术馆、公园、botanic garden、state government 官方页。
- Bunnings 官方活动预约页。
- 消防局、开放日、公共服务机构官方活动页。

Sydney 重点：City of Sydney, Inner West, Waverley, North Sydney, Willoughby, Mosman, Woollahra, Burwood, Ryde, Strathfield, Cumberland, Bayside, Northern Beaches, Canterbury-Bankstown, Georges River, Hornsby, Ku-ring-gai, Lane Cove, Liverpool, Blacktown, Penrith 等有官网活动页的主要 council；Sydney Opera House, Darling Harbour, Sydney Olympic Park, Australian Museum, Powerhouse, State Library NSW, Art Gallery NSW, MCA, Maritime Museum, Taronga Zoo, Sydney Zoo, Luna Park, Botanic Gardens, Centennial Parklands, Harry Potter: The Exhibition Sydney, Children’s International Film Festival 等大型场馆或官方活动页。

Melbourne 重点：City of Melbourne, Yarra, Port Phillip, Stonnington, Boroondara, Darebin, Merri-bek, Moonee Valley, Maribyrnong, Hobsons Bay, Brimbank, Wyndham, Kingston, Banyule, Whitehorse, Manningham, Maroondah, Knox, Casey, Greater Dandenong, Frankston 等有官网活动页的主要 council；Museums Victoria, ACMI, NGV, State Library Victoria, Arts Centre Melbourne, Fed Square, Royal Botanic Gardens Victoria, Melbourne Museum, Immigration Museum, Zoos Victoria, Puffing Billy, CERES, Collingwood Children's Farm, Melbourne Recital Centre 等大型场馆或官方活动页。

### B/C/D 级：补充线索

- Eventbrite, Humanitix, AllEvents, Time Out, Concrete Playground, Broadsheet, Secret Sydney / Secret Melbourne。
- ellaslist, Mamma Knows Melbourne, Kiddiehood, Busy City Kids, Melbourne with Kidz, Little Melbourne, What's On 4 Kids。
- Instagram, Facebook Events, 小红书, newsletter, flyer, community noticeboard。

B/C/D 级只用于发现线索，入选前必须回到官方页、官方报名页或主办方页面核验。

社媒线索处理规则：

1. 先提取截图或帖子里的活动名、日期、时间、地点、费用、主办方和关键词。
2. 用更宽的搜索范围反查：`活动名 + suburb`、`地点 + date`、`council + event`、`venue + kids/family`、`festival/open day + city`。
3. Sydney 线索优先反查相关 NSW council 和大型场馆；Melbourne 线索优先反查相关 VIC council 和大型场馆。
4. 如果能找到官方 council/venue/organiser/ticketing 页面，才可进入 8 条主推荐或 `More`。
5. 如果只能找到小红书、Instagram、Facebook 截图，没有官方核验页，只能暂存为候选，不写入公开页面。
6. 短期、免费、明确适合家庭的活动，经官方核验后下周更新时优先排在前面；已经结束则直接删除。

## 10. Playgrounds tab 规则

定位：

- Playgrounds 是常备地点库，不是每周活动列表。
- Playgrounds 不限制为每个城市 8 个。它应是“地区地点库”：每个地区按实际密度放 2-4 个候选，热门地区可以更多，信息少的地区可以 1-2 个。
- 当前页面采用一个主展示层级：筛选 chips → 按地区分组的小卡片目录 → More 链接。不要同时显示一组大推荐卡和同名地区小卡，避免页面凌乱。
- 如以后恢复“重点推荐”大卡，只能作为地区目录的替代入口或极少量 spotlight，不得和地区目录重复同一个 playground。
- 重点回答：适合谁、有什么设施、在哪个区域、能不能组成半日行程；不要在页面显示内部查找逻辑。

如使用 spotlight 大卡，结构为：

```text
Tag
Playground name
一句话推荐理由
Half-day combo
Best for / Facilities / Area
Official / Map / Share
Reference
```

地区地点库的紧凑结构：

```text
Region heading
Playground name
简介：什么场所 / 有什么项目 / 适合什么
半日：附近可接的具体地点、展馆、公园、步道、图书馆或 cafe 区域
Feature chips: half-day / water / fenced / toddler / toilets / shade / indoor
Official or council finder / Map
```

筛选与标签：

- 手机端用横向 chip，不做复杂搜索。
- 筛选顺序固定：`All / 全部`、`Half-day / 半日组合`、`Water play / 水玩`、功能标签，再放地区标签。
- Sydney 优先地区：`CBD / Inner City`、`Inner West`、`Eastern Suburbs`、`Lower North Shore`、`Northern Beaches`、`Parramatta / West`、`Northwest / Hills`、`St George / Sutherland`、`Southwest`。
- Melbourne 优先地区：`CBD / Docklands`、`Inner North`、`Inner East`、`Eastern Suburbs`、`Bayside`。
- 筛选 chip 必须允许换行，不能依赖横向滚动条；sticker 不能遮挡 chip。
- 卡片可标注：`water / fenced / toilets / toddler / big-kids / indoor / half-day`。
- 功能筛选必须作用于该城市全部可见 playground 条目；筛选后空地区应自动隐藏。
- `All / 全部` 显示所有地区和所有条目。
- 参考活动网站的信息架构：优先让用户先选择场景或分类，再进入短卡列表；不要把长正文、重复卡片、查找说明和链接库同时摊开。
- 参考旅游手账视觉，但不要让装饰抢正文。当前小卡不放图片；正文固定两行：`简介：` 和 `半日：`。
- `简介：` 不要重复标题，只写这个地点是什么场所、有什么活动项目、适合什么孩子或家庭。
- `半日：` 必须写清楚附近可接的具体地点，例如展馆要写出 ACMI、Australian National Maritime Museum、Casula Powerhouse Arts Centre 等具体名称，不要只写“展馆”。
- 精准信息优先级：名称、简介、半日组合、设施标签、Official/Map/Share。装饰元素只负责增强识别，不能覆盖按钮和文字。

内容选择：

- 优先选择 council、official park、parklands、botanic garden、venue 官方页面能核验的地点。
- 覆盖不同区域，不只集中 CBD。
- 家长常用查找路径：council / official park finder 查设施，Google Maps 查距离、照片、近期评论和附近咖啡/厕所，亲子媒体和社媒找灵感。
- Google Maps 可以作为发现层和快速查找入口，尤其用于按区域搜索 playground、water play、fenced playground、toilets、shade、nearby cafe。
- Google Maps 不作为主推荐的最终 Reference；进入 8 条主卡前仍需反查 council、official park、venue 或 parklands 页面。
- 亲子媒体线索包括 ellaslist、Time Out、Secret Sydney / Melbourne、Mamma Knows Melbourne、TOT: HOT OR NOT、Busy City Kids、小红书和 Facebook 社群；这些只做候选发现。
- 找不到单个 playground 官网或 council 详情页的地点也可以进入地区地点库，但不要显示 `Official` 按钮；只显示 `Map`，并在后续核验到官方详情页后再补 Official。
- 重点推荐卡片优先保留有官方详情页的地点；地区库可以容纳更多只有地图定位和清楚名称的地点。
- 水玩区、维修、开放时间、预约状态可能变化，正文必须提醒以官网为准。
- 半日组合可以加入 nearby cafe、library、museum、walk、bike loop、beach、garden，但不能编造具体营业信息。
- Playgrounds 不需要每周大改；建议每月或每季度检查一次链接和设施信息。若官方显示关闭、维修或永久变更，立即更新或移除。

## 11. 自动更新与校验

- Workflow 使用 UTC 多时间槽覆盖 AEST / AEDT，再由脚本 gate 判断本地小时。
- 每周任务必须从 sources 重新检索网页内容，不能把旧 `kids/data/*.json` 或旧 HTML 卡片当作本周事实来源。
- 自动任务必须重新筛选 Sydney 和 Melbourne 活动，删除已结束活动，新增最新活动，并按“新活动前排、持续活动后排”排序。
- 自动任务必须重新生成结构化数据：`kids/data/events.json` 和 `kids/data/melbourne-events.json`。
- 自动任务必须同步 HTML fallback：更新 `kids/index.html` 内的活动卡片和 `data-period-start` / `data-period-end`。公开页面不能只依赖运行时 JSON。
- 自动任务必须同步 `More` 区链接；More 链接应来自本周重新检索后的候选活动或大型官方入口，不能保留上周失效链接。
- 自动任务必须生成或刷新 `kids/CANDIDATE_POOL.md`，记录每个城市至少前 20 条候选、来源、URL 和分数。
- 自动任务必须 UTF-8 读写，防止中文乱码破坏 JSON。
- 生成后校验 JSON 可解析。
- 校验英文页面无中文泄漏。
- 校验每个城市仍为 8 条主推荐，`More` 区保持 3-5 条链接。
- 校验卡片官网链接和 `More` 链接；Sources 大列表可作为参考来源，不作为每周卡片链接校验范围。
- 校验活动文本没有明显 `expired / ended / closed / cancelled / 已结束 / 取消` 等过期或取消信号。
- 写入 Friday-to-Friday 周期。
- 记录 OpenAI API token 到 `TOKEN_USAGE.md`。
- 确认写入、提交、推送都成功，不能静默失败。

更新流水线固定为：

```text
gate 0:00 / 1:00
→ fetch official sources and discovery sources
→ widen search with suburb / council / venue / event-name queries from social tips
→ extract candidates
→ verify B/C/D tips against official council, venue, organiser or ticketing pages
→ filter expired or unclear activities
→ rank new / short-date activities first, ongoing activities later
→ generate bilingual event data
→ write JSON data
→ sync HTML fallback cards and period metadata
→ sync More links from current candidates
→ write candidate pool report
→ validate UTF-8, JSON, English-only fields, card counts, visible links, expired signals and Friday-to-Friday dates
→ update TOKEN_USAGE.md
→ commit and push
→ confirm origin/main
```

## 12. Token、分享和访问

- 页面访问、朋友打开分享链接、点击官网、点击地图，不消耗 OpenAI token。
- 只有自动更新脚本调用 OpenAI API 时才消耗 API token。
- `TOKEN_USAGE.md` 只记录自动更新 API token，不记录 Codex/ChatGPT 对话 token。
- 顶部浏览量目前是本地浏览器计数，不是全站真实访问统计。
- 分享链接应包含城市、语言和活动锚点，例如 `?city=sydney&lang=zh&event=sydney-01`。
- Playgrounds 分享链接也应包含 view，例如 `?city=sydney&lang=zh&view=playgrounds&event=...`。

## 13. 本地与部署

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

## 14. 调用 Codex 的推荐提示词

```text
请按 KIDS_PAGE_GUIDE.md 维护“今天带娃去哪儿？”页面。保持手机优先、马卡龙手帐风、Sydney/Melbourne 城市切换、中英双语、8 条主推荐、More 折叠链接、官网/导航/分享按钮顺序。每周五凌晨 0:00 更新新一周全部内容：必须重新检索 sources、重新筛选，删除过期活动，新增最新活动，新活动放前排，仍在持续的活动往后放；不能复用上周静态 DATA 当作本周内容。搜索范围要宽：official council/venue pages、Eventbrite/Humanitix/AllEvents/Secret/Time Out/亲子媒体、Instagram/Facebook/小红书/社群线索都可用于发现，但社媒线索必须反查官方 council、venue、organiser 或 ticketing 页面后才能入选。更新后同步 JSON data 和 HTML fallback，再校验 UTF-8、英文无中文泄漏、Friday-to-Friday 日期和远程推送。英文页面必须全英文。先保存本地，不要推送 GitHub，除非我明确要求部署。
```
