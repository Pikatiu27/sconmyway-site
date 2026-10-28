# Kids Page Guide

## 每周两次更新（2026-10-30 起生效，优先于旧周五单次说明）

- Australia/Sydney 本地时间周二、周五 05:00 主更新，07:00 仅失败补偿；沿用本对话的 kids-weekly-refresh，不创建新对话。夏令时随悉尼时区，非固定 UTC。
- 周五：全网重新检索两城，完整替换新一期，前四条优先新发现、单日、短期或明确日期活动。删除过期、取消、已售罄条目；不足则记录短缺，不填弱内容。
- 周二：同一期再次检索并逐条核实，清理周末已结束/取消/售罄，补入本周剩余日期的新活动，新发现靠前。不虚构新日期，也不硬凑四条新活动。
- 发布范围仍为周五到下周五。updatedAt 固定该期周五，lastReviewedAt 记录真实最近检索日，refreshKind 为 weekly / midweek；周二不滚动 periodStart/periodEnd。两城和 event-presentation.json 的 lastReviewedAt 必须一致。
- 周二需重新核实所有保留的主卡和本周 More 链接，linkReview.checkedAt/evidence 对应真实检索，不只改 metadata；展示字段、日期场次和保留路线一并重检，移除过时 key。新一期不得使用旧展示事实。
- 小字日期显示最近核实日期，周范围独立不随点击改变。现有清爽手账、收藏、无箭头卡片、单弹层历史列表与路线/时间详情全部不变。
- 07:00 仅在当天 05:00 未完成、数据不一致或核实证据不足时恢复相应任务。周二不能因为周五周期正确就 no-op；须证明当天已经重新查过两城（可以是有证据的无变化复核）。
- kids/refresh-policy.json 与 scripts/kids-refresh-calendar.mjs 定义校验策略；从2026-10-30起 validate 要求最近一次到期的周二/周五检查已完成，逐项 review 支持日期。08:30 GitHub watchdog 同时覆盖两天，只校验不生成内容。
- 本次规则更新不重写活动数据、不伪造最近核实日期；下一次主更新为2026-10-30周五05:00，第一次周二复核为2026-11-03 05:00。

## 2026-10-29 正式设计与周更约定（优先于旧版设计说明）

- 手机优先的清爽亲子手账：冷白 `#FAFCFC`、白卡、浅草莓粉 `#F9B4CC`、浅汽水蓝 `#DDF3F4`、标题 `#29384A`、正文 `#526070`。页眉仅一个小彩虹，不放活动照片、相册或大贴纸。
- 顶部顺序不变，收藏和语言同排，不能因语言控件隐藏一半而保留空列。卡片仍是日期签、标题/区域、图标时间地点费用、家庭适配（可选）、简介、注意事项（可选）、路线摘要（可选）、官网/导航/分享、弱来源。
- 卡片内不再使用箭头原位展开。完整时刻表和“看路线”打开原生底部弹层，不改变卡片高度；闭馆、预约、来源冲突及必要年龄/陪同条件必须直接显示。底部 More/Sources 保持独立折叠。
- “本周已结束 · N 条 / Finished this week · N”是弱文字入口加“查看 / View”，不是箭头。打开列表仅显示名称、日期、区域；同一弹层切换活动详情、路线或完整时间，不能层层叠加弹窗。详情明确标记已结束；返回/关闭可达，历史分享与收藏链接直接打开对应活动。
- 收藏覆盖活动与游乐场，仅保存在访问者当前浏览器的 localStorage，不上传、不跨设备同步。本地预览与线上域名不互通。已结束标注状态，本期未收录的收藏不得生成死链接，允许移除；保存失败不能显示成功。
- 正式样式/交互为 `family-journal.css`、`family-journal.js`，加原有 `field-notes.*`、`event-filters.mjs`、`journal.*` 和 sync helper。不得将 preview 文件直接发布，也不得恢复旧的卡片内展开方式。
- 每周同周期 `event-presentation.json` 可包含 `introZh/En`、`familyFitZh/En`、`noteZh/En`、`timeShortZh/En`、`showFullTime` 和 `copyReview`。简介与注意事项不重复；没有核实年龄/推车条件就不填。完整事实仍保留在 events JSON 中，showFullTime 时原文同步到详情。copyReview 记录真实核实日期、匹配官网和证据，不把排版编辑日期冒充内容检索日期。
- 路线的 `purposes` 可提供与 steps 对齐的简短双语用途（如看展、野餐、散步），必须来自同一批已核实站点事实；steps、地图、note、sources、checkedAt/evidence 都需更新。额外站点按家庭体力选去，不编步行时长、开门时间或未核实设施。
- 新一周必须重新检索并重建展示字段，绝不能复用旧活动的文案、日期、时刻或路线。缺少同周期展示字段时回退完整原文，而不是拼接上周数据。
- 发布前跑 static/publication/filter/两城 validate 检查；sync 两次比较哈希；通过 Playwright 执行 `scripts/check-kids-layout.js` 和 `scripts/check-kids-family.js`，检查两城双语、320–430px/短屏、无箭头卡片、单弹层历史列表、收藏和真实分享目标。设计发布不等于本周重新检索成功。

### 检索补充：覆盖面与可参加性

1. 候选池按“城市 × 区域 × 活动类型 × 可参加状态”记录，而不只搜索 kids events。每城先扩至约20条真实候选再筛选；不足必须记录检查过哪些区域、什么原因剔除，不凑数。
2. 每周扫 council 与其地方旅游/商业街活动站两条线。Sydney 兼顾 Parramatta、Penrith、Inner West、Burwood、Ryde、Northern Beaches、南区/西南；Melbourne 兼顾 city、北/东/西/东南/海湾各区。质量允许时主推荐至少3区、前4条至少2区，不强行配额。
3. 用 festival、show、market、family day、open day、public art、night event、community celebration 等词补查，别只搜 children。大型场馆、商圈、文化社区、消防开放/展示日和 Bunnings 单店活动也可发现候选。
4. 额外核对“家长能否共同参与”，区分亲子活动与儿童独立托管/营地；确认具体分店/场地、当年日期、预约场次、余票/售罄、取消和天气公告。目录与旧年度宣传页不作详情证据。
5. 搜索摘要可过期或混入跨州同名地点。每个主推荐、More 和路线都回到官方详情/官方票务核实；预约已满的不作为现在可参加推荐，未知余量不能写成有票。
6. 主推荐优先大人也值得参与的家庭出游；library/storytime、仅3岁以下和简单 playgroup 只进已核实 More 或省略。主办者跨多个渠道发布同一活动时去重，不占多个名额。
7. 已检查的补充入口：[Penrith Council](https://www.penrithcity.nsw.gov.au/upcoming-events) 还指向 Visit Penrith 的非 Council 活动；[Bunnings](https://www.bunnings.com.au/services/in-store/kids-activities) 需落实到分店预约页；[FRV](https://www.frv.vic.gov.au/community-events) 的开放展示需查实际预约状态。上述是发现入口，不代表本周已有可报名项目。

<!-- MANUAL_REFRESH_RULE_START -->
## Current Refresh Rule

The [Link Publication Policy](LINK_PUBLICATION_POLICY.md) supersedes older fixed-count and all-links-must-pass rules. Run per-item preparation before static sync; publish verified items even when below the target count.

- Default update path is the same-conversation Codex heartbeat at Tuesday/Friday 05:00 Australia/Sydney, with 07:00 failure recovery. Friday rebuilds the edition; Tuesday reviews and supplements the remaining week without rolling its period.
- The recurring tasks mirror the proven Industry Review model. Their canonical prompts and recovery proof are recorded in `kids/KIDS_AUTOMATION_PROMPTS.md`.
- Do not use an API key or automated content generation unless the user explicitly asks to restore that path.
- Each Friday update must fresh-search Sydney and Melbourne activities; never roll old dates forward.
- GitHub Actions performs a final freshness/link audit Tuesday and Friday 08:30. It is a watchdog only and must never generate or roll forward event content.
- Local Codex automation `kids-weekly-refresh` runs Tuesday/Friday 05:00 and 07:00 in this conversation. The old standalone `kids-weekly-retry` stays paused.
- First four cards in each city must be newly found or short-window current-week activities.
- Long-running activities can remain only after fresher current-week options.
- Library storytime, toddler-only, and weak discovery leads belong in More or are skipped.
- Main cards should favour adult-friendly family outings: festivals, shows, markets, light walks, outdoor trails, theatre, food-plus-activity, and major venue programs.
- More links must be real, checked links; no placeholder items.
<!-- MANUAL_REFRESH_RULE_END -->

本文件是 `今天带娃去哪儿？ / Kids Finder` 的唯一维护说明。以后调整页面、扩展城市、筛选活动、修改自动更新逻辑时，优先按本文执行。

## 0. 快速执行大纲

每次维护 kids 页面先按这个短大纲执行，再看后面的细则。

### 0.1 页面显示逻辑（2026-10-26 手机版定稿）

- 默认打开：Sydney / 悉尼 + Events / 本周活动。
- 顶部顺序固定：品牌/语言 → 一行标题 → 发布周期 → 城市下拉与 Events/Playgrounds 同排 → 地区/日期/只看免费 → 卡片。
- 标题固定一行：`今天带娃去哪儿？` / `Where to take the kids today?`
- Events 每个城市目标 8 条主推荐，允许核实后不足；Playgrounds 是地区地点库，不按 8 条限制。
- 活动卡片按钮顺序固定：`官网 / 导航 / 分享`，英文为 `Official / Map / Share`。
- `More` 必须折叠，放 3-5 条本周候选或大型官方入口，不放空链接、过期链接或装饰性链接。
- 正式 Events 采用无照片的紧凑手账，具体结构和无箭头弹层规则以上方2026-10-29约定为准。

### 0.2 内容筛选逻辑

- 每周必须重新检索，不复用上周 JSON、HTML fallback 或旧 DATA 当作事实来源。
- 主卡优先级：family outing > 本周明确日期 > 官方可核验 > 区域覆盖。
- 每个城市前 4 条必须是本周新检索到、单日、短期或明确日期活动。
- 持续展览、长期开放项目、场馆入口和泛 `What's On` 页面只能放第 5 条以后或 More。
- Library、storytime、rhyme time、baby/toddler-only、0-3、playgroup 不进主 8 条，只能进 More。
- 社媒、小红书、Instagram、Facebook、亲子媒体只能作为线索；入选前必须反查 council、venue、organiser 或 ticketing 官方页。
- Sydney / Melbourne 都要按实用区域扩展搜索，不让 CBD / City core 长期占满前排。

### 0.3 自动更新逻辑

- 每周五 Australia/Sydney 本地时间 5:00 执行主更新。
- 每周五 7:00 做补偿检查；如果 5:00 已成功刷新当天内容，7:00 必须 no-op。
- 自动更新流程固定：重新检索 → 候选打 Region → 过滤过期和弱活动 → 排序 → 生成双语 JSON → 同步 HTML fallback → 同步 More → 写候选池和 token 记录 → 校验 → commit → push。
- 如果 AI/API 不可用，且 fallback 不能证明前 4 条是新/短期/明确日期活动，必须失败并保留旧页面，不能发布弱内容。
- GitHub Actions 不生成内容；当前 workflow 在周五 8:30 做最终 freshness/link 审计，也保留手动校验入口。内容更新由 5:00 主 Codex 任务和 7:00 补偿 Codex 任务完成重新检索、写入和 push。

### 0.4 推送上线逻辑

- 用户明确说“推送 / 部署 / 上线”时才从本地 commit + push。
- 推送前必须通过内容 gate、文件 gate 和 `git diff --check`。
- 正常推送目标是 `origin/main`，不 force push。
- 推送后必须分别确认：`content quality gate passed`、`push succeeded`、`Pages refreshed`。
- 如果 push 成功但 GitHub Pages 还没刷新，只能说 `Pages pending`，不能说已上线。

### 0.5 自动更新失败处理

如果周五页面没有更新，先按这个顺序排查：

1. 查 `Kids event page checks` Actions run。
2. 按 `kids/KIDS_BACKUP_PLAN.md` 分成配置失败、来源失败、内容质量失败三类处理。
3. 如果周五更新失败，不能只改日期；必须重新检索、重写 JSON、同步 HTML fallback，再重新 push。
4. 如果 key 存在但某些来源返回 `403/404`，不要降级发布静态旧内容；先替换坏 URL、增加可访问官方来源或 direct event 来源，再 rerun。
5. 不足 8 条时扩展检索和候选池；仍不足则发布已核实条目，不等待凑数。
6. 手动 rerun 成功后必须确认：JSON `updatedAt` 是当天、周期是本周五到下周五、前 4 条是新/短期活动、Pages 已刷新。
7. 如果 08:00 仍无法满足内容 gate，保留旧页面并报告 `Pages not refreshed`；不能只改日期或用旧活动补位。

## 1. 页面定位

- 面向 Sydney / Melbourne 家长，在手机上快速查找本周亲子活动。
- 不是完整活动数据库，而是每周精选 8 条可靠、适合孩子、信息清楚的活动。
- 首页必须 answer-first：打开后马上知道“这周带娃去哪儿”。
- 同一个网页支持 Sydney / Melbourne 城市切换和中文 / English 切换。
- 每个城市主推荐目标 8 条（核实不足时可减少）活动，底部 `More` 折叠区只放额外 3-5 条链接。
- `More` 不是装饰区；每周也必须更新，链接必须可打开，并来自本周检索候选或可靠官方入口。
- 分享链接应定位到具体城市、语言和被分享的活动卡片。
- 页面可以扩展成 `Events / Playgrounds` 双 tab：Events 解决“本周有什么活动”，Playgrounds 解决“今天临时去哪儿放电”。

## 2. 视觉与排版

- 沿用 SConmyway industry 页面的轻量结构感，但 kids 页面更可爱。
- 手机优先：所有字号、按钮、间距先按竖屏手机判断。
- 手机竖屏为主要使用场景，不以缩小桌面版代替手机设计。纸灰绿背景、白卡片、小日期签和轻微主按钮底色，不叠加重复活动标签或推荐贴纸。
- Sticker 不能遮挡城市切换、语言切换、标题或按钮。
- Sydney / Melbourne 使用明显的原生下拉框，手机字号 16px、宽度至少 120px，两个英文名称必须一行完整显示；旁边为 Events/Playgrounds 双按钮。
- 顶部保持简洁，不放解释性长文。
- 顶部浏览量必须弱于品牌副标题。
- 主标题固定：中文 `今天带娃去哪儿？`；英文 `Where to take the kids today?`
- `More` 区可以分成 `本周候选 / More this week` 和 `备用入口 / Backup sources` 两组，仍保持折叠。
- 如果运行时数据加载失败，页面必须显示 HTML fallback，并用很轻的提示提醒用户出发前确认官网。
- Playgrounds tab 使用同一套马卡龙手帐视觉，但信息密度可以更偏地点库：区域筛选、设施标签和正文里的半日建议必须比长正文更突出。
- Playgrounds 延续文字手账和地图/路线感，但不加胶带、stamp 或悬浮 sticker；当前版本不放图片，优先保证文字信息清楚。
- 城市下拉浅汽水蓝，当前类型浅草莓粉；Playgrounds 保持白卡与少量功能标签，不以 half-day 决定颜色。
- 来源主按钮浅粉，`导航 / Map` 和 `分享 / Share` 保持白底。

### 2.1 Figma 视觉调整大纲

当前 kids 页面按“亲子旅行手账 + 信息工具”处理，不做厚重 landing hero。

字体：

- 中文优先 `Noto Sans SC / PingFang SC / Microsoft YaHei`，英文优先 `Nunito Sans / Segoe UI`。使用本地托管、按 Unicode 范围加载的完整字体资源；不能发布仅覆盖某一周文案的试用字体子集。
- 不使用过重的 900 字重。主标题、卡片标题、按钮以 700-780 为主；正文保持 400-500。
- 中英文同一层级使用相近视觉重量，不让英文页面显得像未整理的 fallback。

层级：

- H1 中文控制在手机一行内，约 24-26px；英文约 19-22px；桌面也不超过 34px。
- 品牌标题约 15-16px，副标题和浏览量 10-11px，弱于城市和内容切换。
- 城市切换是一级操作，手机 16px；Events / Playgrounds 是同组二级操作，约 12-13px。
- 活动卡标题约 18-20px；手机正文 15px、行高 1.7；事实栏 13px；来源约 10-11px。主要操作按钮高度 46px，保持三列一行。
- 日期签只显示核实后的日期范围，持续项目写 `持续展出 / On now`；缺少日期签数据时回退为 `本周活动 / This week` 或 `持续活动 / Ongoing`，不猜日期、不加星级和重复精选标签。

背景和颜色：

- 页面底色 `#FAFCFC`，不放顶部网格、渐变光晕、装饰色团或大面积彩色背景。
- 主文字 `#29384A`，正文 `#526070`；完整色彩约定见本文首节。
- 日期签色盘：mint `#d9ede1`、coral `#f3d7d0`、lemon `#f1e5b2`、lavender `#e8e1f1`。
- 卡片为白底、1px 边框、8px 圆角，不放彩色侧边条。节庆日期签浅黄，户外薄荷绿，演出珊瑚，展览淡紫。
- 标题是卡片唯一主要视觉中心，不做大 featured 卡片。正式版无活动照片、无相册；本地预览照片及截图不得跟随发布。

页面节奏：

- 第一屏顺序必须稳定：Header → H1 → 发布周期 → 城市/内容切换 → 筛选 → 内容卡片。
- More 是折叠候选入口，视觉上像补充抽屉，不要像第三个主 tab。
- 长期活动暂不独立成顶层 tab；如果数量增加，先在 Events 内部作为 `长期活动 / Ongoing` 区块或第 5 条以后处理。

## 3. 当前页面信息架构

第一屏顺序固定：

1. Header：品牌名、弱浏览量、语言切换。
2. Hero：主标题 `今天带娃去哪儿？` / `Where to take the kids today?`。
3. Week meta：Friday-to-Friday 发布周期和弱化的核实/更新日期。
4. Finder controls：城市下拉 + 内容类型切换同排；当前选择摘要仅供读屏，不重复占一行。
5. Events filters：地区、日期、只看免费；Playgrounds 使用自己的地区和设施筛选。
6. Content：根据当前城市和内容类型显示 Events 或 Playgrounds。

顶部层级规则：

- Header 不放城市切换；城市切换只放在 Finder controls。
- 内容类型切换只放在 Finder controls，不再放到日期下面或内容列表上方。
- Finder controls 必须同时回答两个问题：`我在哪个城市？`、`我在看活动还是游乐场？`
- 当前城市和内容类型由可见选择控件直接表达；实时摘要保留为读屏文本，避免重复标签。
- 无 URL 分享参数时，页面默认必须是 `Sydney / 悉尼` + `Events / 本周活动`；不要用上一次浏览留下的 localStorage 覆盖默认首页。
- 只有分享链接或深链接参数可以覆盖默认，例如 `?city=melbourne&view=playgrounds`。
- 主标题必须一行显示，中文不要断成两行；字号服务于定位，不做夸张 hero。
- 左上品牌固定 `SConmyway kids`，副标题 `亲子城市指南 / A family city guide`；不要写 `本周 8 条`，避免切到 Playgrounds 时误导。
- 语言切换可以在 Header 右侧；它是辅助设置，视觉权重低于城市和内容类型。

Finder controls 结构：

```text
发布周期                         小更新日期
[ 悉尼/Sydney v ] [ 本周活动/Events | 游乐场/Playgrounds ]
[ 地区/Area ] [ 日期/Date ] [ ] 只看免费/Free only
```

不要再出现：

- 顶部 header 一个城市切换，标题下面另一个类型切换的分裂结构。
- `按地区找 playground` 这类解释性提示块。
- 地区标题下面的泛泛说明句。
- Playground 小卡图片或假图片；当前版本以文字精准信息为主。

## 4. 更新周期

- 每周五 Sydney/Melbourne 当地时间 5:00 自动全网检索、更新并推送上线。
- 7:00 做补偿检查；如果 5:00 没成功，再重试。
- 页面显示的是发布周期，不随用户点击当天滚动。
- 周期固定为本周五到下一个周五，使用 `periodStart` / `periodEnd`。
- 自动校验必须确认周期是 Friday-to-Friday。
- 每周更新必须重新检索、重新筛选、重新生成内容，不能只复用上周静态 DATA 或只改日期。

## 5. 内容排序规则

每周更新时必须重新筛选整周内容：

1. 删除已经结束的活动。
2. 新增最新活动。
3. 新活动、单日活动、短期活动放在前排。
4. 每个城市前 4 条必须是本周新检索到的新活动、单日活动、短期活动或明确日期活动。
5. 仍在持续的长期展览、长期开放项目、场馆入口和泛 `What's On` 页面只能放在第 5 条以后。
6. 每个城市目标 8 条主推荐，核实不足时减少。
7. `More` 区保留 3-5 条有效链接，不无限增加，不放失效、空白或长期无人维护的入口。
8. 每周保留候选池报告，记录 8 条主推荐之外的候选和来源，方便追溯为什么入选或未入选。

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
Small Date Tab
Title
Region
Time / Location / Price
Summary
Half-day Plan (optional, collapsed)
Official / Map / Share
Reference
```

要求：

- 三个按钮在手机上必须保持一行。
- 按钮顺序固定：`官网 / 导航 / 分享`，英文为 `Official / Map / Share`。
- `Official` 打开官网或可信官方页。
- `Map` 打开 Google Maps 搜索或导航。
- `Share` 复制深链接，朋友打开后定位到该活动。
- 日期签为小矩形：单日大数字 25px、多日范围约 17px，附小月份；持续项目保留核实后的短标签。标题 18-20px、区域 12px、手机正文 15px、事实栏 13px、来源 10-11px。
- 手机时间、地点、费用各占一个完整图标行，不挤成两个窄栏；宽屏可将地点和费用分列。继续使用图标，不加 Time/Place/Cost 文本表头。
- 简介不加“亮点”等前缀，也不重复事实栏。中文不再额外复制一行英文活动名。
- 半日路线只在有核实过的具体站点时出现，卡片上为短摘要和“看路线 / View route”，无展开箭头。
- 路线底部弹层内按“阶段 + 地点/用途”排齐，各地点独立打开地图，原始说明和来源保留。
- 周内已结束活动移入“查看”列表，同一个弹层切换详情，分享直接打开对应活动，不占主推荐前排。新周仍需删除过期条目。
- `kids/data/event-presentation.json` 用唯一 shareKey 关联日期签、活动类型、精简文案和半日路线，必须与两城活动的 periodStart/periodEnd 一致；不同周的数据不应用，避免旧日期和旧路线残留。
- 周五重检后同步更新该文件，或清除对应活动的旧展示数据。没有合适半日路线时省略，不编造内容；模板、排版和折叠交互由 sync helper 保留。
- 日期筛选读取同一文件每项的 `dates`（本周期确实有场次的 ISO 日期数组）和 `dateReview`（checkedAt、官方 URL、具体证据）。每天开放只能在官网明确说明时展开为每日；闭馆日不得纳入，无法核实则不填 dates，筛选时提示确认预约日历。
- 日期元数据必须按每周检索重建，并通过 `node scripts/test-kids-filters.mjs`。禁止在 CSS、JS 或独立静态索引里硬编码某周日期、活动名或路线。
- 无 JavaScript 时仍有完整静态卡片、事实、官网/地图和原生路线展开；分享和按当天折叠属于渐进增强。

### 7.1 手机交互与每周保留项

- `kids/field-notes.css`、`kids/field-notes.js`、`kids/event-filters.mjs` 为正式手机版实现；保留 journal 的周内结束折叠和 sync helper 的静态结构，不恢复旧版布局。
- 手机边距通常 16px，极窄屏 14px，适配安全区；主标题和城市名不换行，操作按钮始终一行。
- 地区、日期、免费筛选按城市分别保存于本次浏览内；切城不串条件，切语言不丢状态，重置和空结果可恢复。
- 手机筛选使用底部面板，选项独立滚动，关闭和应用按钮不被短屏或安全区挡住；Escape 可关闭，焦点可返回触发按钮。
- 每周更新后跑静态、发布和筛选测试，再使用 `scripts/check-kids-layout.js` 在两个城市、两种语言及 320/360/375/390/393/412/430px 检查。首屏、路线展开、分享定位、已结束折叠和无照片均需保留。
- `kids/preview/`、`kids/output/`、截图和试用图片不提交；这次排版发布不改本周活动日期，也不冒充一次新内容检索。

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

Sydney 重点：City of Sydney, City of Parramatta / AtParramatta, Inner West, Waverley, North Sydney, Willoughby, Mosman, Woollahra, Burwood, Ryde, Strathfield, Cumberland, The Hills, Bayside, Northern Beaches, Canterbury-Bankstown, Georges River, Sutherland, Hornsby, Ku-ring-gai, Lane Cove, Liverpool, Blacktown, Fairfield, Penrith, Campbelltown, Camden, Blue Mountains, Hawkesbury 等有官网活动页的主要 council；Sydney Opera House, The Rocks, Darling Harbour, Darling Square / Darling Quarter, ICC Sydney, Sydney Olympic Park, Sydney Showground, Riverside Theatres Parramatta, Casula Powerhouse Arts Centre, The Joan Penrith, Australian Museum, Powerhouse, State Library NSW, Art Gallery NSW, MCA, Maritime Museum, Taronga Zoo, Sydney Zoo, Luna Park, Botanic Gardens, Centennial Parklands, Harry Potter: The Exhibition Sydney, Children’s International Film Festival 等大型场馆或官方活动页。

Library rule: library, libraries, storytime, rhyme time, baby rhyme and book-club activities can be kept as More links, but must not occupy the 8 main cards. Main cards should prioritise council festivals, school-holiday programs, NAIDOC/community events, larger venues, outdoor/active events, exhibitions and short-date official family activities.

Melbourne 重点：City of Melbourne, Yarra, Port Phillip, Stonnington, Boroondara, Bayside, Glen Eira, Darebin, Merri-bek, Moonee Valley, Maribyrnong, Hobsons Bay, Brimbank, Wyndham, Melton, Hume, Whittlesea, Kingston, Banyule, Nillumbik, Whitehorse, Manningham, Maroondah, Knox, Yarra Ranges, Monash, Casey, Cardinia, Greater Dandenong, Frankston, Mornington Peninsula 等有官网活动页的主要 council；Queen Victoria Market, Museums Victoria, ACMI, NGV, State Library Victoria, Arts Centre Melbourne, Fed Square, Royal Botanic Gardens Victoria, Melbourne Museum, Immigration Museum, Melbourne Convention and Exhibition Centre, Melbourne Zoo, Werribee Open Range Zoo, Healesville Sanctuary, Puffing Billy, Abbotsford Convent, CERES, Collingwood Children's Farm, Melbourne Recital Centre 等大型场馆或官方活动页。

### 9.1 区域覆盖地图

官方底图：

- Sydney 底层按 NSW Planning 的 Greater Sydney Districts：Central City、Eastern City、North、South、Western City。页面和候选池不要直接显示太行政化的名字，而是转成家长能快速理解的活动区域。
- Melbourne 底层参考 ABS SA4 / Greater Melbourne 的 functional city areas，以及 Plan Melbourne 的 activity centres。页面和候选池同样使用实用区域名，不用复杂行政边界吓用户。

Sydney 实用区域：

- 市中心 / 海港核心：City of Sydney、The Rocks、Darling Harbour、Darling Square / Darling Quarter、ICC Sydney、Opera House、Australian Museum、Powerhouse、Art Gallery NSW、MCA、Maritime Museum、Botanic Gardens。这里是高频大型展览、演出、节庆、市集和游客型家庭活动区。
- Inner West / East：Inner West、Canada Bay、Burwood、Strathfield、Waverley、Woollahra、Randwick、Centennial Parklands。这里常有社区节、parklands 活动、海边/公园亲子活动。
- North / Beaches：North Sydney、Willoughby、Mosman、Hornsby、Ku-ring-gai、Lane Cove、Ryde、Northern Beaches、Taronga。这里适合找 council family days、户外活动、动物园和海边活动。
- Parramatta / Olympic Park：Parramatta / AtParramatta、Riverside Theatres、Sydney Olympic Park、Sydney Showground、Cumberland、The Hills。这里是西北/中西部最重要的活动枢纽，Parramatta festival、showground、Olympic Park 活动要每周深查。
- South / St George / Shire：Bayside、Canterbury-Bankstown、Georges River、Sutherland。这里常有 council festival、waterfront / park 活动和社区日。
- West / South-west：Blacktown、Fairfield、Liverpool、Casula、Penrith、The Joan、Campbelltown、Camden、Blue Mountains、Hawkesbury。这里不能被 CBD 覆盖掉，尤其 Penrith、Blacktown、Fairfield、Casula、Campbelltown 的大型社区活动和场馆活动。
- Statewide / chain：Bunnings、Fire and Rescue NSW、NSW National Parks、Museums of History NSW 等跨区域来源。只在活动具体、日期清楚、适合家庭时进入主卡。

Melbourne 实用区域：

- City core：City of Melbourne、Queen Victoria Market、Melbourne Museum、NGV、ACMI、State Library Victoria、Arts Centre Melbourne、Fed Square、Immigration Museum、MCEC、Melbourne Recital Centre。这里是大型展览、演出、市集和游客型家庭活动核心。
- Inner north：Yarra、Merri-bek、Darebin、Melbourne Zoo、CERES、Collingwood Children's Farm、Abbotsford Convent。这里适合找 farm、market、community festival、arts/culture family day。
- Inner south / bayside：Port Phillip、Stonnington、Bayside、Glen Eira。这里常有 beach/bayside 活动、council family day、arts centre 和社区节。
- West / north-west：Moonee Valley、Maribyrnong、Hobsons Bay、Brimbank、Wyndham、Melton、Hume、Werribee Open Range Zoo。这里是西区和西北区家庭活动覆盖重点，不能只用 City of Melbourne 代替。
- North / north-east：Whittlesea、Banyule、Nillumbik。重点找 council events、parks、community days、outdoor family programs。
- East / outer east：Boroondara、Whitehorse、Manningham、Maroondah、Knox、Yarra Ranges、Puffing Billy、Healesville Sanctuary。这里是东区、Dandenong/Yarra Ranges 方向的家庭 outing 重点。
- South-east / peninsula：Monash、Kingston、Casey、Cardinia、Greater Dandenong、Frankston、Mornington Peninsula。这里重点找大型 council 活动、waterfront / park events、family shows 和 school holiday programs。
- Statewide / chain：Bunnings、Fire Rescue Victoria、CFA、Zoos Victoria、Open House Melbourne 等。只在活动具体、日期清楚、适合家庭时进入主卡。

区域推荐规则：

- 每周候选池必须先按区域打标，再交给筛选和 AI 归纳。
- 主 8 条不强行平均分配，但如果质量允许，每个城市主 8 条应覆盖至少 3 个实用区域；前 4 条优先活动如果质量允许，应至少覆盖 2 个区域。
- 不要为了凑区域而放弱活动。质量优先级仍然是：本周明确日期 > family outing > 官方可核验 > 区域覆盖。
- CBD / City core 可以有高质量大型活动，但不能长期占满前 4 条。Parramatta/Olympic Park、Penrith/Blacktown/Fairfield/Casula/Campbelltown、Melbourne west/north/east/south-east 等郊区枢纽必须每周深查。
- `CANDIDATE_POOL.md` 必须记录 Region 列，方便回看是否只抓到 city core。

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
- 不要在 HTML 里保留隐藏的 `.playground-cards` 大推荐卡；隐藏内容会干扰分享、筛选和后续维护。当前正式 playground 展示只使用地区小卡目录。
- 如以后恢复“重点推荐”大卡，只能作为地区目录的替代入口或极少量 spotlight，不得和地区目录重复同一个 playground。
- 重点回答：适合谁、有什么设施、在哪个区域、能不能组成半日行程；不要在页面显示内部查找逻辑。

如使用 spotlight 大卡，结构为：

```text
Tag
Playground name
正文短文：项目简介 + 推荐理由合并
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
Feature chips: water / fenced / toddler / big-kids / nature / indoor
Official or council finder / Map
```

筛选与标签：

- 手机端用横向 chip，不做复杂搜索。
- 筛选顺序固定：`All / 全部`、`Water play / 水玩`、`Fenced / 围栏`、`Toddler-friendly / 低龄友好`、`Big kids / 大童放电`、`Nature / 自然大公园`、`Indoor backup / 雨天备用`（如该城市有），再放地区标签。
- Sydney 优先地区：`CBD / Inner City`、`Inner West`、`Eastern Suburbs`、`Lower North Shore`、`Northern Beaches`、`Parramatta / West`、`Northwest / Hills`、`St George / Sutherland`、`Southwest`。
- Melbourne 优先地区：`CBD / Docklands`、`Inner North`、`Inner East`、`Eastern Suburbs`、`Bayside`。
- 筛选 chip 必须允许换行，不能依赖横向滚动条；sticker 不能遮挡 chip。
- 卡片可标注：`water / fenced / toilets / toddler / big-kids / indoor / nature`。`half-day` 不作为标签或筛选条件；半日组合只写在正文的 `半日：` 行。
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
- 自动任务必须重新筛选 Sydney 和 Melbourne 活动，删除已结束活动，新增最新活动，并按“前 4 条必须是新/短期/明确日期活动，持续活动后排”排序。
- 自动任务必须给候选来源打 Region 标签，并优先从多个实用区域构建候选池，避免结果长期集中在 CBD / City core。
- 自动任务必须重新生成结构化数据：`kids/data/events.json` 和 `kids/data/melbourne-events.json`。
- 自动任务必须同步 HTML fallback：更新 `kids/index.html` 内的活动卡片和 `data-period-start` / `data-period-end`。公开页面不能只依赖运行时 JSON。
- 自动任务必须同步 `More` 区链接；More 链接应来自本周重新检索后的候选活动或大型官方入口，不能保留上周失效链接。
- 自动任务必须生成或刷新 `kids/CANDIDATE_POOL.md`，记录每个城市至少前 20 条候选、来源、URL 和分数。
- 自动任务必须 UTF-8 读写，防止中文乱码破坏 JSON。
- 生成后校验 JSON 可解析。
- 校验英文页面无中文泄漏。
- 校验主推荐不超过 8 条、More 不超过 5 条；核实不足只告警。
- 校验每个城市前 4 条都是本周新检索到的新活动、单日活动、短期活动或明确日期活动；长期展览、持续开放项目、场馆入口、泛 `What's On` 页面不能进入前 4。
- 校验卡片官网链接和 `More` 链接；Sources 大列表可作为参考来源，不作为每周卡片链接校验范围。
- 校验活动文本没有明显 `expired / ended / closed / cancelled / 已结束 / 取消` 等过期或取消信号。
- 写入 Friday-to-Friday 周期。
- 记录 API token 到 `TOKEN_USAGE.md`。
- 确认写入、提交、推送都成功，不能静默失败。

更新流水线固定为：

```text
gate 5:00 / 7:00
→ fetch official sources and discovery sources
→ widen search with suburb / council / venue / event-name queries from social tips
→ extract candidates
→ assign practical Region labels and diversify the candidate pool
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
- 顶部浏览量目前是本地浏览器计数，不是全站真实访问统计；页面文案必须写成 `本机浏览 / Local views` 或保持更弱，不要写成全站 `浏览量 / Views`。
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

## 14. 推送逻辑大纲

推送不是单一步骤，要拆成 4 个独立成功条件：

```text
content gate passed
→ commit created or explicit no-op
→ push confirmed on origin/main
→ GitHub Pages public page refreshed
```

### 14.1 允许推送的场景

- 每周五 5:00 自动任务：允许在内容质量 gate 全部通过后自动 commit + push。
- 每周五 7:00 补偿任务：只在 5:00 没有成功刷新当天内容时运行；如果 5:00 已确认成功，必须 no-op。
- 手动 workflow_dispatch：允许作为人工补跑，但仍必须通过同样的内容质量 gate。
- Codex 本地修改：默认只保存本地；只有用户明确说“推送 / 部署 / 上线”时才 commit + push。

### 14.2 推送前必须完成的 gate

内容 gate：

- Sydney 和 Melbourne 都重新检索，不复用旧 JSON 或旧 HTML 当作事实来源。
- 每个城市目标 8 条主卡、More 目标 3-5 条有效链接，不足时按实际数量发布。
- 前 4 条必须是本周新检索到、单日、短期或明确日期活动。
- Library、storytime、rhyme time、baby/toddler-only、0-3、playgroup 只能进 More，不能进主 8 条。
- 候选池必须记录 Region，避免长期集中在 CBD / City core。
- 英文页面字段不能夹中文；中文和英文事实一致。

文件 gate：

- `kids/data/events.json` 和 `kids/data/melbourne-events.json` 可解析、UTF-8 无乱码。
- `kids/index.html` fallback 与 JSON 同步，周期是 Friday-to-Friday。
- `kids/CANDIDATE_POOL.md` 和 `kids/TOKEN_USAGE.md` 已更新。
- 链接校验至少覆盖主卡和 More 的可点击链接。
- `git diff --check` 通过。

### 14.3 不能推送的场景

- 只改了 `updatedAt`、周期日期或页面日期，但活动内容没有实质更新。
- AI enrichment 不可用，且 fallback 不能证明前 4 条是新/短期/明确日期活动。
- 数量不足不阻止发布；删除未核实条目，记录缺口，不凑数。
- 前 4 条包含泛 `What's On` 页面、长期场馆入口、过期活动、图书馆低龄活动或旧日期。
- JSON、HTML fallback、UTF-8、Friday-to-Friday 整体校验失败；单条内容或链接失败先剔除，再校验剩余条目。
- 当前工作树包含 unrelated 改动且无法只 stage kids 相关文件。

### 14.4 Commit 规则

- 只 stage 与 kids 更新直接相关的文件：`kids/index.html`、`kids/data/*.json`、`kids/TOKEN_USAGE.md`、`kids/CANDIDATE_POOL.md`、kids workflow、kids updater、kids guide。
- 如果没有实质内容变化，不强行 commit。报告为 no-op，并说明是“没有通过内容变化门槛”还是“当前线上已经是最新”。
- Commit message 使用清楚的目的，例如 `Update weekly kids activities` 或 `Expand kids regional source coverage`。
- 不把 industry、SC handbook 或其他目录混进 kids commit。

### 14.5 Push 规则

- 正常路径：`git push origin HEAD:main`，最多重试 3 次。
- 如果遇到 non-fast-forward / fetch-first：先 `git fetch origin main`，确认远端变化；只在无冲突且重新校验通过时再推送。
- 不能 force push。
- 推送成功后必须确认本地 `HEAD` 与 `origin/main` 一致。
- 如果 push 成功但 Pages 未刷新，状态只能写 `push succeeded, Pages pending/failed`，不能说“已上线”。

### 14.6 Pages 上线确认

- Pages workflow 由 `main` push 触发，和 weekly update workflow 是两个阶段。
- 推送后需要检查公开页面或公开 JSON 是否反映新 commit。
- 允许 GitHub Pages 有缓存延迟；可等待后重查，但不能把未确认的页面描述成已更新。
- 最终汇报必须拆开三句话：`content quality gate passed`、`push succeeded`、`Pages refreshed`。

### 14.7 失败后的处理

- 5:00 失败：7:00 补偿任务重试。
- 7:00 仍失败：保留旧页面，不发布弱内容；报告失败原因和卡在哪个 gate。
- 内容失败优先修内容，不通过“只改日期”掩盖。
- 推送失败优先查 GitHub 凭据、non-fast-forward、workflow 权限和 Pages 状态。
- 每次失败要补充到 `KIDS_PAGE_GUIDE.md` 的 failure summary，防止下周重复。

## 15. 调用 Codex 的推荐提示词

```text
请按 KIDS_PAGE_GUIDE.md 维护“今天带娃去哪儿？”页面。保持手机优先、马卡龙手帐风、Sydney/Melbourne 城市切换、中英双语、8 条主推荐、More 折叠链接、官网/导航/分享按钮顺序。每周五早上 5:00 更新新一周全部内容：必须重新检索 sources、重新筛选，删除过期活动，新增最新活动；每个城市前 4 条必须是本周新检索到的新活动、单日活动、短期活动或明确日期活动，仍在持续的活动、长期展览、场馆入口和泛 What's On 页面往后放；不能复用上周静态 DATA 当作本周内容。搜索范围要宽：official council/venue pages、Eventbrite/Humanitix/AllEvents/Secret/Time Out/亲子媒体、Instagram/Facebook/小红书/社群线索都可用于发现，但社媒线索必须反查官方 council、venue、organiser 或 ticketing 页面后才能入选。更新后同步 JSON data 和 HTML fallback，再校验 UTF-8、英文无中文泄漏、Friday-to-Friday 日期和远程推送。英文页面必须全英文。先保存本地，不要推送 GitHub，除非我明确要求部署。
```

## 16. Weekly Update Failure Guardrails

- Date refresh alone is not a valid update. The weekly job must remove expired activities and publish a materially rechecked current-week list.
- For each city, cards 1-4 must be newly found, one-off, short-date, or concrete-date current-week activities. Long-running exhibitions, venue entrances, recurring backups, and generic `What's On` pages can only appear from card 5 onward.
- Reject generic category pages such as `Free`, `Program`, `Family and kids`, `Kindergarten`, `Playgroups`, `Support for parents`, or `Child and Family Hub`.
- Reject stale years earlier than the publication week year, known old-event titles, and mismatched old dates such as a June-only event in a July publication week.
- Reject scraper noise including JavaScript challenge text, outdated-browser text, historic snippets, and unrelated council page fragments.
- If fewer than 8 valid events remain for a city, the updater must fail and leave the site unchanged rather than publish filler.

### 16.1 2026-07-10 refresh reset

What failed:

- The old automation path was reset: future kids refreshes use manual web search, local JSON/HTML sync, GitHub push and public verification.
- The first published result looked like a date rollover because it updated `updatedAt`, `periodStart`, `periodEnd`, JSON files and HTML fallback, while several visible activities still behaved like stale or low-quality picks.
- The run used fallback mode instead of a strong AI-assisted review path, so it relied on simple candidate scraping and scoring.
- The validation checked structure and dates, but did not prove that the first 4 cards were materially new, higher-quality, or different from the previous week.
- Library/storytime/craft items had clear titles and dates, so the simple scoring overvalued them and allowed them to crowd out larger family-friendly council festivals.
- Parramatta Midwinter Festival was discoverable from AtParramatta, but the workflow did not force a second-pass check of featured/current-week events from major sources.

Root causes:

- `updatedAt` freshness was treated as too important compared with content freshness.
- The updater could still publish fallback-generated content when the candidate quality was weak.
- The search source list existed, but priority sources were not deep-checked.
- The release gate did not compare the new first 4 cards against the previous first 4 cards.
- The release gate did not enforce enough event-type hierarchy: large council festivals and short-date family events should beat library/storytime backups.
- Push success and content success were conflated. `git push` succeeding is not enough; the live page must show genuinely refreshed content.

### 16.2 How to make the next update succeed

The goal is not to guarantee that every external service works. The goal is to guarantee that bad content does not go live.

Required next-run behaviour:

1. Save a pre-update snapshot of each city's current 8 `title + url` pairs.
2. Re-fetch and re-screen official sources; do not use the previous JSON or HTML fallback as an activity source.
3. Deep-check major Sydney sources every run: City of Sydney, City of Parramatta / AtParramatta, The Rocks, Darling Harbour, Darling Square / Darling Quarter, Penrith City Council, Inner West, Blacktown, Strathfield and other major councils or venues.
4. Deep-check major Melbourne council and venue sources the same way, not only generic `What's On` pages.
5. For B/C/D discovery sources such as Eventbrite, Humanitix, AllEvents, Time Out, Secret, Instagram, Facebook and Xiaohongshu, use them only to discover leads; every selected card still needs an official council, venue, organiser or ticketing page.
6. Main cards must prioritise council festivals, NAIDOC/community days, school-holiday programs, short-date venue programs, outdoor/active events and major exhibitions.
7. Library, libraries, storytime, rhyme time, baby rhyme and book-club activities must be moved to `More`, not the 8 main cards.
8. Cards 1-4 for each city must be concrete-date, short-date, one-off, newly starting, or newly found current-week activities.
9. Ongoing exhibitions, venue landing pages, recurring backup sessions and generic `What's On` links must be card 5 or later, or `More`.
10. `More` must also refresh and contain 3-5 usable links from the current candidate pool or major official entry points.

Hard fail conditions:

- If fewer than 8 valid main cards remain for a city, fail the workflow and leave the previous site unchanged.
- If fewer than 3 valid `More` links remain for a city, fail the workflow.
- If cards 1-4 are mostly unchanged from the previous snapshot, fail the workflow unless there is written evidence that the same activities are still the best current-week picks.
- If cards 1-4 contain a generic source page, long-running venue entrance, library/storytime item, or old-date item, fail the workflow.
- If the update changes only `updatedAt`, `periodStart`, `periodEnd`, or visible date text without materially changing content, fail the workflow.
- If AI enrichment is unavailable and fallback cannot prove first-4 freshness, fail instead of publishing fallback filler.
- If UTF-8 validation, JSON parsing, English-only field checks, link checks or HTML fallback sync fail, do not commit.
- If GitHub Pages or `origin/main` confirmation fails after push, report the failure explicitly and do not describe the update as live.

Post-push verification:

- Confirm local `HEAD` equals `origin/main`.
- Confirm the public GitHub Pages page or public JSON reflects the new commit after allowing for deployment/cache delay.
- Compare the visible page against the candidate pool: the first 4 visible cards must match the intended current-week lead picks.
- Report separately: `push succeeded`, `Pages refreshed`, and `content quality gate passed`. Do not collapse these into one success statement.

## 17. Family outing and tag display rule

The main event cards are for family outings, not child-only activities. Prefer festivals, shows, family days, open days, performances, outdoor events, major venue programs and exhibitions that adults can also enjoy with children.

Move these to `More`, not the 8 main cards:

- Storytime, rhyme time, baby rhyme and book-club sessions.
- Toddler-only, 0-3-only and playgroup activities.
- Small library craft sessions unless they are part of a larger festival or official family day.

Public cards should stay visually light:

```text
Source / area tag
One status tag only: 本周精选 / Weekly pick or 持续活动 / Ongoing, based on event duration, never card position
Short Chinese title, with the official English name in smaller text; English mode shows the official name only
Merged summary
Time / place / cost
Official / Map / Share
Reference
```

Do not show star ratings, numeric ratings, separate recommendation-reason blocks or multiple sticker tags on event cards. If a detail matters, put it into the merged summary or facts instead of adding another tag.

The event merged summary should be one compact paragraph, not two repeated blocks. Write the body sentence directly; do not prefix it with visible labels such as `亮点：`, `推荐理由：`, `Why go:` or `Why:`. It must combine:

```text
What it is + what families can do there + why it is worth adults and kids going together
```

Good Chinese tone:

```text
Parramatta Square 这场冬季夜游把火盆、沉浸电影、小吃和现场娱乐集中在一起，傍晚去更有节日感，适合全家轻松逛一圈。
```

Good English tone:

```text
Parramatta Square turns into a winter night-out with firepits, immersive cinema, food and entertainment, making it an easy family outing rather than a kid-only session.
```

Playground directory cards should show no more than two small feature chips. Keep the detailed fit in the intro and half-day text instead of adding more visible labels.
