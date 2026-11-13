import PageSEO from '../../../components/PageSEO';
import { Mail, Globe, MapPin } from 'lucide-react';
import ContactForm from '../../../components/ContactForm';
import PageStyles from '../../../components/PageStyles';
import { getSettings,readRows } from '../../../lib/content';
import { safeURL } from '../../../lib/urls';
import { pageMetadata } from '../../../lib/metadata';
export const metadata=pageMetadata('Contact','Discuss your next website, template customization, or Second Boot PC project with NEXT Technology.','/contact');
export default async function ContactPage({searchParams}){
    const [s,config,params]=await Promise.all([getSettings(),readRows('planner_config','id=eq.1'),searchParams]);
    const methods=Array.isArray(config?.[0]?.contact_methods)&&config[0].contact_methods.length?config[0].contact_methods:['Email','WhatsApp','Phone Call','Zoom / Video Call','Facebook Messenger'];
    const template=typeof params.template==='string'?params.template:'';const service=typeof params.service==='string'?params.service:'';
    return <><PageStyles name="contact"/><main><PageSEO title="Contact" description={metadata.description} path="/contact" type="ContactPage"/><section className="contact-section standalone-contact"><div className="section-container"><div className="section-header"><span className="section-tag">CONTACT</span><h1 className="section-title">Start the Conversation</h1><p className="section-subtitle">Let’s collaborate to build something remarkable.</p></div><div className="contact-layout"><div className="contact-info"><div className="info-content"><span className="info-label">Office</span><h2>NEXT Technology</h2></div><div className="info-details"><div className="info-item"><Mail/><div><span>Send an Email</span><a href={`mailto:${s.email||'hello@nexttechnologyph.com'}`}>{s.email||'hello@nexttechnologyph.com'}</a></div></div><div className="info-item"><Globe/><div><span>Web Address</span><a href={safeURL(s.footer_url,'https://nexttechnologyph.com')} target="_blank" rel="noopener noreferrer">{s.footer_url||'nexttechnologyph.com'}</a></div></div><div className="info-item"><MapPin/><div><span>Location</span><p>{s.location||'Global / Distributed Remote'}</p></div></div></div></div><ContactForm methods={methods} template={template} hardware={params.division==='second-boot'} service={service}/></div></div></section></main></>;
}
