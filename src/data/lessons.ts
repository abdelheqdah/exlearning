import type { Lesson } from '../types'

const lesson = (data: Omit<Lesson, 'moduleOrder'> & { moduleOrder: number }): Lesson => data

export const lessons: Lesson[] = [
  lesson({ moduleOrder: 1, id: 'ex-orientation', title: 'Ex learning orientation', level: 'Beginner', category: 'Foundations', briefDescription: 'Understand the scope of Ex learning and the boundaries of this independent simulator.', estimatedMinutes: 10, objectives: ['Explain explosive atmosphere and ignition-source basics.', 'Recognise when competent escalation is needed.', 'Distinguish learning support from certification and conformity assessment.'], prerequisites: [], sections: [{ heading: 'A practical learning scope', body: 'Ex work brings together area information, equipment selection, installation quality, inspection, maintenance, and competent decisions. This course uses original explanations to support learning; it does not authorise work.' }, { heading: 'Important boundaries', body: 'ExLearn is not a Recognised Training Provider (RTP), not an IECEx Certification Body (ExCB), and does not issue a Certificate of Personnel Competence (CoPC). Completing this app does not certify a person, product, installation, or organisation.' }], keyTakeaways: ['Learning content is not a certificate.', 'Stop and seek competent advice when evidence is incomplete or safety-critical.', 'Use current standards, procedures, and manufacturer instructions for real work.'], relatedTopics: ['CoPC, RTP, and ExCB'] }),
  lesson({ moduleOrder: 2, id: 'ex001-foundations', title: 'EX001: Ex fundamentals', level: 'Beginner', category: 'Foundations', briefDescription: 'Build a practical vocabulary for explosive atmospheres, equipment, and safe decisions.', estimatedMinutes: 12, objectives: ['Describe the relationship between fuel, atmosphere, and ignition.', 'Explain why area, equipment, and lifecycle controls work together.', 'Replace assumptions with evidence.'], prerequisites: ['ex-orientation'], sections: [{ heading: 'Why hazardous areas need a system', body: 'A hazardous area is managed by understanding what can ignite, where an explosive atmosphere may occur, and how equipment is selected and maintained. The goal is controlled risk, not memorising labels in isolation.' }, { heading: 'The three-part safety model', body: 'Effective controls combine area classification, suitable equipment, and disciplined installation, inspection, and maintenance. A gap in any one part can undermine the others.' }], keyTakeaways: ['Risk depends on materials, release conditions, and ventilation.', 'Equipment suitability includes its installation and environment.', 'Uncertainty is a reason to investigate.'], relatedTopics: ['Hazardous areas', 'Responsibilities and competence'] }),
  lesson({ moduleOrder: 3, id: 'atex-iecex-context', title: 'ATEX and IECEx concepts', level: 'Beginner', category: 'Frameworks', briefDescription: 'Compare ATEX and IECEx at a high level without treating either as a shortcut to competence.', estimatedMinutes: 16, objectives: ['Describe ATEX and IECEx context.', 'Separate regulation, product conformity, and personnel competence.', 'Avoid treating a scheme label as proof of installed suitability.'], prerequisites: ['ex001-foundations'], sections: [{ heading: 'Different contexts, related safety goals', body: 'ATEX is commonly discussed in relation to European regulatory requirements for equipment and workplaces. IECEx is an international conformity-assessment system built around IEC standards. Their routes and local implementation must be checked for the situation at hand.' }, { heading: 'What a learning app cannot do', body: 'ExLearn does not determine legal compliance, perform conformity assessment, approve equipment, or certify personnel. It is not an RTP, not an ExCB, and cannot issue CoPC.' }], keyTakeaways: ['Framework names do not replace site evidence.', 'Product certification and personnel competence are different questions.', 'Verify current jurisdictional and scheme requirements.'], relatedTopics: ['CoPC, RTP, and ExCB'] }),
  lesson({
    moduleOrder: 4,
    id: 'hazardous-areas',
    title: 'Hazardous areas and explosive atmospheres',
    level: 'Beginner',
    category: 'Area awareness',
    briefDescription: 'Understand how releases, ventilation, and process conditions determine Zone 0, 1, 2 and Zone 20, 21, 22 classifications.',
    estimatedMinutes: 18,
    objectives: [
      'Define Zone 0, 1, and 2 for gases/vapours and Zone 20, 21, and 22 for combustible dusts.',
      'Explain how release grades and ventilation affect atmosphere persistence.',
      'Treat area classification drawings as evidence-led technical baselines.',
    ],
    prerequisites: ['ex001-foundations'],
    sections: [
      {
        heading: 'How atmospheres form and persist',
        body: 'An explosive atmosphere forms when a flammable gas, vapour, mist, or combustible dust mixes with air within its flammable limits (between the Lower Explosive Limit LEL and Upper Explosive Limit UEL). Source release rate, release frequency, ventilation effectiveness, and environmental conditions dictate whether an atmosphere is continuous, intermittent, or only present during rare abnormalities.',
      },
      {
        heading: 'Gas and dust zone definitions',
        body: 'Standard area classification (IEC 60079-10-1 for gases and IEC 60079-10-2 for dusts) defines zones qualitatively based on the frequency and duration of an explosive atmosphere: \n• Zone 0: Explosive gas atmosphere present continuously, for long periods, or frequently (commonly benchmarked in industry guidance such as EI 15 as > 1,000 hours/year).\n• Zone 1: Explosive gas atmosphere likely to occur in normal operation occasionally (industry guidance benchmark: 10 to 1,000 hours/year).\n• Zone 2: Explosive gas atmosphere not likely to occur in normal operation, and if it occurs, persists for a short period only (industry guidance benchmark: < 10 hours/year, typically < 0.1% of operating time).\n• Zone 20: Explosive dust cloud present continuously, for long periods, or frequently.\n• Zone 21: Explosive dust cloud likely to occur in normal operation occasionally.\n• Zone 22: Explosive dust cloud not likely to occur in normal operation and persists for a short period only.\nNote: Operating hours are informative industry benchmarks rather than rigid statutory boundaries in IEC 60079-10-1.',
      },
      {
        heading: 'Boundaries are evidence, not permanent assumptions',
        body: 'Hazardous area drawings and equipment schedules record technical determinations made for defined operating states. If ventilation fails, piping changes, relief points are altered, or housekeeping degrades, the engineering basis must be formally reviewed and updated before work proceeds.',
      },
    ],
    keyTakeaways: [
      'Gas zones (0, 1, 2) and dust zones (20, 21, 22) classify atmosphere probability and duration.',
      'Release grades (continuous, primary, secondary) and ventilation determine zone boundaries.',
      'Area drawings must be verified against current process conditions; never assume safe area based on appearance.',
    ],
    relatedTopics: ['Gas, vapour, mist, and dust', 'Zones and EPLs'],
  }),
  lesson({
    moduleOrder: 5,
    id: 'gas-vapour-mist-dust',
    title: 'Gas, vapour, mist, and dust hazards',
    level: 'Beginner',
    category: 'Hazards',
    briefDescription: 'Compare gas and dust ignition physics, including Gas Groups IIA, IIB, IIC and Dust Groups IIIA, IIIB, IIIC.',
    estimatedMinutes: 18,
    objectives: [
      'Distinguish Gas Groups IIA, IIB, and IIC by representative gases and Maximum Experimental Safe Gap (MESG).',
      'Distinguish Dust Groups IIIA, IIIB, and IIIC by particle size and electrical conductivity.',
      'Recognise why dust layers and clouds require different temperature and housekeeping controls.',
    ],
    prerequisites: ['hazardous-areas'],
    sections: [
      {
        heading: 'Gas and vapour groups: IIA, IIB, IIC',
        body: 'Surface electrical equipment (Group II) for flammable gases and vapours is subdivided based on ignition energy and flame propagation severity: \n• Group IIA: Representative gas is Propane (MESG > 0.9 mm, Minimum Igniting Current MIC ratio > 0.8). Least easily ignited.\n• Group IIB: Representative gas is Ethylene (MESG 0.5 mm to 0.9 mm, MIC ratio 0.45 to 0.8).\n• Group IIC: Representative gases are Hydrogen and Acetylene (MESG < 0.5 mm, MIC ratio < 0.45). Most easily ignited with very low spark energy required. Equipment certified for Group IIC is permitted in Group IIB and IIA atmospheres.',
      },
      {
        heading: 'Combustible dust groups: IIIA, IIIB, IIIC',
        body: 'Combustible dust equipment (Group III) is subdivided based on material form and electrical resistivity: \n• Group IIIA: Combustible flyings (solid particles larger than 500 µm, such as textile lint or sawdust).\n• Group IIIB: Non-conductive dust (particle size ≤ 500 µm, electrical volume resistivity > 10³ Ω·m, such as grain, flour, sugar, and dry plastics).\n• Group IIIC: Conductive dust (particle size ≤ 500 µm, electrical volume resistivity ≤ 10³ Ω·m, such as coal dust, carbon black, aluminium, and magnesium powders). Conductive dust presents both fire/explosion and internal tracking/short-circuit hazards. Equipment certified IIIC is suitable for IIIB and IIIA.',
      },
      {
        heading: 'Clouds vs. layers: thermal physics',
        body: 'A dust cloud can explode violently if dispersed near an ignition source. Settled dust layers act as thermal insulation, causing equipment to heat up internally, and can smoulder or self-ignite at much lower temperatures than the cloud ignition temperature. Never use compressed air to clean dust; unapproved cleaning can blast settled dust into an explosive cloud.',
      },
    ],
    keyTakeaways: [
      'Gas groups rate ignition difficulty: IIA (Propane), IIB (Ethylene), IIC (Hydrogen/Acetylene).',
      'Dust groups rate particle size and conductivity: IIIA (flyings), IIIB (non-conductive), IIIC (conductive).',
      'Equipment rated for a higher subdivision (IIC, IIIC) covers lower subdivisions in the same group.',
      'Dust layers insulate surfaces and must never be cleared with uncontrolled compressed air.',
    ],
    relatedTopics: ['Zones and EPLs', 'Equipment selection and marking', 'Ex t'],
  }),
  lesson({
    moduleOrder: 6,
    id: 'zones-and-epl',
    title: 'Zones and Equipment Protection Levels',
    level: 'Intermediate',
    category: 'Area and selection',
    briefDescription: 'Relate Zone 0, 1, 2 and 20, 21, 22 to Equipment Protection Levels Ga, Gb, Gc and Da, Db, Dc.',
    estimatedMinutes: 20,
    objectives: [
      'Map Equipment Protection Levels (EPLs) to gas and dust zones according to IEC 60079-0.',
      'Explain the fault-tolerance criteria underpinning Ga/Da, Gb/Db, and Gc/Dc.',
      'Verify that EPL, gas/dust group, and temperature limits agree before accepting equipment.',
    ],
    prerequisites: ['hazardous-areas', 'gas-vapour-mist-dust'],
    sections: [
      {
        heading: 'The Equipment Protection Level (EPL) framework',
        body: 'IEC 60079-0 introduces Equipment Protection Levels (EPLs) to describe equipment ignition-risk capability independently of the specific protection concept used. EPL indicates the level of risk the equipment protects against based on fault tolerance:\n• EPL Ga / Da: "Very high" protection. Safe during normal operation, expected malfunctions, and rare malfunctions (two independent faults). Required for Zone 0 (gas) and Zone 20 (dust).\n• EPL Gb / Db: "High" protection. Safe during normal operation and expected malfunctions (single fault). Required for Zone 1 (gas) and Zone 21 (dust).\n• EPL Gc / Dc: "Enhanced" protection. Safe during normal operation; does not ignite during stated operational conditions. Required for Zone 2 (gas) and Zone 22 (dust).',
      },
      {
        heading: 'Standard zone-to-EPL relationship',
        body: 'The normative selection alignment between zones and minimum EPLs is:\n• Zone 0 -> EPL Ga\n• Zone 1 -> EPL Gb (or Ga)\n• Zone 2 -> EPL Gc (or Gb, Ga)\n• Zone 20 -> EPL Da\n• Zone 21 -> EPL Db (or Da)\n• Zone 22 -> EPL Dc (or Db, Da)\nEquipment with a higher protection level (e.g. Ga) may always be installed in an area requiring a lower protection level (e.g. Zone 1 or 2), provided gas group and temperature class requirements are also satisfied.',
      },
      {
        heading: 'EPL is one component of selection',
        body: 'An EPL alone does not approve equipment. A complete specification requires verifying: (1) EPL matches the zone, (2) Gas/dust group matches the substance (e.g., IIB or IIC), (3) Temperature class or surface temperature is safe against the substance auto-ignition temperature, (4) Ingress Protection (IP) rating is adequate, and (5) Ambient temperature limits and specific conditions of use (X suffix) are satisfied.',
      },
    ],
    keyTakeaways: [
      'EPLs define fault-tolerance: Ga/Da (very high), Gb/Db (high), Gc/Dc (enhanced).',
      'Normative mapping: Zone 0/20 requires Ga/Da; Zone 1/21 requires Gb/Db; Zone 2/22 requires Gc/Dc.',
      'Higher EPL equipment is permitted in lower-risk zones, but group and temperature class must always match.',
      'A zone is not a full specification; verify group, temperature, IP, and certificate conditions.',
    ],
    relatedTopics: ['Equipment selection and marking', 'Protection concepts'],
  }),
  lesson({ moduleOrder: 7, id: 'ex-d-ex-e', title: 'Protection concepts: Ex d and Ex e', level: 'Intermediate', category: 'Protection', briefDescription: 'Learn the intent of flameproof and increased-safety approaches.', estimatedMinutes: 20, objectives: ['Explain the protective intent of Ex d and Ex e.', 'Recognise why entries, fasteners, terminations, and modifications matter.', 'Identify when a defect needs approved repair or escalation.'], prerequisites: ['zones-and-epl'], sections: [{ heading: 'Ex d', body: 'An Ex d design uses a robust enclosure and controlled flamepath concept to contain an internal ignition event and limit transmission to the surrounding atmosphere. Damage, incorrect fasteners, poor entries, or unapproved changes can undermine that design.' }, { heading: 'Ex e', body: 'Ex e designs reduce the likelihood of arcs, sparks, and excessive temperatures through construction and installation controls. Termination quality, clearances, enclosure condition, and component suitability are part of the installed system.' }], keyTakeaways: ['Protection concepts have specific conditions and boundaries.', 'A marking cannot compensate for damaged or altered equipment.', 'Use approved instructions and competent repair routes.'], relatedTopics: ['Installation fundamentals', 'Inspection principles'] }),
  lesson({ moduleOrder: 8, id: 'ex-i-ex-t-ex-p', title: 'Protection concepts: Ex i, Ex t, and Ex p', level: 'Intermediate', category: 'Protection', briefDescription: 'Compare intrinsic safety, dust-protection enclosures, and pressurization.', estimatedMinutes: 22, objectives: ['Explain the safety intent of Ex i, Ex t, and Ex p.', 'Recognise circuit, enclosure, and purge evidence.', 'Avoid applying one concept’s assumptions to another.'], prerequisites: ['zones-and-epl'], sections: [{ heading: 'Ex i', body: 'Intrinsic safety limits electrical and thermal energy so a defined circuit can remain non-incendive under specified conditions. The complete loop, associated apparatus, wiring, and installation constraints matter.' }, { heading: 'Ex t and Ex p', body: 'Ex t uses enclosure and temperature controls for dust hazards. Ex p maintains a protective pressure or purge condition. Seals, monitoring, alarms, leakage, and operating procedures are critical.' }], keyTakeaways: ['Ex i is a circuit-system decision.', 'Ex t depends on enclosure integrity and surface-temperature control.', 'Ex p depends on maintained protective conditions and alarm response.'], relatedTopics: ['Equipment marking', 'Maintenance and repair'] }),
  lesson({
    moduleOrder: 9,
    id: 'equipment-selection-marking',
    title: 'Equipment selection and marking',
    level: 'Intermediate',
    category: 'Equipment',
    briefDescription: 'Decipher complete Ex markings, standard Temperature Classes T1–T6, and dust surface temperatures.',
    estimatedMinutes: 22,
    objectives: [
      'Decode standard Ex nameplate strings including protection concept, group, temperature class, and EPL.',
      'List standard Temperature Classes T1 through T6 and their maximum surface temperature limits.',
      'Explain dust surface temperature limits against cloud and layer auto-ignition temperatures.',
    ],
    prerequisites: ['zones-and-epl', 'ex-d-ex-e', 'ex-i-ex-t-ex-p'],
    sections: [
      {
        heading: 'Standard Temperature Classes: T1 through T6',
        body: 'For explosive gas atmospheres, equipment is assigned a temperature class specifying the maximum operating surface temperature under worst-case rated conditions (IEC 60079-0):\n• T1: Maximum surface temperature ≤ 450°C (suitable for methane, hydrogen with AIT > 450°C)\n• T2: Maximum surface temperature ≤ 300°C (suitable for butane, propane, ethylene)\n• T3: Maximum surface temperature ≤ 200°C (suitable for diesel fuel, kerosene, gasoline)\n• T4: Maximum surface temperature ≤ 135°C (suitable for ethyl ether, acetaldehyde)\n• T5: Maximum surface temperature ≤ 100°C\n• T6: Maximum surface temperature ≤ 85°C (most stringent; required for carbon disulphide AIT ~90°C)\nRule: Equipment surface temperature must never exceed the Auto-Ignition Temperature (AIT) of any gas or vapour that may be present. Equipment rated T6 is safe for T5, T4, T3, T2, and T1 atmospheres.',
      },
      {
        heading: 'Dust surface temperatures and safety margins',
        body: 'For combustible dusts (Group III), temperature is marked directly in degrees Celsius (e.g., Ex tb IIIC T125°C Db). Maximum permitted surface temperature Tmax must satisfy two safety margins: (1) For dust clouds: Tmax ≤ (2/3) * Tcloud (where Tcloud is the minimum cloud ignition temperature), and (2) For dust layers up to 5 mm: Tmax ≤ T5mm - 75°C (where T5mm is the layer ignition temperature). If layers exceed 5 mm, special derating or testing is required.',
      },
      {
        heading: 'Reading the complete marking string and ATEX Directive codes',
        body: 'Ex nameplates combine European ATEX Directive (2014/34/EU) statutory markings with international IEC 60079 technical standards:\n1. ATEX Statutory Marking:\n• "CE" mark: Accompanied by the 4-digit Notified Body ID (e.g., "CE 0518") whenever a Notified Body is involved in the production surveillance phase (e.g. Quality Assurance Notification for Category 1 and 2 equipment; Category 3 equipment under internal control of production Module A carries the CE mark without an NB number).\n• Community hexagon mark "⟨Ex⟩": European explosion-protection emblem.\n• Equipment Group: Group I (underground mining / firedamp) or Group II (surface industrial installations).\n• Equipment Category: Category 1 (Zone 0/20), Category 2 (Zone 1/21), Category 3 (Zone 2/22) followed by "G" (gas/vapour) or "D" (combustible dust), e.g. "II 2 G".\n2. Standard Technical Marking (IEC 60079-0):\n• Protection Concept: e.g., "Ex db" (flameproof), "Ex eb" (increased safety), "Ex ia" (intrinsic safety), "Ex tb" (dust enclosure).\n• Gas/Dust Subdivision: "IIA", "IIB", "IIC" for gas; "IIIA", "IIIB", "IIIC" for dust.\n• Temperature Class or Surface Temp: "T1"–"T6" for gas; direct Celsius limit (e.g., "T125°C") for dust.\n• Equipment Protection Level: "Ga", "Gb", "Gc" (gas) or "Da", "Db", "Dc" (dust).\n• Ambient Temperature Range: Default is -20°C to +40°C. If non-standard, the plate must state the range (e.g., "-40°C ≤ Ta ≤ +60°C").',
      },
      {
        heading: 'Certificate numbers and X / U suffix significance',
        body: 'Certificate numbers follow a standardized structure:\n• ATEX Certificate: e.g., "Sira 19 ATEX 1042X" ([Notified Body] [Year] ATEX [Certificate Number] [Suffix]).\n• IECEx Certificate: e.g., "IECEx BAS 20.0034U" (IECEx [ExCB code] [Year 2-digit].[Serial 4-digit][Suffix]).\nCertificate suffixes carry critical safety meaning:\n• "X" Suffix (Specific Conditions of Use): Indicates mandatory constraints listed in the certificate schedule that must be fulfilled during installation and inspection (e.g., electrostatic cleaning precautions, special cable thermal rating, external fuse sizing, or restricted ambient conditions). Equipment marked "X" cannot be accepted without verifying these conditions in the field.\n• "U" Suffix (Ex Component Certificate): Certifies an incomplete component (e.g., an empty flameproof enclosure, a sight glass, or a certified terminal block). A component with a "U" certificate is NOT full equipment and must NEVER be installed standalone in a hazardous area; it requires incorporation into complete equipment with an equipment certificate.',
      },
    ],
    keyTakeaways: [
      'Temperature classes range from T1 (450°C) down to T6 (85°C); lower numbers allow hotter surfaces.',
      'T6 is the coolest and most protective temperature class; T6 equipment satisfies T1–T5 requirements.',
      'Dust markings show actual temperature in °C and require margins against cloud and layer ignition.',
      'ATEX Directive codes include CE + NB number, ⟨Ex⟩ mark, Equipment Group (I/II), and Category (1G, 2G, 3G / 1D, 2D, 3D).',
      'Certificate suffixes matter: "X" denotes mandatory Specific Conditions of Use; "U" denotes an incomplete Ex Component that cannot be installed alone.',
    ],
    relatedTopics: ['Zones and EPLs', 'Documentation and records', 'Inspection principles'],
  }),
  lesson({ moduleOrder: 10, id: 'installation-fundamentals', title: 'Installation fundamentals', level: 'Intermediate', category: 'Installation', briefDescription: 'Recognise installation details that preserve an equipment protection concept.', estimatedMinutes: 20, objectives: ['Identify entry, bonding, enclosure, and modification concerns.', 'Connect installation evidence to the equipment concept.', 'Record and escalate defects safely.'], prerequisites: ['equipment-selection-marking'], sections: [{ heading: 'The installed assembly', body: 'Equipment suitability depends on entries, seals, fasteners, bonding, cable routing, accessories, environment, and special conditions. A correct product can become unsuitable through incorrect installation.' }, { heading: 'Common findings', body: 'Cracked entries, missing plugs, loose fasteners, damaged enclosures, poor bonding, unapproved accessories, and undocumented modifications require controlled reporting and an approved response.' }], keyTakeaways: ['Installation quality preserves design intent.', 'Do not improvise repairs or substitutions.', 'Traceable defect reporting supports safe follow-up.'], relatedTopics: ['Inspection principles', 'Maintenance and repair'] }),
  lesson({
    moduleOrder: 11,
    id: 'ex008-inspection',
    title: 'EX008: Inspection principles and methodology',
    level: 'Advanced',
    category: 'Inspection',
    briefDescription: 'Master the three inspection grades (Visual, Close, Detailed) and four inspection regimes defined in IEC 60079-17.',
    estimatedMinutes: 24,
    objectives: [
      'Differentiate between Visual, Close, and Detailed inspection grades.',
      'Explain the four inspection regimes: Initial, Periodic, Sample, and Continuous Supervision.',
      'State safe isolation and gas-testing requirements prior to opening flameproof or increased-safety enclosures.',
      'Document traceable findings with asset ID, location, observed defect, owner, and closure criteria.',
    ],
    prerequisites: ['installation-fundamentals'],
    sections: [
      {
        heading: 'The Three Inspection Grades (IEC 60079-17)',
        body: 'IEC 60079-17 establishes three progressive grades of inspection depending on the depth of physical examination required:\n1. Visual Inspection: Identifies defects that are apparent to the eye without the use of access equipment or tools. Examples: missing cover bolts, cracked glass, unauthorized entries, disconnected earth bonding straps, or excessive dust accumulation.\n2. Close Inspection: Encompasses all Visual aspects and, in addition, identifies defects using access equipment (e.g., steps, ladders, scaffolds) and hand tools (e.g., spanners to check tightness of bolts, gland locknuts, and earthing continuity), but WITHOUT opening the enclosure.\n3. Detailed Inspection: Encompasses all Close aspects and, in addition, identifies defects that are only accessible by OPENING the enclosure (using tools, test instruments, and torque wrenches). Examines internal terminations, tightness, creepage and clearance distances, flamepath condition, internal gaskets, and circuit fuse ratings. Must be conducted with equipment safely de-energised and isolated, or under a formal hot-work gas test permit.',
      },
      {
        heading: 'The Four Inspection Regimes',
        body: 'Equipment inspections are scheduled under four distinct regimes :\n1. Initial Inspection: 100% Detailed inspection of all newly installed or modified equipment before initial energisation or return to service (mandated by IEC 60079-14 and IEC 60079-17).\n2. Periodic Inspection: Routine inspection of all installed equipment at fixed intervals. For fixed electrical installations, the standard maximum interval between periodic inspections is 3 years (unless an alternative interval is justified and documented). In contrast, movable, portable, and transportable equipment faces higher mechanical risk: it requires a visual check by the user before each use, and a close inspection at intervals not exceeding 12 months.\n3. Sample Inspection: High-frequency inspection of a representative proportion of equipment to assess environmental degradation (e.g., severe marine corrosion, vibration, moisture ingress) and adjust periodic intervals.\n4. Continuous Supervision: Ongoing inspection and maintenance by experienced, qualified personnel who regularly attend the plant during normal operation, maintaining the verification dossier.',
      },
      {
        heading: 'Writing defensible inspection findings',
        body: 'An inspection finding is only actionable when it contains complete traceable evidence: (1) Asset tag and precise geographic/plant location, (2) Inspection grade performed, (3) Exact observed condition vs requirement, (4) Immediate safety risk control taken (e.g., de-energised / locked out), (5) Assigned action owner and required remediation, and (6) Closure sign-off criteria. Never write vague summaries like "looks ok" or "checked".',
      },
    ],
    keyTakeaways: [
      'The 3 inspection grades are Visual (no tools/access), Close (tools/access without opening), and Detailed (opening enclosure de-energised).',
      'The 4 regimes are Initial (100% detailed before power-up), Periodic (max 3-year intervals for fixed equipment, 12 months for portable), Sample, and Continuous Supervision.',
      'Opening enclosures for Detailed inspection requires verified electrical isolation or hot-work gas testing.',
      'Defensible findings require asset ID, location, observed defect, immediate control, owner, and closure evidence.',
    ],
    relatedTopics: ['Documentation and records', 'Competence and responsibilities', 'EX007 installation practice'],
  }),
  lesson({ moduleOrder: 12, id: 'maintenance-repair-overhaul', title: 'Maintenance, repair, overhaul, and modification', level: 'Advanced', category: 'Lifecycle', briefDescription: 'Keep equipment protection intact through controlled maintenance and approved repair.', estimatedMinutes: 22, objectives: ['Separate routine maintenance from repair and modification.', 'Identify when manufacturer or certificate constraints matter.', 'Make cautious return-to-service decisions.'], prerequisites: ['ex008-inspection'], sections: [{ heading: 'Control the lifecycle', body: 'Maintenance, repair, overhaul, and modification can change the conditions that support protection. Work should use approved methods, competent people, suitable records, and relevant manufacturer and site requirements.' }, { heading: 'Return to service', body: 'A repaired or modified item needs evidence that its protection concept, documentation, and installation remain acceptable. If the method is uncertain, keep the condition controlled and escalate before service.' }], keyTakeaways: ['Improvised repair can remove the protection basis.', 'Change control and traceability matter after repair or modification.', 'Return-to-service is an evidence decision.'], relatedTopics: ['Installation fundamentals', 'Documentation and records'] }),
  lesson({ moduleOrder: 13, id: 'documentation-and-records', title: 'Documentation and records', level: 'Advanced', category: 'Assurance', briefDescription: 'Use drawings, registers, certificates, inspection records, and defect history as connected evidence.', estimatedMinutes: 18, objectives: ['Identify records needed for a defensible review.', 'Recognise revision and traceability problems.', 'Link records to field conditions and actions.'], prerequisites: ['equipment-selection-marking', 'ex008-inspection'], sections: [{ heading: 'A usable evidence trail', body: 'Area drawings, equipment registers, certificates or declarations, manufacturer instructions, inspection records, defect registers, and maintenance history should tell a consistent story. Revision status and asset identity are part of that story.' }, { heading: 'When records disagree', body: 'A conflict between a document and field condition should be recorded and investigated. Do not silently edit history or accept an assumption because it is easier to close.' }], keyTakeaways: ['Good records make later decisions safer and faster.', 'Traceability includes location, asset identity, revision, owner, and closure evidence.', 'Conflicting information requires review.'], relatedTopics: ['Inspection principles', 'Competence and responsibilities'] }),
  lesson({ moduleOrder: 14, id: 'copc-rtp-excb', title: 'CoPC, RTP, and ExCB boundaries', level: 'Advanced', category: 'Competence and schemes', briefDescription: 'Understand learning, personnel competence certification, training providers, and conformity-assessment bodies.', estimatedMinutes: 18, objectives: ['Explain CoPC, RTP, and ExCB at a high level.', 'Distinguish training from assessment and certification.', 'State the exact boundary of this application.'], prerequisites: ['atex-iecex-context', 'ex008-inspection'], sections: [{ heading: 'Different roles', body: 'A Certificate of Personnel Competence is associated with a formal competence certification route. An RTP is a recognised training-provider role within the relevant scheme context. An ExCB performs defined conformity-assessment activities. These roles are not interchangeable.' }, { heading: 'ExLearn’s boundary', body: 'ExLearn is none of these: it is not an RTP, not an ExCB, and does not issue CoPC. It cannot assess a person’s competence, certify equipment, approve an installation, or replace a formal scheme process.' }], keyTakeaways: ['Training material is not personnel certification.', 'Conformity assessment belongs to authorised bodies and defined processes.', 'ExLearn provides education only and grants no qualification or approval.'], relatedTopics: ['ATEX and IECEx concepts', 'Competence and responsibilities'] }),
  lesson({ moduleOrder: 15, id: 'competence-and-responsibilities', title: 'Competence, responsibilities, and decision-making', level: 'Advanced', category: 'Decision-making', briefDescription: 'Make cautious decisions within competence boundaries and communicate escalation clearly.', estimatedMinutes: 18, objectives: ['Recognise role and competence boundaries.', 'Choose when to stop work or escalate.', 'Communicate safety-critical findings clearly.'], prerequisites: ['copc-rtp-excb', 'documentation-and-records'], sections: [{ heading: 'Roles have limits', body: 'Owners, designers, installers, inspectors, maintainers, and reviewers may have different responsibilities and competence. A person should not accept a decision outside the evidence, authority, or competence available to them.' }, { heading: 'A defensible next step', body: 'When evidence is incomplete, control the condition, describe the uncertainty, preserve records, identify the responsible competent party, and seek review.' }], keyTakeaways: ['Stop-work and escalation are valid safety decisions.', 'Clear communication reduces hidden assumptions.', 'Use this app to practise thinking, not to authorise work.'], relatedTopics: ['Inspection principles', 'CoPC, RTP, and ExCB'] }),
  lesson({ moduleOrder: 16, id: 'integrated-ex-workshop', title: 'Integrated Ex decision workshop', level: 'Advanced', category: 'Integration', briefDescription: 'Bring area, equipment, installation, inspection, maintenance, records, and competence evidence together.', estimatedMinutes: 25, objectives: ['Combine multiple evidence sources.', 'Prioritise safe next actions.', 'Explain why a conclusion may need competent review.'], prerequisites: ['competence-and-responsibilities', 'maintenance-repair-overhaul'], sections: [{ heading: 'Connect the evidence', body: 'A practical review may involve an area drawing, process change, equipment marking, installation condition, inspection record, and repair history. The decision should explain how those facts agree or conflict.' }, { heading: 'Learning without approval', body: 'The workshop is a practice exercise. It does not produce an inspection acceptance, certificate, CoPC, legal compliance decision, or approval by ExLearn.' }], keyTakeaways: ['Integrated decisions depend on connected evidence.', 'Prioritise control and escalation where uncertainty remains.', 'Formal decisions belong to responsible competent people and applicable processes.'], relatedTopics: ['All Phase 2 modules'] }),

  lesson({
    moduleOrder: 17,
    id: 'ex007-installation-practice',
    title: 'EX007: Installation practice and standards compliance',
    level: 'Intermediate',
    category: 'Installation',
    briefDescription: 'Apply rigorous IEC 60079-14 installation requirements for entries, thread engagement, earthing, and segregation.',
    estimatedMinutes: 26,
    objectives: [
      'Apply IEC 60079-14 thread engagement rules for metric (≥5 threads, ≥8mm) and NPT (≥5 threads) entries.',
      'Identify when barrier cable glands (compound-filled) are mandatory for Ex d enclosures.',
      'Specify equipotential bonding conductor sizing (typically minimum 4 mm² Cu unprotected, or 2.5 mm² Cu if mechanically protected).',
      'Enforce Intrinsic Safety cable segregation (≥50 mm separation, light-blue sheath, single-point screen earthing).',
    ],
    prerequisites: ['installation-fundamentals'],
    sections: [
      {
        heading: 'Thread engagement and flameproof entry integrity',
        body: 'Cable entries into flameproof (Ex d) enclosures form part of the flamepath. IEC 60079-14 defines strict thread engagement:\n• Metric Parallel Threads: Must have at least 5 full threads engaged, with a minimum axial engagement length of 8 mm (for enclosures > 100 cm³) or 5 mm (enclosures ≤ 100 cm³).\n• NPT Tapered Threads: Must have at least 5 full threads engaged and be wrench-tight.\n• Sealing and lubrication: Never apply standard plumbers’ PTFE tape to metric parallel flamepath threads unless explicitly permitted by the equipment certificate schedule. Non-setting grease must be non-metallic, non-hardening, and suitable for the certified temperature range.',
      },
      {
        heading: 'Direct entry and barrier gland selection (IEC 60079-14)',
        body: 'When cables enter directly into an Ex d enclosure, gland selection follows defined safety criteria:\n• Barrier Glands (compound/resin filled): Generally mandatory according to historical IEC 60079-14 rules if the enclosure contains an internal source of ignition (switches, contactors, relays) AND the gas group is IIC, OR if the enclosure internal volume exceeds 2 litres (unless specialized cable construction and tested elastomeric seal glands are certified).\n• Compression Glands: Permitted only for cables that are substantially compact and circular with extruded bedding, where barrier gland thresholds do not apply.\n• Stopping Plugs: Certified Ex d stopping plugs matching the thread type must be fitted in all unused entries. Never use plastic transit plugs or uncertified fittings.',
      },
      {
        heading: 'Earthing, bonding, and Intrinsic Safety segregation',
        body: 'Workmanship and segregation preserve the safety design:\n• Equipotential Bonding: All non-current-carrying metallic parts, cable trays, and enclosures must be bonded to the site equipotential system . External supplementary bonding conductors require a typical minimum copper cross-sectional area of 4 mm² (if unprotected against mechanical damage) or 2.5 mm² (if provided with mechanical protection), though the latest standards must always be consulted.\n• Intrinsic Safety (Ex i) Segregation: Maintain a typical minimum 50 mm clearance (or as defined by the current standard) between intrinsically safe circuits and non-intrinsically safe circuits in ducts, trunks, and trays, or separate them with an earthed metallic screen or partition. IS cables and terminals must be identified with light-blue color coding or distinct labelling.\n• Screen Earthing: IS cable screens are normally connected to the instrument reference earth at ONE point only (typically at the barrier / safe-area interface) to prevent circulating earth loop currents from inducing incendiary energy. Multiple screen earthing is permitted only under strict conditions (e.g., verified high-integrity equipotential bonding with < 1 V potential difference, or via approved small capacitive grounding for EMC).',
      },
    ],
    checklist: [
      'Verify thread type (metric vs NPT), pitch, and minimum 5 full threads engaged.',
      'Check direct Ex d entries for barrier gland requirements (>2 litres, Group IIC with ignition sources).',
      'Verify certified Ex d / Ex e stopping plugs in all unused enclosure entries.',
      'Inspect external equipotential bonding (typically minimum 4 mm² Cu unprotected, 2.5 mm² Cu with mechanical protection).',
      'Check Ex i cable segregation (≥50 mm separation or earthed shield, light-blue identification, single-point screen earth).',
    ],
    examples: [
      'An Ex d enclosure with 3.5 L volume in a Zone 1 Group IIB plant requires barrier glands for direct cable entry per IEC 60079-14.',
      'Plastic shipping transit plugs found in commissioned junction boxes are non-compliant and must be replaced immediately with certified stopping plugs.',
    ],
    keyTakeaways: [
      'Metric Ex d entries require ≥5 full threads engaged and ≥8 mm engagement depth; NPT requires ≥5 threads wrench-tight.',
      'Barrier glands are required for direct Ex d entry if volume > 2 L or in Group IIC with internal ignition sources.',
      'External supplementary bonding conductors require minimum 4 mm² copper (or 2.5 mm² if mechanically protected).',
      'Intrinsically safe circuits require ≥50 mm segregation from non-IS cables and single-point screen earthing.',
    ],
    relatedTopics: ['EX008 inspection', 'Glands and cable entries', 'Ex i: intrinsic-safety loops'],
  }),
  lesson({ moduleOrder: 18, id: 'ex-d-flameproof', title: 'Ex d: flameproof enclosure decisions', level: 'Intermediate', category: 'Protection', briefDescription: 'Explore flamepaths, fasteners, joints, and repair boundaries in Ex d equipment.', estimatedMinutes: 22, objectives: ['Describe the protective intent of a flameproof enclosure.', 'Identify observations that can affect a flamepath.', 'Select a safe escalation path for damage or alteration.'], prerequisites: ['ex-d-ex-e', 'ex007-installation-practice'], sections: [{ heading: 'Flamepath thinking', body: 'An Ex d enclosure relies on controlled joints and mechanical features to manage an internal ignition event. Corrosion, scoring, paint, contamination, incorrect bolts, or an unapproved cover can change the conditions on which protection depends.' }, { heading: 'Inspection is not repair', body: 'An inspector may describe and control a condition, but must not dress, machine, substitute, or alter a flamepath without an approved method and competent authority.' }], checklist: ['Identify the enclosure and certificate information.', 'Observe joints without altering them.', 'Check fasteners, entries, plugs, and visible damage against instructions.', 'Escalate any condition whose acceptability is uncertain.'], examples: ['A corroded joint should be documented with location and extent; sanding it on the spot may create a new unapproved condition.'], keyTakeaways: ['Flamepath integrity is evidence-led.', 'Unapproved repairs can remove the protection basis.', 'Stop and escalate safety-critical uncertainty.'], relatedTopics: ['Findings and defect writing', 'Maintenance and repair'] }),
  lesson({ moduleOrder: 19, id: 'ex-e-increased-safety', title: 'Ex e: increased-safety installation', level: 'Intermediate', category: 'Protection', briefDescription: 'Practise checks for terminations, clearances, temperature, and enclosure condition.', estimatedMinutes: 20, objectives: ['Explain how Ex e reduces ignition likelihood.', 'Recognise termination and clearance evidence.', 'Distinguish a correct observation from an unsupported acceptance.'], prerequisites: ['ex-d-ex-e', 'ex007-installation-practice'], sections: [{ heading: 'Avoiding arcs and excess heat', body: 'Increased-safety arrangements depend on construction and installation controls that reduce sparks, hot spots, and electrical faults. Correct terminals, torque, clearances, creepage, enclosure condition, and component compatibility all matter.' }, { heading: 'Evidence at the enclosure', body: 'A tidy appearance is not proof. Compare the installed parts and workmanship with the equipment documentation and approved installation method, and record what was actually observed.' }], checklist: ['Verify component and accessory identity.', 'Check terminations, conductor preparation, and signs of heating.', 'Check enclosure sealing and environmental condition.', 'Record evidence rather than a conclusion unsupported by access.'], examples: ['A heat-discoloured terminal is a finding requiring controlled investigation, not a cosmetic note.'], keyTakeaways: ['Ex e depends on many small installation controls.', 'Thermal evidence can indicate a deeper issue.', 'Competent review is required when limits or methods are unclear.'], relatedTopics: ['Marking', 'Inspection findings'] }),
  lesson({
    moduleOrder: 20,
    id: 'ex-i-intrinsic-safety',
    title: 'Ex i: intrinsic-safety loops',
    level: 'Advanced',
    category: 'Protection',
    briefDescription: 'Master intrinsic-safety loop validation using standard entity parameters (Ui, Ii, Pi, Ci, Li vs Uo, Io, Po, Co, Lo).',
    estimatedMinutes: 26,
    objectives: [
      'Describe intrinsic safety as a complete-loop decision covering barrier, cable, and field device.',
      'Apply the 5 fundamental entity parameter rules (Ui >= Uo, Ii >= Io, Pi >= Po, Ci + Cc <= Co, Li + Lc <= Lo).',
      'Calculate cumulative cable capacitance and inductance over a circuit run.',
    ],
    prerequisites: ['ex-i-ex-t-ex-p', 'ex007-installation-practice'],
    sections: [
      {
        heading: 'The loop, not a single device',
        body: 'Intrinsic safety (Ex i) limits electrical energy (spark energy) and thermal energy (hot surfaces) under normal operation and specified fault conditions. A safe loop always consists of: (1) Associated apparatus (e.g., Zener barrier or galvanic isolator located in the safe area), (2) Field device (located in the hazardous area), and (3) Interconnecting cabling and earthing.',
      },
      {
        heading: 'The 5 Golden Entity Parameter Rules',
        body: 'To prove an intrinsically safe loop cannot ignite the hazardous atmosphere, compare source parameters (subscript "o" for output) with field device parameters (subscript "i" for input) and cable parameters (subscript "c"):\n1. Ui ≥ Uo: Field device maximum input voltage rating must equal or exceed barrier maximum open-circuit voltage.\n2. Ii ≥ Io: Field device maximum input current rating must equal or exceed barrier maximum short-circuit current.\n3. Pi ≥ Po: Field device maximum input power rating must equal or exceed barrier maximum output power.\n4. Ci + Ccable ≤ Co: Total loop capacitance (field device internal capacitance Ci plus cable capacitance Ccable) must not exceed barrier allowed capacitance Co.\n5. Li + Lcable ≤ Lo: Total loop inductance (field device internal inductance Li plus cable inductance Lcable) must not exceed barrier allowed inductance Lo (or verify L/R ratio).',
      },
      {
        heading: 'Worked loop calculation example',
        body: 'Barrier / Source: Uo = 28 V, Io = 93 mA, Po = 0.65 W, Co = 83 nF, Lo = 4.2 mH.\nField Transmitter: Ui = 30 V, Ii = 100 mA, Pi = 0.75 W, Ci = 12 nF, Li = 0.1 mH.\nCable run: 250 m with Ccable = 100 pF/m (total Cc = 25 nF) and Lcable = 1 µH/m (total Lc = 0.25 mH).\nVerification:\n• Ui (30 V) ≥ Uo (28 V) -> PASS\n• Ii (100 mA) ≥ Io (93 mA) -> PASS\n• Pi (0.75 W) ≥ Po (0.65 W) -> PASS\n• Ci + Cc (12 nF + 25 nF = 37 nF) ≤ Co (83 nF) -> PASS\n• Li + Lc (0.1 mH + 0.25 mH = 0.35 mH) ≤ Lo (4.2 mH) -> PASS.\nEvery inequality is satisfied. The descriptive calculation sheet must be filed in the installation verification dossier.',
      },
    ],
    checklist: [
      'Extract barrier entity parameters: Uo, Io, Po, Co, Lo.',
      'Extract field device parameters: Ui, Ii, Pi, Ci, Li from certificate schedule.',
      'Calculate cable parameters Ccable and Lcable using certified cable data sheets.',
      'Verify all 5 entity inequalities: Ui >= Uo, Ii >= Io, Pi >= Po, Ci + Cc <= Co, Li + Lc <= Lo.',
      'Check segregation, blue marking, screen earthing, and grounding impedance.',
    ],
    examples: [
      'Barrier (Uo=28V, Io=93mA, Co=83nF) paired with Transmitter (Ui=30V, Ii=100mA, Ci=12nF) over 250m cable (Cc=25nF) gives Ci+Cc=37nF <= 83nF: PASS.',
    ],
    keyTakeaways: [
      'Intrinsic safety is a system calculation; field devices cannot be approved in isolation.',
      'The 5 entity rules must all pass: Ui >= Uo, Ii >= Io, Pi >= Po, Ci + Cc <= Co, Li + Lc <= Lo.',
      'Cable capacitance and inductance consume barrier allowance and must be accounted for over the run.',
      'Calculation sheets are part of the legal verification dossier required by IEC 60079-14 / IEC 60079-25.',
    ],
    relatedTopics: ['IS calculations', 'Documentation and records'],
  }),
  lesson({ moduleOrder: 21, id: 'ex-t-dust-protection', title: 'Ex t: dust-protection enclosures', level: 'Intermediate', category: 'Protection', briefDescription: 'Connect enclosure integrity, dust ingress, surface temperature, and housekeeping.', estimatedMinutes: 20, objectives: ['Explain the protective intent of Ex t.', 'Recognise dust ingress and surface-temperature evidence.', 'Select safe actions for damaged or contaminated enclosures.'], prerequisites: ['ex-i-ex-t-ex-p', 'gas-vapour-mist-dust'], sections: [{ heading: 'Dust protection is physical protection', body: 'Ex t relies on the enclosure and its interfaces limiting dust ingress while managing surface temperature. Gaskets, covers, entries, fasteners, deposits, and ambient conditions must be considered together.' }, { heading: 'Layers and heat', body: 'Settled dust may insulate a surface and can be disturbed into a cloud. Housekeeping controls must follow an approved method; blowing dust into the air can create a new hazard.' }], checklist: ['Check enclosure, joints, gaskets, and entries.', 'Record dust deposits and the surface or equipment involved.', 'Compare temperature and ambient limits with controlled documents.', 'Escalate compromised seals or unknown modifications.'], examples: ['A missing gasket is both an ingress concern and a traceable defect requiring controlled correction.'], keyTakeaways: ['Dust protection includes enclosure and temperature evidence.', 'Housekeeping must not create a cloud.', 'Use approved maintenance methods.'], relatedTopics: ['Dust hazards', 'Glands and cable entries'] }),
  lesson({ moduleOrder: 22, id: 'ex-p-pressurization', title: 'Ex p: pressurization and purge', level: 'Advanced', category: 'Protection', briefDescription: 'Practise evidence checks for purge cycles, pressure monitoring, alarms, and operating response.', estimatedMinutes: 22, objectives: ['Explain why Ex p depends on maintained protective conditions.', 'Identify evidence for purge, pressure, alarms, and leakage control.', 'Choose a cautious response to an alarm or loss of pressure.'], prerequisites: ['ex-i-ex-t-ex-p', 'ex007-installation-practice'], sections: [{ heading: 'A maintained protective atmosphere', body: 'Pressurization or purge protection relies on a defined sequence and maintained pressure or flow condition. Doors, seals, relief paths, monitoring, alarms, and the protected equipment boundary form one operating system.' }, { heading: 'Alarm response is a control', body: 'A pressure loss or failed purge indication is not merely an instrumentation issue. Follow the approved operating response, control ignition risk, preserve evidence, and escalate before restoring service.' }], checklist: ['Confirm purge and pressurization procedure revision.', 'Check indicators, alarms, seals, and visible leakage evidence.', 'Verify response records for trips or alarms.', 'Do not bypass protective monitoring to keep production running.'], examples: ['A repeated low-pressure alarm needs investigation of leakage and procedure, not a muted alarm.'], keyTakeaways: ['Ex p protection depends on operational discipline.', 'Alarms and interlocks are part of the protection concept.', 'Never bypass a protective control as a shortcut.'], relatedTopics: ['Inspection findings', 'Responsibilities'] }),
  lesson({
    moduleOrder: 23,
    id: 'glands-and-cable-entries',
    title: 'Glands, cable entries, and sealing systems',
    level: 'Intermediate',
    category: 'Installation',
    briefDescription: 'Review cable glands, barrier glands, stopping plugs, sealing washers, and adaptor limits under IEC 60079-14.',
    estimatedMinutes: 24,
    objectives: [
      'Distinguish between Ex d barrier glands, Ex d compression glands, and Ex e increased-safety glands.',
      'Check gland sealing washers, locknuts, and IP ratings (IP54 gas, IP6X dust).',
      'Apply thread adaptor/reducer rules (maximum one adaptor per entry; never connect adaptors in series).',
      'Write actionable, location-specific entry inspection findings.',
    ],
    prerequisites: ['ex007-installation-practice', 'equipment-selection-marking'],
    sections: [
      {
        heading: 'Cable gland types and protection integrity',
        body: 'Cable glands must be certified to match the equipment concept and cable construction:\n• Ex d Barrier Glands: Contain setting compound or resin surrounding individual conductors. Obligatory when internal volume > 2 L, or in Group IIC atmospheres with internal ignition sources, or where cables cannot be verified as substantially compact with extruded bedding.\n• Ex d Compression Glands: Use a certified elastomeric displacement sealing ring compressed onto the cable inner sheath. Must be sized accurately to the cable diameter range specified on the gland label.\n• Ex e Increased Safety Glands: Provide mechanical retention and environmental sealing (minimum IP54 for gas, IP6X for dust). In threaded entries, an approved non-perishable sealing washer (e.g., nylon or fiber) must be fitted on the gland entry thread against the enclosure face to preserve the IP rating.',
      },
      {
        heading: 'Stopping plugs, adaptors, and installation limits',
        body: 'Critical entry constraints under IEC 60079-14:\n• Certified Stopping Plugs: Must match the protection concept (Ex d / Ex e) and thread form. Must be installed with the approved tool (hex key / special socket) so they cannot be removed by hand. Never leave transit plugs in place.\n• Thread Adaptors and Reducers: Only certified Ex d / Ex e adaptors may be used to interface different thread sizes or forms (e.g., M25 to M20). Rule: Only ONE adaptor or reducer is permitted per entry. Stacking or connecting adaptors in series is strictly prohibited.\n• Earthing Washers (Tag rings): When fitted to unarmoured glands or plastic enclosures, ensure earth continuity is verified with a calibrated low-resistance ohmmeter.',
      },
      {
        heading: 'What to record in entry findings',
        body: 'Document the exact asset ID, entry face/position (e.g., "bottom right M20 entry"), gland manufacturer and type, specific defect (e.g., pinched outer sheath, missing IP washer, wrong gland size, uncertified plug), immediate safety risk control, and required remediation.',
      },
    ],
    checklist: [
      'Verify gland certification code and match with equipment protection concept.',
      'Check cable diameter against the gland certified clamping range.',
      'Confirm barrier compound cure or elastomeric seal compression.',
      'Verify maximum one certified thread adaptor per entry (no series stacking).',
      'Verify certified stopping plugs with appropriate sealing washers on all unused openings.',
    ],
    examples: [
      'A plastic transit blanking plug left in an Ex e terminal box fails IP54 and allows moisture/dust ingress: non-conformance requiring replacement with certified Ex eb M20 plug.',
      'Two thread reducers screwed together (M32 to M25, M25 to M20) violates the IEC 60079-14 rule limiting installations to one adaptor per entry.',
    ],
    keyTakeaways: [
      'Cable glands must match protection concept: Ex d (barrier or compression) vs Ex e (IP54/IP6X seal).',
      'All unused openings must have certified Ex d/Ex e stopping plugs fitted wrench-tight.',
      'Only one certified adaptor or reducer is permitted per entry; series stacking is prohibited.',
      'Sealing washers on parallel threads are essential to maintain enclosure Ingress Protection (IP).',
    ],
    relatedTopics: ['Ex d: flameproof enclosure decisions', 'Ex t: dust-protection enclosures', 'EX007: Installation practice'],
  }),
  lesson({
    moduleOrder: 24,
    id: 'marking-findings-and-is-calculations',
    title: 'Marking, findings, and IS calculations workshop',
    level: 'Advanced',
    category: 'Applied practice',
    briefDescription: 'Integrate marking interpretation, finding quality, and transparent intrinsic-safety entity parameter verification.',
    estimatedMinutes: 28,
    objectives: [
      'Break an Ex marking review into verifiable technical claims.',
      'Write traceable inspection findings that include asset identity, location, condition, and controlled action.',
      'Execute complete intrinsic-safety entity calculations (Ui, Ii, Pi, Ci, Li vs Uo, Io, Po, Co, Lo).',
    ],
    prerequisites: ['ex-i-intrinsic-safety', 'glands-and-cable-entries', 'ex008-inspection'],
    sections: [
      {
        heading: 'Marking as a starting point',
        body: 'Read marking as a set of claims to verify: protection concept, gas/dust group, temperature class or surface limit, EPL, ambient range, certificate identifier, and special conditions (X or U). The marking starts a review; it does not finish one without checking installation, cable, and environment.',
      },
      {
        heading: 'Findings that teach and control',
        body: 'A useful finding states what was seen, where it was seen, why it matters, and what controlled action is needed. For calculations, document every source parameter (barrier data sheet, field certificate, and manufacturer cable per-meter specifications) to prove compliance with Ui >= Uo, Ii >= Io, Pi >= Po, Ci + Cc <= Co, and Li + Lc <= Lo.',
      },
    ],
    checklist: [
      'Transcribe marking without silently correcting it.',
      'Link each claim to a controlled source or field observation.',
      'Write condition, consequence, action, owner, and closure evidence.',
      'Verify all 5 IS entity parameter inequalities (Ui >= Uo, Ii >= Io, Pi >= Po, Ci + Cc <= Co, Li + Lc <= Lo).',
      'Show units and cable length assumptions in every calculation sheet.',
    ],
    examples: [
      'Loop calculation: Barrier (Uo=28V, Io=93mA, Po=0.65W, Co=83nF, Lo=4.2mH) vs Transmitter (Ui=30V, Ii=100mA, Pi=0.75W, Ci=12nF, Li=0.1mH) with 150m cable (Cc=15nF, Lc=0.15mH). Result: Ci+Cc=27nF <= 83nF, Li+Lc=0.25mH <= 4.2mH: loop passes verification.',
      'Gland finding: Asset JB-14 east entry has damaged elastomeric seal; isolate circuit and replace with certified Ex db/eb M20 gland per site instruction (action assigned to electrical team).',
    ],
    keyTakeaways: [
      'Marking, findings, and calculations require complete traceability.',
      'IS entity calculations must verify both spark ignition (capacitance/inductance) and thermal limits (power).',
      'Clear uncertainty is safer than false precision; educational examples never replace formal site assessment.',
    ],
    relatedTopics: ['Equipment marking', 'EX008 inspection', 'Ex i'],
  }),
]
