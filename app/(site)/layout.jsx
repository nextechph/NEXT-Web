import Header from '../../components/Header';
import JsonLD from '../../components/JsonLD';
import { organizationGraph } from '../../lib/seo';
import Footer from '../../components/Footer';
import { getSettings } from '../../lib/content';
export const dynamic = 'force-dynamic';
export default async function SiteLayout({children}) {
    const settings = await getSettings();
    return <><div className="bg-grid"/><Header/><JsonLD data={organizationGraph(settings)}/>{children}<Footer settings={settings}/></>;
}
