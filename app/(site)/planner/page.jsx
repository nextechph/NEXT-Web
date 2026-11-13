import PageSEO from '../../../components/PageSEO';
import LegacyWorkflow from '../../../components/LegacyWorkflow';
import PageStyles from '../../../components/PageStyles';
import source from '../../../legacy/generated/planner.json';
import { pageMetadata } from '../../../lib/metadata';
export const metadata = pageMetadata('Project Planner','Configure your website, explore features, and plan your budget with NEXT Technology.','/planner');
export default function PlannerPage() { return <><PageStyles name="planner"/><div className="planner-breadcrumb"><PageSEO title="Project Planner" description={metadata.description} path="/planner" type="WebPage"/></div><LegacyWorkflow {...source}/></>; }
