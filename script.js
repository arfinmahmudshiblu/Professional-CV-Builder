"use strict";

const state = {
  selectedTemplate:"professional",
  personal:{fullName:"",jobTitle:"",email:"",phone:"",location:"",linkedin:"",github:"",website:"",photo:""},
  summary:"",
  experience:[ ],
  education:[ ],
  skills:[ ],
  projects:[ ],
  certifications:[ ],
  languages:[ ],
  optional:{awards:"",interests:"",memberships:"",publications:"",references:""}
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
const personalFields = ["fullName","jobTitle","email","phone","location","linkedin","github","website"];
let confirmAction = null;
let toastTimer = null;

function createElement(tag,className,text) {
  const node=document.createElement(tag);
  if(className) node.className=className;
  if(text!==undefined) node.textContent=text;
  return node;
}

function isDataMeaningful() {
  const p=state.personal;
  return Boolean(p.fullName || p.jobTitle || p.email || p.phone || p.location || p.linkedin || p.github || p.website ||
    state.summary || state.experience.some(hasMeaningfulExperience) || state.education.some(hasMeaningfulEducation) ||
    state.skills.length || state.projects.some(hasMeaningfulProject) || state.certifications.some(hasMeaningfulCertification) ||
    state.languages.some(hasMeaningfulLanguage) || Object.values(state.optional).some(v=>v.trim()));
}
function hasMeaningfulExperience(e){ return Object.entries(e).some(([k,v])=>k==="current" ? v : Boolean(String(v||"").trim())); }
function hasMeaningfulEducation(e){ return Object.values(e).some(v=>Boolean(String(v||"").trim())); }
function hasMeaningfulProject(p){ return Object.values(p).some(v=>Boolean(String(v||"").trim())); }
function hasMeaningfulCertification(c){ return Object.values(c).some(v=>Boolean(String(v||"").trim())); }
function hasMeaningfulLanguage(l){ return Object.values(l).some(v=>Boolean(String(v||"").trim())); }
function formatDate(value) {
  if(!value) return "";
  const [year,month]=value.split("-");
  if(!year) return "";
  if(!month) return year;
  return new Date(Number(year),Number(month)-1).toLocaleDateString(undefined,{month:"short",year:"numeric"});
}

function showToast(message,type="") {
  const toast=$("#toast");
  toast.textContent=message;
  toast.className=`toast show ${type}`.trim();
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.className="toast",2600);
}

function openConfirm(title,message,onConfirm) {
  $("#confirmTitle").textContent=title;
  $("#confirmMessage").textContent=message;
  confirmAction=onConfirm;
  $("#confirmDialog").showModal();
}
function closeConfirm(){ confirmAction=null; if($("#confirmDialog").open) $("#confirmDialog").close(); }

$("#confirmCancel").addEventListener("click",closeConfirm);
$("#confirmContinue").addEventListener("click",()=>{ const action=confirmAction; closeConfirm(); if(action) action(); });
$("#confirmDialog").addEventListener("cancel",closeConfirm);

$("#navToggle").addEventListener("click",()=>{
  const open=$("#mainNav").classList.toggle("open");
  $("#navToggle").setAttribute("aria-expanded",String(open));
});
$$(".main-nav a").forEach(link=>link.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#navToggle").setAttribute("aria-expanded","false");}));

function cloneTemplateCards() {
  const source=$("#templateGrid");
  const target=$("#builderTemplateGrid");
  target.replaceChildren();
  $$(".template-card",source).forEach(card=>{
    const clone=card.cloneNode(true);
    clone.setAttribute("aria-pressed","false");
    target.append(clone);
  });
}
cloneTemplateCards();

function selectTemplate(template) {
  state.selectedTemplate=template;
  $$(".template-card").forEach(card=>{
    const selected=card.dataset.template===template;
    card.classList.toggle("selected",selected);
    card.setAttribute("aria-pressed",String(selected));
  });
  renderPreview();
}
function templateCardHandler(card) {
  selectTemplate(card.dataset.template);
  showToast(`${card.querySelector("h3").textContent} template selected.`,"success");
}
$("#templateGrid").addEventListener("click",event=>{
  const card=event.target.closest(".template-card");
  if(card) templateCardHandler(card);
});
$("#builderTemplateGrid").addEventListener("click",event=>{
  const card=event.target.closest(".template-card");
  if(card) templateCardHandler(card);
});
document.addEventListener("keydown",event=>{
  if((event.key==="Enter"||event.key===" ") && event.target.classList.contains("template-card")){
    event.preventDefault();
    templateCardHandler(event.target);
  }
});
selectTemplate("professional");

function goToStep(step) {
  step=Number(step);
  if(step===4 && !validateForPreview()) return;
  if(step===3 && !validateForPreview()) return;
  for(let i=1;i<=4;i++) $("#stage"+i).hidden=i!==step;
  $$("#progress li").forEach(li=>{
    const stage=Number(li.dataset.stage);
    li.classList.toggle("active",stage===step);
    li.classList.toggle("complete",stage<step);
  });
  if(step===3) renderReview();
  if(step===4) updateDownloadStatus();
  if(step>=2) setTimeout(()=>$("#create").scrollIntoView({behavior:"smooth",block:"start"}),20);
}
document.addEventListener("click",event=>{
  const control=event.target.closest("[data-go-step]");
  if(control) goToStep(control.dataset.goStep);
});

function validateForPreview() {
  let valid=true;
  const name=state.personal.fullName.trim();
  const nameError=$("#fullNameError");
  nameError.textContent=name?"":"Full name is required.";
  $("#fullName").classList.toggle("invalid",!name);
  valid=name.length>0;
  ["email","linkedin","github","website"].forEach(field=>{
    const input=$("#"+field);
    const error=$("#"+field+"Error");
    const value=state.personal[field]||input.value.trim();
    let message="";
    if(value){
      if(field==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message="Enter a valid email address.";
      if(field!=="email"){ try { const url=new URL(value); if(!["http:","https:"].includes(url.protocol)) throw new Error(); } catch { message="Enter a complete URL beginning with http:// or https://."; } }
    }
    if(error) error.textContent=message;
    input.classList.toggle("invalid",Boolean(message));
    if(message) valid=false;
  });
  if(!valid){ showToast("Please correct the highlighted fields.","error"); }
  else if(!isDataMeaningful()){ showToast("Add some CV information before continuing.","error"); return false; }
  return valid;
}

personalFields.forEach(field=>{
  const input=$("#"+field);
  input.addEventListener("input",()=>{ state.personal[field]=input.value; clearFieldError(field); renderPreview(); });
});
function clearFieldError(field){ if($("#"+field+"Error")) $("#"+field+"Error").textContent=""; $("#"+field).classList.remove("invalid"); }

["summary","awards","interests","memberships","publications","references"].forEach(field=>{
  const input=$("#"+field);
  input.addEventListener("input",()=>{
    if(field==="summary") state.summary=input.value;
    else state.optional[field]=input.value;
    renderPreview();
  });
});

function escapeForTemplate(value){ return String(value||""); }
function fieldInput(type,title,field,value="",options={}) {
  const id=`${type || "repeat"}-${field}-${Math.random().toString(36).slice(2,7)}`;
  const wrap=createElement("div","field");
  const label=createElement("label","",title);
  label.htmlFor=id;
  let input;
  if(options.textarea){input=createElement("textarea");input.rows=options.rows||3;}
  else if(options.select){input=createElement("select");options.values.forEach(v=>{const o=createElement("option","",v);o.value=v;input.append(o);});}
  else{input=createElement("input");input.type=options.type||"text";if(options.placeholder)input.placeholder=options.placeholder;}
  input.id=id;input.value=value;input.dataset.field=field;
  wrap.append(label,input);
  return wrap;
}

function repeatCard(type,item,index) {
  const card=createElement("div","repeat-card");
  card.dataset.array=type; card.dataset.index=String(index);
  const remove=createElement("button","text-button remove-entry","Remove");
  remove.type="button";remove.dataset.removeEntry=type;remove.dataset.index=String(index);
  remove.setAttribute("aria-label",`Remove ${type} entry ${index+1}`);
  card.append(remove);
  const fields=createElement("div","repeat-card-fields");
  card.append(fields);
  return {card,fields};
}
function addField(container,title,field,value,options={}){ const wrap=fieldInput(container.dataset.array||"",title,field,value,options); wrap.dataset.fieldContainer="true"; container.append(wrap); return wrap.querySelector("input,textarea,select"); }

function renderExperience(){
  const list=$("#experienceList");list.replaceChildren();
  state.experience.forEach((item,index)=>{
    const {card,fields}=repeatCard("experience",item,index);
    let i=addField(fields,"Job Title","jobTitle",item.jobTitle);i.dataset.field="jobTitle";
    i=addField(fields,"Company Name","company",item.company);i.dataset.field="company";
    i=addField(fields,"Employment Type","employment",item.employment,{placeholder:"Full-time, Contract"});i.dataset.field="employment";
    i=addField(fields,"Location","location",item.location);i.dataset.field="location";
    i=addField(fields,"Start Date","startDate",item.startDate,{type:"month"});i.dataset.field="startDate";
    i=addField(fields,"End Date","endDate",item.endDate,{type:"month"});i.dataset.field="endDate";
    i=addField(fields,"Responsibilities and Achievements","description",item.description,{textarea:true,rows:4});i.parentElement.classList.add("full");i.dataset.field="description";
    const checkboxWrap=createElement("label","checkbox-row");
    const checkbox=createElement("input");checkbox.type="checkbox";checkbox.checked=Boolean(item.current);checkbox.dataset.field="current";
    checkboxWrap.append(checkbox,createElement("span","","Currently working here"));
    fields.append(checkboxWrap);
    list.append(card);
  });
  syncRepeaterDisabled(list,"experience");
}
function renderEducation(){
  const list=$("#educationList");list.replaceChildren();
  state.education.forEach((item,index)=>{
    const {card,fields}=repeatCard("education",item,index);
    [["Degree / Qualification","degree",item.degree,{}],["Institution Name","institution",item.institution,{}],["Department / Field","department",item.department,{}],["Start Date","startDate",item.startDate,{type:"month"}],["End Date","endDate",item.endDate,{type:"month"}],["Grade / CGPA","grade",item.grade,{}],["Description","description",item.description,{textarea:true,rows:3}]].forEach(args=>{
      const input=addField(fields,...args);input.dataset.field=args[1];if(args[1]==="description")input.parentElement.classList.add("full");
    });
    list.append(card);
  });
}
function renderProjects(){
  const list=$("#projectList");list.replaceChildren();
  state.projects.forEach((item,index)=>{
    const {card,fields}=repeatCard("projects",item,index);
    [["Project Name","name",item.name,{}],["Technologies Used","technologies",item.technologies,{}],["Project URL","url",item.url,{type:"url",placeholder:"https://"}],["Short Description","description",item.description,{textarea:true,rows:3}]].forEach(args=>{
      const input=addField(fields,...args);input.dataset.field=args[1];if(args[1]==="description")input.parentElement.classList.add("full");
    });
    list.append(card);
  });
}
function renderCertifications(){
  const list=$("#certificationList");list.replaceChildren();
  state.certifications.forEach((item,index)=>{
    const {card,fields}=repeatCard("certifications",item,index);
    [["Certification Name","name",item.name,{}],["Issuing Organization","organization",item.organization,{}],["Issue Date","date",item.date,{type:"month"}],["Credential URL","url",item.url,{type:"url",placeholder:"https://"}]].forEach(args=>{
      const input=addField(fields,...args);input.dataset.field=args[1];
    });
    list.append(card);
  });
}
function renderLanguages(){
  const list=$("#languageList");list.replaceChildren();
  state.languages.forEach((item,index)=>{
    const {card,fields}=repeatCard("languages",item,index);
    const nameInput=addField(fields,"Language","name",item.name);nameInput.dataset.field="name";
    const prof=addField(fields,"Proficiency","proficiency",item.proficiency,{select:true,values:["","Beginner","Conversational","Professional","Native / Fluent"]});prof.dataset.field="proficiency";
    if(item.proficiency) prof.value=item.proficiency;
    list.append(card);
  });
}
function renderSkills(){
  const tags=$("#skillTags");tags.replaceChildren();
  state.skills.forEach((skill,index)=>{
    const tag=createElement("span","skill-tag");
    tag.append(createElement("span","",skill));
    const remove=createElement("button","","×");remove.type="button";remove.dataset.removeSkill=String(index);remove.setAttribute("aria-label",`Remove ${skill}`);
    tag.append(remove);tags.append(tag);
  });
}

document.addEventListener("input",event=>{
  const input=event.target;
  if(!input.dataset.field) return;
  const card=input.closest(".repeat-card");
  if(!card) return;
  const arrayName=card.dataset.array;
  const index=Number(card.dataset.index);
  let value=input.type==="checkbox"?input.checked:input.value;
  state[arrayName][index][input.dataset.field]=value;
  if(arrayName==="experience"&&input.dataset.field==="current") syncRepeaterDisabled(card,"experience");
  renderPreview();
});
document.addEventListener("change",event=>{
  if(!event.target.dataset.field) return;
  event.target.dispatchEvent(new Event("input",{bubbles:true}));
});
function syncRepeaterDisabled(root,type){
  if(type!=="experience") return;
  const cards=root.classList&&root.classList.contains("repeat-card")?[root]:$$(".repeat-card",root);
  cards.forEach(card=>{
    const checkbox=$('input[data-field="current"]',card);
    const end=$('input[data-field="endDate"]',card);
    if(checkbox&&end){end.disabled=checkbox.checked;end.title=checkbox.checked?"Current role uses Present in the CV":"";}
  });
}

function addEntry(arrayName,empty) {
  state[arrayName].push(empty);
  ({experience:renderExperience,education:renderEducation,projects:renderProjects,certifications:renderCertifications,languages:renderLanguages}[arrayName])();
  renderPreview();
}
$("#addExperience").addEventListener("click",()=>addEntry("experience",{jobTitle:"",company:"",employment:"",location:"",startDate:"",endDate:"",current:false,description:""}));
$("#addEducation").addEventListener("click",()=>addEntry("education",{degree:"",institution:"",department:"",startDate:"",endDate:"",grade:"",description:""}));
$("#addProject").addEventListener("click",()=>addEntry("projects",{name:"",description:"",technologies:"",url:""}));
$("#addCertification").addEventListener("click",()=>addEntry("certifications",{name:"",organization:"",date:"",url:""}));
$("#addLanguage").addEventListener("click",()=>addEntry("languages",{name:"",proficiency:""}));

document.addEventListener("click",event=>{
  if(event.target.dataset.removeEntry){
    const type=event.target.dataset.removeEntry,index=Number(event.target.dataset.index);
    state[type].splice(index,1);
    ({experience:renderExperience,education:renderEducation,projects:renderProjects,certifications:renderCertifications,languages:renderLanguages}[type])();
    renderPreview();
  }
  if(event.target.dataset.removeSkill!==undefined){
    state.skills.splice(Number(event.target.dataset.removeSkill),1);renderSkills();renderPreview();
  }
});
$("#addSkill").addEventListener("click",()=>{
  const input=$("#skillInput"),skill=input.value.trim();
  if(!skill){showToast("Enter a skill before adding it.","error");input.focus();return;}
  if(!state.skills.includes(skill)){state.skills.push(skill);renderSkills();renderPreview();input.value="";input.focus();}
  else showToast("That skill is already added.","error");
});
$("#skillInput").addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventEventDefault?event.preventEventDefault():event.preventDefault();$("#addSkill").click();}});

function appendCVSection(cv,title,entries) {
  if(!entries || !entries.length) return;
  const section=createElement("section","cv-section");
  section.append(createElement("h2","cv-section-title",title));
  entries.forEach(entry=>section.append(entry));
  cv.append(section);
}
function appendTextSection(cv,title,text) {
  if(!text||!text.trim()) return;
  const section=createElement("section","cv-section");
  section.append(createElement("h2","cv-section-title",title));
  const p=createElement("p","cv-description",text.trim());
  section.append(p);cv.append(section);
}
function safeLink(value,text) {
  if(!value||!/^https?:\/\//i.test(value.trim())) return null;
  const link=createElement("a","",text||value.trim());
  try { link.href=new URL(value.trim()).href; } catch { return null; }
  link.target="_blank";link.rel="noopener";
  return link;
}
function addContactLine(container,text) {
  if(text) container.append(createElement("span","",text));
}
function buildHeader() {
  const header=createElement("header","cv-header");
  if(state.personal.photo){
    const photo=createElement("img","cv-header-photo");
    photo.src=state.personal.photo;
    photo.alt="Profile photograph";
    header.append(photo);
  }
  const name=createElement("h1","",state.personal.fullName.trim()||"Your Name");
  const title=createElement("p","cv-title",state.personal.jobTitle.trim());
  header.append(name,title);
  const contact=createElement("div","cv-contact");
  addContactLine(contact,state.personal.email);
  addContactLine(contact,state.personal.phone);
  addContactLine(contact,state.personal.location);
  ["linkedin","github","website"].forEach(field=>{
    const link=safeLink(state.personal[field],field==="linkedin"?"LinkedIn":field==="github"?"GitHub":"Portfolio");
    if(link) contact.append(link);
  });
  header.append(contact);
  return header;
}
function buildSummary() {
  if(!state.summary.trim()) return null;
  const section=createElement("section","cv-section cv-summary");
  section.append(createElement("h2","cv-section-title","Professional Summary"));
  section.append(createElement("p","cv-description",state.summary.trim()));
  return section;
}
function buildExperience() {
  const nodes=[];
  state.experience.forEach(item=>{
    if(!hasMeaningfulExperience(item)) return;
    const entry=createElement("article","cv-entry");
    const head=createElement("div","cv-entry-head");
    const left=createElement("div");
    left.append(createElement("h3","",item.jobTitle||"Role"));
    if(item.company) left.append(createElement("div","cv-meta",item.company+(item.employment?" • "+item.employment:"")));
    head.append(left);
    const date=createElement("div","cv-meta",(formatDate(item.startDate)||"")+(item.startDate||item.endDate||item.current?" — ":"")+(item.current?"Present":formatDate(item.endDate)));
    head.append(date);entry.append(head);
    if(item.location) entry.append(createElement("div","cv-meta",item.location));
    if(item.description) entry.append(createElement("p","cv-description",item.description.trim()));
    nodes.push(entry);
  });
  return nodes;
}
function buildEducation() {
  const nodes=[];
  state.education.forEach(item=>{
    if(!hasMeaningfulEducation(item)) return;
    const entry=createElement("article","cv-entry");
    const head=createElement("div","cv-entry-head");
    const left=createElement("div");
    left.append(createElement("h3","",item.degree||"Qualification"));
    const institution=[item.institution,item.department,item.grade].filter(Boolean).join(" • ");
    if(institution) left.append(createElement("div","cv-meta",institution));
    head.append(left);
    const date=createElement("div","cv-meta",(formatDate(item.startDate)||"")+(item.startDate||item.endDate?" — ":"")+formatDate(item.endDate));
    head.append(date);entry.append(head);
    if(item.description) entry.append(createElement("p","cv-description",item.description.trim()));
    nodes.push(entry);
  });
  return nodes;
}
function buildProjects() {
  const nodes=[];
  state.projects.forEach(item=>{
    if(!hasMeaningfulProject(item)) return;
    const entry=createElement("article","cv-entry");
    const head=createElement("div","cv-entry-head");
    head.append(createElement("h3","",item.name||"Project"));
    const link=safeLink(item.url,"View project");
    if(link) head.append(link);
    entry.append(head);
    if(item.technologies) entry.append(createElement("div","cv-meta","Technologies: "+item.technologies));
    if(item.description) entry.append(createElement("p","cv-description",item.description.trim()));
    nodes.push(entry);
  });
  return nodes;
}
function buildCertifications() {
  const nodes=[];
  state.certifications.forEach(item=>{
    if(!hasMeaningfulCertification(item)) return;
    const entry=createElement("article","cv-entry");
    const head=createElement("div","cv-entry-head");
    head.append(createElement("h3","",item.name||"Certification"));
    if(item.date) head.append(createElement("div","cv-meta",formatDate(item.date)));
    entry.append(head);
    if(item.organization) entry.append(createElement("div","cv-meta",item.organization));
    const link=safeLink(item.url,"Credential");
    if(link) entry.append(link);
    nodes.push(entry);
  });
  return nodes;
}
function buildLanguages() {
  const nodes=[];
  state.languages.forEach(item=>{
    if(!hasMeaningfulLanguage(item)) return;
    const entry=createElement("article","cv-entry");
    entry.append(createElement("p","",item.name+(item.proficiency?" — "+item.proficiency:"")));
    nodes.push(entry);
  });
  return nodes;
}
function buildSkillsNodes() {
  if(!state.skills.length) return null;
  const wrap=createElement("div","cv-skills");
  state.skills.forEach(skill=>wrap.append(createElement("span","cv-skill",skill)));
  return wrap;
}
function appendMainSections(cv,options={}) {
  const summary=buildSummary();if(summary) cv.append(summary);
  appendCVSection(cv,"Work Experience",buildExperience());
  appendCVSection(cv,"Education",buildEducation());
  if(buildSkillsNodes()) appendCVSection(cv,"Skills",[buildSkillsNodes()]);
  appendCVSection(cv,"Projects",buildProjects());
  appendCVSection(cv,"Certifications",buildCertifications());
  appendCVSection(cv,"Languages",buildLanguages());
  appendTextSection(cv,"Awards and Achievements",state.optional.awards);
  appendTextSection(cv,"Volunteer Experience / Interests",state.optional.interests);
  appendTextSection(cv,"Professional Memberships",state.optional.memberships);
  appendTextSection(cv,"Publications",state.optional.publications);
  appendTextSection(cv,"References",state.optional.references);
}
function renderCV(container) {
  container.className=`cv-preview template-${state.selectedTemplate}`;
  container.replaceChildren();
  if(!isDataMeaningful()){
    const empty=createElement("div","empty-preview");
    empty.append(createElement("h3","","Start your professional CV"));
    empty.append(createElement("p","","Enter your details or fill with sample data to see a live preview."));
    container.append(empty);return;
  }
  if(state.selectedTemplate==="colorful"){
    const sidebar=createElement("aside","cv-sidebar");
    if(state.personal.photo){const img=createElement("img","cv-photo");img.src=state.personal.photo;img.alt="Profile photograph";sidebar.append(img);}
    const miniHeader=buildHeader();sidebar.append(miniHeader);
    const contactSidebar=createElement("div","cv-section");
    contactSidebar.append(createElement("h2","cv-section-title","Contact"));
    [state.personal.email,state.personal.phone,state.personal.location].forEach(v=>{if(v)contactSidebar.append(createElement("p","",v));});
    ["linkedin","github","website"].forEach(field=>{const link=safeLink(state.personal[field],field==="linkedin"?"LinkedIn":field==="github"?"GitHub":"Portfolio");if(link)contactSidebar.append(link);});
    sidebar.append(contactSidebar);
    const skills=createElement("section","cv-section");skills.append(createElement("h2","cv-section-title","Skills"));
    const skillNodes=buildSkillsNodes();
    if(skillNodes){skills.append(skillNodes);sidebar.append(skills);}
    const main=createElement("div","cv-main");
    const summary=buildSummary();if(summary) main.append(summary);
    appendCVSection(main,"Work Experience",buildExperience());
    appendCVSection(main,"Education",buildEducation());
    appendCVSection(main,"Projects",buildProjects());
    appendCVSection(main,"Certifications",buildCertifications());
    appendCVSection(main,"Languages",buildLanguages());
    appendTextSection(main,"Awards and Achievements",state.optional.awards);
    appendTextSection(main,"Volunteer Experience / Interests",state.optional.interests);
    appendTextSection(main,"Professional Memberships",state.optional.memberships);
    appendTextSection(main,"Publications",state.optional.publications);
    appendTextSection(main,"References",state.optional.references);
    container.append(sidebar,main);
  }else{
    container.append(buildHeader());
    appendMainSections(container);
  }
}
function renderPreview(){
  renderCV($("#cvPreview"));
  if(!$("#stage3").hidden) renderCV($("#cvPreviewReview"));
  updateDownloadStatus();
}
function renderReview(){
  renderCV($("#cvPreviewReview"));
  const review=$("#reviewSummary");review.replaceChildren();
  review.append(createElement("h3","","Review Summary"));
  review.append(createElement("p","","Check your details, then continue to export."));
  const items=[
    ["Template",state.selectedTemplate.charAt(0).toUpperCase()+state.selectedTemplate.slice(1)],
    ["Name",state.personal.fullName||"Not provided"],
    ["Experience",String(state.experience.filter(hasMeaningfulExperience).length)],
    ["Education",String(state.education.filter(hasMeaningfulEducation).length)],
    ["Skills",String(state.skills.length)]
  ];
  items.forEach(([label,value])=>{
    const p=createElement("p","");p.append(createElement("strong","",label+": "));p.append(document.createTextNode(value));review.append(p);
  });
}

function updateDownloadStatus(){
  const status=$("#downloadStatus");
  if(!status) return;
  const valid=Boolean(state.personal.fullName.trim())&&isDataMeaningful();
  status.textContent=valid?"Ready to print. Choose Save as PDF in the browser dialog.":"Add a full name and at least one CV section before printing.";
  $("#downloadPdf").disabled=!valid;
  $("#downloadPdf").setAttribute("aria-disabled",String(!valid));
}

renderExperience();renderEducation();renderProjects();renderCertifications();renderLanguages();renderSkills();renderPreview();

function hydrateStaticFields(){
  personalFields.forEach(field=>{$("#"+field).value=state.personal[field]||"";});
  $("#summary").value=state.summary||"";
  ["awards","interests","memberships","publications","references"].forEach(field=>{$("#"+field).value=state.optional[field]||"";});
  $("#photoPreview").src=state.personal.photo||"assets/sample-avatar.svg";
  $("#photoPreview").alt=state.personal.photo?"Profile preview":"Neutral profile placeholder";
}
function hydrateAll(){
  hydrateStaticFields();
  renderExperience();renderEducation();renderProjects();renderCertifications();renderLanguages();renderSkills();renderPreview();
}

function loadSampleData(){
  state.personal={
    fullName:"Avery Morgan",
    jobTitle:"Senior Data Analyst",
    email:"avery.morgan@example.com",
    phone:"+1 555 014 8821",
    location:"Austin, Texas",
    linkedin:"https://linkedin.com/in/avery-morgan-example",
    github:"https://github.com/avery-morgan-example",
    website:"https://averymorgan.example",
    photo:"assets/sample-avatar.svg"
  };
  state.summary="Data-focused professional with 7+ years of experience turning complex datasets into clear decisions. Skilled in analytics, visualization, SQL, stakeholder communication, and building reliable reporting workflows.";
  state.experience=[
    {jobTitle:"Senior Data Analyst",company:"Northstar Analytics (Fictional)",employment:"Full-time",location:"Austin, Texas",startDate:"2022-04",endDate:"",current:true,description:"Lead reporting initiatives across sales and operations.\nBuilt self-service dashboards that reduced manual reporting time by 40%.\nMentor analysts and present findings to senior stakeholders."},
    {jobTitle:"Data Analyst",company:"Brightfield Group (Fictional)",employment:"Full-time",location:"Dallas, Texas",startDate:"2019-06",endDate:"2022-03",current:false,description:"Analyzed customer behavior and campaign performance.\nCreated repeatable SQL and Excel workflows for quarterly planning.\nImproved forecast accuracy through validation and segmentation."}
  ];
  state.education=[
    {degree:"M.S. in Data Science",institution:"Lakeside State University (Fictional)",department:"Applied Analytics",startDate:"2017-08",endDate:"2019-05",grade:"3.9 / 4.0",description:"Research in predictive modeling and responsible data systems."},
    {degree:"B.B.A. in Information Systems",institution:"Westbridge College (Fictional)",department:"Business Intelligence",startDate:"2013-08",endDate:"2017-05",grade:"3.8 / 4.0",description:"Data management, accounting, and systems analysis."}
  ];
  state.skills=["Python","SQL","Data Analysis","Microsoft Excel","Tableau","Power BI","Communication","Forecasting"];
  state.projects=[
    {name:"Customer Churn Explorer",description:"Interactive analysis identifying churn signals and recommended retention actions.",technologies:"Python, SQL, Tableau",url:"https://example.com/churn-explorer"},
    {name:"Regional Sales Dashboard",description:"A shared dashboard for monitoring revenue, pipeline health, and regional performance.",technologies:"Power BI, Excel, SQL",url:"https://example.com/sales-dashboard"}
  ];
  state.certifications=[
    {name:"Data Analytics Professional Certificate",organization:"Fictional Analytics Institute",date:"2023-06",url:"https://example.com/credential"},
    {name:"Advanced SQL for Analysis",organization:"Fictional Learning College",date:"2021-10",url:""}
  ];
  state.languages=[
    {name:"English",proficiency:"Native / Fluent"},
    {name:"Spanish",proficiency:"Conversational"}
  ];
  state.optional={
    awards:"2024 Data Excellence Award — Northstar Analytics (Fictional)",
    interests:"Volunteer data mentor for a local youth coding program.",
    memberships:"Member, Fictional Analytics Professionals Association",
    publications:"“Practical Forecasting for Growing Teams,” Example Journal, 2023.",
    references:"References available upon request."
  };
  hydrateAll();
  showToast("Sample data loaded successfully.","success");
}

function clearForm(){
  state.personal={fullName:"",jobTitle:"",email:"",phone:"",location:"",linkedin:"",github:"",website:"",photo:""};
  state.summary="";state.experience=[];state.education=[];state.skills=[];state.projects=[];state.certifications=[];state.languages=[];
  state.optional={awards:"",interests:"",memberships:"",publications:"",references:""};
  hydrateAll();showToast("CV form cleared.","success");
}

$("#sampleDataButton").addEventListener("click",()=>{
  if(isDataMeaningful()){
    openConfirm("Replace your current information?","Loading sample data will replace the information currently in this CV.",loadSampleData);
  }else loadSampleData();
});
$("#clearFormButton").addEventListener("click",()=>{
  if(isDataMeaningful()) openConfirm("Clear the complete CV?","This will remove all entered details and uploaded photo data.",clearForm);
  else clearForm();
});

$("#photoInput").addEventListener("change",event=>{
  const file=event.target.files&&event.target.files[0];
  if(!file) return;
  const validTypes=["image/jpeg","image/png","image/webp"];
  if(!validTypes.includes(file.type)){showToast("Unsupported image type. Choose JPG, PNG, or WebP.","error");event.target.value="";return;}
  if(file.size>5*1024*1024){showToast("The selected image exceeds 5 MB.","error");event.target.value="";return;}
  const reader=new FileReader();
  reader.onload=()=>{state.personal.photo=String(reader.result);$("#photoPreview").src=state.personal.photo;$("#photoPreview").alt="Profile preview";renderPreview();showToast("Profile photo updated.","success");};
  reader.onerror=()=>showToast("The photo could not be read. Please try another image.","error");
  reader.readAsDataURL(file);
});
$("#removePhoto").addEventListener("click",()=>{
  state.personal.photo="";
  $("#photoPreview").src="assets/sample-avatar.svg";
  $("#photoPreview").alt="Neutral profile placeholder";
  $("#photoInput").value="";
  renderPreview();showToast("Profile photo removed.","success");
});
$("#refreshPreview").addEventListener("click",()=>{renderPreview();showToast("Preview refreshed.","success");});
$("#changeTemplate").addEventListener("click",()=>goToStep(1));

function sanitizeFilename(name){
  const cleaned=name.trim().replace(/[<>:"/\\|?*\u0000-\u001F]/g,"").replace(/\s+/g,"_").replace(/[^A-Za-z0-9_-]/g,"").replace(/^_+|_+$/g,"");
  return (cleaned||"My")+"_CV.pdf";
}
$("#downloadPdf").addEventListener("click",()=>{
  if(!state.personal.fullName.trim()){showToast("Add your full name before downloading.","error");goToStep(2);return;}
  if(!isDataMeaningful()){showToast("Add CV information before downloading.","error");return;}
  renderCV($("#cvPreviewReview"));
  const oldTitle=document.title;
  document.title=sanitizeFilename(state.personal.fullName).replace(/\.pdf$/i,"");
  showToast("Opening the print dialog. Choose Save as PDF.","success");
  setTimeout(()=>{
    try{window.print();}
    catch(error){showToast("Printing could not start. Use your browser menu and choose Print.","error");}
    finally{setTimeout(()=>{document.title=oldTitle;},300);}
  },100);
});

window.addEventListener("beforeprint",()=>renderCV($("#cvPreviewReview")));
