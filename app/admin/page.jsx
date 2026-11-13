import LegacyWorkflow from '../../components/LegacyWorkflow';
import PageStyles from '../../components/PageStyles';
import source from '../../legacy/generated/admin.json';
export const metadata = {title:'Admin',robots:{index:false,follow:false}};
export default function AdminPage() { return <><PageStyles name="admin"/><LegacyWorkflow {...source}/></>; }
