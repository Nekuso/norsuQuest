window.TeacherTypes = {
  normal: "Normal",
  infotech: "Information Technology",
  comsci: "Computer Science",
  math: "Math",
  science: "Science",
};

window.Teachers = {
  // Information Technology Teachers
  i001: {
    name: "Japhet Fulmaran",
    description: "Teaches App development",
    type: TeacherTypes.infotech,
    src: "resources/images/characters/teachers/i001.png",
    icon: "resources/images/icons/infotech.png",
    actions: ["bonk", "teachLaravel", "regen"],
  },
  i002: {
    name: "Roche Cabanlit",
    description: "Teaches System Administration",
    type: TeacherTypes.infotech,
    src: "resources/images/characters/teachers/i002.png",
    icon: "resources/images/icons/infotech.png",
    actions: ["bonk", "regen"],
  },
  i003: {
    name: "Josephine Munasque",
    description: "Teaches Business Process",
    type: TeacherTypes.infotech,
    src: "resources/images/characters/teachers/i003.png",
    icon: "resources/images/icons/infotech.png",
    actions: ["bonk"],
  },

  // Computer Science Teachers
  c001: {
    name: "Wayne Fostrillo",
    description: "Teaches Web Development",
    type: TeacherTypes.comsci,
    src: "resources/images/characters/teachers/c001.png",
    icon: "resources/images/icons/comsci.png",
    actions: ["bonk", "nWord", "regen"],
  },

  // Math Teachers
  m001: {
    name: "Sami Khayat",
    description: "Teaches Quatitive Method",
    type: TeacherTypes.math,
    src: "resources/images/characters/teachers/m001.png",
    icon: "resources/images/icons/math.png",
    actions: ["bonk", "teachLinear", "regen"],
  },
};
