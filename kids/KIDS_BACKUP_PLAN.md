# Kids Weekly Refresh Backup Plan

本文件处理周五自动更新失败时的恢复流程。核心原则：宁可保留旧页面，也不发布无法核验、由旧数据拼出来的弱内容。

## 1. 失败分级

### A. 配置失败：`OPENAI_API_KEY` 缺失

现象：

- `Weekly kids event refresh` 在 `Preflight OpenAI secret` 步骤失败。
- 日志显示 `OPENAI_API_KEY is missing` 或 `OPENAI_API_KEY is required`。
- 页面不会更新，JSON 仍保留上一周期。

处理：

1. 在 GitHub repo `Settings > Secrets and variables > Actions > Repository secrets` 新增 `OPENAI_API_KEY`。
2. 手动 rerun `Weekly kids event refresh`。
3. 确认 `kids/data/events.json` 和 `kids/data/melbourne-events.json` 的 `updatedAt` 是当天。
4. 确认页面周期是本周五到下周五。

不能做：

- 不能只改日期推送。
- 不能复用上周 `events.json`。
- 不能把旧 HTML fallback 当成新内容发布。

### B. 来源失败：大量 `403/404`

现象：

- 日志出现多个 `source skipped: ... 403/404`。
- AI key 存在，但候选池太弱，报 `AI enrichment did not produce 8 events`。

处理：

1. 打开 run log，记录失败来源。
2. 优先替换坏 URL，而不是删除区域覆盖。
3. 为 Sydney / Melbourne 各保留足够的大型官方入口：council、major venues、museum/gallery、festival/market、ticketing/organiser pages。
4. 临时加入 direct event 来源时，必须是官方页面，并且只能补本周明确日期活动。
5. rerun workflow。

不能做：

- 不能因为某个 council 403 就让 city core 占满 8 条。
- 不能把 library/storytime/toddler-only 放入主卡补数。
- 不能用社媒截图直接入选；必须反查官方页。

### C. 内容质量失败：前 4 条不够新

现象：

- validate 阶段报 `first four events must be new or short-date current-week lead activity`。
- 或脚本报 `first four cards are not materially refreshed`。

处理：

1. 扩展本周短期活动来源：festival、show、open day、community day、market、museum family day、school holiday venue program。
2. 把长期展览、venue directory、recurring program 放到第 5 条以后或 More。
3. rerun workflow。

## 2. 周五恢复时限

按 Australia/Sydney 时间：

- 05:00 primary refresh 自动跑。
- 06:00 recovery retry 自动检查；如果 05:00 成功，必须 no-op。
- 07:00 如果页面周期仍旧，人工介入。
- 07:15 先判断 A/B/C 哪类失败。
- 07:30 修复配置或来源后手动 rerun。
- 08:00 仍失败时，保留旧页面，并在维护记录中写明 `Pages not refreshed`，不要发布弱内容。

## 3. 手动恢复检查清单

手动 rerun 成功后必须逐项确认：

- `Weekly kids event refresh` conclusion 是 `success`。
- `kids/data/events.json` 是当天 `updatedAt`。
- `kids/data/melbourne-events.json` 是当天 `updatedAt`。
- `periodStart` 是当天周五，`periodEnd` 是下周五。
- 每个城市 8 条主卡。
- 前 4 条是本周新检索、单日、短期或明确日期活动。
- 主卡没有 library/storytime/rhyme-time/book-club/playgroup/toddler-only/0-3-only。
- More 有 3-5 条有效链接。
- GitHub Pages 公开页面刷新。

## 4. 允许的紧急兜底

只有在 AI key 已配置但来源短时不可访问时，可以做紧急兜底：

- 人工检索官方活动页。
- 手写 8 条 `events.json` 内容。
- 同步 HTML fallback。
- 运行 validator。
- 推送。

紧急兜底也必须满足内容 gate；不能只改日期，不能用旧活动补位。

## 5. 记录格式

每次失败恢复后，在维护记录或最终回复中分开写：

- `triggered`: 是否触发自动更新。
- `failure_type`: A / B / C。
- `fix`: 做了什么。
- `content_quality_gate`: passed / failed。
- `push`: pushed / not pushed。
- `pages`: refreshed / pending / not refreshed。
