import Login from '../../components/Login';
import PageStyles from '../../components/PageStyles';
export const metadata={title:'Admin Sign In',robots:{index:false,follow:false}};
export default function LoginPage(){return <><PageStyles name="admin-auth"/><Login/></>;}
