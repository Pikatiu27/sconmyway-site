from __future__ import annotations

import json
import shutil
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


ROOT = Path(r"C:\Users\silin\Documents\Codex\2026-06-19\wo")
REPO = ROOT / "outputs" / "sconmyway-site"
LIVE_DIR = REPO / "industry"
LIVE_HTML = LIVE_DIR / "index.html"
LIVE_JSON = LIVE_DIR / "daily-data.json"
MIRROR_DIR = ROOT / "outputs" / "industry"
MIRROR_HTML = MIRROR_DIR / "index.html"
MIRROR_JSON = MIRROR_DIR / "daily-data.json"
ROOT_HTML = ROOT / "outputs" / "index.html"
ROOT_JSON = ROOT / "outputs" / "daily-data.json"

TODAY = datetime.now(ZoneInfo("Australia/Sydney")).date().isoformat()

DATA = {
    "date": TODAY,
    "edition": {
        "zh": "晨间简报",
        "en": "Morning Brief",
    },
    "liveUpdates": [
        {
            "topic": {
                "zh": "AI基础设施",
                "en": "AI Infrastructure",
            },
            "title": {
                "zh": "FERC要求电网运营商加快AI数据中心接入，算力竞争进一步变成电力审批竞争",
                "en": "FERC orders faster AI data-center interconnection, turning compute competition further into a grid-approval race",
            },
            "summary": {
                "zh": "美国联邦能源监管委员会于2026年6月18日一致要求六大区域电网运营商在30至60天内提交大型负荷接入改进方案，以应对AI数据中心迅速增长的用电需求。对行业更关键的信号是，下一阶段AI扩张不仅比GPU和模型，还比谁能更快锁定并网容量、承担升级成本并证明负荷可以在高峰时段被管理。",
                "en": "On June 18, 2026, the US Federal Energy Regulatory Commission unanimously directed six regional grid operators to submit large-load interconnection improvements within 30 to 60 days to respond to accelerating AI data-centre demand. The more important signal for industry is that the next phase of AI expansion will be judged not only by GPUs and models, but by who can secure grid capacity faster, absorb upgrade costs, and show that load can be managed under peak-system stress.",
            },
            "watch": {
                "zh": "接下来要看各区域电网如何细化自备电源、可中断负荷和升级费用分摊规则，以及这些规则会不会改变站址与融资优先级。",
                "en": "Watch how the regional grids define behind-the-meter generation, interruptible load, and upgrade-cost allocation, and whether those rules start to reshape siting and financing priorities.",
            },
            "reference": "AP, Grid operators are ordered to speed power to energy-hungry AI data centers, published 2026-06-18",
            "referenceLinks": [
                {
                    "label": "AP: Grid operators are ordered to speed power to AI data centers",
                    "url": "https://apnews.com/article/506e3d206871111f15c3c62fc5368be5",
                }
            ],
        },
        {
            "topic": {
                "zh": "数字支付",
                "en": "Digital Payments",
            },
            "title": {
                "zh": "数字欧元进入新一轮立法审议，欧洲继续把支付主权当成公共基础设施建设",
                "en": "The digital euro enters a new legislative phase, with Europe continuing to treat payments sovereignty as public infrastructure",
            },
            "summary": {
                "zh": "围绕2026年6月23日欧洲议会讨论的数字欧元方案，重点已经不再只是概念争论，而是线上线下一体化、隐私边界、商户成本和欧洲对Visa、Mastercard等外部支付轨道的依赖如何被制度化重构。对支付和金融科技行业来说，这意味着竞争正在从产品便利性延伸到规则制定权、韧性和清算基础设施控制。",
                "en": "Around the digital-euro proposal discussed in the European Parliament on June 23, 2026, the issue is no longer merely conceptual. It is now about how online and offline use, privacy boundaries, merchant economics, and Europe’s dependence on external payment rails such as Visa and Mastercard are redesigned through legislation. For payments and fintech, that means competition is expanding from product convenience into rule-setting power, resilience, and control of settlement infrastructure.",
            },
            "watch": {
                "zh": "接下来要看全会审议节奏、最终规则是否收紧中介义务，以及离线支付和隐私承诺会不会被保留到落地阶段。",
                "en": "The next checkpoint is the plenary timetable, whether intermediary obligations tighten in the final text, and whether offline capability plus privacy commitments survive into implementation.",
            },
            "reference": "Le Monde, How the digital euro works: The currency's new form promises cheaper, faster transactions, published 2026-06-23; ECB digital euro project page, accessed 2026-06-25",
            "referenceLinks": [
                {
                    "label": "Le Monde: How the digital euro works",
                    "url": "https://www.lemonde.fr/en/economy/article/2026/06/23/how-the-digital-euro-works-the-currency-s-new-form-promises-cheaper-faster-transactions_6754794_19.html",
                },
                {
                    "label": "ECB: Digital euro",
                    "url": "https://www.ecb.europa.eu/euro/digital_euro/html/index.en.html",
                },
            ],
        },
        {
            "topic": {
                "zh": "半导体",
                "en": "Semiconductors",
            },
            "title": {
                "zh": "Micron与Anthropic的新合作让AI内存从通用器件更像长期基础设施配套",
                "en": "Micron’s new Anthropic deal makes AI memory look less like a commodity and more like long-horizon infrastructure",
            },
            "summary": {
                "zh": "6月22日披露的Micron与Anthropic合作，把HBM、DRAM和SSD直接绑定到前沿模型开发的长期路线图，也让6月24日的Micron财报更像一次AI基础设施定价与供需验证。行业含义是，内存不再只是被动跟随GPU出货，而是在多年度供货、系统效率和成本曲线里成为前置战略资源。",
                "en": "The Micron-Anthropic partnership disclosed on June 22 ties HBM, DRAM, and SSD supply directly to a frontier-model roadmap and turns Micron’s June 24 earnings event into a broader test of AI-infrastructure pricing and supply discipline. The industry implication is that memory is no longer merely a passive add-on to GPU shipments; it is becoming an early strategic resource embedded in multiyear supply, system efficiency, and cost curves.",
            },
            "watch": {
                "zh": "重点看多年度供货协议是否增多，以及内存涨价、封装瓶颈和客户锁量会不会继续重塑AI资本开支排序。",
                "en": "Watch whether multiyear supply deals proliferate and whether memory pricing, packaging bottlenecks, and customer lock-ins keep reshaping AI capex priorities.",
            },
            "reference": "MarketWatch, Micron’s stock momentum builds as the company inks a new Anthropic partnership, published 2026-06-22",
            "referenceLinks": [
                {
                    "label": "MarketWatch: Micron inks a new Anthropic partnership",
                    "url": "https://www.marketwatch.com/story/microns-stock-momentum-builds-as-the-company-inks-a-new-anthropic-partnership-484e3845",
                }
            ],
        },
    ],
    "insights": [
        {
            "area": {
                "zh": "施工火灾安全",
                "en": "Construction Fire Safety",
            },
            "title": {
                "zh": "下一代工地火灾监测的价值不只是识别火焰，而是即时排序谁最暴露、谁先处置",
                "en": "The next value step in site fire monitoring is not flame detection alone, but instant ranking of who is most exposed",
            },
            "evidence": {
                "zh": "研究类型：2026年预印本；方法：双模型YOLOv8、火烟分割、周边目标识别、像素到米换算与风险评分。",
                "en": "Evidence: 2026 preprint using dual-model YOLOv8, fire-smoke segmentation, nearby-object detection, pixel-to-metre conversion, and risk scoring.",
            },
            "summary": {
                "zh": "这篇研究把视觉火灾监测从“有火/没火”推进到“火源距离人员、车辆和设施还有多近”，输出可以直接支持现场优先级调度。对土木和施工管理的启发是，真正有用的数字安全系统不是多装一个摄像头，而是把识别、距离、暴露对象和响应顺序串成可执行流程。",
                "en": "This study pushes vision-based fire monitoring from a binary 'fire or no fire' question into an actionable estimate of how close the hazard is to people, vehicles, and infrastructure. For civil and construction management, the useful digital-safety system is not the extra camera itself, but the workflow that connects detection, distance, exposed assets, and response order into something crews can act on.",
            },
            "caveat": {
                "zh": "方法仍依赖现场标定、遮挡条件和摄像视角，实验室指标高并不等于复杂施工现场已经具备审计级可靠性。",
                "en": "The method still depends on site calibration, occlusion, and camera angle, so strong laboratory metrics do not yet guarantee audit-grade reliability on complex live sites.",
            },
            "reference": "arXiv:2603.09069, submitted 2026-03-10",
            "referenceLinks": [
                {
                    "label": "arXiv: Intelligent Spatial Estimation for Fire Hazards in Engineering Sites",
                    "url": "https://arxiv.org/abs/2603.09069",
                }
            ],
        },
        {
            "area": {
                "zh": "桥梁养护",
                "en": "Bridge Maintenance",
            },
            "title": {
                "zh": "老桥数字孪生开始重用交通相机和天气数据，而不是先假设必须新增大量传感器",
                "en": "Bridge digital twins are beginning to reuse traffic cameras and weather data instead of assuming new sensors come first",
            },
            "evidence": {
                "zh": "研究类型：2026年预印本；方法：交通视觉识别、LWR交通流模型、天气退化指标与蒙特卡洛不确定性分析。",
                "en": "Evidence: 2026 preprint combining traffic vision, an LWR traffic-flow model, weather deterioration indicators, and Monte Carlo uncertainty analysis.",
            },
            "summary": {
                "zh": "这项工作把既有桥面相机、交通流推断和天气API组合成面向疲劳与维护分类的混合数字孪生，说明预测性养护不一定从昂贵的新硬件开始。对桥梁与资产管理实践而言，能把现有视频、环境和运营数据转化为更稳健风险信号的人，会比只会布设单一传感系统的人更接近项目决策层。",
                "en": "This work combines existing bridge-deck cameras, traffic-flow inference, and weather APIs into a hybrid digital twin for fatigue and maintenance classification, showing that predictive maintenance does not always need to start with expensive new hardware. For bridge and asset-management practice, people who can turn existing video, environmental, and operational data into stronger risk signals will sit closer to the decision layer than those focused only on deploying one more sensor family.",
            },
            "caveat": {
                "zh": "交通代理量与真实结构应力之间仍需现场校核，跨桥型迁移能力也还没有被完全证明。",
                "en": "The link from traffic proxies to true structural stress still needs site calibration, and transferability across bridge types is not yet fully demonstrated.",
            },
            "reference": "arXiv:2603.14028, submitted 2026-03-14",
            "referenceLinks": [
                {
                    "label": "arXiv: Traffic and weather driven hybrid digital twin for bridge monitoring",
                    "url": "https://arxiv.org/abs/2603.14028",
                }
            ],
        },
        {
            "area": {
                "zh": "岩土数字校核",
                "en": "Geotechnical Digital Verification",
            },
            "title": {
                "zh": "AI进入岩土计算真正需要的不是聊天能力，而是把公式、单位和适用边界锁成可审计方法卡",
                "en": "What AI really needs in geotechnical calculation is not conversation quality, but auditable method cards for formulas, units, and limits",
            },
            "evidence": {
                "zh": "研究类型：2026年预印本；方法：以JSON方法卡表达公式、单位、适用范围和文献引用，再由受约束符号引擎执行。",
                "en": "Evidence: 2026 preprint representing methods as JSON cards with formulas, units, applicability limits, and literature citations, executed by a constrained symbolic engine.",
            },
            "summary": {
                "zh": "GeoMCP的核心不是让LLM直接充当计算器，而是把岩土解析方法结构化为带适用边界和引用的可验证卡片，再由受约束执行层完成计算。对土木和结构工程的职业含义很明确：未来更可信的AI工作流，不是把责任交给黑箱回答，而是让模型编排已验证方法、暴露假定并保留工程师签字责任。",
                "en": "The core contribution of GeoMCP is not using an LLM as the calculator, but structuring geotechnical analytical methods into verifiable cards with applicability bounds and citations, then executing them through a constrained layer. The professional implication for civil and structural work is clear: trustworthy AI workflows will not hand responsibility to a black-box answer, but will orchestrate verified methods, expose assumptions, and preserve engineer sign-off responsibility.",
            },
            "caveat": {
                "zh": "框架证明了可审计方向，但要覆盖更广方法库、企业流程和审批接口，还需要持续治理和行业接受度。",
                "en": "The framework proves a more auditable direction, but broader method libraries, company workflows, and approval interfaces still require sustained governance and industry adoption.",
            },
            "reference": "arXiv:2603.01022, submitted 2026-03-01",
            "referenceLinks": [
                {
                    "label": "arXiv: GeoMCP",
                    "url": "https://arxiv.org/abs/2603.01022",
                }
            ],
        },
    ],
    "classroom": {
        "title": {
            "zh": "结构耐火暴露：为什么中外审核都会先区分采用哪一条火灾曲线？",
            "en": "Structural fire exposure: why do both Chinese and international reviews start by asking which fire curve applies?",
        },
        "text": {
            "zh": "结构耐火设计最容易被简化成“耐火极限多少分钟”，但真正决定校核起点的往往是火灾暴露曲线本身。无论在中国审图还是国际项目复核里，第一步通常都要先判断项目面对的是标准建筑火、烃类火还是更复杂的性能化火情，因为温升速度会直接改变构件升温、保护层需求和审批边界。中国常见流程更强调按建筑使用功能、防火分区和耐火等级建立合规底线；国际实践则更常把标准火、烃类火、自然火和性能化情景拆开说明。语言不同，但首先要讲清楚的物理问题是一致的：你在按哪一条时间-温度曲线评估结构。",
            "en": "Structural fire design is often reduced to a single fire-resistance rating in minutes, but the real first decision is usually the fire-exposure curve itself. In both Chinese reviews and international project checks, the opening question is commonly whether the structure faces a standard building fire, a hydrocarbon fire, or a more complex performance-based scenario, because the heating rate directly changes member temperature rise, protection demand, and the approval boundary. Chinese workflows more often foreground occupancy, compartmentation, and required fire-rating compliance, while international practice more often separates standard, hydrocarbon, natural, and performance-based fires explicitly. The language differs, but the first physical question is the same: which time-temperature curve is actually being used to assess the structure?",
        },
        "comparisonPoints": [
            {
                "label": {
                    "zh": "标准建筑火",
                    "en": "Standard building fire",
                },
                "text": {
                    "zh": "标准火曲线适合表达办公、住宅和一般民用建筑中用于构件耐火评级的统一加热情景，优点是可比性强、审批语言稳定，但它并不自动代表所有真实火灾过程。",
                    "en": "The standard fire curve is suited to the unified heating scenario used for member fire ratings in offices, housing, and general buildings. Its strength is comparability and stable approval language, but it does not automatically represent every real fire development.",
                },
            },
            {
                "label": {
                    "zh": "烃类与特殊火",
                    "en": "Hydrocarbon and special fires",
                },
                "text": {
                    "zh": "油气、隧道或高燃料负荷场景常需要考虑更陡的升温曲线，因为前期温升更快，保护层厚度、节点细部和关键构件冗余会更快变成控制条件。",
                    "en": "Oil and gas, tunnel, or high-fuel-load scenarios often need steeper heating curves because the early temperature rise is much faster, which makes protection thickness, connection detailing, and reserve capacity of critical members become controlling sooner.",
                },
            },
            {
                "label": {
                    "zh": "审批表达",
                    "en": "Approval language",
                },
                "text": {
                    "zh": "真正能帮助审查通过的，不是笼统写“满足2小时耐火”，而是明确说明采用的火灾曲线、受火边界、构件保护做法、荷载水平和例题是否只作筛查而非正式设计。",
                    "en": "What actually helps approval is not a generic statement that a structure achieves a two-hour rating, but a bounded statement of the fire curve, exposed faces, protection strategy, load level, and whether a worked example is only a screen rather than a formal design.",
                },
            },
        ],
        "takeaway": {
            "zh": "做中外耐火复核时，先把火灾曲线类型、适用场景和受火边界讲清楚，再讨论耐火极限和保护厚度，会比一开始就比较“多少分钟更安全”更有效。",
            "en": "For cross-system fire review, explain the fire-curve type, applicable scenario, and exposure boundary first, then discuss fire-resistance time and protection thickness. That is more useful than starting with a raw comparison of minutes.",
        },
        "example": {
            "title": {
                "zh": "实例：30分钟时，标准建筑火与烃类火的气体温度能差多少？",
                "en": "Example: at 30 minutes, how far apart can standard-building and hydrocarbon fire gas temperatures be?",
            },
            "intro": {
                "zh": "为说明火灾曲线本身的差异，取受火时间 t = 30 min，仅比较理想化气体温度，不进一步推到构件钢温或耐火承载力。假设分别采用Eurocode标准火曲线和烃类火曲线，且不考虑冷却段、保护层传热、通风控制、局部火焰冲刷和构件约束效应。该例仅用于说明筛查逻辑，不替代正式耐火设计。",
                "en": "To isolate the difference in the fire curves themselves, take exposure time t = 30 min and compare idealised gas temperature only, without extending the calculation to steel temperature or fire resistance. Assume the Eurocode standard fire curve and hydrocarbon fire curve are used, and ignore cooling, protection-layer heat transfer, ventilation control, local flame impingement, and restraint effects. This example is a screening illustration only and does not replace formal fire design.",
            },
            "equations": [
                {
                    "label": {
                        "zh": "标准火曲线",
                        "en": "Standard fire curve",
                    },
                    "formula": "θ_g = 20 + 345 log10(8 t + 1)",
                    "formulaTokens": [
                        {"var": "θ"},
                        {"sub": "g"},
                        {"text": " = 20 + 345 log"},
                        {"sub": "10"},
                        {"text": "(8 "},
                        {"var": "t"},
                        {"text": " + 1)"},
                    ],
                    "citation": {
                        "zh": "规范出处：EN 1991-1-2:2002，第3.2.1(1)条，式(3.1)。",
                        "en": "Code reference: EN 1991-1-2:2002, Cl. 3.2.1(1), Eq. (3.1).",
                    },
                    "result": {
                        "zh": "代入 t = 30 min，可得 θ_g = 20 + 345 log10(241) = 841.8 °C。",
                        "en": "Substituting t = 30 min gives θ_g = 20 + 345 log10(241) = 841.8 °C.",
                    },
                },
                {
                    "label": {
                        "zh": "烃类火曲线",
                        "en": "Hydrocarbon fire curve",
                    },
                    "formula": "θ_g = 20 + 1080 [1 - 0.325 e^(-0.167 t) - 0.675 e^(-2.5 t)]",
                    "formulaTokens": [
                        {"var": "θ"},
                        {"sub": "g"},
                        {"text": " = 20 + 1080 [1 - 0.325 "},
                        {"var": "e"},
                        {"sup": "-0.167 t"},
                        {"text": " - 0.675 "},
                        {"var": "e"},
                        {"sup": "-2.5 t"},
                        {"text": "]"},
                    ],
                    "citation": {
                        "zh": "规范出处：EN 1991-1-2:2002，附录A，式(A.1)。",
                        "en": "Code reference: EN 1991-1-2:2002, Annex A, Eq. (A.1).",
                    },
                    "result": {
                        "zh": "代入 t = 30 min，可得 θ_g = 1097.7 °C。也就是说，在同样30分钟内，烃类火曲线已经明显高于标准建筑火。",
                        "en": "Substituting t = 30 min gives θ_g = 1097.7 °C. In the same 30-minute window, the hydrocarbon curve is already much hotter than the standard building fire.",
                    },
                },
                {
                    "label": {
                        "zh": "温度对比量",
                        "en": "Temperature comparison metric",
                    },
                    "formula": "r_θ = θ_HC / θ_ISO",
                    "formulaTokens": [
                        {"var": "r"},
                        {"sub": "θ"},
                        {"text": " = "},
                        {"var": "θ"},
                        {"sub": "HC"},
                        {"text": " / "},
                        {"var": "θ"},
                        {"sub": "ISO"},
                    ],
                    "citation": {
                        "zh": "推导关系：由标准火与烃类火温度结果直接比较得到；依据 EN 1991-1-2:2002 式(3.1) 与附录A式(A.1)（导出式，非规范原编号公式）。",
                        "en": "Derived relation: direct comparison of the standard-fire and hydrocarbon-fire temperatures; based on EN 1991-1-2:2002 Eq. (3.1) and Annex A Eq. (A.1) (derived, not a numbered code equation).",
                    },
                    "result": {
                        "zh": "r_θ = 1097.7 / 841.8 = 1.304，因此30分钟时烃类火温度约高30.4%，温差约255.9 °C。",
                        "en": "r_θ = 1097.7 / 841.8 = 1.304, so at 30 minutes the hydrocarbon fire temperature is about 30.4% higher, with a temperature difference of about 255.9 °C.",
                    },
                },
            ],
            "note": {
                "zh": "这个结果说明，首先选错火灾曲线就可能让后续保护层和耐火判断整体偏离。正式设计仍需继续复核构件升温、截面因子、保护材料性能、荷载水平、约束效应和冷却阶段，而不能把气体温度差直接等同于构件安全裕度。",
                "en": "This result shows that choosing the wrong fire curve at the start can shift the entire later judgment on protection and fire resistance. Formal design still needs member-temperature rise, section factor, protection-material properties, load level, restraint effects, and cooling-phase checks, so the gas-temperature difference must not be treated as the structural safety margin itself.",
            },
        },
        "references": "Chinese standards platform; Eurocode 1 fire actions; public fire-design references",
        "referenceLinks": [
            {
                "label": "SAMR national standards platform",
                "url": "https://std.samr.gov.cn/",
            },
            {
                "label": "European Commission JRC: Eurocode 1 actions on structures",
                "url": "https://eurocodes.jrc.ec.europa.eu/EN-Eurocodes/eurocode-1-actions-structures",
            },
            {
                "label": "European Commission JRC: EN 1991 overview page",
                "url": "https://eurocodes.jrc.ec.europa.eu/showpage.php?id=131",
            },
        ],
    },
}


def extract_fallback_block(html: str) -> tuple[int, int]:
    marker = "const fallback = "
    start = html.index(marker) + len(marker)
    brace_start = html.index("{", start)
    depth = 0
    in_string = False
    escape = False

    for index in range(brace_start, len(html)):
        char = html[index]
        if in_string:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                end = index + 1
                if html[end:end + 1] == ";":
                    end += 1
                return brace_start, end
    raise ValueError("Could not locate end of fallback JSON block")


def render_fallback_json(data: dict) -> str:
    return json.dumps(data, ensure_ascii=False, indent=6)


def replace_fallback(html: str, data: dict) -> str:
    start, end = extract_fallback_block(html)
    return html[:start] + render_fallback_json(data) + html[end:]


def safe_url(url: str) -> bool:
    return url.startswith("https://")


def assert_no_mojibake(text: str, label: str) -> None:
    bad_markers = ["锟", "�", "Ã", "Â", "ðŸ", "æ", "ç", "å"]
    if any(marker in text for marker in bad_markers):
        raise AssertionError(f"{label} appears to contain mojibake")


def validate_data(data: dict, html_text: str) -> None:
    if data["date"] != TODAY:
        raise AssertionError(f"Expected Sydney date {TODAY}, got {data['date']}")
    if len(data.get("liveUpdates", [])) != 3:
        raise AssertionError("Expected exactly 3 live updates")
    if len(data.get("insights", [])) != 3:
        raise AssertionError("Expected exactly 3 insights")
    if not data.get("classroom"):
        raise AssertionError("Classroom section is required")

    for group_name in ("liveUpdates", "insights"):
        for item in data[group_name]:
            links = item.get("referenceLinks", [])
            if not links:
                raise AssertionError(f"{group_name} item is missing referenceLinks")
            for link in links:
                if not safe_url(link.get("url", "")):
                    raise AssertionError(f"Non-HTTPS URL found in {group_name}: {link}")

    classroom = data["classroom"]
    if len(classroom.get("comparisonPoints", [])) != 3:
        raise AssertionError("Expected exactly 3 classroom comparison points")
    if not classroom.get("referenceLinks"):
        raise AssertionError("Classroom referenceLinks are required")
    for link in classroom["referenceLinks"]:
        if not safe_url(link.get("url", "")):
            raise AssertionError(f"Non-HTTPS classroom URL found: {link}")

    equations = classroom.get("example", {}).get("equations", [])
    if len(equations) < 3:
        raise AssertionError("Expected at least 3 classroom equations")
    for equation in equations:
        tokens = equation.get("formulaTokens")
        if not tokens:
            raise AssertionError("Each equation requires formulaTokens")
        citation = equation.get("citation", {})
        if not citation.get("zh") or not citation.get("en"):
            raise AssertionError("Each equation requires bilingual citations")

    fallback_start, fallback_end = extract_fallback_block(html_text)
    fallback_text = html_text[fallback_start:fallback_end].rstrip(";")
    fallback = json.loads(fallback_text)
    if fallback != data:
        raise AssertionError("Embedded fallback does not match JSON data")

    if "@media (max-width: 520px)" not in html_text:
        raise AssertionError("Expected mobile media query is missing")
    if "overflow-wrap: anywhere;" not in html_text:
        raise AssertionError("Expected overflow-safe formula link styling is missing")
    if '[pick(item.summary), pick(item.watch)].filter(Boolean).join(" ")' not in html_text:
        raise AssertionError("Live update renderer no longer integrates watch into one paragraph")
    if '[pick(item.summary), pick(item.caveat)].filter(Boolean).join(" ")' not in html_text:
        raise AssertionError("Insight renderer no longer integrates caveat into one paragraph")
    if "${equation.citation ? `<p class=\"equation-citation\">" not in html_text:
        raise AssertionError("Equation citation renderer is missing")

    assert_no_mojibake(json.dumps(data, ensure_ascii=False), "data")
    assert_no_mojibake(html_text, "HTML")


def main() -> None:
    html_text = LIVE_HTML.read_text(encoding="utf-8")
    new_html = replace_fallback(html_text, DATA)

    LIVE_JSON.write_text(
        json.dumps(DATA, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    LIVE_HTML.write_text(new_html, encoding="utf-8")

    shutil.copyfile(LIVE_HTML, MIRROR_HTML)
    shutil.copyfile(LIVE_JSON, MIRROR_JSON)
    shutil.copyfile(LIVE_HTML, ROOT_HTML)
    shutil.copyfile(LIVE_JSON, ROOT_JSON)

    html_after = LIVE_HTML.read_text(encoding="utf-8")
    json_after = json.loads(LIVE_JSON.read_text(encoding="utf-8"))
    validate_data(json_after, html_after)

    for path in (MIRROR_JSON, ROOT_JSON):
        mirrored = json.loads(path.read_text(encoding="utf-8"))
        if mirrored != DATA:
            raise AssertionError(f"Mirror JSON out of sync: {path}")
    for path in (MIRROR_HTML, ROOT_HTML):
        mirrored_html = path.read_text(encoding="utf-8")
        start, end = extract_fallback_block(mirrored_html)
        mirrored_fallback = json.loads(mirrored_html[start:end].rstrip(";"))
        if mirrored_fallback != DATA:
            raise AssertionError(f"Mirror HTML fallback out of sync: {path}")

    print(f"Updated industry briefing for {TODAY}")


if __name__ == "__main__":
    main()
