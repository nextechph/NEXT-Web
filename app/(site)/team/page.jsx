import PageSEO from '../../../components/PageSEO';
import PageStyles from '../../../components/PageStyles';
import PageIntro from '../../../components/PageIntro';
import { TeamPrinciples } from '../../../components/PageCTA';
import TeamGrid from '../../../components/TeamGrid';
import { getTeam } from '../../../lib/content';
import { pageMetadata } from '../../../lib/metadata';
export const metadata=pageMetadata('Team','Meet the founders, leaders, and architects behind NEXT Technology.','/team');
export default async function TeamPage(){const members=await getTeam();return <><PageStyles name="team"/><main><PageSEO title="Team" description={metadata.description} path="/team" type="AboutPage"/><PageIntro page="team" stats={[['100%','In-House Engineering'],['Founder-Led','Direct Client Access'],['Manila, PH','Global Delivery']]}/><TeamGrid members={members}/><TeamPrinciples/></main></>;}
