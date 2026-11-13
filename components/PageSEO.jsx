import JsonLD from './JsonLD';
import { pageGraph } from '../lib/seo';
export default function PageSEO({title,description,path,type,parents=[],extra=[]}){
    return <><nav className="page-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a>{parents.map(parent=><span key={parent.path}><span aria-hidden="true"> / </span><a href={parent.path}>{parent.name}</a></span>)}<span aria-hidden="true"> / </span><span aria-current="page">{title}</span></nav><JsonLD data={pageGraph({title,description,path,type,parents,extra})}/></>;
}
