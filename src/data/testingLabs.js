export const qualityKpis = [
  {
    value: "99.8%",
    label: "On-Spec Delivery",
    subtext: "Historical audit rate",
    highlight: true,
  },
  {
    value: "48h",
    label: "Dispatch Speed",
    subtext: "On standard stock lots",
    highlight: false,
  },
  {
    value: "100%",
    label: "Tested Lots",
    subtext: "Thread go/no-go checks",
    highlight: true,
  },
];

export const testingLabs = [
  {
    id: "optical",
    icon: "visibility",
    title: "Optical Comparator & Thread Gauges",
    description: "High-resolution profile projectors and calibrated Mitutoyo thread pitch micrometers verify pitch diameter tolerances within ±0.01 mm per ISO 965.",
    standard: "ISO 965 CLASS 6g",
  },
  {
    id: "tensile",
    icon: "fitness_center",
    title: "Tensile & Proof Load Verification",
    description: "Hydraulic UTM pull testers assess ultimate tensile strength, proof load capacity, and elongation failure points under ISO 898-1 and ASTM F606 guidelines.",
    standard: "UP TO 1000 kN CAPACITY",
  },
  {
    id: "salt-spray",
    icon: "opacity",
    title: "Salt Spray Corrosion Testing (NSS)",
    description: "Standard ASTM B117 neutral salt spray chambers evaluating coating integrity up to 1,500 hours without red rust formation for Ruspert and Geomet finishes.",
    standard: "ASTM B117 / ISO 9227",
  },
  {
    id: "mtr",
    icon: "workspace_premium",
    title: "EN 10204 3.1 Traceability Dossier",
    description: "Complete metallurgical dossiers detailing chemical composition spectrometry, Rockwell/Vickers hardness values, and batch manufacturing heat numbers.",
    standard: "DIGITAL MTR ARCHIVE",
  },
];
