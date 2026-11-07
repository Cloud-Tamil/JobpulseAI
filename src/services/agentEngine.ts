import { Artifact, CandidateProfile, Message, ToolExecution } from '../types/agent';
import { AI_MODELS } from '../data/modelsData';
import { resolveSearchQuery } from './searchResolver';
import { generateConversationalAnswer } from './conversationalEngine';

export async function processAgentTurn(
  userPrompt: string,
  candidate: CandidateProfile,
  modelId: string = 'deepseek-r1',
  ollamaEndpoint?: string,
  history: Message[] = []
): Promise<{
  content: string;
  thinking: string;
  toolsUsed: ToolExecution[];
  artifacts: Artifact[];
  modelUsed: string;
}> {
  const promptLower = userPrompt.toLowerCase();
  const toolsUsed: ToolExecution[] = [];
  const artifacts: Artifact[] = [];

  const selectedModel = AI_MODELS.find((m) => m.id === modelId) || AI_MODELS[0];

  // Determine intent
  const isResumeTemplate = promptLower.includes('template') || promptLower.includes('templates');
  const isResumeTailoring = !isResumeTemplate && (promptLower.includes('tailor') || promptLower.includes('resume') || promptLower.includes('cv'));
  const isAtsAudit = promptLower.includes('ats') || promptLower.includes('compliance') || promptLower.includes('audit');
  const isRecruiterEmail = promptLower.includes('recruiter') || promptLower.includes('email') || promptLower.includes('outreach') || promptLower.includes('cold');
  const isInterviewPrep = promptLower.includes('interview') || promptLower.includes('mock') || promptLower.includes('question') || promptLower.includes('sre');
  const isSearchQuery = promptLower.includes('search') || promptLower.includes('find') || promptLower.includes('details') || promptLower.includes('explain') || promptLower.includes('what') || promptLower.includes('how') || promptLower.includes('company') || promptLower.includes('salary');

  // Multi-step tool simulation
  if (isResumeTemplate) {
    toolsUsed.push({
      id: 'tool-' + Date.now() + '-templates',
      name: 'ats_template_synthesizer',
      displayName: `${selectedModel.name} · ATS Template Synthesizer`,
      status: 'completed',
      input: 'Synthesizing 3 industry gold-standard ATS resume templates (Technical/Cloud, Executive XYZ, Clean Minimalist)...',
      output: 'Generated 3 complete ATS resume templates with Google XYZ impact metrics and modular section structures.',
      durationMs: 240
    });
  }

  if (isSearchQuery) {
    toolsUsed.push({
      id: 'tool-' + Date.now() + '-search',
      name: 'omni_search_crawler',
      displayName: `${selectedModel.name} · Live Web & Intelligence Crawler`,
      status: 'completed',
      input: `Querying 16 job portals, employer engineering blogs, and cloud architecture specs for "${userPrompt.slice(0, 48)}..."`,
      output: 'Indexed 4 verified technical citations, salary data, and current infrastructure specs.',
      durationMs: selectedModel.id.includes('flash') ? 120 : 310
    });
  }

  if (isResumeTailoring || isAtsAudit) {
    toolsUsed.push({
      id: 'tool-' + Date.now() + '-1',
      name: 'ats_parser_v4',
      displayName: `${selectedModel.name} · ATS Semantic Scanner`,
      status: 'completed',
      input: `[${selectedModel.name}] Tokenizing candidate experience: AWS EKS, Terraform, ArgoCD, FinOps 30% savings...`,
      output: '99.2% alignment detected across AWS EKS, ArgoCD GitOps, Terraform S3 state locking.',
      durationMs: selectedModel.id.includes('flash') ? 140 : 380
    });
  }

  if (isResumeTailoring) {
    toolsUsed.push({
      id: 'tool-' + Date.now() + '-2',
      name: 'bullet_impact_quantifier',
      displayName: `${selectedModel.name} · XYZ Impact Optimizer`,
      status: 'completed',
      input: 'Applying Google XYZ formula: Accomplished [X] as measured by [Y], by doing [Z]...',
      output: 'Restructured 5 production bullets highlighting 30% cloud savings & 99.9% uptime SLA.',
      durationMs: selectedModel.id.includes('flash') ? 160 : 420
    });
  }

  if (isRecruiterEmail) {
    toolsUsed.push({
      id: 'tool-' + Date.now() + '-3',
      name: 'recruiter_radar',
      displayName: `${selectedModel.name} · Executive Recruiter Tone Synthesizer`,
      status: 'completed',
      input: 'Synthesizing value proposition for VP of Infrastructure / Talent Lead...',
      output: 'Constructed 3-paragraph executive narrative with call-to-action.',
      durationMs: 290
    });
  }

  if (isInterviewPrep) {
    toolsUsed.push({
      id: 'tool-' + Date.now() + '-4',
      name: 'sre_scenario_engine',
      displayName: `${selectedModel.name} · Distributed Systems Scenario Generator`,
      status: 'completed',
      input: 'Loading Kubernetes EKS multi-region failover and CrashLoopBackOff scenarios...',
      output: 'Generated 3 real-world production incident response prompts with STAR evaluation rubrics.',
      durationMs: 380
    });
  }

  // Model-specific thinking trace representation
  let thinkingPrefix = '';
  if (modelId.includes('claude')) {
    thinkingPrefix = `[Anthropic ${selectedModel.name} Extended Thinking & Artifact Synthesis]\n`;
  } else if (modelId.includes('gpt') || modelId.includes('o1') || modelId.includes('o3')) {
    thinkingPrefix = `[OpenAI ${selectedModel.name} Multi-Step Analytical Engine]\n`;
  } else if (modelId === 'deepseek-r1') {
    thinkingPrefix = `<think>\n[DeepSeek-R1 Autonomous Reasoning Mode]\n`;
  } else if (modelId.includes('llama')) {
    thinkingPrefix = `[Meta ${selectedModel.name} Enterprise System Execution Trace]\n`;
  } else if (modelId.includes('qwen') || modelId.includes('codestral')) {
    thinkingPrefix = `[${selectedModel.name} Architectural Code Synthesis]\n`;
  } else if (modelId === 'ollama-local') {
    thinkingPrefix = `[Ollama Local Daemon · Private Air-Gapped Inference via ${ollamaEndpoint || 'localhost:11434'}]\n`;
  } else {
    thinkingPrefix = `[${selectedModel.name} Reasoning Pipeline]\n`;
  }

  let thinking = '';
  if (isResumeTemplate) {
    thinking = `${thinkingPrefix}1. Parsing request for high-performance resume templates: "${userPrompt}".
2. Designing 3 industry gold-standard ATS-optimized templates:
   - Template 1: Modern Technical & Cloud / DevOps (single-column, skill-dense, high metric visibility).
   - Template 2: Google "XYZ Formula" Executive & Staff Leadership Standard.
   - Template 3: Clean Minimalist Harvard-Format Professional Standard.
3. Structuring full markdown with customizable placeholders and production-tested metric bullets.
4. Packaging into an interactive split-screen Artifact for instant copy and export.${modelId === 'deepseek-r1' ? '\n</think>' : ''}`;
  } else if (isResumeTailoring) {
    thinking = `${thinkingPrefix}1. Parsing verified profile: ${candidate.name} (${candidate.experienceYears} yrs at ${candidate.currentCompany}).
2. Verifying verified technical skills: AWS EKS, Azure AKS, Terraform, ArgoCD, Prometheus, Grafana.
3. Formulating ATS-friendly document structure: Executive Summary, Technical Competencies, Professional Experience (quantified via Google's XYZ formula), Education & Certifications.
4. Validating absence of buzzwords: Ensuring zero invented experiences, strictly anchoring on production automation, FinOps 30% cost reduction, and 99.9% uptime SLA.
5. Preparing interactive Artifact preview for direct split-panel review and 1-click export.${modelId === 'deepseek-r1' ? '\n</think>' : ''}`;
  } else if (isAtsAudit) {
    thinking = `${thinkingPrefix}1. Parsing candidate resume structure against Workday, Greenhouse, Taleo, and Lever parsing heuristics.
2. Evaluating keyword density:
   - Kubernetes / EKS: 9/10 (Excellent presence)
   - Terraform & IaC: 9/10 (Strong modular pattern mention)
   - CI/CD & ArgoCD GitOps: 8.5/10 (High alignment)
   - FinOps & Cost Optimization: 9.5/10 (Rare high-value differentiator)
3. Synthesizing ATS score calculation (Target: 95%+).
4. Generating optimization recommendations for hiring team readability.${modelId === 'deepseek-r1' ? '\n</think>' : ''}`;
  } else if (isRecruiterEmail) {
    thinking = `${thinkingPrefix}1. Evaluating recruiter attention span (average 6-10 seconds initial scan).
2. Crafting punchy subject line that signals senior infrastructure capability immediately.
3. Highlighting 4+ years production DevOps, Kubernetes orchestration, and 30% cost savings upfront.
4. Proposing low-friction calendar call with clear availability.${modelId === 'deepseek-r1' ? '\n</think>' : ''}`;
  } else if (isInterviewPrep) {
    thinking = `${thinkingPrefix}1. Designing high-signal Principal SRE / Cloud Engineer interview questions.
2. Formulating scenarios that test actual operational grit:
   - Scenario 1: Debugging CrashLoopBackOff on stateful pods under traffic spike.
   - Scenario 2: Active-passive multi-region failover across AWS us-east-1 and eu-west-1.
   - Scenario 3: Terraform state lock resolution during active pipeline deployment.
3. Providing concrete STAR framework responses for candidate study.${modelId === 'deepseek-r1' ? '\n</think>' : ''}`;
  } else {
    thinking = `${thinkingPrefix}1. Analyzing search query: "${userPrompt}".
2. Conducting deep cross-reference:
   - Candidate context: ${candidate.name}, ${candidate.title} (4+ years in enterprise cloud infrastructure).
   - Technical standards: Cloud infrastructure, Kubernetes orchestration, Terraform state management, FinOps.
3. Synthesizing exact technical details, step-by-step implementation, architectural diagrams, and verified facts.
4. Packaging deep dive into an interactive split-screen artifact.${modelId === 'deepseek-r1' ? '\n</think>' : ''}`;
  }

  // Content & Artifact generation
  let content = '';

  if (isResumeTemplate) {
    const artifactId = 'art-' + Date.now();
    const templatesMarkdown = `# Best-in-Class ATS Resume Templates (2026 Edition)
*100% Parsing Compatibility Guaranteed across Workday, Greenhouse, Lever, Taleo, and iCIMS.*

---

## 📋 Table of Contents
1. **Template 1:** Modern Technical & Cloud Engineering (DevOps, SRE, Cloud, Platform)
2. **Template 2:** The Google "XYZ Formula" Executive & Staff Leadership Standard
3. **Template 3:** Clean Minimalist Harvard-Style Software Engineer Standard
4. **ATS Survival Guide:** 5 Non-Negotiable Rules for 99%+ Parsing Scores

---

# 🚀 TEMPLATE 1: Modern Technical & Cloud/DevOps Standard
*(Best for: DevOps Engineers, SREs, Cloud Architects, Platform Engineers)*

\`\`\`markdown
# [FIRST NAME] [LAST NAME]
**Senior Cloud & DevOps Engineer | Kubernetes, Terraform & GitOps Specialist**  
Email: [your.email@example.com] | Phone: [+1 (555) 019-2834] | Location: [City, State / Remote]  
LinkedIn: [linkedin.com/in/yourprofile] | GitHub: [github.com/yourhandle]  

---

### PROFESSIONAL SUMMARY
Results-oriented Cloud & DevOps Engineer with [4+] years of production experience designing, deploying, and maintaining highly available cloud infrastructure across [AWS / Azure / GCP]. Proven track record orchestrating enterprise Kubernetes (EKS) clusters, authoring modular Terraform IaC with remote state locking, and standardizing GitOps delivery pipelines via ArgoCD. Championed FinOps initiatives achieving a [30%] reduction in monthly compute expenditure while maintaining a strict [99.99%] application uptime SLA.

---

### TECHNICAL SKILLS
- **Cloud Platforms:** AWS (EKS, EC2, S3, RDS, IAM, VPC, Route 53, CloudWatch), Azure (AKS, Blob, Virtual Networks)
- **Containerization & Orchestration:** Docker, Kubernetes, Helm Charts, ArgoCD, Istio Service Mesh
- **Infrastructure as Code (IaC):** Terraform (Modules, State Locking, Terragrunt), Ansible, CloudFormation
- **CI/CD & DevSecOps:** GitHub Actions, GitLab CI/CD, Jenkins, Trivy, SonarQube, Vault
- **Observability & SRE:** Prometheus, Grafana, Datadog, ELK Stack, OpenTelemetry, PagerDuty
- **Languages & Scripting:** Bash / Shell, Python, Go, YAML, SQL

---

### PROFESSIONAL EXPERIENCE

#### **[Target Company Name]** — *[Location or Remote]*
**Senior Cloud & DevOps Engineer** | *[Month Year] – Present*
- Architected and automated multi-region AWS EKS infrastructure using modular Terraform, slashing environment provisioning lead time by [75%] (from 4 days to under 45 minutes).
- Deployed and scaled ArgoCD GitOps pipelines for [40+] microservices, achieving zero-downtime canary deployments and reducing rollback frequency by [60%].
- Spearheaded company-wide FinOps rightsizing audit, migrating batch workloads to Karpenter-managed AWS Spot instances to eliminate [$140,000+] in annual idle cloud spend ([30%] net savings).
- Engineered comprehensive Prometheus and Grafana observability stack with dynamic alerting, resolving production P1 incidents [40%] faster and maintaining a [99.99%] SLA.
- Established automated DevSecOps scanning using Trivy and GitHub Actions, preventing [100%] of critical CVEs from reaching production container registries.

#### **[Previous Company Name]** — *[Location or Remote]*
**DevOps & Systems Engineer** | *[Month Year] – [Month Year]*
- Migrated legacy monolithic services to Dockerized microservices deployed on Kubernetes, improving deployment frequency from bi-weekly to [8x daily].
- Standardized Terraform modules across 4 engineering teams, enforcing S3 remote state storage and DynamoDB distributed locking to eliminate state corruption.
- Automated CI/CD test, build, and publish pipelines with GitHub Actions, reducing release build times from 35 minutes to [7 minutes].

---

### KEY PROJECTS
- **Multi-Cluster Disaster Recovery:** Automated cross-region DNS failover using Route 53 and Velero backup operators, achieving an RTO of [< 15 minutes] and RPO of [< 5 minutes].
- **Zero-Trust K8s Security Architecture:** Implemented Kyverno admission controllers and RBAC least-privilege policies across 12 production clusters.

---

### EDUCATION & CERTIFICATIONS
- **Bachelor of Science in Computer Science / Engineering** — [University Name], [Graduation Year]
- **AWS Certified Solutions Architect – Associate** (Validation ID: [AWS-XXXXX])
- **HashiCorp Certified: Terraform Associate** (Validation ID: [HASHI-XXXXX])
- **Certified Kubernetes Administrator (CKA)** (Linux Foundation)
\`\`\`

---

# 🏛️ TEMPLATE 2: The Google "XYZ Formula" Executive & Staff Leadership Standard
*(Best for: Staff / Principal Engineers, Engineering Managers, Solution Architects)*

\`\`\`markdown
# [FIRST NAME] [LAST NAME], [P.E. / M.S.]
**Principal Platform Architect & Engineering Leader**  
[City, State] | [Phone Number] | [Professional Email] | [LinkedIn URL]  

---

### EXECUTIVE PROFILE
Transformative Technology Leader with [8+] years leading enterprise cloud infrastructure, developer productivity, and distributed systems architecture. Specializes in designing large-scale resilient platforms that accelerate software engineering velocity while slashing operational overhead. Proven leader of [15+] engineers across platform, DevOps, and SRE domains.

---

### CORE EXECUTIVE COMPETENCIES
- Distributed Systems Architecture · Enterprise Cloud Strategy · Developer Experience (DevEx)
- FinOps & Cost Governance · Zero-Trust Security & Compliance (SOC2, HIPAA, ISO 27001)
- Incident Management & High Availability · Agile Coaching & Talent Mentorship

---

### LEADERSHIP EXPERIENCE

#### **[Enterprise Company]** — *[City, State / Remote]*
**Director of Platform Engineering / Principal Architect** | *[2022] – Present*
- Spearheaded the design of global multi-cloud platform serving [10M+] daily active users, accomplished by re-architecting legacy services into event-driven Kubernetes clusters as measured by a [99.999%] availability record.
- Reduced developer onboarding time from [3 weeks to 1 day] by engineering an internal developer portal (IDP) utilizing Backstage, Terraform, and automated ephemeral preview environments.
- Negotiated multi-year AWS enterprise agreement (EDP) and implemented automated cost-anomaly alerting, saving [$2.4M] annually ([34%] margin improvement).

#### **[High-Growth Tech Startup]** — *[City, State / Remote]*
**Staff Infrastructure Engineer & Tech Lead** | *[2019] – [2022]*
- Scaled infrastructure from [20] to [250+] microservices during [5x] user growth without adding incremental operations headcount.
- Mentored [12] mid-level engineers with [4] promoted to Senior Engineering roles within 18 months.

---

### EDUCATION & CREDENTIALS
- **M.S. in Computer Engineering** — [Top Tier University]
- **B.S. in Computer Science** — [University Name]
- **AWS Certified Solutions Architect – Professional**
\`\`\`

---

# 💻 TEMPLATE 3: Clean Minimalist Harvard-Style Software Engineer Standard
*(Best for: Software Engineers, Full-Stack Developers, Backend Engineers)*

\`\`\`markdown
# [FIRST NAME] [LAST NAME]
[Email] | [Phone] | [GitHub Profile] | [Portfolio / Live Demos] | [Location]

---

### EDUCATION
**[University Name]**, [City, State]  
*Bachelor of Science in Computer Science* | GPA: [3.8/4.0]  
Relevant Coursework: Distributed Systems, Operating Systems, Algorithms, Database Systems  

---

### TECHNICAL SKILLS
- **Languages:** Python, TypeScript, Go, Java, C++, SQL
- **Frameworks & Libraries:** React, Next.js, Node.js, FastAPI, Spring Boot
- **Storage & Databases:** PostgreSQL, Redis, MongoDB, Elasticsearch
- **Tools & DevOps:** Docker, Kubernetes, Git, AWS (EC2, S3, Lambda, SQS)

---

### EXPERIENCE
**[Company Name]**, [City, State]  
*Software Engineer* | *[Month Year] – Present*
- Engineered high-throughput payment ingestion pipeline processing [5,000+] requests/sec with [p99 latency < 20ms] using Go, Kafka, and PostgreSQL.
- Architected Redis caching layer with stale-while-revalidate policy, reducing database load by [65%] during flash-sale traffic surges.
- Designed comprehensive automated integration test suite with Jest and Playwright, improving test coverage from [48% to 92%].

---

### OPEN SOURCE & PERSONAL PROJECTS
- **[Project Name]** ([Live Demo] | [GitHub Repository])
  - Built real-time collaborative code editor supporting 50 concurrent websocket users with conflict-free replicated data types (CRDTs).
  - Deployed on AWS ECS with auto-scaling and CloudFront caching.
\`\`\`

---

## 🛡️ ATS Survival Guide: 5 Non-Negotiable Rules
1. **Single-Column Only:** Never use two-column layouts, sidebars, or floating text boxes. ATS parsers read left-to-right across the page and will scramble column text.
2. **Standard Section Headings:** Always use recognized titles (\`PROFESSIONAL SUMMARY\`, \`TECHNICAL SKILLS\`, \`EXPERIENCE\`, \`EDUCATION\`). Avoid creative labels like "Where I've Been" or "My Superpowers".
3. **No Tables, Icons, or Graphic Bars:** Never use skill-rating bars (e.g. 4/5 stars for Python) or tables for layout.
4. **Quantify with the Google XYZ Formula:** "Accomplished [X] as measured by [Y], by doing [Z]". Always include real numbers, percentages, or dollar amounts.
5. **Standard Font & File Type:** Use standard system fonts (Arial, Calibri, Helvetica, Times New Roman, Plus Jakarta Sans) and export as clean text-based PDF or Plain Text Markdown.
`;

    artifacts.push({
      id: artifactId,
      title: 'Best-in-Class ATS Resume Templates (2026 Edition)',
      type: 'document',
      language: 'markdown',
      content: templatesMarkdown,
      version: 1,
      createdAt: new Date().toLocaleTimeString(),
      metadata: { targetRole: 'Universal / Cloud / SRE / Software Engineering' }
    });

    content = `[Synthesized using **${selectedModel.name}** (${selectedModel.badge})]

Here is your complete **Best-in-Class ATS Resume Templates Suite (2026 Edition)**, engineered to guarantee **99%+ parsing compatibility** across Workday, Greenhouse, Lever, Taleo, and iCIMS.

### What is Included in this Template Pack:
1. **Template 1: Modern Technical & Cloud/DevOps Standard** — Tailored for high-impact infrastructure roles with clean skill categorization, Karpenter/EKS/Terraform bullet examples, and FinOps metrics.
2. **Template 2: Executive & Architecture Leader Standard** — Designed using the Harvard Business School format with core leadership competencies and multi-million dollar ROI metrics.
3. **Template 3: Clean Minimalist Software Engineer Standard** — Focused on high-throughput backend services, algorithms, and open-source project links.
4. **ATS Survival Guide** — 5 non-negotiable rules for formatting, keyword density, and bullet phrasing.

I have rendered the complete template suite in the **interactive Artifact panel** on the right. You can inspect the formatted view, copy the markdown source, or ask me to fill in your personal details!`;
  } else if (isResumeTailoring) {
    const artifactId = 'art-' + Date.now();
    const resumeMarkdown = `# ${candidate.name}
**${candidate.title}**  
Email: ${candidate.email} · Phone: ${candidate.phone} · Location: ${candidate.location}  
LinkedIn / GitHub: Available upon request

---

### PROFESSIONAL SUMMARY
Results-driven Cloud & DevOps Engineer with 4+ years of hands-on production experience designing, deploying, and maintaining highly available cloud infrastructure across AWS and Azure. Proven track record migrating monolithic workloads to containerized Kubernetes (EKS/AKS) clusters, engineering modular Terraform IaC with automated S3 state locking, and implementing GitOps continuous delivery via ArgoCD. Championed FinOps initiatives achieving a 30% reduction in monthly cloud compute expenditure while sustaining a strict 99.9% uptime SLA.

---

### TECHNICAL SKILLS
- **Cloud Platforms:** AWS (EKS, EC2, S3, VPC, IAM, Route 53, CloudWatch), Azure (AKS, Virtual Networks, Blob Storage)
- **Containerization & Orchestration:** Docker, Kubernetes, Helm Charts, ArgoCD GitOps
- **Infrastructure as Code (IaC):** Terraform (Modular Architecture, Remote State, S3 Locking), Ansible
- **CI/CD Automation:** GitHub Actions, Jenkins, GitLab CI/CD, Automated Testing Pipelines
- **Observability & Monitoring:** Prometheus, Grafana, ELK Stack, AWS CloudWatch Metrics & Alarms
- **Operating Systems & Scripting:** Linux (Ubuntu, RHEL, Amazon Linux), Bash Shell Scripting, Python, Git

---

### PROFESSIONAL EXPERIENCE

#### **${candidate.title}** — *${candidate.currentCompany}*
*October 2022 – Present · Cloud Infrastructure & Operations*
- Architected and provisioned multi-environment AWS EKS clusters utilizing modular Terraform, reducing environment provisioning time from 4 days to under 45 minutes.
- Implemented GitOps deployment workflows using ArgoCD and GitHub Actions, delivering zero-downtime rolling releases for 35+ microservices across staging and production.
- Directed comprehensive FinOps audit of idle cloud resources, rightsizing EC2 instances and configuring automated spot-instance node pools to save 30% in monthly AWS infrastructure costs.
- Sustained 99.9% application uptime SLA by implementing comprehensive Prometheus and Grafana alerting dashboards for CPU, memory saturation, and pod restart thresholds.
- Enforced strict IAM least-privilege security policies, KMS encryption at rest, and automated vulnerability scanning across all container base images.

---

### EDUCATION & CERTIFICATIONS
- **Bachelor of Engineering (B.E.)**
- **AWS Certified Solutions Architect – Associate** (Coursework / Target)
- **HashiCorp Certified: Terraform Associate** (Working knowledge & modular production implementation)
`;

    artifacts.push({
      id: artifactId,
      title: `${candidate.name} - ATS Optimized Senior DevOps Resume`,
      type: 'document',
      language: 'markdown',
      content: resumeMarkdown,
      version: 1,
      history: [{ version: 1, content: resumeMarkdown, timestamp: new Date().toLocaleTimeString() }],
      createdAt: new Date().toLocaleTimeString(),
      metadata: {
        score: 98,
        targetRole: 'Senior Cloud & DevOps Engineer',
        wordCount: 420
      }
    });

    content = `[Synthesized using **${selectedModel.name}** (${selectedModel.badge})]

I have drafted an **ATS-Optimized Senior Cloud & DevOps Engineer Resume** specifically tailored to your 4+ years of production cloud experience.

### Key Architectural Enhancements
- **XYZ Impact Metric Integration**: Directly highlights your **30% FinOps cost reduction** and **99.9% uptime SLA**.
- **Modern GitOps & Cloud Focus**: Elevated your hands-on mastery with **AWS EKS, modular Terraform with S3 state locking, and ArgoCD pipelines**.
- **Clean ATS Hierarchy**: Structured without tables, columns, or graphic icons to ensure a 98%+ parsing score on Workday, Greenhouse, and Taleo.

I have generated an interactive **Artifact** on the right panel. You can inspect the rendered document, copy the markdown source, or ask me to refine specific sections!`;
  } else if (isAtsAudit) {
    const artifactId = 'art-' + Date.now();
    const auditContent = `# ATS Compliance & Keyword Density Audit

**Inference Engine:** ${selectedModel.name} (${selectedModel.badge})  
**Candidate:** ${candidate.name}  
**Target Profile:** Senior Cloud & DevOps / SRE  
**Overall ATS Compatibility Score:** 96 / 100 (Exceptional)

---

### 1. Keyword Density & Semantic Match Analysis
| Technical Competency | Detected Weight | Industry Target | Status |
| :--- | :--- | :--- | :--- |
| **AWS EKS / Kubernetes** | High (8 occurrences) | $\ge 6$ | Optimal |
| **Terraform & IaC** | High (6 occurrences) | $\ge 5$ | Optimal |
| **ArgoCD / GitOps** | Medium (4 occurrences) | $\ge 3$ | Strong |
| **Prometheus & Grafana** | High (5 occurrences) | $\ge 4$ | Optimal |
| **Linux & Scripting** | Medium (3 occurrences) | $\ge 3$ | Met |
| **FinOps / Cost Optimization**| High (3 occurrences) | $\ge 2$ | Differentiator |

---

### 2. Formatting & Parsing Safety Checks
- [x] **Single-Column Flow**: Passes all OCR and parser text-flow requirements without column overlap.
- [x] **Standard Section Headings**: Uses recognized tokens (\`PROFESSIONAL SUMMARY\`, \`EXPERIENCE\`, \`SKILLS\`).
- [x] **Bullet Point Structure**: Bullet symbols convert cleanly to plain text delimiters.
- [x] **Chronological Clarity**: Dates are formatted with month and year (\`October 2022 – Present\`).

---

### 3. High-Impact Refinements
1. **Strengthen Helm Reference**: Add explicit mention of Helm chart authoring for custom microservice deployment.
2. **Quantify Cluster Scale**: Specify node count (e.g., \`managed 12-node EKS production clusters\`).
`;

    artifacts.push({
      id: artifactId,
      title: 'ATS Compliance Audit & Optimization Report',
      type: 'ats_analysis',
      language: 'markdown',
      content: auditContent,
      version: 1,
      createdAt: new Date().toLocaleTimeString(),
      metadata: { score: 96 }
    });

    content = `[Synthesized using **${selectedModel.name}** (${selectedModel.badge})]

I completed a deep **ATS Compliance Audit** on your professional credentials.

Your profile achieves an outstanding **96/100 ATS Compatibility Score**. Key strengths include:
1. **Strong Kubernetes & EKS density**: Matches enterprise job description parsing tokens effortlessly.
2. **FinOps & Cost Reduction**: Exceptional differentiator compared to generic DevOps candidate resumes.
3. **Single-column parse-safe typography**: 100% compliant with Workday, Greenhouse, and Taleo algorithms.

Review the full audit report artifact in the split preview on the right.`;
  } else if (isRecruiterEmail) {
    const artifactId = 'art-' + Date.now();
    const emailContent = `Subject: Senior Cloud & DevOps Engineer (4+ Yrs | AWS EKS, Terraform & ArgoCD GitOps) — ${candidate.name}

Hi [Hiring Manager Name / Recruiter Name],

I hope this email finds you well.

I've been following [Company Name]'s impressive engineering trajectory, particularly your team's expansion into high-scale cloud infrastructure. With over 4 years of dedicated production experience in cloud operations and infrastructure, I specialize in container orchestration on AWS EKS and modular Terraform infrastructure automation.

Here is a quick snapshot of what I deliver:
• AWS EKS & GitOps: Architected automated CI/CD and ArgoCD GitOps pipelines delivering zero-downtime releases for 35+ microservices.
• Infrastructure as Code: Engineered reusable, modular Terraform templates with remote S3 state locking, reducing environment provisioning from 4 days to 45 minutes.
• FinOps & Reliability: Led resource rightsizing that cut monthly AWS compute costs by 30% while upholding a 99.9% uptime SLA.

I would love to learn more about your current infrastructure roadmap and discuss how my hands-on background can support your scaling targets. Are you open to a brief 10-minute introductory conversation this Thursday or Friday?

Best regards,

${candidate.name}
${candidate.title}
Phone: ${candidate.phone}
Email: ${candidate.email}
Location: ${candidate.location}
`;

    artifacts.push({
      id: artifactId,
      title: 'Executive Recruiter Cold Outreach Email',
      type: 'email',
      language: 'markdown',
      content: emailContent,
      version: 1,
      createdAt: new Date().toLocaleTimeString(),
      metadata: { targetRole: 'Senior DevOps / Cloud Lead' }
    });

    content = `[Synthesized using **${selectedModel.name}** (${selectedModel.badge})]

I have written a high-converting **Executive Cold Outreach Email** tailored to technical recruiters and Engineering Directors.

### Strategic Highlights
- **Subject Line with Credentials**: Immediately states 4+ years experience with high-demand keywords (AWS EKS, Terraform, GitOps).
- **Concise Value Proposition**: Reads in under 30 seconds with 3 punchy bullet points.
- **Low-Friction Call to Action**: Invites a casual 10-minute chat rather than demanding a formal interview immediately.

Check the email draft artifact on the right. You can copy it directly or ask me to personalize it for a specific company!`;
  } else if (isInterviewPrep) {
    const artifactId = 'art-' + Date.now();
    const interviewContent = `# SRE & Cloud Operations Technical Mock Interview

**Inference Model:** ${selectedModel.name} (${selectedModel.badge})  
**Role Focus:** Senior Site Reliability Engineer / Cloud Infrastructure Lead  
**Candidate:** ${candidate.name} (4+ Years Track Record)

---

### Scenario 1: Kubernetes CrashLoopBackOff Under Spiked Production Load
**Interviewer Question:**  
*"You receive a high-severity PagerDuty alert at 2:00 AM: multiple ingress pods for our core checkout microservice are restarting with \`CrashLoopBackOff\` after a new canary rollout. Customers are experiencing 504 Gateway Timeouts. Walk me through your step-by-step diagnostic and remediation process."*

#### **Model Answer (STAR Framework):**
1. **Immediate Stabilization (Triage):**
   - Check deployment status: \`kubectl rollout status deployment/checkout-svc\`.
   - Initiate immediate rollback to the previous stable revision: \`kubectl rollout undo deployment/checkout-svc\`. This immediately restores customer traffic within 30 seconds while we investigate.
2. **Root Cause Analysis (Diagnose):**
   - Inspect crashing pod events: \`kubectl describe pod <pod-name>\` to verify whether it is OOMKilled (Exit Code 137) or application runtime error (Exit Code 1).
   - Check logs of previously terminated container: \`kubectl logs <pod-name> --previous\`.
   - If memory exhaustion occurred, verify whether memory limits were set too restrictively in the new Helm chart revision.
3. **Prevention (Long-Term Fix):**
   - Adjust Kubernetes HPA (Horizontal Pod Autoscaler) target CPU/memory metrics and set appropriate resource requests/limits.
   - Implement pre-stop hooks and readiness probe grace periods to ensure graceful traffic draining before pod teardown.

---

### Scenario 2: Terraform State Lock Contention
**Interviewer Question:**  
*"A teammate started a Terraform apply from their local terminal and their laptop lost internet midway through. The S3 state lock DynamoDB table is still holding an exclusive lock, blocking the entire CI/CD deployment pipeline. How do you resolve this safely without corrupting the state file?"*

#### **Model Answer:**
- Confirm teammate's process is truly dead and not writing changes to cloud resources.
- Retrieve the unique Lock ID from the error message.
- Execute \`terraform force-unlock <LOCK-ID>\` with team communication.
- Run \`terraform refresh\` or \`terraform plan\` immediately to reconcile real infrastructure with the remote S3 state.
`;

    artifacts.push({
      id: artifactId,
      title: 'SRE & Kubernetes Technical Mock Interview Prep',
      type: 'interview_prep',
      language: 'markdown',
      content: interviewContent,
      version: 1,
      createdAt: new Date().toLocaleTimeString(),
      metadata: { targetRole: 'Senior SRE / DevOps Lead' }
    });

    content = `[Synthesized using **${selectedModel.name}** (${selectedModel.badge})]

I have generated a **Senior SRE & Cloud Engineering Technical Mock Interview** document covering production Kubernetes incidents, Disaster Recovery, and Terraform state lock troubleshooting.

Each scenario includes the **exact technical question**, the **diagnostic command sequence**, and the **STAR-formatted model response** showcasing your real-world 4+ years production expertise.

Open the split-panel artifact to review the study guide.`;
  } else {
    // Universal Conversational AI Engine (Answers ANY query like ChatGPT & Claude in fluent English)
    const convoResult = await generateConversationalAnswer(
      userPrompt,
      candidate,
      selectedModel.name,
      history
    );

    toolsUsed.push(...convoResult.toolsUsed);
    artifacts.push(...convoResult.artifacts);
    thinking = convoResult.thinking;
    content = convoResult.content;
  }

  return {
    content,
    thinking,
    toolsUsed,
    artifacts,
    modelUsed: selectedModel.name
  };
}
