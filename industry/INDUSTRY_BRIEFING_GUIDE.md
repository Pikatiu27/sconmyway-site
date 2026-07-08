# SConmyway 行业日报调用指南

这份文件记录我们已经确定的行业日报网页标准。以后开新 chat 或制作同类网页时，可以直接把这份 Markdown 作为参考资料交给 Codex。

## 1. 核心定位

- 这是一个可以公开分享的个人行业知识库网页。
- 页面应适合手机浏览，别人通过链接打开即可阅读，不需要登录。
- 默认部署在 GitHub Pages。
- 默认每日更新：悉尼时间早上 5 点更新全部内容；如果失败，早上 6 点重试。
- 每次推送上线时，页面必须显示当日日期，日期应来自 `daily-data.json` 的 `date` 字段。
- 默认内容结构固定为：
  - 3 条时事快讯
  - 3 条专业趋势洞察
  - 1 条中外设计课堂

## 2. 视觉风格

整体风格：

- 阳光、清爽、马卡龙配色。
- 保留 `SConmyway` 个人风格元素。
- 水印要淡、小、不抢正文。
- 封面清爽，不要太重、太暗、太商业海报感。
- 适合手机阅读，正文不能太窄。
- 页面顶部或封面附近要清楚显示当日日期，避免读者不确定内容是否为当天更新。

排版原则：

- 第一、第二板块保持统一层级：
  - 分类标签
  - 正文标题
  - 正文概括
  - Reference
- 不要在第一、第二板块继续加很多可见小标题，例如：
  - Evidence
  - Caveat
  - Watch next
  - Why it matters
- 正文要有清晰层级，但不要显得复杂。
- 中文和英文都使用常见网页字体。
- 英文正文可以左右对齐，但不能把一个英文单词拆到两行。
- 所有卡片、按钮、引用链接都要适合手机点击。

## 3. 第一板块：时事快讯

目标：每天筛选 3 条对未来行业趋势有意义的消息，不只是罗列新闻。

优先方向：

- AI 基础设施
- 机器人
- 半导体
- 跨境电商
- 加密货币和数字支付
- 生物医药
- 游戏
- 教育科技
- 能源和数据中心基础设施

筛选标准：

- 优先选择过去 24 到 72 小时内的新消息。
- 优先选择能反映行业结构变化的事件，例如：
  - 监管变化
  - 资本市场动作
  - 供应链变化
  - 重要公司战略
  - 新技术进入真实应用
  - 基础设施约束
- 不要选择纯营销式产品发布，除非它能说明真实趋势。
- 每条都要回答一个问题：这件事对行业意味着什么？

文字处理：

- 每条要有标题。
- 中文概括大约 100 到 150 字。
- 英文概括不需要逐字翻译，但含义必须一致。
- 不要写成新闻播报腔，要写成“行业观察”。
- 正文可以把“发生了什么”和“下一步看什么”合并成一个自然段。

推荐来源：

- Reuters
- AP
- 官方公司公告
- 监管机构
- 央行或交易所
- 主流财经科技媒体
- 可靠行业媒体

## 4. 第二板块：专业趋势洞察

目标：结合结构工程、可靠度、基础设施和未来职业发展，帮助用户形成行业洞察。

优先方向：

- 结构可靠度
- 结构韧性
- Performance-Based Engineering
- Structural Health Monitoring
- Digital Twin
- AI-assisted engineering calculation
- 新材料与低碳材料
- 桥梁和基础设施运维
- 风工程、抗震、火灾、疲劳、耐久性、鲁棒性
- 可审计工程软件
- 数据中心、能源基础设施和土木工程交叉领域

筛选标准：

- 优先使用专业资料，而不是普通新闻。
- 推荐来源：
  - peer-reviewed paper
  - arXiv / university preprint，但要标明是预印本
  - 标准机构
  - 专业协会
  - 政府基础设施部门
  - 大学或研究机构技术报告
- 每条不只是总结论文，而是要说明：
  - 它解决了什么问题
  - 为什么对结构工程师重要
  - 它和未来职业能力有什么关系
  - 它的边界或局限在哪里

文字处理：

- 中文正文目标约 200 到 300 字。
- 英文正文要使用自然、专业、学术化的工程表达。
- 中英文含义必须对应，但不要机械翻译。
- 避免口语化、营销化、夸张化。
- 可以在正文里自然说明局限，不需要单独做很多小标题。

推荐术语：

- limit state
- ultimate limit state
- serviceability limit state
- reliability index
- resistance
- action effect
- fragility
- structural resilience
- performance-based design
- time-dependent reliability
- structural health monitoring
- digital twin
- embodied carbon
- life-cycle assessment

## 5. 第三板块：中外设计课堂

目标：每天讲一个中国与国际设计体系之间的工程概念差异。它不是规范条文翻译，而是解释设计逻辑。

主题轮换硬规则：

- 第三板块每天必须更换概念族，不允许只改标题但继续讲同一类问题。
- 同一概念族至少 7 天内不能重复，例如：
  - 风荷载 / 设计风 / 风压 / 风速压力 属于同一族。
  - 可靠度 / 分项系数 / 抗力折减 / 极限状态校准 属于同一族。
  - 混凝土强度 / 混凝土等级 / 立方体圆柱体强度 属于同一族。
  - 钢材强度 / 屈服强度 / 钢材等级 属于同一族。
- 更新前必须查看最近 7 天 classroom.title，不得选择同族主题。
- 如果最近几天已经连续出现风、可靠度、荷载组合等主题，下一次必须转向其他方向，例如基础、耐久性、防火、施工阶段、裂缝控制、钢连接、疲劳、地震细部、地基承载、混凝土收缩徐变、结构鲁棒性等。

可选主题：

- 钢材强度定义
- 混凝土标号和特征强度
- 可靠度指标
- 荷载组合
- 风荷载定义
- 地震设计思路
- 基础选择
- 裂缝控制
- 使用性能验算
- 耐久性环境类别
- 防火设计
- 鲁棒性和连续倒塌
- 施工阶段效应
- 温度、收缩、徐变和约束

推荐结构：

- 主标题
- 工程对比
- 对比拆解
- 设计提醒
- 参考实例
- 关键结论
- Reference

内容要求：

- 可以比前两个板块更长。
- 先解释物理或力学概念，再解释各国规范语言。
- 要说明中国、澳洲、美国、欧洲等体系为什么看起来不一样。
- 不要只比较一个数字，要比较定义、适用范围、单位、统计基础和安全水准。
- 尽量加入一个具体例子：
  - 简单计算
  - 公式对比
  - 设计检查
  - 规范表达差异

## 6. 公式和规范引用

公式要求：

- 公式要专业，不要出现下划线式写法。
- 下标和上标要通过 `formulaTokens` 渲染。
- 公式要尽量采用规范或教材里的常见格式。
- 如果只是为了说明量级，需要明确写明这是 simplified screen 或 derived relation。

引用要求：

- 如果公式来自规范，要在公式下面直接写规范引用。
- 引用应尽量具体到 clause、chapter、equation。
- 示例：
  - `AS/NZS 1170.2:2021, Eq. 2.4(1)`
  - `ASCE/SEI 7-22, Eq. (26.10-1)`
  - `EN 1991-1-4:2005+A1:2010, Cl. 4.5(1), Eq. (4.10)`
  - `GB 50009-2012, Cl. 8.1.1`
- 如果公式是根据力学或教材推导的，不要假装它是规范原公式。
- 派生公式要写清楚：
  - `Derived relation`
  - `not a numbered code equation`
  - `based on mechanics of materials`
  - `based on Bernoulli dynamic-pressure relation`

## 7. Reference 处理

每一条内容都必须有 Reference。

数据格式：

```json
"reference": "Readable source description",
"referenceLinks": [
  {
    "label": "Readable link label",
    "url": "https://example.com/source"
  }
]
```

规则：

- Reference 必须可点击。
- 优先使用 `https://` 链接。
- 链接名称要可读，不要只放裸 URL。
- 如果某个标准或网站会 403、打不开、需要特殊权限，不要把它作为唯一可点击链接。
- 对于付费规范，可以使用官方标准介绍页、标准机构页面或权威公开说明页，同时在正文里写明具体条文号。
- 不要为了凑 Reference 放不支持正文结论的链接。

## 8. 中英文写作标准

中文：

- 清晰、精炼、专业。
- 少用口号式表达。
- 工程术语要准确。
- 专业洞察部分要像研究简报，不要像社交媒体评论。

英文：

- 使用自然的专业英文。
- 不要逐字翻译中文。
- 保留准确工程含义。
- 注意不同规范体系的术语差异：
  - Eurocode / Australia 常用 `actions`
  - US 语境常用 `loads`
  - 可靠度语境使用 `resistance`、`action effect`、`reliability index`
- 如果中文有边界条件，英文也要有同等边界条件。

最终检查：

- 中英文意思是否一致。
- 单位是否一致。
- 符号是否一致。
- 规范名称是否一致。
- 公式引用是否完整。
- 有没有把中国规范语言直接硬译成不自然英文。

## 9. 文件结构和同步要求

主文件：

- `outputs/sconmyway-site/industry/daily-data.json`
- `outputs/sconmyway-site/industry/index.html`

数据逻辑：

- `daily-data.json` 是运行时数据源。
- `index.html` 里面有一份 embedded fallback。
- 两者必须保持完全同步。

镜像文件：

- `outputs/industry/daily-data.json`
- `outputs/industry/index.html`
- `outputs/daily-data.json`
- `outputs/index.html`

这些镜像在可行时也要同步，避免本地预览或旧入口读到旧内容。

公开页面：

- `https://pikatiu27.github.io/sconmyway-site/industry/`

默认仓库：

- `C:\Users\silin\Documents\Codex\sconmyway-site`

历史工作区镜像：

- `C:\Users\silin\Documents\Codex\2026-06-19\wo\outputs\sconmyway-site`

## 10. 每日更新流程

1. 先检查 git 工作区状态。
2. 每天早上 5 点刷新全部内容：3 条时事快讯、3 条专业趋势洞察和 1 条中外设计课堂都要更新，不只更新日期。
3. 确认今天内容是否已经发布。
4. 如果 `origin/main` 已经是正确版本，不要重复生成。
5. 如果需要更新，必须先联网筛选并重写 `daily-data.json` 的全部内容；不要复用昨天的 `liveUpdates`、`insights` 或 `classroom`。
6. 运行 `scripts/update-industry-briefing.py`，把新的 `daily-data.json` 同步进 `index.html` fallback。
7. 注意：`scripts/update-industry-briefing.py` 只负责同步和校验，不负责生成内容；如果 `daily-data.json` 没有先重写，脚本不会让内容自动变新。
8. 同步镜像文件。
9. 校验：
   - 日期正确
   - 页面可见位置显示当日日期
   - 3 条 live updates
   - 3 条 insights
   - 1 条 classroom
   - 每条都有 clickable HTTPS Reference
   - 公式有 `formulaTokens`
   - 公式引用有中文和英文
   - fallback 与 JSON 完全一致
   - 中文 UTF-8 可读
10. 可以本地预览时，打开本地页面检查手机排版。
11. commit。
12. push 到 GitHub。
13. 验证 `origin/main`。
14. 读取线上 GitHub Pages JSON 或网页，确认已经更新。

## 11. 可复制调用 Prompt

以后可以直接把下面这段给 Codex：

```text
请更新 SConmyway industry briefing 页面。

保留当前风格：手机优先、阳光马卡龙配色、中英文切换、淡 SConmyway 水印、清晰卡片层级、Reference 可点击、index.html 内嵌 fallback。
页面必须在可见位置显示当日日期，日期来自 daily-data.json 的 date 字段。
每天早上 5 点更新全部内容，不只是改日期；3 条时事快讯、3 条专业趋势洞察和 1 条中外设计课堂都要重新筛选、重写和校验。

内容结构：
1. 三条时事快讯：每条有分类、标题、约100字中文概括、对应英文概括、Reference。
2. 三条专业趋势洞察：结合结构工程、可靠度、韧性、基础设施、AI工程工具、新材料和未来职业发展；每条约200到300字中文概括、对应专业英文概括、Reference。
3. 一条中外设计课堂：比较中国和国际设计体系，可以涉及材料、可靠度、荷载、风、地震、基础、混凝土、耐久性、施工阶段等。需要工程对比、设计提醒、参考实例和关键结论。

要求：
- 每条内容都必须有 clickable HTTPS referenceLinks。
- 中英文不能机械翻译，要使用专业、学术化、工程上准确的表达。
- 如果课堂包含公式，使用专业格式和 formulaTokens，不要用下划线；如果公式来自规范，要在公式下方写具体规范、clause/equation；如果是推导式，要标明 derived relation，不要假装是规范原公式。
- 先重写 daily-data.json 的全部内容，再运行 scripts/update-industry-briefing.py 同步 index.html fallback 和镜像文件；该脚本只做同步和校验，不生成日报内容。
- 完成后校验数量、引用、公式、fallback 一致性、UTF-8，并本地预览。
- 如果需要上线，commit、push 到 GitHub，并验证公开链接。
```
