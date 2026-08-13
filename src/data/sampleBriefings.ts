import { BriefingData } from '../types';

export const SAMPLE_BRIEFINGS: BriefingData[] = [
  {
    id: 'sample-1',
    createdAt: new Date().toISOString(),
    companyName: 'Acme Health Tech',
    stakeholderName: 'Sarah Chen',
    stakeholderTitle: 'VP of Procurement & Operations',
    isFavorite: true,
    companySnapshot: {
      industry: 'Healthcare SaaS / Enterprise Software',
      companySize: '1,200+ employees',
      hqLocation: 'Boston, MA',
      fundingOrRevenue: 'Series D ($120M raised) / ~$85M ARR',
      recentNews: [
        'Expanded regional healthcare network across 14 midwest hospital groups in Q2.',
        'Announced new HIPAA-compliant cloud data architecture initiative for 2026.',
        'Recently appointed new CIO with a strong mandate for vendor consolidation.'
      ],
      whyItMattersNow: 'Acme is undergoing a massive vendor consolidation drive following their Series D expansion; legacy software tools are being audited for efficiency and security compliance.'
    },
    stakeholderProfile: {
      name: 'Sarah Chen',
      title: 'VP of Procurement & Operations',
      roleOverview: 'Leads strategic vendor selection, contract negotiations, and cross-department operational efficiency across software & infrastructure.',
      topKPIs: [
        'Vendor cost reduction (target 15% YoY savings)',
        'SLA compliance & security audit speed',
        'Implementation time-to-value across regional teams'
      ],
      communicationStyle: 'Direct, data-driven, and ROI-focused. Appreciates bullet points, concrete metrics, and clear implementation timelines over high-level pitches.',
      perceivedPainPoints: [
        'Current software stack has redundant point solutions creating security auditing overhead.',
        'Long onboarding cycles slowing down regional clinic launches.'
      ],
      recentPublicActivity: [
        'Keynote panelist at HealthTech Summit 2025: "Streamlining Procurement in Regulated Environments."',
        'LinkedIn post highlighting team expansion and need for agile vendor partnerships.'
      ]
    },
    talkingPoints: [
      {
        topic: 'Vendor Consolidation & Overhead Reduction',
        opener: 'Sarah, congrats on the recent regional expansion. I noticed your team is driving a platform unification push — how are your current vendors supporting that rollout?',
        strategicContext: 'Aligns directly with her mandate to reduce point-solution complexity and lower security audit overhead.'
      },
      {
        topic: 'Implementation Speed in Regulated Clinics',
        opener: 'In your HealthTech Summit talk, you mentioned the friction in new clinic onboarding. We helped a similar healthcare network cut vendor deployment time by 40%.',
        strategicContext: 'Demonstrates deep industry familiarity and directly answers her public pain point.'
      },
      {
        topic: 'HIPAA & Compliance Automation',
        opener: 'Given Acme’s 2026 cloud security roadmap, how is procurement evaluating compliance automation in new software evaluations?',
        strategicContext: 'Positions our solution as a forward-compatible fit for their CIO’s security goals.'
      }
    ],
    objectionRadar: [
      {
        objection: 'We already have an incumbent vendor (LegacyMed) locked into a 3-year contract.',
        riskLevel: 'High',
        responseAngle: 'Acknowledge the contract, but position us as a high-ROI overlay or pilot for new expansion clinics, eliminating full migration risk while proving value.'
      },
      {
        objection: 'Our procurement cycle takes 6+ months for security review.',
        riskLevel: 'Medium',
        responseAngle: 'Highlight our pre-built SOC2 Type II, HIPAA compliance packages and rapid 14-day security fast-track documentation.'
      },
      {
        objection: 'Budget for Q3 is already locked.',
        riskLevel: 'Medium',
        responseAngle: 'Offer flexible deferred billing terms aligned with their Q4 budget cycle or start with a low-friction operational trial.'
      }
    ],
    competitiveContext: {
      keyCompetitors: ['LegacyMed Enterprise', 'HealthStack Global', 'PointRx Solutions'],
      incumbentAdvantage: 'Deep integration into legacy regional databases and established relationships with facility managers.',
      ourDifferentiators: [
        '3x faster deployment speed without requiring custom database overhaul',
        'Unified administrative analytics board providing real-time SLA metrics',
        'Transparent seat pricing model with 0 hidden maintenance fees'
      ],
      trapQuestionsToAsk: [
        'How much time does your team currently spend manually auditing vendor compliance certificates every quarter?',
        'When onboarding new regional clinics, what is the biggest bottleneck between contract signing and go-live?'
      ]
    },
    discoveryQuestions: [
      'What are the primary criteria your CIO and procurement committee will use to evaluate new platform tools this year?',
      'If you could fix one bottleneck in your current vendor stack today, what would it be?',
      'Who else on your team will be involved in validating compliance and deployment timeline?'
    ]
  },
  {
    id: 'sample-2',
    createdAt: new Date().toISOString(),
    companyName: 'DataPulse Systems',
    stakeholderName: 'Marcus Vance',
    stakeholderTitle: 'Head of Growth Engineering',
    isFavorite: false,
    companySnapshot: {
      industry: 'Developer Tools & Data Infrastructure',
      companySize: '350 employees',
      hqLocation: 'San Francisco, CA',
      fundingOrRevenue: 'Series B ($45M raised) / ~$28M ARR',
      recentNews: [
        'Launched real-time streaming connector for enterprise data warehouses.',
        'Hired 25 new engineers in past quarter to accelerate AI pipeline features.',
        'Experiencing high customer demand for low-latency streaming analytics.'
      ],
      whyItMattersNow: 'Rapid engineering scale-up creates urgent need for unified monitoring and automated workflow tools.'
    },
    stakeholderProfile: {
      name: 'Marcus Vance',
      title: 'Head of Growth Engineering',
      roleOverview: 'Leads developer experience, growth infrastructure, and pipeline scalability for enterprise clients.',
      topKPIs: [
        'API pipeline uptime & query latency (<50ms)',
        'Engineering velocity & pull request cycle time',
        'Trial-to-paid conversion rate for dev tier'
      ],
      communicationStyle: 'Technical, pragmatic, and metric-obsessed. Prefers code examples, architecture diagrams, and benchmark data over marketing decks.',
      perceivedPainPoints: [
        'Engineering team spends too much time on custom internal glue code.',
        'Data latency spikes during peak traffic hours impacting trial experience.'
      ],
      recentPublicActivity: [
        'Author of popular blog post: "Scaling Real-Time Pipelines to 10M Events/Sec."',
        'Active contributor to open-source data streaming repositories.'
      ]
    },
    talkingPoints: [
      {
        topic: 'Real-Time Pipeline Optimization',
        opener: 'Marcus, loved your post on scaling streaming pipelines. How is your team handling latency bottlenecks as transaction volume grows?',
        strategicContext: 'Establishes technical credibility and taps into his engineering passion.'
      },
      {
        topic: 'Developer Experience & Glue Code Elimination',
        opener: 'We notice growth eng teams often waste 20% of sprint time maintaining custom API integrations. Is that a friction point for DataPulse right now?',
        strategicContext: 'Highlights engineering efficiency gains that Marcus cares about.'
      }
    ],
    objectionRadar: [
      {
        objection: 'We prefer building internal tools tailored to our custom schema.',
        riskLevel: 'High',
        responseAngle: 'Emphasize our extensible SDK and open architecture that lets engineering build custom plugins without maintaining core pipeline infra.'
      },
      {
        objection: 'Is the pricing predictable as our throughput scales 10x?',
        riskLevel: 'Medium',
        responseAngle: 'Share our flat-tier architecture model engineered specifically for high-throughput data teams.'
      }
    ],
    competitiveContext: {
      keyCompetitors: ['Confluent', 'Datadog Engine', 'Segment Protocols'],
      incumbentAdvantage: 'Market familiarity among data engineering leads.',
      ourDifferentiators: [
        'Zero-overhead setup with native TypeScript & Python SDKs',
        'Sub-10ms processing latency overhead',
        '50% lower total cost of ownership at scale'
      ],
      trapQuestionsToAsk: [
        'How many engineer-hours were spent last quarter building and maintaining internal connector maintenance?'
      ]
    },
    discoveryQuestions: [
      'What is your target SLA for sub-50ms streaming queries over the next 12 months?',
      'How does your team evaluate build vs. buy decisions when scaling developer infrastructure?'
    ]
  }
];
