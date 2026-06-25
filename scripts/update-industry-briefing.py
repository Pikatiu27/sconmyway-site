from __future__ import annotations

import json
import shutil
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


REPO = Path(__file__).resolve().parents[1]
ROOT = REPO.parent.parent if REPO.parent.name == "outputs" else REPO.parent
LIVE_DIR = REPO / "industry"
LIVE_HTML = LIVE_DIR / "index.html"
LIVE_JSON = LIVE_DIR / "daily-data.json"
LEGACY_OUTPUTS = ROOT / "outputs"
MIRROR_DIR = LEGACY_OUTPUTS / "industry"
MIRROR_HTML = MIRROR_DIR / "index.html"
MIRROR_JSON = MIRROR_DIR / "daily-data.json"
ROOT_HTML = LEGACY_OUTPUTS / "index.html"
ROOT_JSON = LEGACY_OUTPUTS / "daily-data.json"
MIRROR_TARGETS = (
    (LIVE_HTML, MIRROR_HTML),
    (LIVE_JSON, MIRROR_JSON),
    (LIVE_HTML, ROOT_HTML),
    (LIVE_JSON, ROOT_JSON),
) if LEGACY_OUTPUTS.exists() else ()

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
                "zh": "FERC催促电网运营商加快大型数据中心接入，算力选址进一步变成电力审批竞速",
                "en": "FERC pushes grid operators to speed large data-center interconnection, turning AI siting even more into a power-approval race",
            },
            "summary": {
                "zh": "美国联邦能源监管委员会在2026年6月18日要求六家区域电网运营商在30至60天内提交大型负荷接入改进方案，以回应AI数据中心快速增长的并网压力。对行业更关键的信号是，下一阶段算力扩张不只比芯片和资本，还比谁能更快锁定电网容量、承担升级成本，并证明负荷可以在高峰时段被调度管理。",
                "en": "On June 18, 2026, the US Federal Energy Regulatory Commission told six regional grid operators to submit large-load interconnection improvements within 30 to 60 days in response to fast-rising AI data-center demand. The stronger industry signal is that the next phase of compute expansion will be judged not only by chips and capital, but by who can secure grid capacity faster, absorb upgrade costs, and prove that load can be managed during peak system stress.",
            },
            "watch": {
                "zh": "接下来要看各区域如何细化可中断负荷、自备电源和升级费用分摊规则，因为这些细节会直接改变项目选址、融资顺序和园区开发节奏。",
                "en": "Watch how each region defines interruptible load, behind-the-meter supply, and upgrade-cost allocation, because those details will directly reshape siting, financing order, and campus build-out timing.",
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
                "zh": "数字欧元进入新一轮立法推进，欧洲继续把支付主权当作公共基础设施建设",
                "en": "The digital euro enters a new legislative push, with Europe continuing to frame payments sovereignty as public infrastructure",
            },
            "summary": {
                "zh": "围绕2026年6月23日欧洲议会讨论的数字欧元方案，焦点已经从概念争论转向线上线下一体化、隐私边界、商户成本，以及欧洲如何降低对Visa和Mastercard等外部支付轨道的依赖。对支付和金融科技行业而言，这意味着竞争正在从产品便利性延伸到规则制定权、清算韧性和底层基础设施控制。",
                "en": "Around the digital-euro proposal discussed in the European Parliament on June 23, 2026, the debate has moved beyond concept into online-offline integration, privacy boundaries, merchant economics, and how Europe reduces dependence on external payment rails such as Visa and Mastercard. For payments and fintech, that means competition is expanding from product convenience into rule-setting power, settlement resilience, and control of the underlying infrastructure.",
            },
            "watch": {
                "zh": "后续重点是全会时间表、离线支付和隐私承诺是否保留到最终文本，以及中介机构义务会不会继续收紧。",
                "en": "The next checkpoints are the plenary timetable, whether offline capability and privacy commitments survive in the final text, and whether intermediary obligations tighten further.",
            },
            "reference": "Le Monde, How the digital euro works, published 2026-06-23; European Central Bank digital euro project page, accessed 2026-06-26",
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
                "zh": "Micron与Anthropic的合作叠加最新财报，AI内存开始更像长期基础设施合同而不是单次器件采购",
                "en": "Micron's Anthropic deal plus its latest earnings make AI memory look more like long-horizon infrastructure contracting than one-off component buying",
            },
            "summary": {
                "zh": "Micron在2026年6月22日披露与Anthropic的新合作，又在6月25日前后的财报沟通中强调多项长期供货安排，这把HBM、DRAM和SSD进一步绑到前沿模型路线图和数据中心扩容节奏上。行业含义是，内存不再只是被动跟随GPU出货，而是在多年度供货、封装瓶颈和系统效率里提前成为战略资源。",
                "en": "Micron disclosed a new partnership with Anthropic on June 22, 2026 and then used its late-June earnings messaging to underline multiple long-term supply arrangements. That ties HBM, DRAM, and SSD capacity more directly to frontier-model roadmaps and data-center expansion schedules. The industry implication is that memory is no longer a passive follower of GPU shipments, but an early strategic resource inside multiyear supply, packaging constraints, and system-efficiency planning.",
            },
            "watch": {
                "zh": "接下来要看多年度锁量协议是否继续增加，以及内存定价和先进封装约束会不会重新排序AI资本开支优先级。",
                "en": "Watch whether multiyear volume agreements keep spreading and whether memory pricing plus advanced-packaging constraints start to reorder AI capex priorities.",
            },
            "reference": "MarketWatch, Micron's stock momentum builds as the company inks a new Anthropic partnership, published 2026-06-22; Wall Street Journal earnings coverage, published 2026-06-25",
            "referenceLinks": [
                {
                    "label": "MarketWatch: Micron inks a new Anthropic partnership",
                    "url": "https://www.marketwatch.com/story/microns-stock-momentum-builds-as-the-company-inks-a-new-anthropic-partnership-484e3845",
                },
                {
                    "label": "WSJ: Micron shares jump as chip shortage is projected to last beyond 2027",
                    "url": "https://www.wsj.com/business/earnings/micron-revenue-soars-on-continued-memory-demand-d736b34b",
                },
            ],
        },
    ],
    "insights": [
        {
            "area": {
                "zh": "地震可靠性与韧性",
                "en": "Seismic Reliability and Resilience",
            },
            "title": {
                "zh": "下一代PBEE不能只算失效概率，还要把恢复过程直接写进结构状态转移",
                "en": "Next-generation PBEE cannot stop at failure probability; it has to embed recovery directly into structural state transitions",
            },
            "evidence": {
                "zh": "研究类型：2026年预印本；方法：连续时间马尔可夫链、状态转移生成矩阵、时间相关可靠指标与运行时间韧性度量。",
                "en": "Evidence: 2026 preprint using a continuous-time Markov chain, a generator-matrix state model, time-dependent reliability indices, and an operational-time resilience metric.",
            },
            "summary": {
                "zh": "这项工作把地震损伤、修复和再次受震的过程写进同一个状态动力学框架，而不是把韧性只当成事后附加指标。对结构工程实践的启发是，如果设计团队仍只汇报一次性超越概率，却不解释恢复速度、停运时间和重复事件下的状态迁移，就很难真正比较不同体系在全寿命周期内的抗震表现。",
                "en": "This work places seismic damage, repair, and repeated shaking inside one state-dynamics framework instead of treating resilience as a post-processing add-on. For structural practice, the implication is that a team reporting only one-off exceedance probabilities, without recovery speed, downtime, and repeated-event state transitions, is not yet giving a full life-cycle comparison of seismic performance.",
            },
            "caveat": {
                "zh": "目前示例主要基于原型体系和方法论演示，离工程审查级别的项目校准、成本耦合和规范采纳还有距离。",
                "en": "The examples are still prototype-based methodological demonstrations, so project-level calibration, cost coupling, and code adoption remain open steps.",
            },
            "reference": "arXiv:2606.12448, submitted 2026-05-30",
            "referenceLinks": [
                {
                    "label": "arXiv: A generalized framework for performance-based earthquake engineering",
                    "url": "https://arxiv.org/abs/2606.12448",
                }
            ],
        },
        {
            "area": {
                "zh": "桥梁数字孪生",
                "en": "Bridge Digital Twins",
            },
            "title": {
                "zh": "老桥数字孪生开始重用交通摄像头和天气数据，而不是默认必须先布满新传感器",
                "en": "Bridge digital twins are starting to reuse traffic cameras and weather data instead of assuming new sensors must come first",
            },
            "evidence": {
                "zh": "研究类型：2026年预印本；方法：交通视觉识别、LWR交通流模型、天气退化指标与蒙特卡罗不确定性分析。",
                "en": "Evidence: 2026 preprint combining traffic computer vision, an LWR traffic-flow model, weather deterioration indicators, and Monte Carlo uncertainty analysis.",
            },
            "summary": {
                "zh": "该框架把既有桥面摄像头、交通流推断和天气API组装成面向疲劳与养护分类的混合数字孪生，说明预测性维护不一定从昂贵的新硬件开始。对桥梁和资产管理团队而言，真正稀缺的能力不是再加一类传感器，而是把现有运营数据转成可追踪的风险信号，并接入维修优先级与预算流程。",
                "en": "This framework combines existing bridge-deck cameras, traffic-flow inference, and weather APIs into a hybrid digital twin for fatigue and maintenance classification, showing that predictive maintenance does not always need to start with expensive new hardware. For bridge and asset-management teams, the scarce capability is not another sensor family by itself, but turning existing operational data into traceable risk signals that feed maintenance priority and budgeting decisions.",
            },
            "caveat": {
                "zh": "交通代理量与真实结构应力之间仍需现场校准，跨桥型迁移能力也还没有被充分证明。",
                "en": "The mapping from traffic proxies to true structural stress still needs site calibration, and transferability across bridge types is not yet fully demonstrated.",
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
                "zh": "结构健康监测",
                "en": "Structural Health Monitoring",
            },
            "title": {
                "zh": "SHM模型想跨桥梁和跨环境真正可用，关键不只是精度，而是物理一致的域适配",
                "en": "For SHM models to work across bridges and environments, the key is not accuracy alone but physically consistent domain adaptation",
            },
            "evidence": {
                "zh": "研究类型：2025年系统综述；范围：60余项振动监测与迁移学习研究，覆盖统计对齐、对抗学习、物理约束与生成式方法。",
                "en": "Evidence: 2025 systematic review of more than sixty vibration-monitoring and transfer-learning studies, covering statistical alignment, adversarial learning, physics constraints, and generative methods.",
            },
            "summary": {
                "zh": "这篇综述强调，结构健康监测真正难的不是在单一桥梁数据集上做出高分，而是让模型跨几何、材料、环境和时间漂移后仍保留对损伤的敏感性。对土木工程团队而言，未来更有价值的不是“黑箱更准”这类口号，而是能说明哪些物理规律被保留、哪些域差异被校正、哪些结果可以被审计和复核的监测工作流。",
                "en": "This review makes the core difficulty explicit: SHM does not fail because a model cannot score well on one benchmark, but because the damage-sensitive information has to survive changes in geometry, materials, environment, and time drift. For civil teams, the higher-value direction is not a vague promise of better black-box accuracy, but monitoring workflows that explain which physical rules are preserved, which domain gaps are corrected, and which results remain auditable.",
            },
            "caveat": {
                "zh": "综述清楚梳理了技术路线，但离可认证、可审批的现场部署标准仍有明显距离。",
                "en": "The review clarifies the technical trajectory, but certified and approval-ready field deployment standards are still some distance away.",
            },
            "reference": "arXiv:2512.18780, submitted 2025-12-21",
            "referenceLinks": [
                {
                    "label": "arXiv: Domain Adaptation in Structural Health Monitoring of Civil Infrastructure",
                    "url": "https://arxiv.org/abs/2512.18780",
                }
            ],
        },
    ],
    "classroom": {
        "title": {
            "zh": "目标可靠指标：为什么中外设计体系都把 β 当成校准语言，而不是“绝不会失效”的承诺？",
            "en": "Target reliability index: why do both Chinese and international systems treat β as a calibration language rather than a promise of zero failure?",
        },
        "text": {
            "zh": "中外结构设计体系在表述上差异很大，但在可靠度层面有一个共同逻辑：规范并不是承诺结构“绝不会失效”，而是通过目标可靠指标、分项系数和构造要求，把失效风险控制在与后果等级、使用年限和社会容忍度相匹配的范围内。中国的可靠度设计标准通常把安全等级、设计工作年限和校准目标放在一起讨论；国际体系则更常通过后果等级、参考期和目标可靠指标表达同样的问题。语言不同，但核心问题一致：你的验算到底对应哪个失效模式、哪个参考期，以及什么级别的可接受风险。",
            "en": "Chinese and international structural systems use different wording, but they share the same reliability logic: codes do not promise that a structure will never fail. Instead, they use target reliability indices, partial factors, and detailing rules to keep risk within a range that matches consequence level, design working life, and social tolerance. Chinese reliability standards more often discuss safety level, design working life, and calibration targets together, while international systems more often express the same issue through consequence class, reference period, and target reliability index. The wording differs, but the core question is identical: which failure mode, which reference period, and what level of acceptable risk does the check actually represent?",
        },
        "comparisonPoints": [
            {
                "label": {
                    "zh": "比较对象",
                    "en": "What is being calibrated",
                },
                "text": {
                    "zh": "可靠指标 β 本身不是材料强度，也不是单一荷载系数，而是把抗力、作用效应和不确定性压缩成一个风险刻度。中外规范看起来写法不同，但都在做同一件事：为某类失效模式设定可接受的目标水平。",
                    "en": "The reliability index β is neither a material strength nor a single load factor. It compresses resistance, action effect, and uncertainty into one risk scale. Chinese and international codes may look different on the page, but both are setting an acceptable target level for a defined failure mode.",
                },
            },
            {
                "label": {
                    "zh": "时间尺度",
                    "en": "Time scale matters",
                },
                "text": {
                    "zh": "脱离参考期谈 β 很容易误读。同样的 β 数值，如果对应的是一年、五十年，或一次极端事件，其风险含义完全不同，所以课堂、设计说明和审批沟通都必须把时间边界说清楚。",
                    "en": "Discussing β without the reference period is an easy way to misread risk. The same numerical β has a very different meaning if it refers to one year, fifty years, or a single extreme event, so teaching notes, design statements, and approvals all need the time boundary stated explicitly.",
                },
            },
            {
                "label": {
                    "zh": "审批表达",
                    "en": "Approval wording",
                },
                "text": {
                    "zh": "真正有用的可靠度表达，不是笼统写“满足规范安全度”，而是说明所对应的失效模式、参考期、独立性假定和是否只是筛查级估算。这样中外团队才能把β值与实际工程责任连接起来。",
                    "en": "Useful reliability wording is not a vague statement that a design 'meets code safety'. It should identify the failure mode, reference period, independence assumptions, and whether the check is only a screening estimate. That is how teams connect a β value to real engineering responsibility across systems.",
                },
            },
        ],
        "takeaway": {
            "zh": "做中外可靠度比较时，先讲清楚 β 对应的失效模式和参考期，再讨论谁“更安全”。脱离边界直接比较数字，往往会把校准语言误读成绝对承诺。",
            "en": "In cross-system reliability comparisons, define the failure mode and reference period behind β before arguing which scheme is 'safer'. Comparing bare numbers without those boundaries usually confuses a calibration language with an absolute promise.",
        },
        "example": {
            "title": {
                "zh": "实例：若两种方案分别对应 β = 3.2 与 β = 3.8，它们的年失效概率与 50 年累计失效概率差多少？",
                "en": "Example: if two schemes correspond to β = 3.2 and β = 3.8, how different are their annual and 50-year cumulative failure probabilities?",
            },
            "intro": {
                "zh": "为说明目标可靠指标的量级差异，这里只做一个筛查级示例。假定 β 采用标准正态可靠指标定义，年失效事件相互独立，并仅比较概率量级，不把结果直接当作具体项目的规范校准值。该例用于理解可靠度语言，不替代正式设计或审批。",
                "en": "To illustrate the magnitude behind target reliability levels, this example is kept at screening level only. Assume β follows the standard-normal reliability-index definition, annual failure events are independent, and the calculation is used only to compare probability orders of magnitude rather than to reproduce a project-specific code calibration. The example is for understanding reliability language and does not replace formal design or approval.",
            },
            "equations": [
                {
                    "label": {
                        "zh": "年失效概率关系",
                        "en": "Annual failure-probability relation",
                    },
                    "formula": "Pf = Φ(−β)",
                    "formulaTokens": [
                        {"var": "P"},
                        {"sub": "f"},
                        {"text": " = "},
                        {"var": "Φ"},
                        {"text": "(−"},
                        {"var": "β"},
                        {"text": ")"},
                    ],
                    "citation": {
                        "zh": "文献依据：Melchers, R.E. and Beck, A.T., Structural Reliability Analysis and Prediction, 3rd ed., Wiley, 2018，标准正态可靠指标与失效概率关系。",
                        "en": "Literature basis: Melchers, R.E. and Beck, A.T., Structural Reliability Analysis and Prediction, 3rd ed., Wiley, 2018, standard-normal relation between reliability index and failure probability.",
                    },
                    "result": {
                        "zh": "代入 β = 3.2，可得 P_f = 6.87 × 10^-4 /年；代入 β = 3.8，可得 P_f = 7.23 × 10^-5 /年，前者约为后者的 9.50 倍。",
                        "en": "Substituting β = 3.2 gives P_f = 6.87 × 10^-4 per year; substituting β = 3.8 gives P_f = 7.23 × 10^-5 per year, so the first is about 9.50 times the second.",
                    },
                },
                {
                    "label": {
                        "zh": "n 年生存概率",
                        "en": "n-year survival probability",
                    },
                    "formula": "Ps,n = (1 − Pf)^n",
                    "formulaTokens": [
                        {"var": "P"},
                        {"sub": "s,n"},
                        {"text": " = (1 − "},
                        {"var": "P"},
                        {"sub": "f"},
                        {"text": ")"},
                        {"sup": "n"},
                    ],
                    "citation": {
                        "zh": "推导关系：由独立年度生存事件连乘得到；基于概率论中的伯努利独立事件假定（推导式，非规范原式）。",
                        "en": "Derived relation: obtained by multiplying independent annual survival events; based on the Bernoulli independent-event assumption in probability theory (derived, not a numbered code equation).",
                    },
                    "result": {
                        "zh": "取 n = 50，可得 β = 3.2 方案的 50 年生存概率约为 0.9662，而 β = 3.8 方案约为 0.9964。",
                        "en": "Taking n = 50 gives a 50-year survival probability of about 0.9662 for the β = 3.2 scheme and about 0.9964 for the β = 3.8 scheme.",
                    },
                },
                {
                    "label": {
                        "zh": "50 年累计失效概率",
                        "en": "50-year cumulative failure probability",
                    },
                    "formula": "Pf,50 = 1 − (1 − Pf)^50",
                    "formulaTokens": [
                        {"var": "P"},
                        {"sub": "f,50"},
                        {"text": " = 1 − (1 − "},
                        {"var": "P"},
                        {"sub": "f"},
                        {"text": ")"},
                        {"sup": "50"},
                    ],
                    "citation": {
                        "zh": "推导关系：由累计生存概率取补集得到；建立在独立年度事件假定上（推导式，非规范原式）。",
                        "en": "Derived relation: obtained as the complement of cumulative survival probability; based on the independent annual-event assumption (derived, not a numbered code equation).",
                    },
                    "result": {
                        "zh": "因此 β = 3.2 时，50 年累计失效概率约为 3.38%；β = 3.8 时约为 0.361%。这个简单比较说明，看似只差 0.6 的 β，放到长期风险尺度上会形成接近一个数量级的差别。",
                        "en": "Therefore, the 50-year cumulative failure probability is about 3.38% for β = 3.2 and about 0.361% for β = 3.8. This simple comparison shows that a β difference of only 0.6 can become nearly an order-of-magnitude difference on a long-term risk scale.",
                    },
                },
            ],
            "note": {
                "zh": "这个例子故意把问题简化到标准正态与独立年度事件，用来帮助理解可靠指标的量级，而不是替代真实工程的规范校准。正式设计还要考虑参考期定义、失效模式相关性、荷载统计模型、抗力分布、后果等级和结构重要性。",
                "en": "This example is intentionally simplified to a standard-normal model with independent annual events so the scale of the reliability index is easier to read. It does not replace real code calibration. Formal design still needs the defined reference period, failure-mode correlation, load statistics, resistance distribution, consequence class, and structural importance.",
            },
        },
        "references": "Chinese standards platform, Eurocode basis of structural design resources, and structural reliability textbook references",
        "referenceLinks": [
            {
                "label": "SAMR national standards platform",
                "url": "https://std.samr.gov.cn/",
            },
            {
                "label": "European Commission JRC: EN 1990 Basis of structural design",
                "url": "https://eurocodes.jrc.ec.europa.eu/showpage.php?id=130",
            },
            {
                "label": "Google Books search: Structural Reliability Analysis and Prediction",
                "url": "https://books.google.com/books?q=Structural+Reliability+Analysis+and+Prediction+Melchers+Beck",
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
    bad_markers = ["锟", "脙", "脗", "冒鸥", "忙", "莽", "氓", "鈥�"]
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
        if not equation.get("formulaTokens"):
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
    if '${equation.citation ? `<p class="equation-citation">' not in html_text:
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

    for source, target in MIRROR_TARGETS:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)

    html_after = LIVE_HTML.read_text(encoding="utf-8")
    json_after = json.loads(LIVE_JSON.read_text(encoding="utf-8"))
    validate_data(json_after, html_after)

    for path in (MIRROR_JSON, ROOT_JSON):
        if not path.exists():
            continue
        mirrored = json.loads(path.read_text(encoding="utf-8"))
        if mirrored != DATA:
            raise AssertionError(f"Mirror JSON out of sync: {path}")
    for path in (MIRROR_HTML, ROOT_HTML):
        if not path.exists():
            continue
        mirrored_html = path.read_text(encoding="utf-8")
        start, end = extract_fallback_block(mirrored_html)
        mirrored_fallback = json.loads(mirrored_html[start:end].rstrip(";"))
        if mirrored_fallback != DATA:
            raise AssertionError(f"Mirror HTML fallback out of sync: {path}")

    print(f"Updated industry briefing for {TODAY}")


if __name__ == "__main__":
    main()
