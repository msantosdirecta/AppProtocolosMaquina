/**
 * Base de Dados Consolidada de Soluções de Conectividade Industrial (20 Soluções, 15 Critérios)
 * Avaliação Técnica para O Plataforma Studio (SKA)
 */

const CRITERIA_DEFINITIONS = [
  // Comerciais & Custo
  { id: 'cost', name: 'Custo & Licença Free', weight: 5, category: 'Comercial', icon: '💰', desc: 'Pontuação alta para soluções Gratuitas / Open Source' },
  { id: 'mat', name: 'Maturidade de Mercado', weight: 5, category: 'Comercial', icon: '🏛️', desc: 'Histórico de adoção industrial, governança e estabilidade em produção' },
  
  // Cobertura Fabril
  { id: 'cnc', name: 'Cobertura CNC', weight: 5, category: 'Fabril', icon: '⚙️', desc: 'Suporte nativo a comandos Fanuc FOCAS, Siemens Sinumerik, Heidenhain, Haas, etc.' },
  { id: 'plc', name: 'Cobertura PLC', weight: 5, category: 'Fabril', icon: '🔌', desc: 'Suporte amplo a controladores (Siemens S7, Allen-Bradley EtherNet/IP, Modbus, Omron)' },
  { id: 'wireless', name: 'Sensores Sem Fio & IO-Link', weight: 5, category: 'Fabril', icon: '📡', desc: 'Suporte a sensores de vibração/temp (LoRaWAN, BLE, IO-Link, Câmeras)' },

  // Arquitetura & Desempenho
  { id: 'sf', name: 'Resiliência (Store & Forward)', weight: 5, category: 'Arquitetura', icon: '🛡️', desc: 'Buffering local em memória/disco durante quedas de rede para prevenção de perda de dados' },
  { id: 'light', name: 'Leveza / Baixo Footprint', weight: 5, category: 'Arquitetura', icon: '⚡', desc: 'Baixo consumo de CPU/RAM em ambiente Edge (Dæmons C/Go vs Java SCADA Heavy)' },
  { id: 'standards', name: 'Padrões Abertos (UNS)', weight: 5, category: 'Arquitetura', icon: '🌐', desc: 'Aderência total a OPC UA, MQTT, Sparkplug B, REST JSON e ISA-95 (Unified Namespace)' },

  // Operacional & Controle
  { id: 'ease', name: 'Facilidade de Implantação', weight: 5, category: 'Operacional', icon: '🚀', desc: 'Baixa complexidade de instalação, configuração rápida (.conf, wizards, Docker)' },
  { id: 'fleet', name: 'Gestão de Frota (Fleet Mgr)', weight: 5, category: 'Operacional', icon: '📡', desc: 'Gerenciamento centralizado remoto de múltiplos gateways e atualização OTA' },
  { id: 'discovery', name: 'Autodescoberta (Tag Browsing)', weight: 5, category: 'Operacional', icon: '🔎', desc: 'Varredura automática da rede para importação de tags sem digitação manual' },
  { id: 'writeback', name: 'Escrita Bi-direcional (Write)', weight: 5, category: 'Operacional', icon: '✍️', desc: 'Capacidade de enviar comandos/setpoints e receitas de volta para PLCs/CNCs' },

  // DevOps & Inteligência
  { id: 'ext', name: 'Extensibilidade / Protocolos', weight: 5, category: 'DevOps', icon: '🧩', desc: 'Facilidade de inclusão de novos drivers por SDK (C, Go, Python, JS, MSpec)' },
  { id: 'sec', name: 'Segurança Enterprise', weight: 5, category: 'Segurança', icon: '🔒', desc: 'Suporte a TLS 1.3, mTLS, certificados X.509, Vault/Kong, OAuth2, RBAC' },
  { id: 'analytics', name: 'Edge Analytics & Lógica Local', weight: 5, category: 'DevOps', icon: '🧠', desc: 'Cálculo de OEE local, agregadores, filtragem e regras antes de enviar à nuvem' }
];

const PRESETS = [
  {
    id: 'balanced',
    name: '⚖️ Padrão Equilibrado',
    desc: 'Todos os critérios com peso intermediário (5)',
    weights: { cost: 5, mat: 5, cnc: 5, plc: 5, wireless: 5, sf: 5, light: 5, standards: 5, ease: 5, fleet: 5, discovery: 5, writeback: 5, ext: 5, sec: 5, analytics: 5 }
  },
  {
    id: 'opensource',
    name: '🆓 Foco em Baixo Custo / Open Source',
    desc: 'Prioriza soluções gratuitas, leves e com padrões abertos',
    weights: { cost: 10, mat: 5, cnc: 3, plc: 6, wireless: 7, sf: 7, light: 9, standards: 10, ease: 8, fleet: 5, discovery: 6, writeback: 6, ext: 8, sec: 7, analytics: 7 }
  },
  {
    id: 'cnc_plc',
    name: '🏭 Foco em Máxima Cobertura CNC & PLC',
    desc: 'Prioriza maior interoperabilidade com máquinas fabris heterogêneas',
    weights: { cost: 2, mat: 9, cnc: 10, plc: 10, wireless: 6, sf: 8, light: 4, standards: 7, ease: 5, fleet: 7, discovery: 9, writeback: 9, ext: 7, sec: 8, analytics: 6 }
  },
  {
    id: 'resilience',
    name: '🛡️ Foco em Resiliência Offline & Frota',
    desc: 'Prioriza integridade total de dados e gestão remota de gateways',
    weights: { cost: 4, mat: 8, cnc: 6, plc: 7, wireless: 5, sf: 10, light: 5, standards: 8, ease: 6, fleet: 10, discovery: 8, writeback: 7, ext: 6, sec: 9, analytics: 7 }
  },
  {
    id: 'edge_light',
    name: '⚡ Foco em Leveza, Edge Analytics & Containers',
    desc: 'Prioriza executáveis ultraleves, lógica no edge e implantação Docker',
    weights: { cost: 7, mat: 6, cnc: 5, plc: 7, wireless: 8, sf: 7, light: 10, standards: 8, ease: 10, fleet: 6, discovery: 6, writeback: 7, ext: 8, sec: 7, analytics: 10 }
  },
  {
    id: 'enterprise_sec',
    name: '🔒 Foco em Segurança Enterprise & Autodescoberta',
    desc: 'Prioriza maturidade de mercado, conformidade TLS/SOC2 e facilidade com Tag Browsing',
    weights: { cost: 2, mat: 10, cnc: 7, plc: 9, wireless: 5, sf: 9, light: 5, standards: 10, ease: 6, fleet: 9, discovery: 10, writeback: 9, ext: 8, sec: 10, analytics: 7 }
  }
];

const SOLUTIONS = [
  {
    id: 'litmus',
    name: 'Litmus Edge',
    vendor: 'Litmus Automation',
    licenseType: 'Commercial',
    licenseText: 'Subscrição Comercial / Nó Edge',
    execType: 'Containers Docker / Edge OS',
    scores: { cost: 3.5, mat: 9.0, cnc: 9.5, plc: 9.8, wireless: 8.5, sf: 9.5, light: 7.5, standards: 9.5, ease: 8.5, fleet: 10.0, discovery: 9.5, writeback: 9.0, ext: 9.0, sec: 9.5, analytics: 9.5 },
    summary: 'Plataforma líder em Edge Data Ops com 250+ drivers nativos, gestão remota via Litmus Manager e motor de Edge Analytics integrado.',
    details: {
      tipoExecucao: 'Containerized Edge OS / Docker com gestão centralizada via Litmus Edge Manager.',
      coberturaCNC: 'Altíssima. Drivers dedicados Fanuc FOCAS, Heidenhain, Siemens Sinumerik, Haas e MTConnect.',
      coberturaPLC: 'Altíssima. 250+ drivers (Siemens S7, Allen-Bradley, Mitsubishi, Omron, ABB, Modbus, OPC UA).',
      licenciamento: 'Comercial por licença de nó edge / subscrição.',
      storeAndForward: 'Nativo em disco local com sincronização automática para Brokers MQTT, Cloud ou Banco SQL.',
      seguranca: 'Enterprise TLS 1.3, OAuth2, RBAC, auditoria SOC2 compliant.',
      maturidade: 'Líder reconhecido em Quadrantes do Gartner para Edge Computing Industrial.',
      extensibilidade: 'Motores de análise low-code, SDKs de conectividade e fluxos de dados extensíveis.',
      esforcoImplantacao: 'Baixo. Interface Web responsiva com assistentes de adição de dispositivos.',
      gestaoFrota: 'Excelente (10/10). Litmus Edge Manager permite orquestração remota, OTA e controle centralizado.',
      autodescoberta: 'Alta. Varredura automática de redes OPC UA e IP para importação simplificada de tags.',
      escritaBiDirecional: 'Nativa com validação de segurança.',
      edgeAnalytics: 'Excelente. Motor de CEP (Complex Event Processing) e regras de KPI OEE locais no edge.',
      compatibilidadeStudio: 'Excelente. Publica tópicos MQTT JSON estruturados prontos para ingestão pelo serviço C# do Plataforma Studio.'
    }
  },
  {
    id: 'kepware',
    name: 'PTC Kepware (KEPServerEX)',
    vendor: 'PTC',
    licenseType: 'Commercial',
    licenseText: 'Pago Perpétuo / Subscrição ($650 - $2.100+)',
    execType: 'Serviço Windows (GUI)',
    scores: { cost: 3.5, mat: 10.0, cnc: 9.5, plc: 9.8, wireless: 6.0, sf: 9.0, light: 6.5, standards: 9.5, ease: 8.5, fleet: 8.0, discovery: 10.0, writeback: 10.0, ext: 9.0, sec: 9.5, analytics: 6.0 },
    summary: 'Padrão-ouro global de conectividade industrial com 150+ drivers, Fanuc FOCAS Suite, Tag Browsing perfeito e escrita bi-direcional.',
    details: {
      tipoExecucao: 'Serviço Windows background de alto desempenho com console GUI de administração.',
      coberturaCNC: 'Altíssima. Driver Fanuc FOCAS dedicado, Siemens Sinumerik, Heidenhain e CNCs legados.',
      coberturaPLC: 'Altíssima. Mais de 150 drivers cobrindo praticamente todos os PLCs do mercado global.',
      licenciamento: 'Comercial perpétuo por driver ou suíte + módulo IoT Gateway.',
      storeAndForward: 'Nativo através do plugin DataLogger e conectores de armazenamento bufferizado.',
      seguranca: 'Enterprise TLS 1.3, mTLS, autenticação por usuário, IP filtering e auditoria.',
      maturidade: 'Altíssima. Líder global absoluto desde 1995.',
      extensibilidade: 'Plataforma de drivers com arquitetura aberta (Open Driver Architecture) e APIs REST.',
      esforcoImplantacao: 'Baixo. Assistentes visuais intuitivos e importação/exportação de tags via CSV.',
      gestaoFrota: 'Alta via Kepware+ Central Management.',
      autodescoberta: 'Máxima (10/10). Varredura de tags em PLCs Siemens, Rockwell e OPC UA.',
      escritaBiDirecional: 'Máxima (10/10). Referência em controle bi-direcional seguro.',
      edgeAnalytics: 'Média (requer plugins externos como Advanced Tags).',
      compatibilidadeStudio: 'Excelente via módulo IoT Gateway MQTT (JSON) ou Cliente OPC UA C# .NET.'
    }
  },
  {
    id: 'telit',
    name: 'Telit deviceWISE',
    vendor: 'Telit C-Matrix',
    licenseType: 'Commercial',
    licenseText: 'Licenciamento Comercial por Gateway',
    execType: 'Gateway Edge Executável / OS',
    scores: { cost: 3.0, mat: 9.8, cnc: 9.5, plc: 9.8, wireless: 7.5, sf: 9.5, light: 7.0, standards: 9.5, ease: 8.0, fleet: 9.5, discovery: 9.0, writeback: 9.5, ext: 8.5, sec: 9.5, analytics: 9.0 },
    summary: 'Plataforma IIoT no-code com 400+ drivers industriais, triggers de lógica local, gestão de frota e resiliência a falhas de rede.',
    details: {
      tipoExecucao: 'Runtime executável em gateways industriais Windows/Linux gerido via deviceWISE Workbench.',
      coberturaCNC: 'Altíssima. Drivers específicos Fanuc FOCAS, Siemens Sinumerik e Mitsubishi Melsec.',
      coberturaPLC: 'Altíssima. 400+ drivers industriais no-code (Rockwell, Siemens S7, Omron, Schneider, Modbus).',
      licenciamento: 'Comercial por gateway / empresa.',
      storeAndForward: 'Nativo e automático. Fila de transações local durante quedas de comunicação.',
      seguranca: 'Enterprise SSL/TLS, criptografia AES-256, controle de acesso refinado.',
      maturidade: 'Altíssima. Mais de 20 anos de uso em automação automotiva e manufatura pesada.',
      extensibilidade: 'Geração de lógica por triggers visuais, extensão via C/C++ e conectores customizados.',
      esforcoImplantacao: 'Baixo. Ferramenta gráfica Workbench sem necessidade de código.',
      gestaoFrota: 'Altíssima via deviceWISE Enterprise Manager.',
      autodescoberta: 'Alta para PLCs Rockwell, Siemens e Modbus.',
      escritaBiDirecional: 'Altíssima via triggers de eventos.',
      edgeAnalytics: 'Alta. Motor de lógica por eventos (Triggers) executado diretamente no nó.',
      compatibilidadeStudio: 'Excelente. Suporte a exportação nativa MQTT, HTTP REST e WebSockets.'
    }
  },
  {
    id: 'crosser',
    name: 'Crosser Edge Data Engine',
    vendor: 'Crosser',
    licenseType: 'Commercial',
    licenseText: 'Comercial (Subscrição por Nó)',
    execType: 'Containers Docker Ultraleves',
    scores: { cost: 4.0, mat: 8.5, cnc: 7.5, plc: 9.0, wireless: 8.0, sf: 9.5, light: 9.0, standards: 9.5, ease: 9.0, fleet: 9.5, discovery: 8.5, writeback: 8.5, ext: 9.0, sec: 9.0, analytics: 10.0 },
    summary: 'Engine de conectividade e Stream Analytics ultraleve (800+ conectores), ideal para cálculo de OEE e regras de alarme diretamente no Edge.',
    details: {
      tipoExecucao: 'Containers Docker ultraleves (<100MB RAM) orquestrados pelo Crosser Control Center.',
      coberturaCNC: 'Alta. Conectores para OPC UA, Modbus TCP, Fanuc e arquivos.',
      coberturaPLC: 'Altíssima. 800+ conectores cobrindo PLCs Siemens, Rockwell, Omron, Beckhoff, Modbus.',
      licenciamento: 'Comercial subscrição por nó.',
      storeAndForward: 'Nativo via módulo de armazenamento e buffer persistente em disco.',
      seguranca: 'Excelente. Criptografia TLS 1.3, gestão de papéis e segurança em nível de fluxo.',
      maturidade: 'Alta. Solução sueca referência em Stream Analytics no Edge.',
      extensibilidade: 'Altíssima. Flow Studio gráfico e integração com Python e Machine Learning.',
      esforcoImplantacao: 'Muito Baixo. Instalação de nós via Docker e criação de fluxos em nuvem.',
      gestaoFrota: 'Altíssima via Crosser Control Center (deploy centralizado de fluxos em massa).',
      autodescoberta: 'Alta para OPC UA e bases industriais.',
      escritaBiDirecional: 'Alta para servidores OPC UA e PLCs.',
      edgeAnalytics: 'Máxima (10/10). Especialista em análise de séries temporais e pré-processamento no Edge.',
      compatibilidadeStudio: 'Total. Envio nativo de eventos padronizados em MQTT JSON para o Plataforma Studio.'
    }
  },
  {
    id: 'edgex',
    name: 'EdgeX Foundry',
    vendor: 'Linux Foundation Edge',
    licenseType: 'Free',
    licenseText: 'Gratuito / Open Source (Apache 2.0)',
    execType: 'Microsserviços Docker (Go/C)',
    scores: { cost: 10.0, mat: 9.0, cnc: 6.0, plc: 8.5, wireless: 9.5, sf: 9.0, light: 7.5, standards: 9.5, ease: 7.0, fleet: 7.5, discovery: 7.5, writeback: 8.0, ext: 9.5, sec: 9.5, analytics: 9.0 },
    summary: 'Arquitetura open source da Linux Foundation com suporte excelente a sensores sem fio/IO-Link, Edge Analytics com eKuiper e Vault/Kong.',
    details: {
      tipoExecucao: 'Containers Docker organizados em microsserviços (Device Services, Core Services, Export Services).',
      coberturaCNC: 'Média. Suporte através de Device Services para OPC UA, Modbus TCP e conectores REST/gRPC.',
      coberturaPLC: 'Alta. Device Services prontos para OPC UA, Modbus, BACnet, Bluetooth, GPIO e REST.',
      licenciamento: '100% Gratuito e Open Source sob licença Apache 2.0.',
      storeAndForward: 'Nativo. Camada de exportação integrada a Redis / NATS com persistência em disco.',
      seguranca: 'Enterprise. Vault para gestão de segredos e Kong API Gateway com autenticação JWT/mTLS.',
      maturidade: 'Altíssima. Mantido pelo ecossistema Linux Foundation Edge e gigantes industriais (Dell, HP, Intel).',
      extensibilidade: 'Altíssima. Device SDKs oficiais em Go e C para adição rápida de novos protocolos.',
      esforcoImplantacao: 'Médio. Requer orquestração por Docker Compose ou Kubernetes no Edge.',
      gestaoFrota: 'Média (via orquestradores como Portainer/K3s).',
      autodescoberta: 'Média (via estatísticas de perfil de dispositivo).',
      escritaBiDirecional: 'Alta via comandos do Core Command Service.',
      edgeAnalytics: 'Altíssima (integrado ao motor de regras eKuiper para SQL em tempo real).',
      compatibilidadeStudio: 'Nativa. Exporta eventos padronizados em JSON via MQTT para o broker do Plataforma Studio.'
    }
  },
  {
    id: 'neuron',
    name: 'EMQX Neuron',
    vendor: 'EMQ Technologies',
    licenseType: 'Dual',
    licenseText: 'Dual (Free LGPL v3 / NeuronEX Comercial)',
    execType: 'Dæmon C / Container Docker',
    scores: { cost: 8.0, mat: 8.5, cnc: 8.0, plc: 9.5, wireless: 7.0, sf: 8.5, light: 10.0, standards: 9.5, ease: 9.5, fleet: 8.0, discovery: 7.5, writeback: 8.5, ext: 8.5, sec: 9.0, analytics: 9.0 },
    summary: 'Servidor de conectividade industrial ultraleve escrito em C (<10MB RAM), com motor NeuronEX para análise e processamento no Edge.',
    details: {
      tipoExecucao: 'Dæmon nativo escrito em C pura ou container Docker ultraleve.',
      coberturaCNC: 'Alta. Módulos para Fanuc FOCAS, Siemens Sinumerik e OPC UA.',
      coberturaPLC: 'Altíssima. 30+ drivers industriais (Siemens S7, Modbus TCP/RTU, EtherNet/IP, Mitsubishi, Omron).',
      licenciamento: 'Open Source (LGPL v3) para núcleo de conectividade + versão comercial NeuronEX com Edge Analytics.',
      storeAndForward: 'Nativo na versão NeuronEX (armazenamento em buffer sqlite/memória).',
      seguranca: 'Excelente. Suporte nativo a TLS 1.3, autenticação de clientes e criptografia mTLS.',
      maturidade: 'Alta. Desenvolvido pela EMQ (criadores do EMQX, maior broker MQTT open source do mundo).',
      extensibilidade: 'Alta. SDK oficial em C para desenvolvimento de novos drivers de protocolo.',
      esforcoImplantacao: 'Muito Baixo. Interface Web embutida responsiva para adição rápida de tags.',
      gestaoFrota: 'Alta via EMQX ECP (Enterprise Control Panel).',
      autodescoberta: 'Média (browsing básico de tags).',
      escritaBiDirecional: 'Alta via comandos MQTT.',
      edgeAnalytics: 'Altíssima na edição NeuronEX (motor eKuiper embutido).',
      compatibilidadeStudio: 'Total. Integração perfeita com arquitetura baseada em broker MQTT JSON.'
    }
  },
  {
    id: 'highbyte',
    name: 'HighByte Intelligence Hub',
    vendor: 'HighByte',
    licenseType: 'Commercial',
    licenseText: 'Comercial (Subscrição por Instância)',
    execType: 'Serviço Java / Docker / Edge OS',
    scores: { cost: 4.0, mat: 8.5, cnc: 6.5, plc: 8.5, wireless: 7.0, sf: 9.0, light: 8.5, standards: 10.0, ease: 9.0, fleet: 8.5, discovery: 8.5, writeback: 7.5, ext: 9.0, sec: 9.5, analytics: 8.5 },
    summary: 'Plataforma líder em Industrial DataOps e Unified Namespace (UNS), com modelagem no-code de dados fabris e transformação de pipelines.',
    details: {
      tipoExecucao: 'Executável Java/Docker de footprint leve (~300MB RAM) administrado via Web UI.',
      coberturaCNC: 'Média. Conexão via OPC UA Client, Modbus, MTConnect ou arquivos.',
      coberturaPLC: 'Alta. 40+ conectores nativos (OPC UA, Modbus TCP, MQTT Sparkplug B, SQL, REST).',
      licenciamento: 'Comercial subscrição por nó/instância.',
      storeAndForward: 'Nativo em disco local com garantia de entrega para destinos Cloud/MQTT.',
      seguranca: 'Enterprise. TLS 1.3, mTLS, suporte a gestão de papéis (RBAC) e auditoria.',
      maturidade: 'Alta. Pioneira e referência global no conceito de Industrial DataOps para UNS.',
      extensibilidade: 'Altíssima. Pipeline visual de transformação de dados e conectores customizáveis via REST.',
      esforcoImplantacao: 'Muito Baixo. Interface Web totalmente no-code orientada a objetos de dados.',
      gestaoFrota: 'Alta via HighByte Intelligence Hub Management API.',
      autodescoberta: 'Alta para nós OPC UA.',
      escritaBiDirecional: 'Média (foco principal em ingestão e DataOps).',
      edgeAnalytics: 'Alta (modelagem, normalização e cálculo de campos derivados).',
      compatibilidadeStudio: 'Excepcional. Modelagem direta em JSON/MQTT Sparkplug B perfeitamente aderente ao Plataforma Studio.'
    }
  },
  {
    id: 'cognite',
    name: 'Cognite Extractors',
    vendor: 'Cognite',
    licenseType: 'Commercial',
    licenseText: 'Comercial Enterprise',
    execType: 'Dæmons Executáveis / Containers Cloud-Connected',
    scores: { cost: 2.5, mat: 9.0, cnc: 6.5, plc: 9.0, wireless: 8.0, sf: 9.5, light: 7.5, standards: 10.0, ease: 7.5, fleet: 9.5, discovery: 9.0, writeback: 6.0, ext: 9.0, sec: 10.0, analytics: 9.5 },
    summary: 'Suíte de extratores da gigante de DataOps Cognite (OPC UA, PI System, SQL), focada em Gêmeos Digitais (Digital Twins) e análise industrial.',
    details: {
      tipoExecucao: 'Dæmons locais e conectores em containers integrados ao Cognite Data Fusion (CDF).',
      coberturaCNC: 'Média. Extração via agregadores OPC UA e conectores industriais.',
      coberturaPLC: 'Alta. Extratores dedicados para OPC UA, Modbus, OSISoft PI e sistemas SCADA.',
      licenciamento: 'Comercial Enterprise por volume de dados/instância.',
      storeAndForward: 'Nativo (Failure Buffering) em caso de desconexão com a nuvem.',
      seguranca: 'Máxima (10/10). Leitura estritamente segura (Read-only), mTLS, OAuth2 e ISO 27001.',
      maturidade: 'Alta. Referência global em inteligência de dados industriais e AI para manufatura.',
      extensibilidade: 'Altíssima. Extratores abertos em Python SDK e REST APIs.',
      esforcoImplantacao: 'Médio. Requer mapeamento do grafo de conhecimento da fábrica.',
      gestaoFrota: 'Altíssima via plataforma Cognite Data Fusion.',
      autodescoberta: 'Altíssima para árvores de ativos e namespaces OPC UA.',
      escritaBiDirecional: 'Baixa (arquitetura focada em ingestão segura read-only).',
      edgeAnalytics: 'Altíssima (contextualização e grafos de relacionamento).',
      compatibilidadeStudio: 'Alta via APIs REST / MQTT / gRPC.'
    }
  },
  {
    id: 'advantech',
    name: 'Advantech WebAccess/CNC',
    vendor: 'Advantech',
    licenseType: 'Commercial',
    licenseText: 'Comercial por Licença Hardware/Software',
    execType: 'Serviço Windows / IoT Edge Gateway',
    scores: { cost: 4.5, mat: 9.5, cnc: 9.5, plc: 7.5, wireless: 7.0, sf: 8.0, light: 7.5, standards: 8.5, ease: 8.5, fleet: 8.0, discovery: 8.0, writeback: 8.0, ext: 7.5, sec: 8.5, analytics: 8.0 },
    summary: 'Solução especialista da gigante taiwanêsa Advantech com suporte nativo aos principais CNCs do mercado (Fanuc, Mitsubishi, Heidenhain, Siemens).',
    details: {
      tipoExecucao: 'Software de monitoramento executável em gateways e PCs industriais Advantech.',
      coberturaCNC: 'Altíssima. Conectividade direta com Fanuc, Mitsubishi Melsec, Heidenhain, Siemens Sinumerik.',
      coberturaPLC: 'Média/Alta. Suporte a Modbus TCP, OPC UA e PLCs comuns.',
      licenciamento: 'Comercial vinculado a software/hardware Advantech.',
      storeAndForward: 'Nativo para prevenção de perda de dados em falta de conexão.',
      seguranca: 'Excelente em redes industriais privadas.',
      maturidade: 'Altíssima. Advantech é líder global em hardware e computadores industriais.',
      extensibilidade: 'Média. Foco em conectores CNC proprietários da marca.',
      esforcoImplantacao: 'Baixo. Software otimizado para a linha de produtos Advantech UNO/TPC.',
      gestaoFrota: 'Alta via Advantech WISE-PaaS.',
      autodescoberta: 'Alta para comandos CNC suportados.',
      escritaBiDirecional: 'Alta para envio de programas e setpoints.',
      edgeAnalytics: 'Alta para cálculo de OEE e disponibilidade de máquina.',
      compatibilidadeStudio: 'Boa via exportação MQTT / OPC UA.'
    }
  },
  {
    id: 'aveva',
    name: 'AVEVA TOP Server / Communication Drivers',
    vendor: 'AVEVA (Schneider Electric)',
    licenseType: 'Commercial',
    licenseText: 'Comercial Perpétuo / Subscrição',
    execType: 'Serviço Windows (GUI)',
    scores: { cost: 3.0, mat: 10.0, cnc: 8.5, plc: 9.8, wireless: 6.5, sf: 9.0, light: 6.5, standards: 9.5, ease: 8.0, fleet: 8.0, discovery: 9.5, writeback: 10.0, ext: 8.5, sec: 9.5, analytics: 6.5 },
    summary: 'Suíte enterprise da AVEVA/Schneider Electric (baseada em Kepware/Software Toolbox) para integração contínua de grandes plantas fabris.',
    details: {
      tipoExecucao: 'Serviços de comunicação de alta estabilidade para Windows Server.',
      coberturaCNC: 'Alta. Módulos Fanuc FOCAS, Sinumerik e OPC UA.',
      coberturaPLC: 'Altíssima. Cobertura completa de PLCs (Siemens, Rockwell, Schneider, Modbus, Omron).',
      licenciamento: 'Comercial enterprise por servidor.',
      storeAndForward: 'Nativo com conectores de buffer local e gravação de emergência.',
      seguranca: 'Enterprise TLS, gestão de privilégios de acesso e integridade de dados.',
      maturidade: 'Altíssima (10/10). Padrão da indústria de grandes manufaturas e óleo & gás.',
      extensibilidade: 'Alta. Suporte a especificações OPC UA/Classic e drivers customizados.',
      esforcoImplantacao: 'Baixo. Utilitários visuais estabelecidos no mercado.',
      gestaoFrota: 'Alta via ferramentas de administração AVEVA System Platform.',
      autodescoberta: 'Altíssima para variáveis industriais.',
      escritaBiDirecional: 'Máxima (10/10) com suporte completo a controle de processo.',
      edgeAnalytics: 'Média (foco em comunicação de dados brutos e alarmes).',
      compatibilidadeStudio: 'Excelente via cliente OPC UA ou ponte MQTT.'
    }
  },
  {
    id: 'cybus',
    name: 'Cybus Connectware',
    vendor: 'Cybus GmbH',
    licenseType: 'Commercial',
    licenseText: 'Comercial / Freemium em Docker',
    execType: 'Containers Docker (Linux)',
    scores: { cost: 5.0, mat: 8.5, cnc: 8.5, plc: 9.0, wireless: 7.0, sf: 9.0, light: 7.5, standards: 9.5, ease: 8.5, fleet: 9.0, discovery: 8.0, writeback: 8.5, ext: 9.0, sec: 9.5, analytics: 8.0 },
    summary: 'Agente DevOps industrial alemão em Docker para fábrica conectada, com resiliência CybusMQ e integração Fanuc FOCAS / OPC UA.',
    details: {
      tipoExecucao: 'Conjunto de containers Docker orquestrados para implantação em servidores fabris Linux.',
      coberturaCNC: 'Alta. Suporte nativo a Fanuc FOCAS e servidores OPC UA de CNCs Sinumerik/Heidenhain.',
      coberturaPLC: 'Alta. Drivers para Siemens S7, Modbus, Beckhoff TwinCAT, OPC UA Client/Server.',
      licenciamento: 'Comercial subscrição + opção Freemium para avaliação.',
      storeAndForward: 'Nativo via barramento interno CybusMQ com persistência em Docker Volumes.',
      seguranca: 'Enterprise. Isolamento por containers, TLS 1.3, gestão de papéis e políticas de dados refinadas.',
      maturidade: 'Alta. Solução de referência da Indústria 4.0 alemã.',
      extensibilidade: 'Altíssima. Arquivos declarativos YAML (Service Commissioning) e SDK em Node/Python.',
      esforcoImplantacao: 'Baixo. Implantação declarativa por infraestrutura como código (IaC YAML).',
      gestaoFrota: 'Altíssima via Cybus Management Console.',
      autodescoberta: 'Alta para endpoints configurados.',
      escritaBiDirecional: 'Alta via mapeamento de rotas bi-direcionais.',
      edgeAnalytics: 'Alta via regras de roteamento e transformação em JS/YAML.',
      compatibilidadeStudio: 'Total. Roteamento nativo MQTT JSON para serviços de nuvem/on-premise.'
    }
  },
  {
    id: 'ignition',
    name: 'Ignition OPC UA',
    vendor: 'Inductive Automation',
    licenseType: 'Commercial',
    licenseText: 'Pago Perpétuo por Servidor / Tags Ilimitadas',
    execType: 'Plataforma Web SCADA / Java',
    scores: { cost: 3.5, mat: 9.8, cnc: 8.0, plc: 9.5, wireless: 7.5, sf: 9.5, light: 4.5, standards: 9.5, ease: 8.0, fleet: 8.5, discovery: 9.5, writeback: 10.0, ext: 9.0, sec: 9.5, analytics: 8.5 },
    summary: 'Plataforma industrial ilimitada de tags com módulo OPC UA robusto, Store & Forward Enterprise e forte ecossistema de módulos.',
    details: {
      tipoExecucao: 'Aplicação Web Java completa (Gateway) executável em Windows, Linux e macOS.',
      coberturaCNC: 'Alta. Suporte a CNCs via OPC UA Client, Modbus e conectores de parceiros.',
      coberturaPLC: 'Altíssima. Drivers nativos para Siemens S7, Allen-Bradley, Modbus, Omron e OPC UA.',
      licenciamento: 'Comercial por servidor (licenciamento por tags ilimitadas).',
      storeAndForward: 'Nativo Enterprise com armazenamento em banco de dados local durante falhas.',
      seguranca: 'Enterprise. Autenticação RBAC, X.509, mTLS, suporte a auditoria avançada.',
      maturidade: 'Altíssima. Plataforma referência mundial em SCADA/IIoT modernizado.',
      extensibilidade: 'Altíssima. SDK oficial de módulos Java e script em Python (Jython) interno.',
      esforcoImplantacao: 'Baixo. Console Web centralizado e ambiente de desenvolvimento Designer.',
      gestaoFrota: 'Alta via Ignition Enterprise Administration Module (EAM).',
      autodescoberta: 'Altíssima (OPC UA Tag Browser integrado).',
      escritaBiDirecional: 'Máxima (10/10) com suporte a receitas e controle de equipamentos.',
      edgeAnalytics: 'Alta através de scripts Jython e módulos de cálculo.',
      compatibilidadeStudio: 'Excelente. Publicação via módulo MQTT Transmission (Sparkplug B / JSON).'
    }
  },
  {
    id: 'telegraf',
    name: 'Telegraf (InfluxData)',
    vendor: 'InfluxData',
    licenseType: 'Free',
    licenseText: 'Gratuito / Open Source (MIT License)',
    execType: 'Dæmon Executável Go / Docker',
    scores: { cost: 10.0, mat: 9.5, cnc: 6.0, plc: 8.5, wireless: 8.0, sf: 9.0, light: 9.5, standards: 9.5, ease: 9.5, fleet: 6.5, discovery: 6.5, writeback: 5.0, ext: 9.5, sec: 9.0, analytics: 7.5 },
    summary: 'Agente ultraleve em Go (<40MB RAM) com 400+ plugins, resiliência de memória/disco e baixíssimo consumo para dados de séries temporais.',
    details: {
      tipoExecucao: 'Dæmon executável binário único em Go ou container Docker.',
      coberturaCNC: 'Média. Suporte via plugins OPC UA, Modbus TCP e leitores de arquivos/processos.',
      coberturaPLC: 'Alta. Plugins nativos para OPC UA, Modbus, Siemens S7 e protocolos de rede.',
      licenciamento: '100% Gratuito e Open Source sob licença MIT.',
      storeAndForward: 'Nativo. Buffer configurável em memória e estouro para disco em caso de falha no destino.',
      seguranca: 'Excelente. Suporte nativo a TLS 1.3, autenticação por token e mTLS.',
      maturidade: 'Altíssima. Agente principal do ecossistema InfluxDB utilizado globalmente.',
      extensibilidade: 'Altíssima. Comunidade ativa com mais de 400 plugins de entrada/saída em Go.',
      esforcoImplantacao: 'Muito Baixo. Arquivo de configuração único `telegraf.conf` sem dependências.',
      gestaoFrota: 'Média (requer orquestração de arquivos .conf via Ansible/GitOps).',
      autodescoberta: 'Média (configuração estática de nós).',
      escritaBiDirecional: 'Baixa (foco principal em coleta e telemetria de séries temporais).',
      edgeAnalytics: 'Média (plugins de agregadores e min/max/avg no buffer).',
      compatibilidadeStudio: 'Excelente. Saída nativa para MQTT Broker em JSON customizável.'
    }
  },
  {
    id: 'nodered',
    name: 'Node-RED com Nós Industriais',
    vendor: 'JS Foundation / Open Source',
    licenseType: 'Free',
    licenseText: 'Gratuito / Open Source (Apache 2.0)',
    execType: 'Motor Flow Node.js / Docker',
    scores: { cost: 10.0, mat: 9.0, cnc: 5.5, plc: 8.0, wireless: 9.0, sf: 7.0, light: 8.0, standards: 9.0, ease: 9.5, fleet: 6.0, discovery: 7.0, writeback: 8.5, ext: 10.0, sec: 8.0, analytics: 9.0 },
    summary: 'Motor visual de programação orientada a fluxos com mais de 4.000 nós da comunidade, ideal para prototipagem e integração rápida.',
    details: {
      tipoExecucao: 'Aplicação Node.js com ambiente gráfico web de arrastar-e-soltar fluxos.',
      coberturaCNC: 'Média. Integração via nós comunitários `node-red-contrib-opcua` e scripts JavaScript.',
      coberturaPLC: 'Alta. Nós para Modbus TCP, OPC UA, Siemens S7 e Ethernet/IP.',
      licenciamento: '100% Gratuito e Open Source sob licença Apache 2.0 da JS Foundation.',
      storeAndForward: 'Parcial/Construível. Requer uso de nós de buffer/local storage ou SQLite.',
      seguranca: 'Boa. Suporte a HTTPS, autenticação básica e TLS nos conectores.',
      maturidade: 'Altíssima. Criado pela IBM e mantido pela OpenJS Foundation com uso massivo em IoT.',
      extensibilidade: 'Máxima (10/10). Extensão direta via código JavaScript e publicação de nós npm.',
      esforcoImplantacao: 'Muito Baixo. Instalação simples via `npm` ou container Docker oficial.',
      gestaoFrota: 'Média (via FlowFuse / DevOps Git).',
      autodescoberta: 'Média (depende do nó utilizado).',
      escritaBiDirecional: 'Alta via nós de saída de comando.',
      edgeAnalytics: 'Altíssima (funções JS completas para transformação de payloads).',
      compatibilidadeStudio: 'Nativa. Nós nativos de MQTT, HTTP REST e WebSockets em JSON.'
    }
  },
  {
    id: 'datafeed',
    name: 'Softing dataFEED OPC Suite',
    vendor: 'Softing Industrial',
    licenseType: 'Commercial',
    licenseText: 'Pago (€1.560 a €2.350)',
    execType: 'Serviço Windows (GUI)',
    scores: { cost: 4.0, mat: 9.8, cnc: 8.5, plc: 9.5, wireless: 6.0, sf: 9.0, light: 6.5, standards: 9.0, ease: 8.0, fleet: 7.5, discovery: 9.0, writeback: 9.0, ext: 8.0, sec: 9.0, analytics: 6.0 },
    summary: 'Suíte tradicional de comunicação industrial com suporte Fanuc/Sinumerik, ponte OPC UA/Classic e Store & Forward na versão Extended.',
    details: {
      tipoExecucao: 'Serviço Windows com utilitário GUI de configuração visual.',
      coberturaCNC: 'Alta. Módulos de comunicação para Fanuc FOCAS e Siemens Sinumerik 840D.',
      coberturaPLC: 'Altíssima. Siemens S7, Rockwell EtherNet/IP, Modbus TCP e B&R.',
      licenciamento: 'Comercial perpétuo (licença Base ou Extended).',
      storeAndForward: 'Nativo na edição Extended para prevenção de perda de dados.',
      seguranca: 'Excelente. Suporte a especificações de segurança OPC UA (X.509/TLS).',
      maturidade: 'Altíssima. Softing atua no mercado de conectividade desde 1979.',
      extensibilidade: 'Alta. Arquitetura modular com suporte a gateways de banco de dados e MQTT.',
      esforcoImplantacao: 'Baixo. Instalador padrão Windows com interface amigável.',
      gestaoFrota: 'Média via ferramentas administrativas locais.',
      autodescoberta: 'Alta para PLCs Siemens e servidores OPC UA.',
      escritaBiDirecional: 'Alta para comandos de automação.',
      edgeAnalytics: 'Média (foco em roteamento de dados e gateways).',
      compatibilidadeStudio: 'Boa via conector MQTT/OPC UA para ingestão no serviço C# do Plataforma Studio.'
    }
  },
  {
    id: 'matrikon',
    name: 'Matrikon OPC UA Suite',
    vendor: 'Honeywell Matrikon',
    licenseType: 'Commercial',
    licenseText: 'Licença Comercial Honeywell',
    execType: 'Serviço Windows / Dæmon Linux',
    scores: { cost: 3.5, mat: 10.0, cnc: 6.0, plc: 9.0, wireless: 6.0, sf: 9.0, light: 7.0, standards: 10.0, ease: 7.5, fleet: 8.0, discovery: 9.5, writeback: 9.0, ext: 8.5, sec: 9.5, analytics: 6.5 },
    summary: 'Suíte referência mundial em interoperabilidade OPC UA, com túneis seguros contra quedas de rede e padrões rígidos de cibersegurança.',
    details: {
      tipoExecucao: 'Serviços de fundo executáveis em Windows e Linux.',
      coberturaCNC: 'Média. Foco principal em servidores OPC UA e pontes industriais.',
      coberturaPLC: 'Alta. Conectividade universal OPC UA para PLCs Honeywell, Siemens, Rockwell e Modbus.',
      licenciamento: 'Comercial por produto/servidor.',
      storeAndForward: 'Nativo com tecnologia Matrikon OPC UA Tunneller Buffer.',
      seguranca: 'Enterprise. Rígidos padrões de segurança cibernética industrial da Honeywell.',
      maturidade: 'Altíssima. Pioneiros mundiais no desenvolvimento das especificações OPC.',
      extensibilidade: 'Alta. Desenvolvimento baseado no Matrikon Flex OPC UA SDK.',
      esforcoImplantacao: 'Médio. Utilitários de configuração com autenticação avançada de certificados.',
      gestaoFrota: 'Alta via gerenciador Matrikon Flex.',
      autodescoberta: 'Altíssima para árvores de espaço de endereçamento OPC UA.',
      escritaBiDirecional: 'Alta para servidores de processo.',
      edgeAnalytics: 'Média (foco em tunelamento seguro e gateway).',
      compatibilidadeStudio: 'Excepcional para comunicação OPC UA nativa C# .NET.'
    }
  },
  {
    id: 'cncnet',
    name: 'Inventcom CNCnetPDM',
    vendor: 'Inventcom',
    licenseType: 'Commercial',
    licenseText: 'Pago ($724 / máquina ou $7k servidor)',
    execType: 'Serviço Windows (sem UI)',
    scores: { cost: 3.0, mat: 9.5, cnc: 9.8, plc: 6.0, wireless: 5.0, sf: 5.5, light: 8.5, standards: 7.5, ease: 8.5, fleet: 7.0, discovery: 8.0, writeback: 7.5, ext: 8.0, sec: 8.5, analytics: 6.0 },
    summary: 'Solução ultraespecializada em CNCs com suporte inigualável a Fanuc, Sinumerik, Heidenhain, Mitsubishi, Haas e Okuma.',
    details: {
      tipoExecucao: 'Serviço Windows em segundo plano sem interface gráfica pesada (configurado via arquivos .ini).',
      coberturaCNC: 'Altíssima (Líder em CNCs). Fanuc FOCAS I/II, Sinumerik, Heidenhain, Mitsubishi, Haas, Okuma.',
      coberturaPLC: 'Média. Suporte a Modbus, Siemens S7 e OPC.',
      licenciamento: 'Comercial perpétuo por máquina monitorada.',
      storeAndForward: 'Parcial. Gravação de logs de buffer locais em arquivos texto.',
      seguranca: 'Excelente em ambiente On-Premise (suporte a redes dedicadas de máquinas).',
      maturidade: 'Altíssima. Foco exclusivo em monitoramento de CNCs desde 1999.',
      extensibilidade: 'Alta. Driver Development Kit em C/C++ para criação de conectores proprietários.',
      esforcoImplantacao: 'Baixo. Instalação leve via Windows Service sem dependências pesadas.',
      gestaoFrota: 'Média (gerenciável via arquivos de configuração centralizados).',
      autodescoberta: 'Alta para comandos CNC específicos.',
      escritaBiDirecional: 'Média/Alta para envio de programas CNC.',
      edgeAnalytics: 'Média (extração direta de status de máquina).',
      compatibilidadeStudio: 'Boa. Envio de dados via chamadas de API, arquivos de saída ou conectores customizáveis.'
    }
  },
  {
    id: 'kunbus',
    name: 'Kunbus Revolution PI Modbridge',
    vendor: 'KUNBUS GmbH',
    licenseType: 'Dual',
    licenseText: 'Dual / Software para Hardware Aberto',
    execType: 'Dæmons C/Python em Linux Industrial',
    scores: { cost: 7.5, mat: 8.5, cnc: 6.0, plc: 8.5, wireless: 8.5, sf: 8.0, light: 9.0, standards: 9.0, ease: 8.0, fleet: 7.5, discovery: 7.0, writeback: 8.0, ext: 9.5, sec: 8.5, analytics: 8.5 },
    summary: 'Solução alemã para computadores industriais abertos (RevPi), combinando conectividade de barramento de campo a módulos de E/S física.',
    details: {
      tipoExecucao: 'Dæmons executáveis em Linux Industrial de alta resistência física.',
      coberturaCNC: 'Média. Conectividade via gateway OPC UA e leitores Modbus/EtherNet/IP.',
      coberturaPLC: 'Alta. Suporte a Profinet, EtherNet/IP, Modbus RTU/TCP, S7.',
      licenciamento: 'Dual / Open Software para hardware Kunbus.',
      storeAndForward: 'Nativo via buffer local em sistema de arquivos Linux.',
      seguranca: 'Excelente. Segurança de sistema operacional Linux industrial com criptografia SSL/TLS.',
      maturidade: 'Alta. Muito utilizado na automação de fábricas europeias.',
      extensibilidade: 'Altíssima. Código aberto em Python/C e suporte a pacotes Linux.',
      esforcoImplantacao: 'Baixo. Implantação rápida em gateways industriais DIN rail.',
      gestaoFrota: 'Média (via orquestradores de borda Linux).',
      autodescoberta: 'Média para módulos de E/S Kunbus.',
      escritaBiDirecional: 'Alta para saídas físicas de E/S e PLCs.',
      edgeAnalytics: 'Alta através de scripts Python e serviços de borda.',
      compatibilidadeStudio: 'Excelente. Publicação nativa em MQTT JSON.'
    }
  },
  {
    id: 'thingsboard',
    name: 'ThingsBoard IoT Gateway',
    vendor: 'ThingsBoard Inc.',
    licenseType: 'Free',
    licenseText: 'Gratuito / Open Source (Apache 2.0)',
    execType: 'Serviço Python / Docker',
    scores: { cost: 10.0, mat: 8.5, cnc: 3.5, plc: 8.0, wireless: 8.0, sf: 8.5, light: 7.5, standards: 9.0, ease: 9.0, fleet: 7.0, discovery: 6.5, writeback: 7.5, ext: 9.0, sec: 8.5, analytics: 7.5 },
    summary: 'Agente gateway em Python com conectores para OPC UA, Modbus, CAN, BACnet e mecanismo Event Storage para buffer offline.',
    details: {
      tipoExecucao: 'Serviço executável em Python 3 ou container Docker.',
      coberturaCNC: 'Baixa. Suporte genérico via conector OPC UA Client e leitores Modbus.',
      coberturaPLC: 'Alta. Conectores nativos para Modbus TCP/RTU, OPC UA, BACnet, CAN Bus e REST.',
      licenciamento: '100% Gratuito e Open Source sob licença Apache 2.0.',
      storeAndForward: 'Nativo. Mecanismo `Event Storage` em disco local para retenção durante desconexões.',
      seguranca: 'Excelente. TLS 1.3, autenticação por token/certificados X.509.',
      maturidade: 'Alta. Mantido pela ThingsBoard Inc. com grande comunidade open source.',
      extensibilidade: 'Altíssima. Criação simples de conectores customizados em linguagem Python.',
      esforcoImplantacao: 'Muito Baixo. Arquivo de configuração `tb_gateway.yaml` com mapeamento direto.',
      gestaoFrota: 'Média via ThingsBoard Server Central.',
      autodescoberta: 'Média para dispositivos CAN/Modbus.',
      escritaBiDirecional: 'Alta via RPC (Remote Procedure Calls).',
      edgeAnalytics: 'Média (conversores de dados em Python).',
      compatibilidadeStudio: 'Excelente. Comunicação nativa em MQTT JSON.'
    }
  },
  {
    id: 'plc4x',
    name: 'Apache PLC4X',
    vendor: 'Apache Software Foundation',
    licenseType: 'Free',
    licenseText: 'Gratuito / Open Source (Apache 2.0)',
    execType: 'Biblioteca / Container Java/Go',
    scores: { cost: 10.0, mat: 8.5, cnc: 3.0, plc: 8.5, wireless: 5.0, sf: 4.0, light: 7.5, standards: 9.0, ease: 6.0, fleet: 5.0, discovery: 5.5, writeback: 8.0, ext: 9.5, sec: 8.5, analytics: 5.5 },
    summary: 'Conjunto unificado de bibliotecas de drivers abertos mantido pela Apache Foundation, focado em eliminação de royalties industriais.',
    details: {
      tipoExecucao: 'Biblioteca integrada em aplicações Java/Go ou executável como daemon containerizado.',
      coberturaCNC: 'Baixa. Requer wrappers customizados ou intermediação via OPC UA.',
      coberturaPLC: 'Alta. Implementação limpa de drivers Siemens ISO-on-TCP (S7), Modbus, EtherNet/IP, BACnet.',
      licenciamento: '100% Gratuito e Open Source sob licença Apache 2.0.',
      storeAndForward: 'Requer integração externa com filas de mensagem (RabbitMQ, MQTT local).',
      seguranca: 'Excelente quando empacotado com comunicação TLS/OPC UA.',
      maturidade: 'Alta. Projeto Top-Level oficial da Apache Software Foundation.',
      extensibilidade: 'Altíssima. Compilador de protocolos MSpec para geração automática de drivers de novos protocolos.',
      esforcoImplantacao: 'Médio. Requer desenvolvimento/configuração de container Java ou Go.',
      gestaoFrota: 'Baixa (depende do empacotamento da aplicação).',
      autodescoberta: 'Média (suporte nativo em desenvolvimento).',
      escritaBiDirecional: 'Alta (suporte nativo a escrita em S7 e Modbus).',
      edgeAnalytics: 'Baixa (foco exclusivo em biblioteca de protocolo puro).',
      compatibilidadeStudio: 'Alta. Exposição de métricas via MQTT JSON ou gRPC para o ecossistema C# .NET.'
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CRITERIA_DEFINITIONS, PRESETS, SOLUTIONS };
}
