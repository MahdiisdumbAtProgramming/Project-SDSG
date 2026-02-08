const initialFilesystem = [
  { id: "term", type: "app", name: "Terminal", icon: "📟" },
  { 
    id: "todo", type: "file", name: "TODO.txt", icon: "📝",
    content: "CASE ID: GOON-COURT-2026/nDETECTIVE: Jason Hernandez/nTASKS:/n1. Look at their crimes by the PDF Files./n2. Roles:/n- Defendant: Castiel Salese/n- Defense: Mahdi Hamade/n- Prosecutor: Christian Gonzalez/n3. No cross examination./n4. Double check./n5. Terminal command:/nVERDICT Name Crime Penalty"
  },
  { 
    id: "files", type: "folder", name: "Files", icon: "📂", children: [
      { id: "Mahdi", type: "folder", name: "Mahdi-Hamade", icon: "🛡️", children: [
        { 
          id: "m_crimes", type: "file", name: "Hamade_Files.pdf", icon: "📄",
          content: "Mahdi Hussain Hamade/n2012.11.21/nAge: 13/nRole: Defense/nDefending Castiel and justifying his NNN loss/nCrimes done in past:/n- /RADACT Character AI GOONING RADACT\\ For 4 WEEKS, stopped after conscience kicked in/n- Prayed too quickly (multiple offenses)/n- Wished upon someone's downfall (Jahanam, the coldest deepest part)/n- Cussed many people in Arabic (examples: annabook, celba, xara, himar, Sharmoota, Khinzir, Loty; usually used with Ya=you, ibin=father of, bint=mother of)"
        },
        { id: "m_testimony", type: "file", name: "Mahdi_Testimony.txt", icon: "🤲", content: "[PLACEHOLDER]" }
      ]},
      { id: "Castiel", type: "folder", name: "Castiel-Salese", icon: "☣️", children: [
        { 
          id: "c_crimes", type: "file", name: "Salese_Files.pdf", icon: "📄",
          content: "Castiel Salese/n2013.??.??/nAge: 12/nRole: Defendant/nCrimes:/n- Failing NNN/n- Doing DDD/n- Doing JJJ/n- Doing FFF/n- Doing MMM/n- While having an unjustified loss of NNN"
        },
        { id: "c_testimony", type: "file", name: "Castiel_Testimony.txt", icon: "🙏", content: "[PLACEHOLDER]" }
      ]},
      { id: "Christian", type: "folder", name: "Christian-Gonzalez", icon: "👊", children: [
        { 
          id: "g_crimes", type: "file", name: "Gonzalez_Files.pdf", icon: "📄",
          content: "Christian Gonzalez/n2013.??.??/nAge: 12/nRole: Prosecutor/nCrimes:/n- Prosecuting Castiel Salese for an unjustified loss of NNN/n- While having cases of months of gooning"
        },
        { id: "g_testimony", type: "file", name: "Christian_Testimony.txt", icon: "🗡️", content: "[PLACEHOLDER]" }
      ]}
    ]
  }
];