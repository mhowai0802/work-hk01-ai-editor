interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  filled?: boolean;
}

function Box({ x, y, w, h, label, sub, filled }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={filled ? "#000" : "#fff"}
        stroke="#000"
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 6 : y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight={600}
        fill={filled ? "#fff" : "#000"}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fill={filled ? "#ccc" : "#737373"}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) {
  const midY = (y1 + y2) / 2;
  const midX = (x1 + x2) / 2;

  let path: string;
  if (x1 === x2) {
    path = `M${x1},${y1} L${x2},${y2}`;
  } else if (y1 === y2) {
    path = `M${x1},${y1} L${x2},${y2}`;
  } else {
    path = `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`;
  }

  return (
    <g>
      <defs>
        <marker id="arrowhead" markerWidth={8} markerHeight={6} refX={7} refY={3} orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#000" />
        </marker>
      </defs>
      <path d={path} fill="none" stroke="#000" strokeWidth={1.2} markerEnd="url(#arrowhead)" />
      {label && (
        <text
          x={x1 === x2 ? x1 + 8 : midX}
          y={x1 === x2 ? midY : midY - 8}
          textAnchor={x1 === x2 ? "start" : "middle"}
          fontSize={10}
          fill="#737373"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function OverviewFlowchart() {
  return (
    <svg viewBox="0 0 680 320" className="flowchart">
      <text x={340} y={18} textAnchor="middle" fontSize={11} fill="#a3a3a3" fontWeight={500}>FRONTEND</text>
      <rect x={10} y={26} width={660} height={80} rx={10} fill="none" stroke="#e8e8e8" strokeWidth={1} strokeDasharray="6 3" />
      <Box x={40} y={40} w={120} h={50} label="用戶介面" sub="React Pages" />
      <Box x={200} y={40} w={120} h={50} label="Hooks" sub="Application" />
      <Box x={360} y={40} w={140} h={50} label="Repository" sub="Infrastructure" />
      <Arrow x1={160} y1={65} x2={200} y2={65} />
      <Arrow x1={320} y1={65} x2={360} y2={65} />

      <Arrow x1={430} y1={90} x2={430} y2={140} label="HTTP" />

      <text x={340} y={152} textAnchor="middle" fontSize={11} fill="#a3a3a3" fontWeight={500}>BACKEND</text>
      <rect x={10} y={160} width={660} height={80} rx={10} fill="none" stroke="#e8e8e8" strokeWidth={1} strokeDasharray="6 3" />
      <Box x={280} y={175} w={140} h={50} label="FastAPI Router" sub="Presentation" />
      <Box x={460} y={175} w={140} h={50} label="Use Case" sub="Application" />
      <Arrow x1={420} y1={200} x2={460} y2={200} />

      <Arrow x1={600} y1={200} x2={640} y2={200} />
      <Arrow x1={640} y1={200} x2={640} y2={280} />

      <text x={340} y={268} textAnchor="middle" fontSize={11} fill="#a3a3a3" fontWeight={500}>EXTERNAL</text>
      <rect x={10} y={275} width={660} height={42} rx={10} fill="none" stroke="#e8e8e8" strokeWidth={1} strokeDasharray="6 3" />
      <Box x={180} y={280} w={160} h={32} label="Airforce API (免費)" filled />
      <Box x={380} y={280} w={200} h={32} label="HKBU GenAI API (Qwen)" filled />
    </svg>
  );
}

function TopicFlowchart() {
  return (
    <svg viewBox="0 0 680 100" className="flowchart">
      <Box x={0} y={20} w={110} h={50} label="文章段落" sub="用戶輸入" />
      <Arrow x1={110} y1={45} x2={150} y2={45} />
      <Box x={150} y={20} w={130} h={50} label="TopicGenerator" sub="React Page" />
      <Arrow x1={280} y1={45} x2={310} y2={45} label="POST" />
      <Box x={310} y={20} w={130} h={50} label="GenerateTopics" sub="Use Case" filled />
      <Arrow x1={440} y1={45} x2={470} y2={45} />
      <Box x={470} y={20} w={100} h={50} label="Qwen LLM" sub="提取主題" filled />
      <Arrow x1={570} y1={45} x2={600} y2={45} />
      <Box x={600} y={20} w={80} h={50} label="主題列表" sub="+ 摘要" />
    </svg>
  );
}

function ImageFlowchart() {
  return (
    <svg viewBox="0 0 680 170" className="flowchart">
      <Box x={0} y={20} w={110} h={50} label="新聞標題" sub="用戶輸入" />
      <Arrow x1={110} y1={45} x2={145} y2={45} />
      <Box x={145} y={20} w={130} h={50} label="ImageGenerator" sub="React Page" />
      <Arrow x1={275} y1={45} x2={310} y2={45} label="POST" />
      <Box x={310} y={20} w={130} h={50} label="GenerateImage" sub="Use Case" filled />

      <Arrow x1={375} y1={70} x2={375} y2={110} />
      <Box x={310} y={110} w={130} h={50} label="Qwen LLM" sub="中文 → 英文 Prompt" filled />
      <Arrow x1={440} y1={135} x2={480} y2={135} />
      <Box x={480} y={110} w={120} h={50} label="Airforce API" sub="Flux-2-Klein 生成" filled />
      <Arrow x1={600} y1={135} x2={630} y2={135} />
      <Box x={630} y={110} w={50} h={50} label="圖片" />

      <Arrow x1={440} y1={45} x2={630} y2={45} />
      <Box x={630} y={20} w={50} h={50} label="URL" />
    </svg>
  );
}

function DetectFlowchart() {
  return (
    <svg viewBox="0 0 680 100" className="flowchart">
      <Box x={0} y={20} w={110} h={50} label="文章段落" sub="用戶輸入" />
      <Arrow x1={110} y1={45} x2={145} y2={45} />
      <Box x={145} y={20} w={120} h={50} label="AIDetector" sub="React Page" />
      <Arrow x1={265} y1={45} x2={300} y2={45} label="POST" />
      <Box x={300} y={20} w={140} h={50} label="DetectAIContent" sub="Use Case" filled />
      <Arrow x1={440} y1={45} x2={475} y2={45} />
      <Box x={475} y={20} w={100} h={50} label="Qwen LLM" sub="6維度分析" filled />
      <Arrow x1={575} y1={45} x2={600} y2={45} />
      <Box x={600} y={20} w={80} h={50} label="檢測報告" sub="概率+建議" />
    </svg>
  );
}

function CleanArchFlowchart() {
  return (
    <svg viewBox="0 0 680 100" className="flowchart">
      <Box x={0} y={25} w={140} h={50} label="Presentation" sub="路由 / 頁面" />
      <Arrow x1={140} y1={50} x2={175} y2={50} />
      <Box x={175} y={25} w={140} h={50} label="Application" sub="Use Cases / Hooks" />
      <Arrow x1={315} y1={50} x2={350} y2={50} />
      <Box x={350} y={25} w={140} h={50} label="Domain" sub="實體 + 介面" filled />
      <text x={520} y={40} fontSize={11} fill="#a3a3a3">←</text>
      <Arrow x1={540} y1={50} x2={525} y2={50} />
      <Box x={540} y={25} w={140} h={50} label="Infrastructure" sub="API 適配器" />
      <text x={245} y={18} textAnchor="middle" fontSize={10} fill="#a3a3a3">依賴方向 →</text>
    </svg>
  );
}

export function ArchitecturePage() {
  return (
    <div className="page-container arch-page">
      <h1 className="page-title">系統架構</h1>
      <p className="page-subtitle">
        HK01 AI Editor 的技術架構與各功能實現方式
      </p>

      {/* Clean Arch layers */}
      <section className="arch-section">
        <h2 className="arch-heading">Clean Architecture 分層</h2>
        <p className="arch-text">
          依賴方向由外向內。<strong>Domain</strong> 是核心，不依賴任何外部框架。
          <strong>Infrastructure</strong> 實現 Domain 定義的介面，指向 Domain 而非 Application。
        </p>
        <CleanArchFlowchart />
      </section>

      {/* System overview */}
      <section className="arch-section">
        <h2 className="arch-heading">系統總覽</h2>
        <OverviewFlowchart />
      </section>

      {/* Tech Stack */}
      <section className="arch-section">
        <h2 className="arch-heading">技術棧</h2>
        <div className="arch-grid">
          <div className="arch-card">
            <div className="arch-card-label">前端</div>
            <div className="arch-card-value">React + TypeScript + Vite</div>
          </div>
          <div className="arch-card">
            <div className="arch-card-label">後端</div>
            <div className="arch-card-value">Python + FastAPI</div>
          </div>
          <div className="arch-card">
            <div className="arch-card-label">LLM</div>
            <div className="arch-card-value">Qwen (HKBU GenAI API)</div>
          </div>
          <div className="arch-card">
            <div className="arch-card-label">圖片生成</div>
            <div className="arch-card-value">Airforce API / Flux-2-Klein (免費)</div>
          </div>
        </div>
      </section>

      {/* Feature 1 */}
      <section className="arch-section">
        <h2 className="arch-heading">功能一：主題生成</h2>
        <p className="arch-text">
          用戶貼上中文文章，經 Qwen LLM 以 HK01 真實標籤風格（含7篇真實範例的 Few-shot Prompt）提取 3-7 個主題標籤和一句摘要。
        </p>
        <TopicFlowchart />
        <div className="arch-api-box">
          <div className="arch-api-label">API</div>
          <code>POST /api/topic/generate</code>
          <div className="arch-api-detail">
            Request: {`{ "passage": "文章段落..." }`}<br />
            Response: {`{ "topics": [...], "passage_summary": "..." }`}
          </div>
        </div>
      </section>

      {/* Feature 2 */}
      <section className="arch-section">
        <h2 className="arch-heading">功能二：新聞配圖</h2>
        <p className="arch-text">
          兩步流程：先用 Qwen 將中文標題翻譯為英文圖片描述，再調用 Airforce API (Flux-2-Klein) 生成圖片。使用 Klein 模型以避免政治新聞內容過濾。
        </p>
        <ImageFlowchart />
        <div className="arch-api-box">
          <div className="arch-api-label">API</div>
          <code>POST /api/image/generate</code>
          <div className="arch-api-detail">
            Request: {`{ "headline": "新聞標題..." }`}<br />
            Response: {`{ "image_url": "...", "prompt_used": "..." }`}
          </div>
        </div>
      </section>

      {/* Feature 3 */}
      <section className="arch-section">
        <h2 className="arch-heading">功能三：AI 內容檢測</h2>
        <p className="arch-text">
          用 Qwen 從六個維度分析文章是否由 AI 生成，返回概率、理由和編輯建議。
        </p>
        <DetectFlowchart />
        <div className="arch-api-box">
          <div className="arch-api-label">API</div>
          <code>POST /api/detect/ai</code>
          <div className="arch-api-detail">
            Request: {`{ "passage": "文章段落..." }`}<br />
            Response: {`{ "is_ai_generated": bool, "ai_probability": 0.0-1.0, ... }`}
          </div>
        </div>
        <div className="arch-note">
          <strong>為什麼需要這個功能？</strong> Google SEO 政策會懲罰低質量 AI
          生成內容（scaled content abuse）。此功能幫助編輯在發布前識別 AI 痕跡並人工優化。
        </div>
      </section>

      {/* Benefits */}
      <section className="arch-section">
        <h2 className="arch-heading">架構優勢</h2>
        <div className="arch-grid">
          <div className="arch-card">
            <div className="arch-card-label">可測試</div>
            <div className="arch-card-value">Use Case 可用 Mock Port 單元測試</div>
          </div>
          <div className="arch-card">
            <div className="arch-card-label">可替換</div>
            <div className="arch-card-value">換 LLM / 圖片服務只需新增 Adapter</div>
          </div>
          <div className="arch-card">
            <div className="arch-card-label">易維護</div>
            <div className="arch-card-value">每層職責單一，代碼位置清晰</div>
          </div>
          <div className="arch-card">
            <div className="arch-card-label">易擴展</div>
            <div className="arch-card-value">加功能 = Use Case + Router + Page</div>
          </div>
        </div>
      </section>

      {/* Project Structure */}
      <section className="arch-section">
        <h2 className="arch-heading">項目結構</h2>
        <pre className="arch-tree">{`backend/
├── domain/          ← 實體、抽象介面、異常（零依賴）
├── application/     ← Use Cases（只依賴 Domain）
├── infrastructure/  ← API 適配器（實現 Domain 介面）
├── presentation/    ← FastAPI 路由 + Pydantic Schema
└── main.py          ← 依賴注入、CORS、啟動

frontend/src/
├── domain/          ← TypeScript 類型、Repository 介面
├── application/     ← Custom Hooks（只依賴 Domain）
├── infrastructure/  ← Axios 客戶端、Repository 實現
└── presentation/    ← 頁面組件、共用 UI 組件`}</pre>
      </section>
    </div>
  );
}
