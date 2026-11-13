import { serviceCatalog } from '../../../lib/seo';
import AnswerSection from '../../../components/AnswerSection';
import { templateAnswers } from '../../../lib/page-answers';
import PageSEO from '../../../components/PageSEO';
import TemplateCatalog from '../../../components/TemplateCatalog';
import { getSection } from '../../../lib/content';
import { pageMetadata } from '../../../lib/metadata';
export const metadata=pageMetadata('Website Templates','Choose a website design to customize with NEXT Technology. Explore portfolio, business, and storefront concepts for your brand.','/templates');
export default async function TemplatesPage(){
    const content=await getSection('templates');
    return <main><PageSEO title="Website Templates" description={metadata.description} path="/templates" type="CollectionPage" extra={[serviceCatalog(content,'/templates')]}/><section className="catalog-section dedicated-catalog" aria-labelledby="templates-title"><div className="section-container"><div className="section-header"><span className="section-tag">DESIGNED TO BECOME YOURS</span><h1 className="section-title dedicated-title" id="templates-title">{content.title}</h1><p className="section-subtitle">{content.description}</p></div><TemplateCatalog items={content.items}/></div></section><section className="catalog-process section-container"><span className="section-tag">WHAT HAPPENS NEXT</span><h2>From a starting point to your own website.</h2><ol><li><strong>Choose your direction.</strong> Preview the concepts and pick the design that fits your brand.</li><li><strong>Make it yours.</strong> Tell us about your content, colors, pages, and required features.</li><li><strong>Plan the build.</strong> We confirm the scope, quote, and timeline before development begins.</li></ol><p>These previews show a visual direction. Features and integrations are scoped for your project.</p></section><AnswerSection items={templateAnswers} title="Website customization questions"/></main>;
}
