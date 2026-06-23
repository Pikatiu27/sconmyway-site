from __future__ import annotations

import json
import math
import re
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
                "zh": "FERC要求电网运营商加快AI数据中心并网，算力竞争正式延伸到电力审批",
                "en": "FERC orders faster AI data-center interconnection, pushing compute competition into grid approvals",
            },
            "summary": {
                "zh": "美联储能源监管委员会于2026年6月18日要求六大区域电网运营商加快超大负荷接入改革，直接回应AI数据中心的爆发式用电需求。对行业的真正提示是，下一阶段AI优势不只看芯片和模型，还看谁能更快拿到并网容量、承担升级成本，并证明负荷可以在高压时段被调度。",
                "en": "On June 18, 2026, the US Federal Energy Regulatory Commission directed six regional grid operators to accelerate reforms for very large-load interconnection in direct response to AI data-centre demand. The practical signal is that the next phase of AI advantage depends not only on chips and models, but also on who can secure interconnection capacity faster, absorb upgrade costs, and prove that load can be managed under grid stress.",
            },
            "watch": {
                "zh": "接下来要看各区域电网在30至60天内提交的细化方案，尤其是自备电源、可中断负荷和升级费用分摊如何落地。",
                "en": "The next thing to watch is how each grid translates the order into 30- to 60-day implementation plans, especially around behind-the-meter generation, interruptible load, and upgrade cost allocation.",
            },
            "reference": "AP, Federal regulators order grid operators to speed power to energy-hungry AI data centers, published 2026-06-18",
            "referenceLinks": [
                {
                    "label": "AP: FERC orders faster power access for AI data centers",
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
                "zh": "欧洲议会经济委员会放行数字欧元，支付主权继续被当作公共基础设施推进",
                "en": "A European Parliament committee advances the digital euro, reinforcing payments sovereignty as public infrastructure",
            },
            "summary": {
                "zh": "欧洲议会经济与货币事务委员会于2026年6月23日通过数字欧元规则文本，使项目进入下一轮全会审议。对支付和金融科技行业而言，重点已从概念讨论转向制度落地：线上线下一体化、隐私边界、银行接入方式，以及欧洲如何减少对外部支付平台的依赖。",
                "en": "On June 23, 2026, the European Parliament's Economic and Monetary Affairs Committee approved the digital euro text, moving the project into the next stage of plenary scrutiny. For payments and fintech, the issue has shifted from concept to institutional delivery: online and offline functionality, privacy boundaries, bank access, and how Europe reduces reliance on external payments platforms.",
            },
            "watch": {
                "zh": "接下来要看全会投票节奏、规则细节是否收紧，以及商业银行和支付机构在持有限额与运营补偿上的最终安排。",
                "en": "The next checkpoint is the plenary timetable and whether the final rule tightens limits, intermediary obligations, and the operating-compensation model for banks and payment firms.",
            },
            "reference": "Cinco Días, El euro digital da un paso clave al recibir la luz verde de la comisión de Economía de la Eurocámara, published 2026-06-23",
            "referenceLinks": [
                {
                    "label": "Cinco Días: ECON committee backs the digital euro",
                    "url": "https://cincodias.elpais.com/criptoactivos/2026-06-23/la-comision-de-asuntos-economicos-del-parlamento-europeo-da-luz-verde-al-euro-digital.html",
                }
            ],
        },
        {
            "topic": {
                "zh": "电网与站址",
                "en": "Grid Siting",
            },
            "title": {
                "zh": "德州批准ERCOT大负荷新流程，数据中心并网开始进入“先证明项目真实性”阶段",
                "en": "Texas approves a new ERCOT large-load process, forcing data-center projects to prove they are real before grid access",
            },
            "summary": {
                "zh": "德州公用事业委员会于2026年6月23日批准ERCOT新的大负荷接入流程，用更严格的土地、融资与分批评估要求筛掉投机性排队项目。对基础设施行业的意义在于，站址、负荷管理和输电升级顺序正在被一起审查，未来大型项目很难再把“先拿容量再说”当成默认路径。",
                "en": "On June 23, 2026, the Texas Public Utility Commission approved ERCOT's new large-load interconnection process, using tighter land, financing, and batch-study requirements to screen speculative queue positions. For infrastructure delivery, that means site control, load-management strategy, and transmission-upgrade timing are now being reviewed together, and large projects can no longer assume they can lock in capacity first and solve the rest later.",
            },
            "watch": {
                "zh": "接下来要看批次研究如何改变并网排队顺序，以及可中断负荷、自备电源和网络升级责任怎样影响项目可融资性。",
                "en": "The next issue is how the batch-study model reshapes queue priority and how interruptibility, self-supply, and network-upgrade obligations affect project bankability.",
            },
            "reference": "San Antonio Express-News, Texas approves new ERCOT process to speed grid connections for data centers, published 2026-06-23",
            "referenceLinks": [
                {
                    "label": "Express-News: Texas approves new ERCOT process for large loads",
                    "url": "https://www.expressnews.com/business/article/texas-ercot-data-center-grid-backlog-approval-22311398.php",
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
                "zh": "下一代工地火灾监测不只要“看见火”，还要立刻判断谁最危险",
                "en": "The next step in site fire monitoring is not just seeing flame, but ranking who is most exposed",
            },
            "evidence": {
                "zh": "研究类型：2026年预印本；方法：双模型YOLOv8、火烟分割、周边目标识别、像素到米的距离换算与风险评分。",
                "en": "Evidence: 2026 preprint using dual-model YOLOv8, fire-smoke segmentation, nearby-object detection, pixel-to-metre conversion, and risk scoring.",
            },
            "summary": {
                "zh": "这篇2026预印本把传统视觉告警推进到“火源离人员、车辆和设施还有多近”这一层，输出的不只是有火没火，而是可直接排序的风险等级。对土木与施工管理而言，真正有价值的数字安全系统不是多装一个摄像头，而是把识别、距离、暴露对象和处置优先级接成一条响应链。",
                "en": "This 2026 preprint pushes computer-vision fire monitoring beyond binary detection into a question that site teams can act on immediately: how close the hazard is to people, vehicles, and infrastructure. For civil and construction management, the useful digital-safety system is not the extra camera by itself, but the workflow that links detection, distance, exposed assets, and response priority.",
            },
            "why": {
                "zh": "它把施工安全的视觉监测从“报警”推进到“优先级调度”。",
                "en": "It moves visual site safety from alarm generation into response prioritisation.",
            },
            "caveat": {
                "zh": "该方法仍依赖现场标定、遮挡条件和摄像视角质量；强精度不等于在复杂工地上已经具备审计级可靠性。",
                "en": "The method still depends on site calibration, occlusion, and camera angle; strong metrics do not yet guarantee audit-grade reliability on complex live sites.",
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
                "zh": "混凝土耐久性",
                "en": "Concrete Durability",
            },
            "title": {
                "zh": "氯盐耐久性建模正在从“经验配比”走向“可解释的服务寿命变量”",
                "en": "Chloride durability modeling is shifting from recipe intuition to explainable service-life variables",
            },
            "evidence": {
                "zh": "研究类型：2026年预印本；方法：线性回归、KNN、核岭回归、SVR、高斯过程和神经网络比较不同配合比对氯离子迁移的影响。",
                "en": "Evidence: 2026 preprint comparing linear regression, KNN, kernel ridge, SVR, Gaussian process, and neural-network models for chloride transport under varying concrete mixtures.",
            },
            "summary": {
                "zh": "这篇2026论文的价值不只在于机器学习预测更准，而在于它把水胶比、掺合料和配比变化重新拉回到“哪些变量真正支配氯离子进入速度”这个工程问题上。对结构与材料工程师来说，未来的耐久性设计优势会落在既懂配合比也懂服务寿命解释的人手里，而不是只会报一个名义强度等级。",
                "en": "The value of this 2026 paper is not merely better prediction accuracy, but the way it re-centres durability on the engineering question of which mixture variables actually control chloride ingress. For structural and materials engineers, the future advantage lies with people who can connect mix design to service-life interpretation, not just specify a nominal strength class.",
            },
            "why": {
                "zh": "它让耐久性讨论更接近可追责的参数选择，而不是抽象口号。",
                "en": "It pushes durability discussions toward accountable parameter choices instead of abstract claims.",
            },
            "caveat": {
                "zh": "替代模型再强，也不能跳过暴露等级、施工质量、裂缝和养护边界；现场偏差仍可能吞掉实验室中的精细优化。",
                "en": "Even strong surrogate models cannot bypass exposure class, construction quality, cracking, and curing assumptions; field deviation can still overwhelm laboratory optimisation.",
            },
            "reference": "arXiv:2601.01009, submitted 2026-01-03",
            "referenceLinks": [
                {
                    "label": "arXiv: Data-Driven Assessment of Concrete Mixture Compositions on Chloride Transport",
                    "url": "https://arxiv.org/abs/2601.01009",
                }
            ],
        },
        {
            "area": {
                "zh": "结构健康监测",
                "en": "Structural Health Monitoring",
            },
            "title": {
                "zh": "SHM真正的门槛不是模型多复杂，而是能不能跨工况、跨结构、跨数据域仍然讲得通",
                "en": "The real SHM threshold is not model complexity, but whether it still works across structures, conditions, and data domains",
            },
            "evidence": {
                "zh": "研究类型：2025年系统综述；范围：六十余项结构健康监测领域的域适应研究，涵盖统计对齐、对抗学习、物理约束与生成式方法。",
                "en": "Evidence: 2025 systematic review covering more than sixty domain-adaptation studies in SHM, including statistical alignment, adversarial learning, physics constraints, and generative methods.",
            },
            "summary": {
                "zh": "这篇综述指出，结构健康监测最大的现实障碍不是单个模型在试验数据上的高精度，而是把实验室、仿真和现场之间的分布差异解释清楚。对职业与研究而言，下一阶段更重要的能力是物理一致性、可迁移性和可审计解释，而不是继续堆一个只能在原数据域里表现漂亮的黑箱模型。",
                "en": "This review argues that the main SHM bottleneck is not obtaining high accuracy on one controlled dataset, but explaining and managing the gap between laboratory, simulated, and field domains. For careers and research, the next differentiator is physics consistency, transferability, and auditable interpretation rather than one more black-box model that performs well only in its original data domain.",
            },
            "why": {
                "zh": "它把“能不能部署”放回了SHM方法评价的中心。",
                "en": "It puts deployability back at the centre of SHM method evaluation.",
            },
            "caveat": {
                "zh": "综述本身不提供统一数据标准，且可解释性与认证路径仍是开放问题，工程落地还需要团队级方法治理。",
                "en": "The review does not solve the lack of shared field standards by itself, and interpretability plus certification remain open problems that still require team-level method governance.",
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
            "zh": "氯盐耐久性：为什么中外设计都会先把扩散路径和保护层讲清楚？",
            "en": "Chloride durability: why do both Chinese and international designs start with diffusion path and cover depth?",
        },
        "text": {
            "zh": "无论在中国项目还是国际项目中，沿海或除冰盐环境下的耐久性复核都很难绕开同一条主线：氯离子能否在目标使用年限内穿过保护层并在钢筋处达到临界浓度。中国做法更常先从环境类别、强度等级、保护层与施工质量的“满足性”条文切入；国际做法则更常把这些要求再往前推进成服务寿命模型、性能验算和概率校核。表达方式不同，但审查人最先要看的物理问题是一致的：扩散路径、时间尺度、临界阈值和保护层假定是否被讲清楚。",
            "en": "Whether the project is reviewed under Chinese practice or an international framework, durability checks in marine or de-icing environments usually return to the same core question: can chlorides cross the concrete cover and reach a critical concentration at the steel within the target service life? Chinese workflows more often begin with prescriptive compliance around exposure class, strength, cover, and construction quality, while international workflows more often extend those same inputs into service-life models, performance checks, and probabilistic verification. The language differs, but the first physical issue is the same: are the diffusion path, time scale, threshold, and cover assumptions clearly bounded?",
        },
        "comparisonPoints": [
            {
                "label": {
                    "zh": "设计入口",
                    "en": "Design entry",
                },
                "text": {
                    "zh": "中国文件常先用环境类别、保护层、混凝土等级和构造要求建立“先满足条文”的底线；国际文件更常把同样的信息写成 service life input，例如表面氯离子浓度、扩散系数、临界阈值和目标年限。入口形式不同，但本质上都在控制氯离子穿透路径。",
                    "en": "Chinese documents often establish the first durability line through exposure category, cover, concrete grade, and detailing requirements, while international files more often turn the same information into service-life inputs such as surface chloride concentration, diffusion coefficient, critical threshold, and target years. The entry format differs, but both are controlling the chloride penetration path.",
                },
            },
            {
                "label": {
                    "zh": "校核深度",
                    "en": "Verification depth",
                },
                "text": {
                    "zh": "当项目风险较高、使用年限较长或环境更苛刻时，单纯的最小保护层表往往不够，中外团队都会进一步要求性能证明、试验参数或模型解释。差别更多在于文档风格：有的以条文符合性为主，有的以计算依据和失效概率表述为主。",
                    "en": "When projects carry higher consequence, longer service life, or harsher exposure, minimum-cover tables alone are usually not enough, and teams in both systems move toward performance evidence, test parameters, or model explanations. The difference is more about documentation style: one may foreground prescriptive compliance, another may foreground calculations and reliability statements.",
                },
            },
            {
                "label": {
                    "zh": "审批语言",
                    "en": "Approval language",
                },
                "text": {
                    "zh": "真正能让审查人快速放行的，不是单独一句“满足耐久性要求”，而是把暴露环境、保护层、裂缝控制、养护条件和所用模型边界一起交代清楚。无论规范体系如何变化，审查逻辑都更喜欢可追溯假定，而不是泛泛结论。",
                    "en": "What actually helps approval is not a single sentence saying the durability requirement is satisfied, but a bounded statement of exposure, cover, crack control, curing, and the model limits being used. Whatever the code family, reviewers prefer traceable assumptions over generic conclusions.",
                },
            },
        ],
        "takeaway": {
            "zh": "跨体系复核耐久性时，先把暴露等级、保护层、扩散参数、临界浓度和目标年限连成一条清晰路径，再讨论条文表格或性能模型谁更保守，会比一开始就争论哪本规范“更严格”更有效。",
            "en": "For a cross-system durability check, first connect exposure class, cover depth, diffusion parameters, critical concentration, and target service life into one clear path. That is more effective than arguing too early about which code is 'stricter'.",
        },
        "example": {
            "title": {
                "zh": "实例：50 mm保护层在50年氯盐环境下是否仍低于临界浓度？",
                "en": "Example: does 50 mm cover stay below a critical chloride threshold at 50 years?",
            },
            "intro": {
                "zh": "假设钢筋保护层厚度 x = 50 mm，表面氯离子浓度 C_s = 0.60%，初始氯离子浓度 C_i = 0，临界浓度 C_crit = 0.20%，表观扩散系数 D_app = 8 × 10^-13 m²/s，目标使用年限 t = 50 年。采用半无限体的一维Fick扩散近似，暂不考虑裂缝、时间衰减扩散系数、湿干循环与施工偏差。该例只用于说明耐久性筛查逻辑，不替代正式设计与试验校准。",
                "en": "Assume reinforcement cover x = 50 mm, surface chloride concentration C_s = 0.60%, initial chloride concentration C_i = 0, critical concentration C_crit = 0.20%, apparent diffusion coefficient D_app = 8 × 10^-13 m²/s, and target service life t = 50 years. Use a one-dimensional semi-infinite Fick diffusion approximation and ignore cracking, time-varying diffusivity, wet-dry cycling, and construction deviation. This example shows screening logic only and does not replace formal design or test calibration.",
            },
            "equations": [
                {
                    "label": {
                        "zh": "扩散特征深度",
                        "en": "Diffusion depth scale",
                    },
                    "formula": "x_d = 2 √(D_app t)",
                    "formulaTokens": [
                        {"var": "x"},
                        {"sub": "d"},
                        {"text": " = 2 √("},
                        {"var": "D"},
                        {"sub": "app"},
                        {"text": " "},
                        {"var": "t"},
                        {"text": ")"},
                    ],
                    "citation": {
                        "zh": "推导关系：半无限体Fick扩散解的特征长度；依据 Crank, The Mathematics of Diffusion, 2nd ed., Chapter 2（推导式，非规范原编公式）",
                        "en": "Derived relation: characteristic length from the semi-infinite Fick diffusion solution; based on Crank, The Mathematics of Diffusion, 2nd ed., Chapter 2 (derived, not a numbered code equation)",
                    },
                    "result": {
                        "zh": "取 t = 50 年，可得 x_d = 2√(8 × 10^-13 × 50 × 365.25 × 24 × 3600) = 71.1 mm。",
                        "en": "With t = 50 years, x_d = 2√(8 × 10^-13 × 50 × 365.25 × 24 × 3600) = 71.1 mm.",
                    },
                },
                {
                    "label": {
                        "zh": "钢筋处氯离子浓度",
                        "en": "Chloride at steel depth",
                    },
                    "formula": "C(x,t) = C_i + (C_s - C_i) [1 - erf(x / (2 √(D_app t)))]",
                    "formulaTokens": [
                        {"var": "C"},
                        {"text": "("},
                        {"var": "x"},
                        {"text": ","},
                        {"var": "t"},
                        {"text": ") = "},
                        {"var": "C"},
                        {"sub": "i"},
                        {"text": " + ("},
                        {"var": "C"},
                        {"sub": "s"},
                        {"text": " - "},
                        {"var": "C"},
                        {"sub": "i"},
                        {"text": ") [1 - erf("},
                        {"var": "x"},
                        {"text": " / (2 √("},
                        {"var": "D"},
                        {"sub": "app"},
                        {"text": " "},
                        {"var": "t"},
                        {"text": ")))]"},
                    ],
                    "citation": {
                        "zh": "推导关系：常扩散系数条件下一维半无限体氯离子分布；依据 Crank, The Mathematics of Diffusion, 2nd ed., Chapter 2 semi-infinite solution（推导式，非规范原编公式）",
                        "en": "Derived relation: one-dimensional semi-infinite chloride profile with constant diffusivity; based on Crank, The Mathematics of Diffusion, 2nd ed., Chapter 2 semi-infinite solution (derived, not a numbered code equation)",
                    },
                    "result": {
                        "zh": "代入 x = 50 mm 与 t = 50 年，得 C(x,t) = 0.60 × [1 - erf(50 / 71.1)] ≈ 0.192%，略低于 0.20% 的临界浓度。",
                        "en": "Substituting x = 50 mm and t = 50 years gives C(x,t) = 0.60 × [1 - erf(50 / 71.1)] ≈ 0.192%, which is slightly below the 0.20% critical threshold.",
                    },
                },
                {
                    "label": {
                        "zh": "目标年限所需保护层",
                        "en": "Required cover for target life",
                    },
                    "formula": "x_req = 2 √(D_app t) erf^-1(1 - (C_crit - C_i) / (C_s - C_i))",
                    "formulaTokens": [
                        {"var": "x"},
                        {"sub": "req"},
                        {"text": " = 2 √("},
                        {"var": "D"},
                        {"sub": "app"},
                        {"text": " "},
                        {"var": "t"},
                        {"text": ") erf"},
                        {"sup": "-1"},
                        {"text": "(1 - ("},
                        {"var": "C"},
                        {"sub": "crit"},
                        {"text": " - "},
                        {"var": "C"},
                        {"sub": "i"},
                        {"text": ") / ("},
                        {"var": "C"},
                        {"sub": "s"},
                        {"text": " - "},
                        {"var": "C"},
                        {"sub": "i"},
                        {"text": "))"},
                    ],
                    "citation": {
                        "zh": "推导关系：由半无限体氯离子分布反算目标年限所需保护层；依据 Crank, The Mathematics of Diffusion, 2nd ed., Chapter 2，与 service-life screening 常用反算思路一致（推导式，非规范原编公式）",
                        "en": "Derived relation: inversion of the semi-infinite chloride profile to estimate required cover for a target life; based on Crank, The Mathematics of Diffusion, 2nd ed., Chapter 2 and consistent with common service-life screening practice (derived, not a numbered code equation)",
                    },
                    "result": {
                        "zh": "对 50 年目标年限反算，x_req ≈ 48.6 mm，因此 50 mm 保护层在该简化假定下只有很小裕度，任何裂缝、施工偏差或更高扩散系数都可能把结果推过临界值。",
                        "en": "Back-solving for a 50-year target gives x_req ≈ 48.6 mm, so 50 mm cover has only a small margin under this simplified assumption and could be pushed past the threshold by cracking, construction deviation, or a higher effective diffusivity.",
                    },
                },
            ],
            "note": {
                "zh": "这个结果说明的是“路径是否大致够用”，而不是正式设计已经完成。实际项目仍需把暴露等级、龄期修正、裂缝控制、养护质量、时间变扩散系数、试验参数与规范最低构造要求一起复核。",
                "en": "This result shows only whether the diffusion path is broadly adequate, not that the design is complete. Real projects still need exposure classification, age adjustment, crack control, curing quality, time-varying diffusivity, test calibration, and the governing code minimum detailing checks.",
            },
        },
        "references": "AS 3600 catalogue; Eurocode 2 official page; Crank, The Mathematics of Diffusion; chloride-ingress literature",
        "referenceLinks": [
            {
                "label": "Standards Australia: AS 3600 catalogue",
                "url": "https://store.standards.org.au/product/as-3600-2018",
            },
            {
                "label": "European Commission JRC: Eurocode 2",
                "url": "https://eurocodes.jrc.ec.europa.eu/showpage.php?id=132",
            },
            {
                "label": "AbeBooks: Crank, The Mathematics of Diffusion",
                "url": "https://www.abebooks.com/9780198534112/Mathematics-Diffusion-Crank-J-0198534116/plp",
            },
            {
                "label": "arXiv: Concrete mixture compositions and chloride transport",
                "url": "https://arxiv.org/abs/2601.01009",
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
    bad_markers = ["�", "鈥", "鍙", "锛", "銆", "涓", "鏉", "璁", "绠€", "瑙"]
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
        mirrored_fallback = json.loads(mirrored_html[extract_fallback_block(mirrored_html)[0]:extract_fallback_block(mirrored_html)[1]].rstrip(";"))
        if mirrored_fallback != DATA:
            raise AssertionError(f"Mirror HTML fallback out of sync: {path}")

    print(f"Updated industry briefing for {TODAY}")


if __name__ == "__main__":
    main()
