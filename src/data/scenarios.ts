import type { Scenario } from '../types'

export const scenarios: Scenario[] = [
  {
    "id": "unclear-area-drawing",
    "title": "An unclear area drawing",
    "level": "Beginner",
    "lessonIds": [
      "hazardous-areas",
      "zones-and-epl"
    ],
    "context": "A process line has been rerouted, and the available area classification drawing does not show the new release point. The process engineer confirms the change was implemented three months ago.",
    "decisionOptions": [
      "Proceed with the installation using the existing drawing, since the process engineer verbally confirmed the change is minor",
      "Use the adjacent area's classification as a conservative substitute until the drawing is formally updated",
      "Pause affected installation work, formally request an updated area classification study, and document the discrepancy",
      "Reclassify the area yourself based on your knowledge of the product being handled"
    ],
    "correctChoice": 2,
    "explanation": "A changed release source can change area understanding. The discrepancy should be controlled, recorded, and reviewed.",
    "consequence": "Unverified area information can lead to unsuitable equipment or work controls.",
    "recommendedAction": "Pause affected work and involve the responsible competent area-classification team."
  },
  {
    "id": "gas-release-ignition-source",
    "title": "Confirmed gas detection near energized equipment",
    "level": "Beginner",
    "lessonIds": [
      "hazardous-areas",
      "gas-vapour-mist-dust"
    ],
    "context": "A fixed gas detector in a Zone 2 area has triggered a confirmed 25% LEL alarm. Energized Ex e lighting and an Ex d junction box are within 3 metres. The process operator reports no visible leak but confirms a nearby valve was recently serviced.",
    "decisionOptions": [
      "Check the gas detector calibration certificate first, since a faulty sensor is the most likely cause",
      "Initiate the site gas alarm response: isolate non-essential electrical circuits, evacuate personnel, and deploy atmospheric monitoring before investigating the valve",
      "Increase the ventilation fan speed to dilute the concentration below 10% LEL and continue monitoring",
      "Treat the alarm as a nuisance trip because the equipment is Ex-rated and suitable for the zone"
    ],
    "correctChoice": 1,
    "explanation": "A possible release near an ignition source requires immediate site-controlled action, not improvised ventilation or continued work.",
    "consequence": "Prompt control reduces exposure while competent people establish the facts.",
    "recommendedAction": "Use the site emergency, isolation, and competent-response process."
  },
  {
    "id": "dust-layer",
    "title": "Dust accumulation on equipment in a Zone 22 area",
    "level": "Beginner",
    "lessonIds": [
      "gas-vapour-mist-dust"
    ],
    "context": "During a walk-down in a grain handling facility, you measure a 4mm dust layer on top of an Ex t motor rated T125°C. The area is classified Zone 22. Plant housekeeping is scheduled weekly.",
    "decisionOptions": [
      "Clean the surface using approved ATEX-rated vacuum equipment and request a housekeeping frequency review with the process team",
      "Note the observation but take no action since Zone 22 only requires attention during abnormal conditions",
      "Use compressed air to remove the dust quickly before the next production run begins",
      "Reduce the motor load to lower the surface temperature as a temporary compensating measure"
    ],
    "correctChoice": 0,
    "explanation": "Dust layers can hide heat and become airborne. Controls must be safe and linked to process review.",
    "consequence": "Ignoring accumulation can allow a preventable hazard to grow.",
    "recommendedAction": "Follow approved housekeeping and notify the responsible competent team."
  },
  {
    "id": "compliant-motor-installation",
    "title": "A fully documented motor installation",
    "level": "Intermediate",
    "lessonIds": [
      "equipment-selection-marking",
      "installation-fundamentals"
    ],
    "context": "You are conducting a Close inspection of a new Ex de IIC T4 Gb motor installed in Zone 1. The area drawing specifies Zone 1, IIC, T3. The certificate covers the installed configuration. Cable glands are certified, correctly selected for the cable diameter, and torqued to manufacturer specification. Earth continuity measures 0.2Ω. Terminations are clean, correctly torqued, and all creepage/clearance distances are maintained.",
    "decisionOptions": [
      "Accept the installation — all evidence is complete, consistent, and the T4 rating is within the T3 requirement",
      "Reject the installation because the T-class marking (T4) does not exactly match the drawing (T3)",
      "Hold acceptance until the manufacturer confirms in writing that T4 is acceptable in a T3 area",
      "Request an independent third-party verification before signing off"
    ],
    "correctChoice": 0,
    "explanation": "When area classification, certification, marking, and verified field conditions all agree and exceed requirements (T4 is safer than T3), escalation adds no safety value.",
    "consequence": "Over-escalating fully compliant work wastes competent review capacity and undermines trust in the sign-off process.",
    "recommendedAction": "Sign off against the verified evidence and file the documentation in the installation dossier."
  },
  {
    "id": "cosmetic-corrosion",
    "title": "Surface corrosion on an Ex e junction box",
    "level": "Intermediate",
    "lessonIds": [
      "ex008-inspection",
      "maintenance-repair-overhaul"
    ],
    "context": "During a periodic inspection, you find light surface rust on the external paintwork of an Ex e junction box in Zone 2. Opening the enclosure, you verify: all terminals are tight and clean, creepage distances are maintained, the gasket is intact and resilient, no internal corrosion is present, and the IP rating is unaffected.",
    "decisionOptions": [
      "Immediately isolate the circuit, tag it as non-conforming, and raise a priority work order for enclosure replacement",
      "Ignore the corrosion entirely since it is external and does not affect terminal function",
      "Repaint the enclosure immediately using whatever workshop paint is available to prevent further corrosion",
      "Record the cosmetic finding with photographs, schedule preventive re-coating at the next maintenance window, and accept continued service"
    ],
    "correctChoice": 3,
    "explanation": "Not every observation is an active protection risk. Cosmetic surface corrosion with no effect on sealing or terminals can be documented and scheduled for routine attention rather than treated as an emergency.",
    "consequence": "Escalating every minor finding as urgent erodes the credibility of genuinely urgent findings and wastes response capacity.",
    "recommendedAction": "Log the finding, track it through the normal maintenance schedule, and monitor its progression at future inspections."
  },
  {
    "id": "equipment-selection-zone1",
    "title": "Selecting replacement equipment for Zone 1",
    "level": "Intermediate",
    "lessonIds": [
      "equipment-selection-marking",
      "zones-and-epl"
    ],
    "context": "A damaged Ex d IIB T4 Gb junction box in Zone 1 (IIB, T3 area) needs replacement. Stores has three options available: (1) Ex d IIC T4 Gb, (2) Ex e IIC T6 Gc, (3) Ex d IIB T3 Gb. All three have valid certificates.",
    "decisionOptions": [
      "Select option 1 (Ex d IIC T4 Gb) — IIC covers IIB, T4 is within T3, Gb is correct for Zone 1",
      "Select option 2 (Ex e IIC T6 Gc) — it has the best temperature class and highest gas group",
      "Select option 3 (Ex d IIB T3 Gb) — it is the exact match for the area classification drawing",
      "Reject all three and order an exact like-for-like replacement from the original manufacturer"
    ],
    "correctChoice": 0,
    "explanation": "Equipment selection must satisfy EPL, gas group, and T-class. Option 1 meets all requirements (IIC > IIB, T4 is cooler than T3, Gb = Zone 1).",
    "consequence": "Incorrect selection can introduce an ignition source. Option 2 has the wrong EPL (Gc is for Zone 2 only).",
    "recommendedAction": "Apply the rules of hierarchy for gas groups and temperature classes to select suitable equipment."
  },
  {
    "id": "wrong-epl",
    "title": "EPL mismatch between drawing and nameplate",
    "level": "Intermediate",
    "lessonIds": [
      "zones-and-epl",
      "equipment-selection-marking"
    ],
    "context": "During a pre-commissioning inspection in Zone 1 (IIB, T3), you find a motor marked Ex ec IIA T4 Gc. The project engineer says it was approved in the equipment schedule.",
    "decisionOptions": [
      "Accept the motor because T4 (135°C) provides a better safety margin than the T3 (200°C) required by the area drawing",
      "Accept the motor on the basis that the project engineer's verbal approval constitutes site authority",
      "Hold commissioning — the EPL (Gc not permitted in Zone 1) and gas group (IIA not suitable for IIB area) are non-compliant, regardless of the favourable temperature class",
      "Install the motor but restrict it to 50% load as a compensating measure until a full review is completed"
    ],
    "correctChoice": 2,
    "explanation": "Conflicting selection evidence must be resolved before acceptance. A favourable T-class does not override an incorrect EPL or gas group.",
    "consequence": "Unsupported substitution can create a protection mismatch.",
    "recommendedAction": "Preserve the evidence and escalate to the responsible equipment-selection authority."
  },
  {
    "id": "damaged-ex-d-entry",
    "title": "A cracked cable gland on an Ex d enclosure",
    "level": "Intermediate",
    "lessonIds": [
      "ex-d-ex-e",
      "installation-fundamentals"
    ],
    "context": "During a detailed inspection of an Ex d junction box in Zone 1, you find a hairline crack in the body of a certified cable gland. The gland thread engagement appears normal, and the armour clamp is intact.",
    "decisionOptions": [
      "Document the finding as a minor observation since the crack does not extend to the flamepath thread",
      "Schedule replacement at the next planned shutdown since the crack is hairline and the enclosure remains bolted",
      "Apply thread sealant compound to the cracked area to restore the ingress protection rating",
      "Isolate the circuit, document the non-conformity, and raise a corrective action for replacement with a certified gland of the same type and thread specification"
    ],
    "correctChoice": 3,
    "explanation": "The installed condition matters. Any damage to an Ex d gland body compromises its ability to withstand an internal explosion.",
    "consequence": "Prompt escalation reduces the chance of an ignition protection gap being overlooked.",
    "recommendedAction": "Follow isolation, defect reporting, and approved repair procedures."
  },
  {
    "id": "ex-e-termination",
    "title": "Loose termination in an Ex e enclosure",
    "level": "Intermediate",
    "lessonIds": [
      "ex-d-ex-e",
      "installation-fundamentals"
    ],
    "context": "During inspection of an Ex eb terminal box, you find one conductor where the ferrule has backed out approximately 2mm from the terminal. The conductor is still making contact, and the motor is running normally under load.",
    "decisionOptions": [
      "Tighten the terminal to the manufacturer's specified torque value during the next planned outage since the circuit is currently functional",
      "De-energize the circuit under permit, re-terminate the conductor with the correct ferrule and torque to manufacturer specification, and record the corrective action",
      "Mark the terminal with a paint pen for identification and monitor it at the next inspection cycle",
      "Increase the protection relay setting to allow for additional heating at the loose connection"
    ],
    "correctChoice": 1,
    "explanation": "Termination condition and clearances are part of the protection design and need competent review.",
    "consequence": "Uncontrolled changes can introduce arcs, sparks, or excessive temperatures.",
    "recommendedAction": "Use the approved isolation, inspection, and repair route."
  },
  {
    "id": "ex-i-documentation-gap",
    "title": "Missing intrinsic safety loop documentation",
    "level": "Intermediate",
    "lessonIds": [
      "ex-i-ex-t-ex-p",
      "documentation-and-records"
    ],
    "context": "During commissioning of a new IS loop, you find the field instrument has a blue IS terminal housing and is marked Ex ia IIC T4. However, the IS loop calculation sheet, entity parameter comparison, and cable schedule cannot be located in the project handover documentation.",
    "decisionOptions": [
      "Accept the installation based on the manufacturer's standard wiring diagram and the visible blue terminal colour coding",
      "Commission the loop at reduced signal range (4-12mA instead of 4-20mA) as a conservative interim measure",
      "Hold commissioning until the complete IS loop documentation (entity parameter comparison, cable parameters, and safety description) is verified and filed",
      "Request the instrument supplier to issue a generic compliance statement covering all their IS instruments"
    ],
    "correctChoice": 2,
    "explanation": "Ex i is a circuit-system decision. Missing loop evidence prevents a defensible acceptance decision.",
    "consequence": "A label-only assumption can hide an incompatible circuit or installation.",
    "recommendedAction": "Escalate the documentation gap to the responsible design or inspection authority."
  },
  {
    "id": "ex-p-alarm",
    "title": "A pressurized enclosure alarm",
    "level": "Intermediate",
    "lessonIds": [
      "ex-i-ex-t-ex-p",
      "maintenance-repair-overhaul"
    ],
    "context": "An Ex p enclosure alarm indicates loss of protective pressure while the process is operating.",
    "decisionOptions": [
      "Acknowledge and silence the audible alarm horn and continue normal operation",
      "Bridge the differential pressure switch contacts to prevent automatic circuit tripping",
      "Open the enclosure door immediately while energized to inspect the internal purge valve",
      "Follow approved operating procedures to de-energize or initiate controlled shutdown and investigate"
    ],
    "correctChoice": 3,
    "explanation": "Ex p protection depends on maintained conditions and a defined response to loss of pressure.",
    "consequence": "Ignoring the alarm can remove the protection assumption during operation.",
    "recommendedAction": "Use the approved operating, isolation, and competent-maintenance procedure."
  },
  {
    "id": "dust-seal",
    "title": "A deteriorated dust enclosure seal",
    "level": "Intermediate",
    "lessonIds": [
      "ex-i-ex-t-ex-p",
      "maintenance-repair-overhaul"
    ],
    "context": "A seal on an Ex t enclosure is brittle and no longer provides a clear environmental barrier.",
    "decisionOptions": [
      "Isolate if necessary, document the defect, and replace the gasket using certified manufacturer parts",
      "Apply general-purpose commercial building mastic over the deteriorated gasket",
      "Disregard the seal condition because combustible dust has not yet accumulated on the floor",
      "Cut away the damaged section of the gasket and bolt the cover back down metal-to-metal"
    ],
    "correctChoice": 0,
    "explanation": "Enclosure integrity and surface conditions are central to dust protection.",
    "consequence": "Loss of the enclosure barrier can allow ingress or alter temperature assumptions.",
    "recommendedAction": "Follow manufacturer and site maintenance requirements and record the finding."
  },
  {
    "id": "inspection-grade-selection",
    "title": "Selecting the correct inspection grade",
    "level": "Advanced",
    "lessonIds": [
      "ex008-inspection",
      "maintenance-repair-overhaul"
    ],
    "context": "A plant has 200 Ex-certified assets in Zone 1 and Zone 2 areas. The last detailed inspection was completed 2 years ago. Management proposes that the upcoming annual inspection cycle should be Visual only, to reduce scaffold and isolation costs.",
    "decisionOptions": [
      "Agree to Visual-only inspection since the assets have been operating without incident for 2 years",
      "Propose a risk-based programme: Detailed inspection for Zone 1 assets with known defect history, Close inspection for remaining Zone 1, and Visual for Zone 2 assets with clean history",
      "Insist on Detailed inspection of all 200 assets regardless of zone, history, or risk, to demonstrate maximum diligence",
      "Defer all inspections by 12 months and request a site management exemption letter"
    ],
    "correctChoice": 1,
    "explanation": "Inspection grades should be selected based on risk, history, and environmental factors as permitted by IEC 60079-17.",
    "consequence": "A one-size-fits-all approach either misses defects (all Visual) or wastes resources (all Detailed).",
    "recommendedAction": "Apply a sample or risk-based inspection strategy utilizing Visual, Close, and Detailed grades appropriately."
  },
  {
    "id": "unapproved-modification",
    "title": "An unapproved field modification",
    "level": "Advanced",
    "lessonIds": [
      "installation-fundamentals",
      "maintenance-repair-overhaul"
    ],
    "context": "A component has been added to an Ex assembly without a traceable change record.",
    "decisionOptions": [
      "Accept the modification as compliant if the added component does not vibrate or hum",
      "Discard the historical equipment record and manufacture a new internal wiring diagram",
      "Isolate the equipment, record the unapproved modification, and route through Management of Change",
      "Replicate the unverified modification across all similar process skids on the plant"
    ],
    "correctChoice": 2,
    "explanation": "A modification can affect the protection concept and must be reviewed and recorded.",
    "consequence": "Uncontrolled changes can invalidate selection or installation assumptions.",
    "recommendedAction": "Use formal change control and do not return the equipment without evidence."
  },
  {
    "id": "conflicting-certificate",
    "title": "Certificate and field condition conflict",
    "level": "Advanced",
    "lessonIds": [
      "equipment-selection-marking",
      "documentation-and-records"
    ],
    "context": "A certificate record appears suitable, but the installed product marking and field accessories do not match the record.",
    "decisionOptions": [
      "Accept the installation based on the certificate document alone without field reconciliation",
      "Hold commissioning, record the mismatch, and obtain verified manufacturer and engineering reconciliation",
      "Alter the nameplate stamping in the field to match the certificate schedule",
      "Remove the field accessories and operate the equipment with open cable entries"
    ],
    "correctChoice": 1,
    "explanation": "The certificate is one part of the evidence; identity, accessories, marking, and installation must agree.",
    "consequence": "Unresolved identity or accessory issues can invalidate the selection decision.",
    "recommendedAction": "Preserve records and obtain competent technical review before acceptance."
  },
  {
    "id": "integrated-site-decision",
    "title": "Integrated site decision",
    "level": "Advanced",
    "lessonIds": [
      "integrated-ex-workshop",
      "competence-and-responsibilities"
    ],
    "context": "A process change, incomplete drawing, damaged entry, and overdue inspection are found together.",
    "decisionOptions": [
      "Treat each issue as a minor independent observation and permit continuous operation",
      "Sign off the overdue inspection as complete to reduce the open risk count",
      "Apply immediate safety controls, document the combined risks, and escalate for cross-discipline review",
      "Replace the damaged cable gland only and disregard the process change and drawing errors"
    ],
    "correctChoice": 2,
    "explanation": "Multiple connected uncertainties require a coordinated response rather than isolated assumptions.",
    "consequence": "Integrated escalation helps the responsible team review area, equipment, installation, and lifecycle evidence together.",
    "recommendedAction": "Use the site risk, isolation, defect, and competent-review processes."
  },
  {
    "id": "cable-gland-selection",
    "title": "Selecting a cable gland for an Ex d enclosure",
    "level": "Advanced",
    "lessonIds": [
      "glands-and-cable-entries",
      "ex-d-ex-e"
    ],
    "context": "An Ex d IIC junction box has an M25 threaded entry. The installed cable is 16mm diameter SWA (steel wire armoured). You need to select a replacement gland from three available options: (1) An uncertified industrial M25 gland rated IP66, (2) A certified Ex d IIC M25 barrier gland with a sealing range of 12-18mm, (3) A certified Ex e IIC M25 gland with a sealing range of 14-20mm.",
    "decisionOptions": [
      "Select option 1 — the IP66 rating exceeds the normal industrial requirement and the thread size matches",
      "Select option 2 — it is Ex d certified for IIC, the thread matches, and the cable diameter is within the sealing range",
      "Select option 3 — it has the highest gas group certification and the widest sealing range",
      "Use option 1 temporarily and order the correct gland for installation at the next shutdown"
    ],
    "correctChoice": 1,
    "explanation": "The gland protection concept must match or exceed the enclosure concept (Ex d needs Ex d). Thread, gas group, and cable dimensions must also match.",
    "consequence": "Using an Ex e gland or uncertified gland on an Ex d enclosure destroys the flameproof integrity.",
    "recommendedAction": "Verify that the selected cable gland matches the enclosure protection concept, thread type/size, and cable dimensions."
  }
]
