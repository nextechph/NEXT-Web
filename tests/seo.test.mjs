import test from 'node:test';
import assert from 'node:assert/strict';
import {organizationGraph,pageGraph,serviceCatalog,articleSchema,validDate,organizationID} from '../lib/seo.js';

test('business entities share stable IDs and omit unsupported business claims',()=>{
    const graph=organizationGraph({email:'team@example.com',facebook:'javascript:alert(1)',instagram:'https://instagram.com/example'})['@graph'];
    assert.equal(graph[0]['@id'],organizationID);assert.equal(graph[1].publisher['@id'],organizationID);
    assert.equal(graph[0].email,'team@example.com');assert.deepEqual(graph[0].sameAs,['https://instagram.com/example']);
    for(const field of ['address','aggregateRating','openingHours','telephone'])assert.equal(graph[0][field],undefined);
});
test('breadcrumb and webpage IDs agree for article hierarchies',()=>{
    const graph=pageGraph({title:'Article',path:'/blog/test',parents:[{name:'Blog',path:'/blog'}]})['@graph'];
    assert.equal(graph[0].breadcrumb['@id'],graph[1]['@id']);
    assert.deepEqual(graph[1].itemListElement.map(item=>item.name),['Home','Blog','Article']);
});
test('service schema excludes hidden services and does not invent prices',()=>{
    const schema=serviceCatalog({title:'PC services',description:'Hardware services.',items:[{title:'Revive',description:'Older PCs'},{title:'Hidden',featured:false}]},'/second-boot');
    assert.equal(schema.hasOfferCatalog.itemListElement.length,1);
    assert.equal(schema.hasOfferCatalog.itemListElement[0].price,undefined);
});
test('article schema uses visible publication dates, safe images, and the shared publisher',()=>{
    const schema=articleSchema({id:'test',title:'Article',post_date:'November 13, 2026',created_at:'2026-11-14T00:00:00Z',image_url:'javascript:alert(1)'});
    assert.match(schema.datePublished,/2026-11-13/);assert.equal(schema.publisher['@id'],organizationID);
    assert.match(schema.image,/\/opengraph-image$/);assert.equal(schema.dateModified,undefined);assert.equal(validDate('invalid'),undefined);
});
