const initialFilesystem = [
    {id:'term',type:'app',name:'Terminal',icon:'📟'},
    {id:'todo',type:'file',name:'TODO.txt',icon:'📝',content:`
CASE ID: GOON-COURT-2026
DETECTIVE: Jason Hernandez

TASKS:
1. Look at their crimes by the PDF Files.
2. The roles are:
   - Defendant: Castiel Salese (Serial Gooner)
   - Defense: Mahdi Hamade (Intellectual Dumbass/Devout)
   - Prosecutor: Christian Gonzalez (Smart/Harsh Blackmailer)
3. Look at thier Testimonies you cant cross examine because the court is all solo mission
4. Double Check alot of times!
5. FINAL ACTION: Use Terminal to type verdict:
   "VERDICT: [Name] [Judgement] [Penalty]"
`},
    {id:'files',type:'folder',name:'Files',icon:'📂',children:[
        {id:'Mahdi',type:'folder',name:'Mahdi-Hamade',icon:'🛡️',children:[
            {id:'m_crimes',type:'file',name:'Hamade_Files.pdf',icon:'📄',content:'[PLACEHOLDER]'}
            {id:'m_testimony',type:'file',name:'Mahdi_Testimony.txt',icon:'🤲',content:'[PLACEHOLDER]'}
        ]},
        {id:'Castiel',type:'folder',name:'Castiel-Salese',icon:'🚓☣️',children:[
            {id:'c_crimes',type:'file',name:'Salese_Files.pdf',icon:'📄',content:'[PLACEHOLDER]'}
            {id:'c_testimony',type:'file',name:'Castiel_Testimony.txt',icon:'🙏',content:'[PLACEHOLDER]'}
        ]},
        {id:'Christian',type:'folder',name:'Christian-Gonzalez',icon:'👊',children:[
        {id:'g_crimes',type:'file',name:'Gonzalez_Files.pdf',icon:'📄',content:'[PLACEHOLDER]'}
        {id:'g_testimony',type:'file',name:'Christian_Testimony.txt',icon:'🙏',content:'[PLACEHOLDER]'}
        ]
        }
    ]}
];