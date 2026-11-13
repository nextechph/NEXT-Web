import { ImageResponse } from 'next/og';
import { siteUrl } from '../lib/supabase-config';
export const alt='NEXT Technology — Building what’s next. Websites, digital solutions, and Second Boot PC services.';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function SocialImage(){return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',background:'#0a0a0a',color:'#fff',padding:'64px 72px',border:'1px solid #333'}}><div style={{display:'flex',fontSize:24,letterSpacing:8,color:'#aaa'}}>NEXT TECHNOLOGY</div><div style={{display:'flex',flexDirection:'column',gap:20}}><div style={{display:'flex',fontSize:88,fontWeight:700,lineHeight:1.05}}>Building what’s next.</div><div style={{display:'flex',fontSize:26,color:'#aaa'}}>Websites. Digital solutions. Custom computers.</div></div><div style={{display:'flex',justifyContent:'space-between',fontSize:20,borderTop:'1px solid #333',paddingTop:26}}><span>{new URL(siteUrl).host}</span><span>SECOND BOOT BY NEXT ↗</span></div></div>,size);}
