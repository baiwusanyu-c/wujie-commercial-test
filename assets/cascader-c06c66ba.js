var Hl=Object.defineProperty;var Rl=(e,l,s)=>l in e?Hl(e,l,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[l]=s;var W=(e,l,s)=>(Rl(e,typeof l!="symbol"?l+"":l,s),s);import{r as y,fc as Ol,f9 as ue,fd as he,fe as nl,ff as ol,fg as il,fh as cl,d as fe,fi as pe,fa as Ul,fj as Kl,fk as rl,fl as Ve,fm as ul,m as f,_ as Pe,c as A,o as v,e as I,k as j,fn as me,w as T,g as x,p as F,q as Ce,F as de,z as ql,A as jl,f as U,fo as Oe,fp as Wl,B as Zl,t as ee,h as be,j as Se,f1 as Ne,fq as Ae,fr as Xe,fs as Gl,ft as Ye,fu as $e,fv as Jl,fw as Xl,fx as Yl,fy as ze,fz as Be,f8 as Ql,b as Qe,e_ as ie,fb as ea,y as dl,fA as el,fB as la,fC as pl,fD as aa,fE as ta,fF as X,fG as Ee,fH as fl,fI as ll,fJ as vl,fK as hl,fL as sa,J as na,fM as ml,fN as oa,fO as bl,fP as ia,fQ as ca,D as ke,i as N,fR as ra,fS as ua,f2 as gl,E as He,fT as da,fU as yl,fV as kl,fW as Cl,fX as pa,fY as Nl,fZ as fa}from"./index-4e8621ec.js";function va({afterComposition:e,emit:l}){const s=y(!1),t=i=>{l==null||l("compositionstart",i),s.value=!0},o=i=>{var h;l==null||l("compositionupdate",i);const u=(h=i.target)==null?void 0:h.value,k=u[u.length-1]||"";s.value=!Ol(k)},d=i=>{l==null||l("compositionend",i),s.value&&(s.value=!1,ue(()=>e(i)))};return{isComposing:s,handleComposition:i=>{i.type==="compositionend"?d(i):o(i)},handleCompositionStart:t,handleCompositionUpdate:o,handleCompositionEnd:d}}const ha={titles:{type:Array,default:()=>[]},placement:{type:he(String),values:nl,default:"bottom-start"},fallbackPlacements:{type:he(Array),default:["bottom-start","bottom","top-start","top","right","left"]},persistent:{type:Boolean,default:!0},tagEffect:{...ol.effect,default:"light"},...il},ma={clear:()=>!0,...cl},ba=fe({name:"NodeContent",setup(){return{ns:pe("cascader-node")}},render(){const{ns:e}=this,{node:l,panel:s}=this.$parent,{data:t,label:o}=l,{renderLabelFn:d}=s;return Ul("span",{class:e.e("label")},d?d({node:l,data:t}):o)}}),Ue=Symbol(),ga=fe({name:"ElCascaderNode",components:{NodeContent:ba,Check:Kl,Loading:rl,ArrowRight:Ve},props:{node:{type:Object,required:!0},menuId:String},emits:["expand"],setup(e,{emit:l}){const s=ul(Ue),t=pe("cascader-node"),o=f(()=>s.isHoverMenu),d=f(()=>s.config.multiple),r=f(()=>s.config.checkStrictly),i=f(()=>{var V;return(V=s.checkedNodes[0])==null?void 0:V.uid}),u=f(()=>e.node.isDisabled),k=f(()=>e.node.isLeaf),h=f(()=>r.value&&!k.value||!u.value),m=f(()=>E(s.expandingNode)),$=f(()=>r.value&&s.checkedNodes.some(E)),E=V=>{var G;const{level:R,uid:le}=e.node;return((G=V==null?void 0:V.pathNodes[R-1])==null?void 0:G.uid)===le},K=()=>{m.value||s.expandNode(e.node)},C=V=>{const{node:R}=e;V!==R.checked&&s.handleCheckChange(R,V,!0,!0)},B=()=>{s.lazyLoad(e.node,()=>{k.value||K()})},Z=V=>{o.value&&(J(),!k.value&&l("expand",V))},J=()=>{const{node:V}=e;!h.value||V.loading||(V.loaded?K():B())},M=()=>{o.value&&!k.value||(k.value&&!u.value&&!r.value&&!d.value?H(!0):J())},Y=V=>{r.value?(C(V),e.node.loaded&&K()):H(V)},H=V=>{e.node.loaded?(C(V),!r.value&&K()):B()};return{panel:s,isHoverMenu:o,multiple:d,checkStrictly:r,checkedNodeId:i,isDisabled:u,isLeaf:k,expandable:h,inExpandingPath:m,inCheckedPath:$,ns:t,handleHoverExpand:Z,handleExpand:J,handleClick:M,handleCheck:H,handleSelectCheck:Y}}});const ya=e=>(ql("data-v-7a299928"),e=e(),jl(),e),ka=["id","aria-haspopup","aria-owns","aria-expanded","tabindex"],Ca=ya(()=>U("span",null,null,-1));function Na(e,l,s,t,o,d){const r=A("el-checkbox"),i=A("el-radio"),u=A("check"),k=A("el-icon"),h=A("node-content"),m=A("loading"),$=A("arrow-right");return v(),I("li",{id:`${e.menuId}-${e.node.uid}`,role:"menuitem","aria-haspopup":!e.isLeaf,"aria-owns":e.isLeaf?null:e.menuId,"aria-expanded":e.inExpandingPath,tabindex:e.expandable?-1:void 0,class:F([e.ns.b(),e.ns.is("selectable",e.checkStrictly),e.ns.is("active",e.node.checked),e.ns.is("disabled",!e.expandable),e.inExpandingPath&&"in-active-path",e.inCheckedPath&&"in-checked-path"]),onMouseenter:l[2]||(l[2]=(...E)=>e.handleHoverExpand&&e.handleHoverExpand(...E)),onFocus:l[3]||(l[3]=(...E)=>e.handleHoverExpand&&e.handleHoverExpand(...E)),onClick:l[4]||(l[4]=(...E)=>e.handleClick&&e.handleClick(...E))},[e.multiple?(v(),j(r,{key:0,"model-value":e.node.checked,indeterminate:e.node.indeterminate,disabled:e.isDisabled,onClick:l[0]||(l[0]=me(()=>{},["stop"])),"onUpdate:modelValue":e.handleSelectCheck},null,8,["model-value","indeterminate","disabled","onUpdate:modelValue"])):e.checkStrictly?(v(),j(i,{key:1,"model-value":e.checkedNodeId,label:e.node.uid,disabled:e.isDisabled,"onUpdate:modelValue":e.handleSelectCheck,onClick:l[1]||(l[1]=me(()=>{},["stop"]))},{default:T(()=>[Ca]),_:1},8,["model-value","label","disabled","onUpdate:modelValue"])):e.isLeaf&&e.node.checked?(v(),j(k,{key:2,class:F(e.ns.e("prefix"))},{default:T(()=>[x(u)]),_:1},8,["class"])):Ce("",!0),x(h),e.isLeaf?Ce("",!0):(v(),I(de,{key:3},[e.node.loading?(v(),j(k,{key:0,class:F([e.ns.is("loading"),e.ns.e("postfix")])},{default:T(()=>[x(m)]),_:1},8,["class"])):(v(),j(k,{key:1,class:F(["arrow-right",e.ns.e("postfix")])},{default:T(()=>[x($)]),_:1},8,["class"]))],64))],42,ka)}const _a=Pe(ga,[["render",Na],["__scopeId","data-v-7a299928"]]),$a=fe({name:"ElCascaderMenu",components:{Loading:rl,ElCascaderNode:_a},props:{title:{type:String,required:!0},nodes:{type:Array,required:!0},index:{type:Number,required:!0}},setup(e){const l=Zl(),s=pe("cascader-menu"),{t}=Oe(),o=Wl();let d=null,r=null;const i=ul(Ue),u=y(null),k=f(()=>!e.nodes.length),h=f(()=>!i.initialLoaded),m=f(()=>`${o.value}-${e.index}`),$=B=>{d=B.target},E=B=>{if(!(!i.isHoverMenu||!d||!u.value))if(d.contains(B.target)){K();const Z=l.vnode.el,{left:J}=Z.getBoundingClientRect(),{offsetWidth:M,offsetHeight:Y}=Z,H=B.clientX-J,V=d.offsetTop,R=V+d.offsetHeight;u.value.innerHTML=`
          <path style="pointer-events: auto;" fill="transparent" d="M${H} ${V} L${M} 0 V${V} Z" />
          <path style="pointer-events: auto;" fill="transparent" d="M${H} ${R} L${M} ${Y} V${R} Z" />
        `}else r||(r=window.setTimeout(C,i.config.hoverThreshold))},K=()=>{r&&(clearTimeout(r),r=null)},C=()=>{u.value&&(u.value.innerHTML="",K())};return{ns:s,panel:i,hoverZone:u,isEmpty:k,isLoading:h,menuId:m,t,handleExpand:$,handleMouseMove:E,clearHoverZone:C}}});const wa={class:"cascader-menu-wraper"},Va={class:"bg-#E9EDF7 color-#8D97A8 text-12px px8px leading-24px"};function Ea(e,l,s,t,o,d){const r=A("el-cascader-node"),i=A("loading"),u=A("el-icon"),k=A("el-scrollbar");return v(),I("div",wa,[U("div",Va,ee(e.title),1),(v(),j(k,{key:e.menuId,tag:"ul",role:"menu",class:F(e.ns.b()),"wrap-class":e.ns.e("wrap"),"view-class":[e.ns.e("list"),e.ns.is("empty",e.isEmpty)],onMousemove:e.handleMouseMove,onMouseleave:e.clearHoverZone},{default:T(()=>{var h;return[(v(!0),I(de,null,be(e.nodes,m=>(v(),j(r,{key:m.uid,node:m,"menu-id":e.menuId,onExpand:e.handleExpand},null,8,["node","menu-id","onExpand"]))),128)),e.isLoading?(v(),I("div",{key:0,class:F(e.ns.e("empty-text"))},[x(u,{size:"14",class:F(e.ns.is("loading"))},{default:T(()=>[x(i)]),_:1},8,["class"]),Se(" "+ee(e.t("el.cascader.loading")),1)],2)):e.isEmpty?(v(),I("div",{key:1,class:F(e.ns.e("empty-text"))},[Ne(e.$slots,"empty",{},()=>[Se(ee(e.t("el.cascader.noData")),1)])],2)):(h=e.panel)!=null&&h.isHoverMenu?(v(),I("svg",{key:2,ref:"hoverZone",class:F(e.ns.e("hover-zone"))},null,2)):Ce("",!0)]}),_:3},8,["class","wrap-class","view-class","onMousemove","onMouseleave"]))])}const Sa=Pe($a,[["render",Ea]]);let Pa=0;const Da=e=>{const l=[e];let{parent:s}=e;for(;s;)l.unshift(s),s=s.parent;return l};class _e{constructor(l,s,t,o=!1){W(this,"uid",Pa++);W(this,"level");W(this,"value");W(this,"label");W(this,"pathNodes");W(this,"pathValues");W(this,"pathLabels");W(this,"childrenData");W(this,"children");W(this,"text");W(this,"loaded");W(this,"checked",!1);W(this,"indeterminate",!1);W(this,"loading",!1);this.data=l,this.config=s,this.parent=t,this.root=o;const{value:d,label:r,children:i}=s,u=l[i],k=Da(this);this.level=o?0:t?t.level+1:1,this.value=l[d],this.label=l[r],this.pathNodes=k,this.pathValues=k.map(h=>h.value),this.pathLabels=k.map(h=>h.label),this.childrenData=u,this.children=(u||[]).map(h=>new _e(h,s,this)),this.loaded=!s.lazy||this.isLeaf||!Ae(u)}get isDisabled(){const{data:l,parent:s,config:t}=this,{disabled:o,checkStrictly:d}=t;return(Xe(o)?o(l,this):!!l[o])||!d&&(s==null?void 0:s.isDisabled)}get isLeaf(){const{data:l,config:s,childrenData:t,loaded:o}=this,{lazy:d,leaf:r}=s,i=Xe(r)?r(l,this):l[r];return Gl(i)?d&&!o?!1:!(Array.isArray(t)&&t.length):!!i}get valueByOption(){return this.config.emitPath?this.pathValues:this.value}appendChild(l){const{childrenData:s,children:t}=this,o=new _e(l,this.config,this);return Array.isArray(s)?s.push(l):this.childrenData=[l],t.push(o),o}calcText(l,s){const t=l?this.pathLabels.join(s):this.label;return this.text=t,t}broadcast(l,...s){const t=`onParent${Ye(l)}`;this.children.forEach(o=>{o&&(o.broadcast(l,...s),o[t]&&o[t](...s))})}emit(l,...s){const{parent:t}=this,o=`onChild${Ye(l)}`;t&&(t[o]&&t[o](...s),t.emit(l,...s))}onParentCheck(l){this.isDisabled||this.setCheckState(l)}onChildCheck(){const{children:l}=this,s=l.filter(o=>!o.isDisabled),t=s.length?s.every(o=>o.checked):!1;this.setCheckState(t)}setCheckState(l){const s=this.children.length,t=this.children.reduce((o,d)=>{const r=d.checked?1:d.indeterminate?.5:0;return o+r},0);this.checked=this.loaded&&this.children.filter(o=>!o.isDisabled).every(o=>o.loaded&&o.checked)&&l,this.indeterminate=this.loaded&&t!==s&&t>0}doCheck(l){if(this.checked===l)return;const{checkStrictly:s,multiple:t}=this.config;s||!t?this.checked=l:(this.broadcast("check",l),this.setCheckState(l),this.emit("check"))}}const Re=(e,l)=>e.reduce((s,t)=>(t.isLeaf?s.push(t):(!l&&s.push(t),s=s.concat(Re(t.children,l))),s),[]);class al{constructor(l,s){W(this,"nodes");W(this,"allNodes");W(this,"leafNodes");this.config=s;const t=(l||[]).map(o=>new _e(o,this.config));this.nodes=t,this.allNodes=Re(t,!1),this.leafNodes=Re(t,!0)}getNodes(){return this.nodes}getFlattedNodes(l){return l?this.leafNodes:this.allNodes}appendNode(l,s){const t=s?s.appendChild(l):new _e(l,this.config);s||this.nodes.push(t),this.allNodes.push(t),t.isLeaf&&this.leafNodes.push(t)}appendNodes(l,s){l.forEach(t=>this.appendNode(t,s))}getNodeByValue(l,s=!1){return!l&&l!==0?null:this.getFlattedNodes(s).find(o=>$e(o.value,l)||$e(o.pathValues,l))||null}getSameNode(l){return l&&this.getFlattedNodes(!1).find(({value:t,level:o})=>$e(l.value,t)&&l.level===o)||null}}const Ta=Jl({modelValue:{type:he([Number,String,Array])},options:{type:he(Array),default:()=>[]},props:{type:he(Object),default:()=>({})}}),xa={expandTrigger:"click",multiple:!1,checkStrictly:!1,emitPath:!0,lazy:!1,lazyLoad:Xl,value:"value",label:"label",children:"children",leaf:"leaf",disabled:"disabled",hoverThreshold:500},La=e=>f(()=>({...xa,...e.props})),tl=e=>{if(!e)return 0;const l=e.id.split("-");return Number(l[l.length-2])},Ia=e=>{if(!e)return;const l=e.querySelector("input");l?l.click():Yl(e)&&e.click()},Ma=(e,l)=>{const s=l.slice(0),t=s.map(d=>d.uid),o=e.reduce((d,r)=>{const i=t.indexOf(r.uid);return i>-1&&(d.push(r),s.splice(i,1),t.splice(i,1)),d},[]);return o.push(...s),o};function _l(e,l,s=[]){if(!(l.length&&e))return l;for(let t of l){if(t.label&&t.label.indexOf(e)>-1){s.push(t);continue}if(t.children&&t.children.length){let o=_l(e,t.children);if(o&&o.length){let d={...t,children:o};s.push(d)}}}return s}function Fa(e){const l=[];function s(t){t.forEach(o=>{l.push(o),o.children&&o.children.length&&s(o.children)})}return s(e),l}const Aa=fe({name:"CascaderPanel",components:{ElCascaderMenu:Sa},props:{...Ta,border:{type:Boolean,default:!0},renderLabel:Function,titles:{type:Array,default:()=>[]}},emits:[ze,Be,"close","expand-change","check-change"],setup(e,{emit:l,slots:s}){const t=y("");let o=!1;const d=pe("cascader"),r=La(e);let i=null;const u=y(!0),k=y([]),h=y(null),m=y([]),$=y(null),E=y([]),K=f(()=>r.value.expandTrigger==="hover"),C=f(()=>e.renderLabel||s.default),B=()=>{var S,P;const{options:c}=e,g=r.value;o=!1,i=new al(c,g),m.value=[i.getNodes()];const b=m.value[0];if(b&&b.length&&(h.value||[]).length<1){const _=(S=b[0])==null?void 0:S.children,O=_&&((P=_[0])==null?void 0:P.children);_&&_.length&&($.value=b[0],m.value[1]=_),O&&O.length&&($.value=_[0],m.value[2]=O)}g.lazy&&Ae(e.options)?(u.value=!1,Z(void 0,_=>{_&&(i=new al(_,g),m.value=[i.getNodes()]),u.value=!0,G(!1,!0)})):G(!1,!0)},Z=(c,g)=>{const b=r.value;c=c||new _e({},b,void 0,!0),c.loading=!0;const S=P=>{const _=c,O=_.root?null:_;P&&(i==null||i.appendNodes(P,O)),_.loading=!1,_.loaded=!0,_.childrenData=_.childrenData||[],g&&g(P)};b.lazyLoad(c,S)},J=(c,g)=>{var _;const{level:b}=c,S=m.value.slice(0,b);let P;c.isLeaf?P=c.pathNodes[b-2]:(P=c,S.push(c.children)),((_=$.value)==null?void 0:_.uid)!==(P==null?void 0:P.uid)&&($.value=c,m.value=S,!g&&l("expand-change",(c==null?void 0:c.pathValues)||[]))},M=(c,g,b=!0,S=!1)=>{S&&l("check-change",c);const{checkStrictly:P,multiple:_}=r.value,O=E.value[0];o=!0,!_&&(O==null||O.doCheck(!1)),c.doCheck(g),le(),b&&!_&&!P&&l("close"),!b&&!_&&!P&&Y(c)},Y=c=>{c&&(c=c.parent,Y(c),c&&J(c))},H=c=>i==null?void 0:i.getFlattedNodes(c),V=c=>{var g;return(g=H(c))==null?void 0:g.filter(b=>b.checked!==!1)},R=()=>{E.value.forEach(c=>c.doCheck(!1)),le(),m.value=m.value.slice(0,1),$.value=null,l("expand-change",[])},le=()=>{const{checkStrictly:c,multiple:g}=r.value,b=E.value,S=V(!c),P=Ma(b,S),_=P.map(O=>O.valueByOption);E.value=P,h.value=g?_:_[0]??null},G=(c=!1,g=!1)=>{const{modelValue:b}=e,{lazy:S,multiple:P,checkStrictly:_}=r.value,O=!_;if(!(!u.value||o||!g&&$e(b,h.value)))if(S&&!c){const L=el(la(ll(b))).map(z=>i==null?void 0:i.getNodeByValue(z)).filter(z=>!!z&&!z.loaded&&!z.loading);L.length?L.forEach(z=>{Z(z,()=>G(!1,g))}):G(!0,g)}else{const p=P?ll(b):[b],L=el(p.map(z=>i==null?void 0:i.getNodeByValue(z,O)));ne(L,g),h.value=pl(b)}},ne=(c,g=!0)=>{const{checkStrictly:b}=r.value,S=E.value,P=c.filter(p=>!!p&&(b||p.isLeaf)),_=i==null?void 0:i.getSameNode($.value),O=g&&_||P[0];O?O.pathNodes.forEach(p=>J(p,!0)):$.value=null,S.forEach(p=>p.doCheck(!1)),Qe(P).forEach(p=>p.doCheck(!0)),E.value=P,ue(oe)},oe=()=>{aa&&k.value.forEach(c=>{const g=c==null?void 0:c.$el;if(g){const b=g.querySelector(`.${d.namespace.value}-scrollbar__wrap`),S=g.querySelector(`.${d.b("node")}.${d.is("active")}`)||g.querySelector(`.${d.b("node")}.in-active-path`);ta(b,S)}})},ge=c=>{const g=c.target,{code:b}=c;switch(b){case X.up:case X.down:{c.preventDefault();const S=b===X.up?-1:1;Ee(fl(g,S,`.${d.b("node")}[tabindex="-1"]`));break}case X.left:{c.preventDefault();const S=k.value[tl(g)-1],P=S==null?void 0:S.$el.querySelector(`.${d.b("node")}[aria-expanded="true"]`);Ee(P);break}case X.right:{c.preventDefault();const S=k.value[tl(g)+1],P=S==null?void 0:S.$el.querySelector(`.${d.b("node")}[tabindex="-1"]`);Ee(P);break}case X.enter:Ia(g);break}};return Ql(Ue,Qe({config:r,expandingNode:$,checkedNodes:E,isHoverMenu:K,initialLoaded:u,renderLabelFn:C,lazyLoad:Z,expandNode:J,handleCheckChange:M})),ie([r,()=>e.options],B,{deep:!0,immediate:!0}),ie(()=>e.modelValue,()=>{o=!1,G()},{deep:!0}),ie(()=>h.value,c=>{$e(c,e.modelValue)||(l(ze,c),l(Be,c))}),ea(()=>k.value=[]),dl(()=>!Ae(e.modelValue)&&G()),{searchInputValue:t,ns:d,menuList:k,menus:m,checkedNodes:E,handleKeyDown:ge,handleCheckChange:M,getFlattedNodes:H,getCheckedNodes:V,clearCheckedNodes:R,calculateCheckedValue:le,scrollToExpandingNode:oe}}});function za(e,l,s,t,o,d){const r=A("el-cascader-menu");return v(),I("div",null,[U("div",{class:F([e.ns.b("panel"),e.ns.is("bordered",e.border)]),onKeydown:l[0]||(l[0]=(...i)=>e.handleKeyDown&&e.handleKeyDown(...i))},[(v(!0),I(de,null,be(e.menus,(i,u)=>(v(),j(r,{key:u,ref_for:!0,ref:k=>e.menuList[u]=k,index:u,nodes:[...i],title:e.titles[u]},{empty:T(()=>[Ne(e.$slots,"empty",{},void 0,!0)]),_:2},1032,["index","nodes","title"]))),128))],34)])}const sl=Pe(Aa,[["render",za],["__scopeId","data-v-c4259310"]]),Ba={key:0},Ha=["placeholder","onKeydown"],Ra="ElCascader",Oa=fe({name:Ra,__name:"cascader",props:ha,emits:ma,setup(e,{expose:l,emit:s}){const t=e,o={modifiers:[{name:"arrowPosition",enabled:!0,phase:"main",fn:({state:a})=>{const{modifiersData:n,placement:w}=a;["right","left","bottom","top"].includes(w)||(n.arrow.x=35)},requires:["arrow"]}]},d=vl();let r=0,i=0;const u=pe("cascader"),k=pe("input"),{t:h}=Oe(),{form:m,formItem:$}=hl(),{valueOnClear:E}=sa(t),{isComposing:K,handleComposition:C}=va({afterComposition(a){var w;const n=(w=a.target)==null?void 0:w.value;Fe(n)}}),B=y(null),Z=y(null),J=y(null),M=y(null),Y=y(null),H=y(!1),V=y(!1),R=y(!1),le=y(!1),G=y(""),ne=y(""),oe=y([]),ge=y([]),c=y([]);na(()=>{c.value=t.options});const g=f(()=>d.style),b=f(()=>t.disabled||(m==null?void 0:m.disabled)),S=f(()=>t.placeholder||h("el.cascader.placeholder")),P=f(()=>ne.value||oe.value.length>0||K.value?"":S.value),_=ml(),O=f(()=>["small"].includes(_.value)?"small":"default"),p=f(()=>!!t.props.multiple),L=f(()=>!t.filterable||p.value),z=f(()=>p.value?ne.value:G.value),ye=f(()=>{var a;return((a=M.value)==null?void 0:a.checkedNodes)||[]}),De=f(()=>!t.clearable||b.value||R.value||!V.value?!1:!!ye.value.length),re=f(()=>{const{showAllLevels:a,separator:n}=t,w=ye.value;return w.length?p.value?"":w[0].calcText(a,n):""}),$l=f(()=>($==null?void 0:$.validateState)||""),Ke=f({get(){return pl(t.modelValue)},set(a){const n=a??E.value;s(ze,n),s(Be,n),t.validateEvent&&($==null||$.validate("change").catch(w=>oa()))}}),wl=f(()=>[u.b(),u.m(_.value),u.is("disabled",b.value),d.class]),Vl=f(()=>[k.e("icon"),"icon-arrow-down",u.is("reverse",H.value)]),El=f(()=>u.is("focus",H.value||le.value)),qe=f(()=>{var a,n;return(n=(a=B.value)==null?void 0:a.popperRef)==null?void 0:n.contentRef}),Q=a=>{var n,w,q;b.value||(a=a??!H.value,a!==H.value&&(H.value=a,(w=(n=Z.value)==null?void 0:n.input)==null||w.setAttribute("aria-expanded",`${a}`),a?(we(),ue((q=M.value)==null?void 0:q.scrollToExpandingNode)):t.filterable&&Me(),s("visibleChange",a)))},we=()=>{ue(()=>{var a;(a=B.value)==null||a.updatePopper()})},Te=()=>{c.value=t.options,R.value=!1},xe=a=>{const{showAllLevels:n,separator:w}=t;return{node:a,key:a.uid,text:a.calcText(n,w),hitState:!1,closable:!b.value&&!a.isDisabled,isCollapseTag:!1}},Le=a=>{var w;const n=a.node;n.doCheck(!1),(w=M.value)==null||w.calculateCheckedValue(),s("removeTag",n.valueByOption)},Sl=()=>{if(!p.value)return;const a=ye.value,n=[],w=[];if(a.forEach(q=>w.push(xe(q))),ge.value=w,a.length){a.slice(0,t.maxCollapseTags).forEach(te=>n.push(xe(te)));const q=a.slice(t.maxCollapseTags),ae=q.length;ae&&(t.collapseTags?n.push({key:-1,text:`+ ${ae}`,closable:!1,isCollapseTag:!0}):q.forEach(te=>n.push(xe(te))))}oe.value=n},Pl=y(null),je=y([]),Dl=a=>{var D,ce;const{filterMethod:n,showAllLevels:w,separator:q}=t,ae=(ce=(D=M.value)==null?void 0:D.getFlattedNodes(!t.props.checkStrictly))==null?void 0:ce.filter(se=>se.isDisabled?!1:(se.calcText(w,q),n(se,z.value))),te=Fa(a.children&&a.children.length?a.children:[a]).map(se=>se.value),ve=ae==null?void 0:ae.filter(se=>te.includes(se.value));ve==null||ve.forEach(se=>{se&&Fl(se)})},We=()=>{const{value:a}=z,n=_l(a,t.options);R.value=!0,c.value=n},Tl=()=>{var n;let a;R.value&&Y.value?a=Y.value.$el.querySelector(`.${u.e("suggestion-item")}`):a=(n=M.value)==null?void 0:n.$el.querySelector(`.${u.b("node")}[tabindex="-1"]`),a&&(a.focus(),!R.value&&a.click())},Ie=()=>{var q,ae;const a=(q=Z.value)==null?void 0:q.input,n=J.value,w=(ae=Y.value)==null?void 0:ae.$el;if(!(!pa||!a)){if(w){const te=w.querySelector(`.${u.e("suggestion-list")}`);te.style.minWidth=`${a.offsetWidth}px`}if(n){const{offsetHeight:te}=n,ve=oe.value.length>0?`${Math.max(te+6,r)}px`:`${r}px`;a.style.height=ve,we()}}},xl=a=>{var n;return(n=M.value)==null?void 0:n.getCheckedNodes(a)},Ll=a=>{we(),s("expandChange",a)},Il=a=>{if(!K.value)switch(a.code){case X.enter:Q();break;case X.down:Q(!0),ue(Tl),a.preventDefault();break;case X.esc:H.value===!0&&(a.preventDefault(),a.stopPropagation(),Q(!1));break;case X.tab:Q(!1);break}},Ml=()=>{var a;(a=M.value)==null||a.clearCheckedNodes(),!H.value&&t.filterable&&Me(),Q(!1),s("clear")},Me=()=>{const{value:a}=re;G.value=a,ne.value=a},Fl=a=>{var w,q;const{checked:n}=a;p.value?(w=M.value)==null||w.handleCheckChange(a,!n,!1):(!n&&((q=M.value)==null||q.handleCheckChange(a,!0,!1)),Q(!1))},Al=a=>{const n=a.target,{code:w}=a;switch(w){case X.up:case X.down:{const q=w===X.up?-1:1;Ee(fl(n,q,`.${u.e("suggestion-item")}[tabindex="-1"]`));break}case X.enter:n.click();break}},zl=()=>{const a=oe.value,n=a[a.length-1];i=ne.value?0:i+1,!(!n||!i||t.collapseTags&&a.length>1)&&(n.hitState?Le(n):n.hitState=!0)},Ze=a=>{const n=a.target,w=u.e("search-input");n.className===w&&(le.value=!0),s("focus",a)},Ge=a=>{le.value=!1,s("blur",a)},Bl=bl(()=>{const{value:a}=z;if(!a)return;const n=t.beforeFilter(a);ia(n)?n.then(We).catch(()=>{}):n!==!1?We():Te()},t.debounce),Fe=(a,n)=>{!H.value&&Q(!0),!(n!=null&&n.isComposing)&&(a?Bl():Te())},Je=a=>Number.parseFloat(da(k.cssVarName("input-height"),a).value)-2;return ie(R,we),ie([ye,b,()=>t.collapseTags],Sl),ie(oe,()=>{ue(()=>Ie())}),ie(_,async()=>{await ue();const a=Z.value.input;r=Je(a)||r,Ie()}),ie(re,Me,{immediate:!0}),dl(()=>{const a=Z.value.input,n=Je(a);r=a.offsetHeight||n,ca(a,Ie)}),l({getCheckedNodes:xl,cascaderPanelRef:M,togglePopperVisible:Q,contentRef:qe}),(a,n)=>{const w=A("el-icon"),q=A("el-input"),ae=A("el-tag"),te=A("el-tooltip"),ve=A("el-scrollbar");return v(),j(te,{ref_key:"tooltipRef",ref:B,visible:H.value,teleported:a.teleported,"popper-class":[N(u).e("dropdown"),a.popperClass],"popper-options":o,"fallback-placements":a.fallbackPlacements,"stop-popper-mouse-event":!1,"gpu-acceleration":!1,placement:a.placement,transition:`${N(u).namespace.value}-zoom-in-top`,effect:"light",pure:"",persistent:a.persistent,onHide:Te},{default:T(()=>[ke((v(),I("div",{class:F(wl.value),style:gl(g.value),onClick:n[8]||(n[8]=()=>Q(L.value?void 0:!0)),onKeydown:Il,onMouseenter:n[9]||(n[9]=D=>V.value=!0),onMouseleave:n[10]||(n[10]=D=>V.value=!1)},[x(q,{ref_key:"input",ref:Z,modelValue:G.value,"onUpdate:modelValue":n[1]||(n[1]=D=>G.value=D),placeholder:P.value,readonly:L.value,disabled:b.value,"validate-event":!1,size:N(_),class:F(El.value),tabindex:p.value&&a.filterable&&!b.value?-1:void 0,onCompositionstart:N(C),onCompositionupdate:N(C),onCompositionend:N(C),onFocus:Ze,onBlur:Ge,onInput:Fe},{suffix:T(()=>[De.value?(v(),j(w,{key:"clear",class:F([N(k).e("icon"),"icon-circle-close"]),onClick:me(Ml,["stop"])},{default:T(()=>[x(N(yl))]),_:1},8,["class","onClick"])):(v(),j(w,{key:"arrow-down",class:F(Vl.value),onClick:n[0]||(n[0]=me(D=>Q(),["stop"]))},{default:T(()=>[x(N(kl))]),_:1},8,["class"]))]),_:1},8,["modelValue","placeholder","readonly","disabled","size","class","tabindex","onCompositionstart","onCompositionupdate","onCompositionend"]),p.value?(v(),I("div",{key:0,ref_key:"tagWrapper",ref:J,class:F([N(u).e("tags"),N(u).is("validate",!!$l.value)])},[(v(!0),I(de,null,be(oe.value,D=>(v(),j(ae,{key:D.key,type:a.tagType,size:O.value,effect:a.tagEffect,hit:D.hitState,closable:D.closable,"disable-transitions":"",onClose:ce=>Le(D)},{default:T(()=>[D.isCollapseTag===!1?(v(),I("span",Ba,ee(D.text),1)):(v(),j(te,{key:1,disabled:H.value||!a.collapseTagsTooltip,"fallback-placements":["bottom","top","right","left"],placement:"bottom",effect:"light"},{default:T(()=>[U("span",null,ee(D.text),1)]),content:T(()=>[U("div",{class:F(N(u).e("collapse-tags"))},[(v(!0),I(de,null,be(ge.value.slice(a.maxCollapseTags),(ce,se)=>(v(),I("div",{key:se,class:F(N(u).e("collapse-tag"))},[(v(),j(ae,{key:ce.key,class:"in-tooltip",type:a.tagType,size:O.value,effect:a.tagEffect,hit:ce.hitState,closable:ce.closable,"disable-transitions":"",onClose:pt=>Le(ce)},{default:T(()=>[U("span",null,ee(ce.text),1)]),_:2},1032,["type","size","effect","hit","closable","onClose"]))],2))),128))],2)]),_:2},1032,["disabled"]))]),_:2},1032,["type","size","effect","hit","closable","onClose"]))),128)),a.filterable&&!b.value?ke((v(),I("input",{key:0,"onUpdate:modelValue":n[2]||(n[2]=D=>ne.value=D),type:"text",class:F(N(u).e("search-input")),placeholder:re.value?"":S.value,onInput:n[3]||(n[3]=D=>Fe(ne.value,D)),onClick:n[4]||(n[4]=me(D=>Q(!0),["stop"])),onKeydown:ra(zl,["delete"]),onCompositionstart:n[5]||(n[5]=(...D)=>N(C)&&N(C)(...D)),onCompositionupdate:n[6]||(n[6]=(...D)=>N(C)&&N(C)(...D)),onCompositionend:n[7]||(n[7]=(...D)=>N(C)&&N(C)(...D)),onFocus:Ze,onBlur:Ge},null,42,Ha)),[[ua,ne.value]]):Ce("",!0)],2)):Ce("",!0)],38)),[[N(Cl),()=>Q(!1),qe.value]])]),content:T(()=>[ke(x(sl,{ref_key:"cascaderPanelRef",ref:M,modelValue:Ke.value,"onUpdate:modelValue":n[11]||(n[11]=D=>Ke.value=D),options:a.options,props:t.props,border:!1,"render-label":a.$slots.default,titles:a.titles,onExpandChange:Ll,onClose:n[12]||(n[12]=D=>a.$nextTick(()=>Q(!1)))},{empty:T(()=>[Ne(a.$slots,"empty")]),_:3},8,["modelValue","options","props","render-label","titles"]),[[He,!R.value]]),a.filterable?ke((v(),j(ve,{key:0,ref_key:"suggestionPanel",ref:Y,tag:"ul",class:F(N(u).e("suggestion-panel")),"view-class":N(u).e("suggestion-list"),onKeydown:Al},{default:T(()=>[c.value.length?(v(),j(sl,{key:0,ref_key:"cascaderPanelRef2",ref:Pl,modelValue:je.value,"onUpdate:modelValue":n[13]||(n[13]=D=>je.value=D),options:c.value,props:t.props,border:!1,"render-label":a.$slots.default,titles:a.titles,suggestions:"",onCheckChange:Dl},{empty:T(()=>[Ne(a.$slots,"empty")]),_:3},8,["modelValue","options","props","render-label","titles"])):Ne(a.$slots,"empty",{key:1},()=>[U("li",{class:F(N(u).e("empty-text"))},ee(N(h)("el.cascader.noMatch")),3)])]),_:3},8,["class","view-class"])),[[He,R.value]]):Ce("",!0)]),_:3},8,["visible","teleported","popper-class","fallback-placements","placement","transition","persistent"])}}}),Ua=Nl(Oa),Ka={titles:{type:Array,default:()=>[]},placement:{type:he(String),values:nl,default:"bottom-start"},fallbackPlacements:{type:he(Array),default:["bottom-start","bottom","top-start","top","right","left"]},persistent:{type:Boolean,default:!0},tagEffect:{...ol.effect,default:"light"},...il},qa={clear:()=>!0,...cl},ja={class:"flex items-center"},Wa={class:"cascader-menu"},Za={class:"bg-#E9EDF7 color-#8D97A8 text-12px px8px leading-24px"},Ga={class:"p4px w180px"},Ja={class:"flex-1"},Xa={class:"cascader-menu"},Ya={class:"bg-#E9EDF7 color-#8D97A8 text-12px px8px leading-24px"},Qa={class:"p4px w180px"},et={class:"flex-1"},lt={class:"cascader-menu"},at={class:"bg-#E9EDF7 color-#8D97A8 text-12px px8px leading-24px"},tt={class:"p4px w180px"},st={class:"flex-1"},nt=fe({__name:"index",props:{titles:{},debounce:{default:1e3}},setup(e){const l=e,s=y(""),t=y([{label:"111",value:"1",checked:!1,children:[{label:"111-1",value:"1-1",checked:!1,children:[{label:"111-1-1",value:"1-1-1",checked:!1},{label:"111-1-2",value:"1-1-2",checked:!1}]},{label:"111-2",value:"1-2",checked:!1,children:[]}]},{label:"222",value:"2",checked:!1,children:[{label:"222-1",value:"2-1",checked:!1,children:[]},{label:"222-2",value:"2-2",checked:!1,children:[{label:"222-2-1",value:"2-2-1",checked:!1},{label:"222-2-2",value:"2-2-2",checked:!1}]}]}]),o=f(()=>t.value),d=f(()=>t.value[0].children),r=f(()=>{var h,m;return((m=(h=t.value[0])==null?void 0:h.children[0])==null?void 0:m.children)||[]}),i=f(()=>!1),u=bl(()=>{const{value:h}=s},l.debounce),k=(h,m)=>{console.log(m),h&&u()};return ie(()=>t.value,()=>{console.log("data>>>>",t.value)},{deep:!0}),(h,m)=>{const $=A("el-icon"),E=A("el-input"),K=A("el-checkbox");return v(),I("div",null,[x(E,{class:"p12px",style:{"border-bottom":"1px solid #d8dfeb"},modelValue:s.value,"onUpdate:modelValue":m[0]||(m[0]=C=>s.value=C),placeholder:"输入查找的内容",onInput:k},{suffix:T(()=>[x($,null,{default:T(()=>[x(N(fa))]),_:1})]),_:1},8,["modelValue"]),U("div",ja,[U("div",Wa,[U("div",Za,ee(h.titles[0]),1),U("div",Ga,[(v(!0),I(de,null,be(o.value,C=>(v(),I("div",{class:"flex items-center justify-between",key:C.value},[x(K,{class:"ml8px mr6px!",modelValue:C.checked,"onUpdate:modelValue":B=>C.checked=B,disabled:i.value},null,8,["modelValue","onUpdate:modelValue","disabled"]),U("span",Ja,ee(C.label),1),x($,null,{default:T(()=>[x(N(Ve))]),_:1})]))),128))])]),U("div",Xa,[U("div",Ya,ee(h.titles[1]),1),U("div",Qa,[(v(!0),I(de,null,be(d.value,C=>(v(),I("div",{class:"flex items-center justify-between",key:C.value},[x(K,{class:"ml8px mr6px!",modelValue:C.checked,"onUpdate:modelValue":B=>C.checked=B,disabled:i.value},null,8,["modelValue","onUpdate:modelValue","disabled"]),U("span",et,ee(C.label),1),x($,null,{default:T(()=>[x(N(Ve))]),_:1})]))),128))])]),U("div",lt,[U("div",at,ee(h.titles[2]),1),U("div",tt,[(v(!0),I(de,null,be(r.value,C=>(v(),I("div",{class:"flex items-center justify-between",key:C.value},[x(K,{class:"ml8px mr6px!",modelValue:C.checked,"onUpdate:modelValue":B=>C.checked=B,disabled:i.value},null,8,["modelValue","onUpdate:modelValue","disabled"]),U("span",st,ee(C.label),1),x($,null,{default:T(()=>[x(N(Ve))]),_:1})]))),128))])])])])}}});const ot=Pe(nt,[["__scopeId","data-v-43a84d04"]]),it="CustomCascader",ct=fe({name:it,__name:"cascader",props:Ka,emits:qa,setup(e,{expose:l,emit:s}){const t=e,o={modifiers:[{name:"arrowPosition",enabled:!0,phase:"main",fn:({state:p})=>{const{modifiersData:L,placement:z}=p;["right","left","bottom","top"].includes(z)||(L.arrow.x=35)},requires:["arrow"]}]},d=vl(),r=pe("cascader"),i=pe("input"),{t:u}=Oe(),{form:k}=hl(),h=y(null),m=y(null),$=y(!1),E=y(!1),K=y(!1),C=y(!1),B=y(),Z=y(),J=f(()=>d.style),M=f(()=>t.disabled||(k==null?void 0:k.disabled)),Y=f(()=>t.placeholder||u("el.cascader.placeholder")),H=f(()=>Y.value),V=ml(),R=f(()=>!!t.props.multiple),le=f(()=>!t.filterable||R.value),G=f(()=>!1),ne=f(()=>[r.b(),r.m(V.value),r.is("disabled",M.value),d.class]),oe=f(()=>[i.e("icon"),"icon-arrow-down",r.is("reverse",$.value)]),ge=f(()=>r.is("focus",$.value||C.value)),c=f(()=>{var p,L;return(L=(p=h.value)==null?void 0:p.popperRef)==null?void 0:L.contentRef}),g=p=>{var L,z;M.value||(p=p??!$.value,p!==$.value&&($.value=p,(z=(L=m.value)==null?void 0:L.input)==null||z.setAttribute("aria-expanded",`${p}`),s("visibleChange",p)))},b=()=>{ue(()=>{var p;(p=h.value)==null||p.updatePopper()})},S=()=>{K.value=!1},P=()=>{g(!1),s("clear")},_=p=>{const L=p.target,z=r.e("search-input");L.className===z&&(C.value=!0),s("focus",p)},O=p=>{C.value=!1,s("blur",p)};return ie(K,b),l({togglePopperVisible:g,contentRef:c}),(p,L)=>{const z=A("el-icon"),ye=A("el-input"),De=A("el-tooltip");return v(),j(De,{ref_key:"tooltipRef",ref:h,visible:$.value,teleported:p.teleported,"popper-class":[N(r).e("dropdown"),p.popperClass],"popper-options":o,"fallback-placements":p.fallbackPlacements,"stop-popper-mouse-event":!1,"gpu-acceleration":!1,placement:p.placement,transition:`${N(r).namespace.value}-zoom-in-top`,effect:"light",pure:"",persistent:p.persistent,onHide:S},{default:T(()=>[ke((v(),I("div",{class:F(ne.value),style:gl(J.value),onClick:L[1]||(L[1]=()=>g(le.value?void 0:!0)),onMouseenter:L[2]||(L[2]=re=>E.value=!0),onMouseleave:L[3]||(L[3]=re=>E.value=!1)},[x(ye,{ref_key:"input",ref:m,placeholder:H.value,readonly:le.value,disabled:M.value,"validate-event":!1,size:N(V),class:F(ge.value),tabindex:R.value&&p.filterable&&!M.value?-1:void 0,onFocus:_,onBlur:O},{suffix:T(()=>[G.value?(v(),j(z,{key:"clear",class:F([N(i).e("icon"),"icon-circle-close"]),onClick:me(P,["stop"])},{default:T(()=>[x(N(yl))]),_:1},8,["class","onClick"])):(v(),j(z,{key:"arrow-down",class:F(oe.value),onClick:L[0]||(L[0]=me(re=>g(),["stop"]))},{default:T(()=>[x(N(kl))]),_:1},8,["class"]))]),_:1},8,["placeholder","readonly","disabled","size","class","tabindex"])],38)),[[N(Cl),()=>g(!1),c.value]])]),content:T(()=>[ke(x(ot,{ref_key:"cascaderPanelRef",ref:Z,modelValue:B.value,"onUpdate:modelValue":L[4]||(L[4]=re=>B.value=re),options:p.options,props:t.props,"render-label":p.$slots.default,titles:p.titles},{empty:T(()=>[Ne(p.$slots,"empty")]),_:3},8,["modelValue","options","props","render-label","titles"]),[[He,!K.value]])]),_:3},8,["visible","teleported","popper-class","fallback-placements","placement","transition","persistent"])}}}),rt=Nl(ct),ut={class:"p20px flex justify-end"},dt={class:"w260px"},ht=fe({__name:"cascader",setup(e){const l=y(),s=y(),t=y([]),o=()=>{},d=["省","市","区"],r=()=>{},i=y(),u=y();return(()=>{setTimeout(()=>{t.value=[{value:"guide",label:"Guide",children:[{value:"disciplines",label:"Disciplines",children:[{value:"consistency",label:"Consistency"},{value:"feedback",label:"Feedback"},{value:"efficiency",label:"Efficiency"},{value:"controllability",label:"Controllability"}]},{value:"navigation",label:"Navigation",children:[{value:"side nav",label:"Side Navigation"},{value:"top nav",label:"Top Navigation"}]}]},{value:"component",label:"Component",children:[{value:"basic",label:"Basic",children:[{value:"layout",label:"Layout"},{value:"color",label:"Color"},{value:"typography",label:"Typography"},{value:"icon",label:"Icon"},{value:"button",label:"Button"}]},{value:"form",label:"Form",children:[{value:"radio",label:"Radio"},{value:"checkbox",label:"Checkbox"},{value:"input",label:"Input"},{value:"input-number",label:"InputNumber"},{value:"select",label:"Select"},{value:"cascader",label:"Cascader"},{value:"switch",label:"Switch"},{value:"slider",label:"Slider"},{value:"time-picker",label:"TimePicker"},{value:"date-picker",label:"DatePicker"},{value:"datetime-picker",label:"DateTimePicker"},{value:"upload",label:"Upload"},{value:"rate",label:"Rate"},{value:"form",label:"Form"}]},{value:"data",label:"Data",children:[{value:"table",label:"Table"},{value:"tag",label:"Tag"},{value:"progress",label:"Progress"},{value:"tree",label:"Tree"},{value:"pagination",label:"Pagination"},{value:"badge",label:"Badge"}]},{value:"notice",label:"Notice",children:[{value:"alert",label:"Alert"},{value:"loading",label:"Loading"},{value:"message",label:"Message"},{value:"message-box",label:"MessageBox"},{value:"notification",label:"Notification"}]},{value:"navigation",label:"Navigation",children:[{value:"menu",label:"Menu"},{value:"tabs",label:"Tabs"},{value:"breadcrumb",label:"Breadcrumb"},{value:"dropdown",label:"Dropdown"},{value:"steps",label:"Steps"}]},{value:"others",label:"Others",children:[{value:"dialog",label:"Dialog"},{value:"tooltip",label:"Tooltip"},{value:"popover",label:"Popover"},{value:"card",label:"Card"},{value:"carousel",label:"Carousel"},{value:"collapse",label:"Collapse"}]}]},{value:"resource",label:"Resource",children:[{value:"axure",label:"Axure Components"},{value:"sketch",label:"Sketch Templates"},{value:"docs",label:"Design Documentation"}]}]},100)})(),sessionStorage.setItem("user","liyang"),(h,m)=>{const $=A("el-cascader");return v(),I("div",ut,[U("div",dt,[Se(" 内部： "),x(N(Ua),{ref_key:"cascaderRef",ref:l,modelValue:s.value,"onUpdate:modelValue":m[0]||(m[0]=E=>s.value=E),titles:d,placeholder:"请选择",options:t.value,props:{multiple:!0},filterable:"",clearable:"","collapse-tags":"","collapse-tags-tooltip":"","max-collapse-tags":1,separator:"-",style:{width:"100%"},onChange:o,onVisibleChange:r},null,8,["modelValue","options"]),x(N(rt),{ref:"cascaderRef3",modelValue:u.value,"onUpdate:modelValue":m[1]||(m[1]=E=>u.value=E),titles:d,placeholder:"请选择",options:t.value,props:{multiple:!0},filterable:"",clearable:"","collapse-tags":"","collapse-tags-tooltip":"","max-collapse-tags":1,separator:"-",style:{width:"100%"},onChange:o},null,8,["modelValue","options"]),Se(" el-cascader： "),x($,{ref:"cascaderRef2",modelValue:i.value,"onUpdate:modelValue":m[2]||(m[2]=E=>i.value=E),titles:d,placeholder:"请选择",options:t.value,props:{multiple:!0},filterable:"",clearable:"","collapse-tags":"","collapse-tags-tooltip":"","max-collapse-tags":1,separator:"-",style:{width:"100%"},onChange:o,onVisibleChange:r},null,8,["modelValue","options"])])])}}});export{ht as default};
//# sourceMappingURL=cascader-c06c66ba.js.map
