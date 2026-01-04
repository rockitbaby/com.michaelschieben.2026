const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-Dh3HEq8M.js","assets/client-Dzuxdzeo.js","assets/raw-B28ebt5Q.js"])))=>i.map(i=>d[i]);
const ee="modulepreload",te=function(e){return"/"+e},I={},_=function(t,r,n){let i=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),o=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));i=Promise.allSettled(r.map(s=>{if(s=te(s),s in I)return;I[s]=!0;const c=s.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${d}`))return;const u=document.createElement("link");if(u.rel=c?"stylesheet":ee,c||(u.as="script"),u.crossOrigin="",u.href=s,o&&u.setAttribute("nonce",o),document.head.appendChild(u),c)return new Promise((g,m)=>{u.addEventListener("load",g),u.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${s}`)))})}))}function a(l){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=l,window.dispatchEvent(o),!o.defaultPrevented)throw l}return i.then(l=>{for(const o of l||[])o.status==="rejected"&&a(o.reason);return t().catch(a)})};function re(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}return e}function M(e,t){return Array(t+1).join(e)}function U(e){return e.replace(/^\n*/,"")}function V(e){for(var t=e.length;t>0&&e[t-1]===`
`;)t--;return e.substring(0,t)}function q(e){return V(U(e))}var ne=["ADDRESS","ARTICLE","ASIDE","AUDIO","BLOCKQUOTE","BODY","CANVAS","CENTER","DD","DIR","DIV","DL","DT","FIELDSET","FIGCAPTION","FIGURE","FOOTER","FORM","FRAMESET","H1","H2","H3","H4","H5","H6","HEADER","HGROUP","HR","HTML","ISINDEX","LI","MAIN","MENU","NAV","NOFRAMES","NOSCRIPT","OL","OUTPUT","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"];function D(e){return O(e,ne)}var W=["AREA","BASE","BR","COL","COMMAND","EMBED","HR","IMG","INPUT","KEYGEN","LINK","META","PARAM","SOURCE","TRACK","WBR"];function j(e){return O(e,W)}function ie(e){return G(e,W)}var K=["A","TABLE","THEAD","TBODY","TFOOT","TH","TD","IFRAME","SCRIPT","AUDIO","VIDEO"];function ae(e){return O(e,K)}function oe(e){return G(e,K)}function O(e,t){return t.indexOf(e.nodeName)>=0}function G(e,t){return e.getElementsByTagName&&t.some(function(r){return e.getElementsByTagName(r).length})}var f={};f.paragraph={filter:"p",replacement:function(e){return`

`+e+`

`}};f.lineBreak={filter:"br",replacement:function(e,t,r){return r.br+`
`}};f.heading={filter:["h1","h2","h3","h4","h5","h6"],replacement:function(e,t,r){var n=Number(t.nodeName.charAt(1));if(r.headingStyle==="setext"&&n<3){var i=M(n===1?"=":"-",e.length);return`

`+e+`
`+i+`

`}else return`

`+M("#",n)+" "+e+`

`}};f.blockquote={filter:"blockquote",replacement:function(e){return e=q(e).replace(/^/gm,"> "),`

`+e+`

`}};f.list={filter:["ul","ol"],replacement:function(e,t){var r=t.parentNode;return r.nodeName==="LI"&&r.lastElementChild===t?`
`+e:`

`+e+`

`}};f.listItem={filter:"li",replacement:function(e,t,r){var n=r.bulletListMarker+"   ",i=t.parentNode;if(i.nodeName==="OL"){var a=i.getAttribute("start"),l=Array.prototype.indexOf.call(i.children,t);n=(a?Number(a)+l:l+1)+".  "}var o=/\n$/.test(e);return e=q(e)+(o?`
`:""),e=e.replace(/\n/gm,`
`+" ".repeat(n.length)),n+e+(t.nextSibling?`
`:"")}};f.indentedCodeBlock={filter:function(e,t){return t.codeBlockStyle==="indented"&&e.nodeName==="PRE"&&e.firstChild&&e.firstChild.nodeName==="CODE"},replacement:function(e,t,r){return`

    `+t.firstChild.textContent.replace(/\n/g,`
    `)+`

`}};f.fencedCodeBlock={filter:function(e,t){return t.codeBlockStyle==="fenced"&&e.nodeName==="PRE"&&e.firstChild&&e.firstChild.nodeName==="CODE"},replacement:function(e,t,r){for(var n=t.firstChild.getAttribute("class")||"",i=(n.match(/language-(\S+)/)||[null,""])[1],a=t.firstChild.textContent,l=r.fence.charAt(0),o=3,s=new RegExp("^"+l+"{3,}","gm"),c;c=s.exec(a);)c[0].length>=o&&(o=c[0].length+1);var d=M(l,o);return`

`+d+i+`
`+a.replace(/\n$/,"")+`
`+d+`

`}};f.horizontalRule={filter:"hr",replacement:function(e,t,r){return`

`+r.hr+`

`}};f.inlineLink={filter:function(e,t){return t.linkStyle==="inlined"&&e.nodeName==="A"&&e.getAttribute("href")},replacement:function(e,t){var r=t.getAttribute("href");r&&(r=r.replace(/([()])/g,"\\$1"));var n=v(t.getAttribute("title"));return n&&(n=' "'+n.replace(/"/g,'\\"')+'"'),"["+e+"]("+r+n+")"}};f.referenceLink={filter:function(e,t){return t.linkStyle==="referenced"&&e.nodeName==="A"&&e.getAttribute("href")},replacement:function(e,t,r){var n=t.getAttribute("href"),i=v(t.getAttribute("title"));i&&(i=' "'+i+'"');var a,l;switch(r.linkReferenceStyle){case"collapsed":a="["+e+"][]",l="["+e+"]: "+n+i;break;case"shortcut":a="["+e+"]",l="["+e+"]: "+n+i;break;default:var o=this.references.length+1;a="["+e+"]["+o+"]",l="["+o+"]: "+n+i}return this.references.push(l),a},references:[],append:function(e){var t="";return this.references.length&&(t=`

`+this.references.join(`
`)+`

`,this.references=[]),t}};f.emphasis={filter:["em","i"],replacement:function(e,t,r){return e.trim()?r.emDelimiter+e+r.emDelimiter:""}};f.strong={filter:["strong","b"],replacement:function(e,t,r){return e.trim()?r.strongDelimiter+e+r.strongDelimiter:""}};f.code={filter:function(e){var t=e.previousSibling||e.nextSibling,r=e.parentNode.nodeName==="PRE"&&!t;return e.nodeName==="CODE"&&!r},replacement:function(e){if(!e)return"";e=e.replace(/\r?\n|\r/g," ");for(var t=/^`|^ .*?[^ ].* $|`$/.test(e)?" ":"",r="`",n=e.match(/`+/gm)||[];n.indexOf(r)!==-1;)r=r+"`";return r+t+e+t+r}};f.image={filter:"img",replacement:function(e,t){var r=v(t.getAttribute("alt")),n=t.getAttribute("src")||"",i=v(t.getAttribute("title")),a=i?' "'+i+'"':"";return n?"!["+r+"]("+n+a+")":""}};function v(e){return e?e.replace(/(\n+\s*)+/g,`
`):""}function X(e){this.options=e,this._keep=[],this._remove=[],this.blankRule={replacement:e.blankReplacement},this.keepReplacement=e.keepReplacement,this.defaultRule={replacement:e.defaultReplacement},this.array=[];for(var t in e.rules)this.array.push(e.rules[t])}X.prototype={add:function(e,t){this.array.unshift(t)},keep:function(e){this._keep.unshift({filter:e,replacement:this.keepReplacement})},remove:function(e){this._remove.unshift({filter:e,replacement:function(){return""}})},forNode:function(e){if(e.isBlank)return this.blankRule;var t;return(t=C(this.array,e,this.options))||(t=C(this._keep,e,this.options))||(t=C(this._remove,e,this.options))?t:this.defaultRule},forEach:function(e){for(var t=0;t<this.array.length;t++)e(this.array[t],t)}};function C(e,t,r){for(var n=0;n<e.length;n++){var i=e[n];if(se(i,t,r))return i}}function se(e,t,r){var n=e.filter;if(typeof n=="string"){if(n===t.nodeName.toLowerCase())return!0}else if(Array.isArray(n)){if(n.indexOf(t.nodeName.toLowerCase())>-1)return!0}else if(typeof n=="function"){if(n.call(e,t,r))return!0}else throw new TypeError("`filter` needs to be a string, array, or function")}function le(e){var t=e.element,r=e.isBlock,n=e.isVoid,i=e.isPre||function(u){return u.nodeName==="PRE"};if(!(!t.firstChild||i(t))){for(var a=null,l=!1,o=null,s=$(o,t,i);s!==t;){if(s.nodeType===3||s.nodeType===4){var c=s.data.replace(/[ \r\n\t]+/g," ");if((!a||/ $/.test(a.data))&&!l&&c[0]===" "&&(c=c.substr(1)),!c){s=x(s);continue}s.data=c,a=s}else if(s.nodeType===1)r(s)||s.nodeName==="BR"?(a&&(a.data=a.data.replace(/ $/,"")),a=null,l=!1):n(s)||i(s)?(a=null,l=!0):a&&(l=!1);else{s=x(s);continue}var d=$(o,s,i);o=s,s=d}a&&(a.data=a.data.replace(/ $/,""),a.data||x(a))}}function x(e){var t=e.nextSibling||e.parentNode;return e.parentNode.removeChild(e),t}function $(e,t,r){return e&&e.parentNode===t||r(t)?t.nextSibling||t.parentNode:t.firstChild||t.nextSibling||t.parentNode}var P=typeof window<"u"?window:{};function ce(){var e=P.DOMParser,t=!1;try{new e().parseFromString("","text/html")&&(t=!0)}catch{}return t}function ue(){var e=function(){};return fe()?e.prototype.parseFromString=function(t){var r=new window.ActiveXObject("htmlfile");return r.designMode="on",r.open(),r.write(t),r.close(),r}:e.prototype.parseFromString=function(t){var r=document.implementation.createHTMLDocument("");return r.open(),r.write(t),r.close(),r},e}function fe(){var e=!1;try{document.implementation.createHTMLDocument("").open()}catch{P.ActiveXObject&&(e=!0)}return e}var de=ce()?P.DOMParser:ue();function me(e,t){var r;if(typeof e=="string"){var n=pe().parseFromString('<x-turndown id="turndown-root">'+e+"</x-turndown>","text/html");r=n.getElementById("turndown-root")}else r=e.cloneNode(!0);return le({element:r,isBlock:D,isVoid:j,isPre:t.preformattedCode?he:null}),r}var L;function pe(){return L=L||new de,L}function he(e){return e.nodeName==="PRE"||e.nodeName==="CODE"}function ge(e,t){return e.isBlock=D(e),e.isCode=e.nodeName==="CODE"||e.parentNode.isCode,e.isBlank=ve(e),e.flankingWhitespace=be(e,t),e}function ve(e){return!j(e)&&!ae(e)&&/^\s*$/i.test(e.textContent)&&!ie(e)&&!oe(e)}function be(e,t){if(e.isBlock||t.preformattedCode&&e.isCode)return{leading:"",trailing:""};var r=ye(e.textContent);return r.leadingAscii&&H("left",e,t)&&(r.leading=r.leadingNonAscii),r.trailingAscii&&H("right",e,t)&&(r.trailing=r.trailingNonAscii),{leading:r.leading,trailing:r.trailing}}function ye(e){var t=e.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);return{leading:t[1],leadingAscii:t[2],leadingNonAscii:t[3],trailing:t[4],trailingNonAscii:t[5],trailingAscii:t[6]}}function H(e,t,r){var n,i,a;return e==="left"?(n=t.previousSibling,i=/ $/):(n=t.nextSibling,i=/^ /),n&&(n.nodeType===3?a=i.test(n.nodeValue):r.preformattedCode&&n.nodeName==="CODE"?a=!1:n.nodeType===1&&!D(n)&&(a=i.test(n.textContent))),a}var we=Array.prototype.reduce,ke=[[/\\/g,"\\\\"],[/\*/g,"\\*"],[/^-/g,"\\-"],[/^\+ /g,"\\+ "],[/^(=+)/g,"\\$1"],[/^(#{1,6}) /g,"\\$1 "],[/`/g,"\\`"],[/^~~~/g,"\\~~~"],[/\[/g,"\\["],[/\]/g,"\\]"],[/^>/g,"\\>"],[/_/g,"\\_"],[/^(\d+)\. /g,"$1\\. "]];function b(e){if(!(this instanceof b))return new b(e);var t={rules:f,headingStyle:"setext",hr:"* * *",bulletListMarker:"*",codeBlockStyle:"indented",fence:"```",emDelimiter:"_",strongDelimiter:"**",linkStyle:"inlined",linkReferenceStyle:"full",br:"  ",preformattedCode:!1,blankReplacement:function(r,n){return n.isBlock?`

`:""},keepReplacement:function(r,n){return n.isBlock?`

`+n.outerHTML+`

`:n.outerHTML},defaultReplacement:function(r,n){return n.isBlock?`

`+r+`

`:r}};this.options=re({},t,e),this.rules=new X(this.options)}b.prototype={turndown:function(e){if(!Se(e))throw new TypeError(e+" is not a string, or an element/document/fragment node.");if(e==="")return"";var t=Y.call(this,new me(e,this.options));return Ee.call(this,t)},use:function(e){if(Array.isArray(e))for(var t=0;t<e.length;t++)this.use(e[t]);else if(typeof e=="function")e(this);else throw new TypeError("plugin must be a Function or an Array of Functions");return this},addRule:function(e,t){return this.rules.add(e,t),this},keep:function(e){return this.rules.keep(e),this},remove:function(e){return this.rules.remove(e),this},escape:function(e){return ke.reduce(function(t,r){return t.replace(r[0],r[1])},e)}};function Y(e){var t=this;return we.call(e.childNodes,function(r,n){n=new ge(n,t.options);var i="";return n.nodeType===3?i=n.isCode?n.nodeValue:t.escape(n.nodeValue):n.nodeType===1&&(i=Ae.call(t,n)),z(r,i)},"")}function Ee(e){var t=this;return this.rules.forEach(function(r){typeof r.append=="function"&&(e=z(e,r.append(t.options)))}),e.replace(/^[\t\r\n]+/,"").replace(/[\t\r\n\s]+$/,"")}function Ae(e){var t=this.rules.forNode(e),r=Y.call(this,e),n=e.flankingWhitespace;return(n.leading||n.trailing)&&(r=r.trim()),n.leading+t.replacement(r,e,this.options)+n.trailing}function z(e,t){var r=V(e),n=U(t),i=Math.max(e.length-r.length,t.length-n.length),a=`

`.substring(0,i);return r+a+n}function Se(e){return e!=null&&(typeof e=="string"||e.nodeType&&(e.nodeType===1||e.nodeType===9||e.nodeType===11))}const Q=new b({headingStyle:"atx",codeBlockStyle:"fenced",bulletListMarker:"*",emDelimiter:"*",strongDelimiter:"**"});Q.addRule("strikethrough",{filter:["del","s","strike"],replacement:e=>"~~"+e+"~~"});function Re(e){var a,l,o,s,c,d,u,g;if(!e)return{};const t={},r=e.querySelector("dl");if(!r)return t;const n=[],i=[];Array.from(r.children).forEach(m=>{m.classList.contains("frontmatter-separator")||(m.tagName==="DT"?n.push(m):m.tagName==="DD"&&i.push(m))});for(let m=0;m<n.length;m++){const w=(((a=n[m].textContent)==null?void 0:a.trim())||"").replace(/: $/,"").replace(/:$/,""),k=i[m];if(!k)continue;const E=k.querySelector("dl");if(E){const p=E.querySelectorAll("dt"),B=E.querySelectorAll("dd"),A=[];for(let h=0;h<p.length;h+=2)if(h+1<p.length){const S=p[h],R=p[h+1],N=B[h],T=B[h+1],J=((o=(l=S==null?void 0:S.textContent)==null?void 0:l.trim())==null?void 0:o.replace(/: $/,""))||"",Z=((c=(s=R==null?void 0:R.textContent)==null?void 0:s.trim())==null?void 0:c.replace(/: $/,""))||"";J==="label"&&Z==="value"&&A.push({label:((d=N==null?void 0:N.textContent)==null?void 0:d.trim())||"",value:((u=T==null?void 0:T.textContent)==null?void 0:u.trim())||""})}A.length>0&&(t[w]=A)}else{const p=((g=k.textContent)==null?void 0:g.trim())||"";/^\d+$/.test(p)?t[w]=parseInt(p,10):t[w]=p}}return t}function Ne(e){if(!e)return"";const t=e.cloneNode(!0);return Q.turndown(t).trim()}function Te(e){const t=e.dataset.slug||"",r=e.querySelector("aside.frontmatter"),n=e.querySelector(".markdown"),i=Re(r),a=Ne(n),l={order:typeof i.order=="number"?i.order:0,title:typeof i.title=="string"?i.title:"",...i},o=["---"];Object.entries(l).forEach(([c,d])=>{if(c==="sidebar_meta"&&Array.isArray(d))o.push(`${c}:`),d.forEach(u=>{o.push(`  - label: "${u.label}"`),o.push(`    value: "${u.value}"`)});else{const u=typeof d=="string"?`"${d}"`:String(d);o.push(`${c}: ${u}`)}}),o.push("---"),o.push("");const s=o.join(`
`)+`
`+a;return{slug:t,frontmatter:l,content:a,rawMarkdown:s}}function Ce(){const t=new URLSearchParams(window.location.search).get("mode");if(t&&["page","reader","raw","source"].includes(t))return t;const r=localStorage.getItem("preferredMode");return r&&["page","reader","raw","source"].includes(r)?r:"reader"}function xe(e){const t=new URL(window.location.href);t.searchParams.set("mode",e),window.history.replaceState({},"",t.toString()),localStorage.setItem("preferredMode",e)}let y=null;function Le(){return Array.from(document.querySelectorAll("section[data-slug]")).map(Te)}function Me(){const e=document.querySelector("main");e&&!y&&(y=e.innerHTML)}function De(e,t){const r=document.createElement("header");r.className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border",r.innerHTML=`
    <div class="container max-w-6xl mx-auto px-4 py-3">
      <nav class="flex items-center justify-between">
        <div class="font-mono text-sm text-muted-foreground">
          <span class="hidden sm:inline">// </span>
          <span class="text-foreground font-medium">michaelschieben.com 2026</span>
        </div>
        <div class="flex items-center gap-1" id="mode-toggle-buttons"></div>
      </nav>
    </div>
  `;const n=[{id:"page",label:"PAGE",mobileLabel:"P",shortcut:"1"},{id:"reader",label:"READER",mobileLabel:"R",shortcut:"2"},{id:"raw",label:"RAW",mobileLabel:"Ra",shortcut:"3"},{id:"source",label:"SOURCE",mobileLabel:"S",shortcut:"U"}],i=r.querySelector("#mode-toggle-buttons");if(!i)return;const a=l=>{i.innerHTML="",n.forEach(o=>{const s=document.createElement("button");s.className=`
        relative px-3 py-1.5 text-xs font-mono uppercase tracking-wider
        transition-all duration-200 rounded-sm
        ${l===o.id?"bg-primary text-primary-foreground":"text-muted-foreground hover:text-foreground hover:bg-muted"}
      `,s.innerHTML=`
        <span class="hidden sm:inline">${o.label}</span>
        <span class="sm:hidden">${o.mobileLabel}</span>
      `,s.addEventListener("click",()=>{o.id==="source"?window.open("https://github.com/rockitbaby/com.michaelschieben.2026/tree/main/content/sections","_blank"):t(o.id)}),i.appendChild(s)})};return a(e),r.updateButtons=a,document.body.insertBefore(r,document.body.firstChild),a}async function Oe(e){const{renderReaderMode:t}=await _(async()=>{const{renderReaderMode:r}=await import("./page-Dh3HEq8M.js");return{renderReaderMode:r}},__vite__mapDeps([0,1]));t(e)}async function Pe(e){const{renderRawMode:t}=await _(async()=>{const{renderRawMode:r}=await import("./raw-B28ebt5Q.js");return{renderRawMode:r}},__vite__mapDeps([2,1]));t(e)}function Be(){const e=document.querySelector("main");if(!e)return null;let t=e.parentElement;(!t||!t.classList.contains("min-h-screen"))&&(t=document.createElement("div"),t.className="min-h-screen bg-background",e.parentNode&&(e.parentNode.insertBefore(t,e),t.appendChild(e)));const r=t.querySelector(":scope > footer");r&&r.remove();const n=document.createElement("footer");return n.className="border-t border-border mt-16",n.innerHTML=`
    <div class="container max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-mono">
        <div>
          <span class="text-foreground">// </span>
          every decoding is another encoding
        </div>
        <div class="hidden sm:flex items-center gap-4">
          <span class="kbd-hint">⌘1</span>
          <span class="kbd-hint">⌘2</span>
          <span class="kbd-hint">⌘3</span>
          <span class="kbd-hint">⌘U</span>
          <span class="text-xs">keyboard shortcuts</span>
        </div>
      </div>
    </div>
  `,t.appendChild(n),{main:e,wrapper:t}}function Ie(){const e=Be();if(!e)return;const{main:t}=e;y&&(t.innerHTML=y),t.className="markdown-mode"}function $e(){window.location.href="view-source:"+window.location.href}function F(){Me();const e=Le();let t=Ce();const r=De(t,i=>{n(i)}),n=async i=>{switch(t=i,xe(i),r&&r(i),i){case"page":await Oe(e);break;case"reader":Ie();break;case"raw":await Pe(e);break;case"source":$e();break}};n(t),window.addEventListener("keydown",i=>{if(i.metaKey||i.ctrlKey)switch(i.key){case"1":i.preventDefault(),n("page");break;case"2":i.preventDefault(),n("reader");break;case"3":i.preventDefault(),n("raw");break;case"u":case"U":i.preventDefault(),n("source");break}})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",F):F();
