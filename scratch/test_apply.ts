import fs from 'fs';
import path from 'path';

const quizzesPath = path.resolve('src/data/quizzes.ts');
const originalContent = fs.readFileSync(quizzesPath, 'utf8');
const lines = originalContent.split('\n');

const deleteIds = new Set([
  'q-ex001-18', 'q-ex001-25', 'q-ex001-28', 'q-ex001-29',
  'q-ex007-08', 'q-ex007-09',
  'q-find-06', 'q-find-07', 'q-find-10'
]);

const rewriteLines: Record<string, string> = {
  'q-ex001-08': `    phase6Question('q-ex001-08', "A process plant handles diethyl ether vapour, which has an auto-ignition temperature of 160°C. Under IEC 60079-14, which temperature class represents the minimum acceptable rating for electrical equipment installed in this area", ["T3, because its 200°C limit allows a 40°C thermal margin above the gas ignition point", "T4, because its 135°C maximum surface temperature is strictly below the 160°C auto-ignition temperature", "T1, because standard industrial process equipment is designed for up to 450°C", "T2, because 300°C is permitted provided the equipment is located outdoors"], 1, "Under IEC 60079-14 Clause 5.6.3, the maximum surface temperature of equipment must not exceed the auto-ignition temperature of the flammable gas. Diethyl ether ignites at 160°C; T3 (200°C) and T2 (300°C) would cause ignition. Equipment must be rated at least T4 (max surface temperature 135°C), or T5 (100°C) / T6 (85°C).", "ex001-foundations"),`,

  'q-ex001-10': `    phase6Question('q-ex001-10', "During initial selection review for a hydrogen compressor shelter classified as Zone 1, an engineer specifies an Ex db IIB T4 Gb motor. Why is this selection technically non-compliant under IEC 60079-14", ["Because an Ex db flameproof motor is legally restricted to Zone 2 installations", "Because hydrogen requires a minimum temperature class of T6 under all circumstances", "Because EPL Gb equipment cannot be installed in a Zone 1 classified location", "Because hydrogen is a Group IIC gas, and Group IIB certified equipment is not permitted in Group IIC atmospheres"], 3, "Under IEC 60079-14 Clause 5.6.2, equipment gas grouping must correspond to the gas hazard. Hydrogen belongs to Group IIC. While equipment certified for Group IIC is permitted in Group IIA and IIB, equipment certified only for Group IIB is not certified to contain or quench IIC flame propagation (MESG < 0.5 mm).", "ex001-foundations"),`,

  'q-ex001-14': `    phase6Question('q-ex001-14', "During a site walkdown, an inspector finds an unrecorded manual sampling valve handling liquid propane installed 1.5 m outside the boundary of an outdoor Zone 2 classification area. Standard industrial lighting is installed 2 m from the valve. What is the required technical response", ["Accept the installation without review if the sampling valve is fitted with a threaded pipe plug and remains normally closed", "Immediately treat the valve as an unassessed release source, hold operations, and require a formal classification review under Management of Change", "Rely on open-air natural dilution to dissipate potential leaks before flammable concentrations reach the adjacent lighting fixture", "Re-classify the unrecorded sampling point as a secondary grade release of negligible extent without updating the area classification drawing"], 1, "Under IEC 60079-10-1, any point capable of releasing flammable liquid or gas is a potential source of release that generates a hazardous zone. An unrecorded valve located outside the classified zone exposes adjacent uncertified electrical apparatus to ignition risk. The condition must be held safe and reviewed under formal engineering MOC.", "ex001-foundations", "finding"),`,

  'q-ex001-16': `    phase6Question('q-ex001-16', "An Ex eb junction box with standard nameplate marking (no ambient range indicated) is installed on an unshaded outdoor compressor skid where local ambient summer temperatures reach +48°C. What is the compliance status of this installation under IEC 60079-0 and IEC 60079-14", ["Compliant, because standard Ex equipment certification inherently covers ambient temperatures up to +50°C", "Non-compliant, because unmarked equipment is certified only for -20°C to +40°C; operation at +48°C invalidates the certificate basis of safety", "Compliant, provided the internal terminal blocks operate below 50% of their maximum rated continuous current", "Compliant, because ambient temperature limits apply only to heat-generating rotating machines and luminaires, not static junction boxes"], 1, "Under IEC 60079-0 Clause 5.1.1, the standard certified ambient temperature range is -20°C to +40°C unless specially marked (e.g. Ta -20°C to +55°C). Operating unmarked equipment in a +48°C ambient violates certification limits, risking insulation thermal degradation and exceeding certified surface temperatures.", "ex001-foundations"),`,

  'q-ex001-24': `    phase6Question('q-ex001-24', "During an initial inspection of a newly painted Ex d flameproof control station, an inspector observes that the flanged cover was painted while open, leaving a 120 μm layer of cured industrial epoxy on the flamepath mating surfaces. What is the technical evaluation under IEC 60079-14 and IEC 60079-17", ["Acceptable, because epoxy primer provides certified corrosion protection to the machined surfaces", "Acceptable, provided the enclosure cover fasteners are torqued 20% above nominal rating to compress the paint film", "A non-conformity; flamepaths must not be painted because paint compromises flamepath gap dimensions and can burn through during an internal explosion", "Acceptable, provided a non-hardening grease is applied over the cured epoxy before closing the cover"], 2, "Under IEC 60079-14 Clause 10.6.1 and IEC 60079-17 Table 1, painting flamepath joint surfaces is prohibited. Cured paint introduces an uncontrolled gap dimension, prevents true metal-to-metal flame quenching, and can burn or decompose during an explosion, allowing flame transmission to the outside atmosphere.", "ex001-foundations", "finding"),`,

  'q-ex001-30': `    phase6Question('q-ex001-30', "An engineering contractor evaluates an intrinsically safe 4-20 mA loop but lacks cable manufacturer datasheets for an existing 450 m cable. The contractor assumes a default capacitance of 80 pF/m and signs off the loop. What is the technical issue under IEC 60079-14", ["Default cable parameters cannot be assumed; cable electrical parameters (Cc and Lc or Lc/Rc) must be verified from manufacturer data or measured directly", "Default values are permitted, but only if the overall cable length is under 500 metres", "Intrinsically safe loops do not require cable capacitance verification if the barrier provides galvanic isolation", "Cable parameters only require verification if the field instrument contains internal inductors"], 0, "Under IEC 60079-14 Clause 16.2.2.2, cable electrical parameters (capacitance and inductance, or L/R ratio) must be determined from the cable manufacturer's specification or through direct measurement. Unvalidated assumptions can lead to exceeding barrier Co or Lo limits, creating a spark ignition hazard.", "ex001-foundations", "boundary"),`,

  'q-ex001-33': `    phase6Question('q-ex001-33', "An instrument control unit nameplate displays the marking Ex db eb [ia Ga] IIC T4 Gb. How should an installation inspector interpret the physical arrangement and rating of this equipment", ["The unit is certified exclusively as an intrinsically safe sensor that must be physically installed inside Zone 0", "The main enclosure is flameproof (Ex db) with an increased safety (Ex eb) terminal chamber, containing associated apparatus with IS circuits capable of connecting into Zone 0", "The enclosure is pressurised (Ex p) with dual containment and flameproof internal relays", "The apparatus is non-sparking (Ex ec) with intrinsically safe galvanic barriers suitable only for Zone 2"], 1, "Under IEC 60079-0 Clause 29.4, composite marking describes combined protection concepts: Ex db designates the flameproof body, Ex eb designates the increased safety terminal box, and square brackets [ia Ga] indicate associated apparatus providing intrinsically safe circuits extending into Zone 0, with an overall equipment rating of EPL Gb (Zone 1).", "ex001-foundations", "finding"),`,

  'q-ex001-35': `    phase6Question('q-ex001-35', "An intrinsically safe loop calculation evaluates a barrier with Co = 100 nF. The transmitter has Ci = 20 nF and is connected via 300 m of instrument cable specified at 150 pF/m. What is the total circuit capacitance and its compliance status under IEC 60079-14", ["Total capacitance is 65 nF (20 nF + 45 nF), which is <= Co (100 nF) and therefore compliant", "Total capacitance is 470 nF (20 nF + 450 nF), which exceeds Co (100 nF) and is non-compliant", "Total capacitance is 20.045 nF, because cable picofarads are negligible compared to nanofarads", "Total capacitance is 45 nF, because transmitter internal capacitance Ci is ignored in simple loops"], 0, "Cable capacitance equals 300 m * 150 pF/m = 45,000 pF = 45 nF. Total lumped capacitance Ci + Cc = 20 nF + 45 nF = 65 nF. Under IEC 60079-14 Clause 16.2.4.3, since 65 nF <= Co (100 nF), the circuit satisfies the permitted capacitance limit.", "ex001-foundations", "calculation"),`,

  'q-ex007-01': `    phase6Question('q-ex007-01', "During the initial installation verification of an Ex eb increased safety terminal box under IEC 60079-14, which documents must be cross-referenced against the physical field installation", ["The manufacturer's standard commercial catalogue cut-sheet and the mechanical piping isometric drawing", "The hazardous area classification drawing, equipment certificate schedule, manufacturer instructions, and cable/earthing design schedule", "The general plant architectural elevation drawing and the civil foundation handover certificate", "The control system functional design specification and software logic flowchart"], 1, "Under IEC 60079-14 Clause 4.2, the verification dossier must contain the area classification documentation, equipment certificates and schedules, manufacturer installation instructions, and design schedules detailing cable and earthing parameters to confirm field compliance before energization.", 'ex007-installation-practice'),`,

  'q-ex007-03': `    phase6Question('q-ex007-03', "An installer needs to fit an M20 certified Ex d cable gland into an Ex d junction box that has M25 threaded entry holes. Under IEC 60079-14, which method is technically compliant", ["Wrap the M20 gland threads in lead foil or excess PTFE tape until it achieves a tight mechanical fit in the M25 hole", "Install a certified Ex d thread adaptor (M25 male to M20 female) with matching thread pitch and certified IP washer", "Install two generic non-certified threaded brass reducers in series to step down the entry thread size", "Machine the M25 entry hole on site using a hand tap to create an oversized non-standard thread form"], 1, "Under IEC 60079-14 Clause 9.3.5, thread adaptors must be certified Ex components matching the enclosure protection concept and thread form. Using PTFE tape to bridge thread size differences or cascading multiple adaptors is strictly prohibited.", 'ex007-installation-practice'),`,

  'q-ex007-10': `    phase6Question('q-ex007-10', "An inspector arrives at a pump skid with an inspection ticket for motor P-101B (duty/standby service). The field motor at that physical location is tagged P-101A. What is the required technical action under IEC 60079-17", ["Perform the inspection and sign off P-101B, assuming identical mechanical and electrical duty", "Deface tag P-101A with a hand punch and re-tag it as P-101B to match the work order", "Hold the inspection, record the tag discrepancy, verify the plant P&ID/equipment register, and ensure both assets are correctly identified before completing records", "Complete the inspection as P-101B but note in the free-text comments that the motor may be P-101A"], 2, "Under IEC 60079-17 Clause 4.2, equipment register traceability is safety-critical. Inspecting an asset with a mismatched tag invalidates historical records, risks missing unverified equipment, and corrupts maintenance dossier integrity. The conflict must be resolved with controlled engineering data.", 'ex007-installation-practice', 'finding'),`,

  'q-ex007-24': `    phase6Question('q-ex007-24', "During a Detailed inspection of an Ex d motor, an inspector uses a 0.25 mm feeler gauge that fully penetrates a flanged flamepath joint where the maximum permitted gap is 0.15 mm. To produce defensible non-conformity evidence, how should the defect photograph be captured", ["A macro shot showing only the feeler gauge blade without any enclosure features or context", "An eye-level photograph of the motor junction box taken with the terminal cover removed", "A clear photograph showing the feeler gauge inserted with marked blade thickness visible, contextual framing showing the motor asset tag, and exact joint location", "A wide-angle photograph of the motor skid taken from outside the unit boundary fence"], 2, "Under IEC 60079-17 Clause 4.3, inspection evidence must be objective, verifiable, and traceable. A defensible defect photo must clearly display the measurement tool/gauge marking, the exact physical defect location, and the equipment asset tag for unambiguous attribution.", "ex007-installation-practice", "finding"),`,

  'q-find-05': `    phase6Question('q-find-05', "During an inspection of an energized Ex d flameproof junction box in a Zone 1 area, an inspector discovers that two adjacent cover bolts are missing, leaving a visible 1.0 mm gap between the flange faces. What is the immediate required action under IEC 60079-17", ["Log the finding as a routine defect and schedule replacement bolts for the next planned plant turnaround", "Immediately arrange for safe electrical isolation of the circuit, maintain safe control, and notify operations because explosion containment is compromised", "Inject high-temperature silicone RTV sealant into the flange gap and allow the junction box to remain energized", "Tighten the remaining bolts beyond their certified torque rating to pull the flange surfaces together"], 1, "Under IEC 60079-17 Clause 4.3.1, defects that directly compromise the explosion protection concept—such as missing Ex d cover fasteners causing an open flamepath gap—represent an active ignition risk in a hazardous zone. The equipment must be safely isolated immediately before permanent repairs are performed.", 'ex008-inspection', 'finding'),`,

  'q-ex008-30': `    phase6Question('q-ex008-30', "Which of the following field inspection log entries represents an actionable and defensible Detailed inspection finding under IEC 60079-17", ["Asset JB-042 (Zone 1, Gas Group IIB): Detailed inspection found flanged flamepath gap measured at 0.25 mm with calibrated feeler gauge (max certified gap 0.15 mm). Non-conformity per IEC 60079-17 Table 1 Item B1. Priority 1; isolate circuit; assigned to Electrical Team.", "Enclosure in Zone 1 inspected; cover flamepath appears to have some clearance issues that should be monitored during routine rounds.", "Detailed inspection completed for compressor junction box; equipment verified as generally compliant with visual standards.", "Flameproof box inspected; technician recommends replacing entire assembly due to general age and service conditions."], 0, "Under IEC 60079-17 Clause 4.2 and Table 1, an actionable finding requires traceable asset identification, zone classification, inspection grade, objective physical measurements compared against certified limits, standard reference, risk priority, and assigned ownership.", "ex008-inspection", "finding"),`
};

let deletedCount = 0;
let rewrittenCount = 0;
let keptCount = 0;

const newLines: string[] = [];

for (const line of lines) {
  let isDelete = false;
  for (const delId of deleteIds) {
    if (line.includes(`'${delId}'`) || line.includes(`"${delId}"`)) {
      isDelete = true;
      deletedCount++;
      break;
    }
  }
  if (isDelete) {
    continue;
  }

  let isRewrite = false;
  for (const [rwId, rwLine] of Object.entries(rewriteLines)) {
    if (line.includes(`'${rwId}'`) || line.includes(`"${rwId}"`)) {
      isRewrite = true;
      rewrittenCount++;
      newLines.push(rwLine);
      break;
    }
  }
  if (isRewrite) {
    continue;
  }

  newLines.push(line);
}

console.log(`Deleted lines matched: ${deletedCount}`);
console.log(`Rewritten lines matched: ${rewrittenCount}`);

// Let's write to a temporary file and verify it
const tempPath = path.resolve('scratch/test_quizzes.ts');
fs.writeFileSync(tempPath, newLines.join('\n'), 'utf8');
console.log(`Wrote temp file to ${tempPath}`);
