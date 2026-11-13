export function inquiryPrompt(template, hardware, service='') {
    if(template)return `I'd like to customize the "${template}" website template.\n\nMy business / brand:\nChanges and features I need:\nBudget and timeline:`;
    if(hardware)return `I'm interested in Second Boot by NEXT.\n\nService: ${service||'PC build / upgrade / servicing'}\nCurrent PC specs (if any):\nIntended use:\nBudget:`;
    return '';
}
export function buildInquiry({name,email,phone,method,description,template,hardware,blueprint='',raw=null}){
    return {name,email,phone,contact_method:method,description,subject:template?`Website Template Customization: ${template}`:hardware?'Second Boot Inquiry':raw?'Project Planner Submission':'Website Inquiry',message:`Phone/WhatsApp: ${phone}\nPreferred Contact: ${method}\n\nProject Description:\n${description}`,blueprint:blueprint?`${blueprint}\n\nPhone: ${phone}\nMethod: ${method}`:`None (Direct Inquiry)\n\nPhone: ${phone}\nMethod: ${method}`,features_needed:raw?.services||null,budget_range:raw?.budget||null,timeline:raw?.timeline||null,project_name:raw?.project_name||null,inquiry_type:template?'Website Template':hardware?'Second Boot':raw?(raw.type==='student'?'Student Package':'Professional Project'):'Direct Inquiry'};
}
