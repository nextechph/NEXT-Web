import PageSEO from '../../../components/PageSEO';
import PageStyles from '../../../components/PageStyles';
import PageIntro from '../../../components/PageIntro';
import { PortfolioCTA } from '../../../components/PageCTA';
import PortfolioGrid from '../../../components/PortfolioGrid';
import { getProjects } from '../../../lib/content';
import { pageMetadata } from '../../../lib/metadata';
export const metadata=pageMetadata('Portfolio','Explore websites, applications, and digital products built by NEXT Technology.','/portfolio');
export default async function PortfolioPage(){const projects=await getProjects();return <><PageStyles name="portfolio"/><main><PageSEO title="Portfolio" description={metadata.description} path="/portfolio" type="CollectionPage"/><PageIntro page="portfolio" stats={[[projects.filter(p=>p.status==='live').length,'Projects Shipped'],[projects.filter(p=>p.status==='coming-soon').length,'In Progress'],['Custom','Design & Development']]}/><PortfolioGrid projects={projects}/><PortfolioCTA/></main></>;}
