import{d as u,a as p,r as _,u as d,y as i,x as l,o as m,k as f,i as s,W as t}from"./index-4e8621ec.js";import{I}from"./index.es-f3f8a0f4.js";const g=u({name:"UserTower"}),U=u({...g,setup(w){const n=p(),a=_(),e=d(),{destroyApp:c,bus:r}=t,o={groupId:e.groupId,brandId:e.brandId,brandName:e.brandName,token:e.token,parentName:"comm",url:e.env.value,redirectUrl:"/crowd"};return console.log("props：",o),i(()=>{r.$on("__USER_TOWER_OSP_INSIGHT",()=>{n.push("/crowd-insight")}),r.$on("__USER_TOWER_CLICK_INSIGHT",()=>{n.push("/crowd-insight")})}),l(()=>{r.$clear(),c("user-tower")}),(h,R)=>(m(),f(s(t),{ref_key:"wujieVueRef",ref:a,width:"100%",height:"100%",name:"user-tower",url:o.url,props:o,plugins:[s(I)()]},null,8,["url","plugins"]))}});export{U as default};
//# sourceMappingURL=user-tower-aa4457d9.js.map
