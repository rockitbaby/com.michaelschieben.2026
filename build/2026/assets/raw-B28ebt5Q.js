import{j as e,c as p}from"./client-Dzuxdzeo.js";function h({sections:n}){const s=t=>{const a=t.split(`
`),c=String(a.length).length;return a.map((r,d)=>{const i=String(d+1).padStart(c," ");let o=r;if(r==="---")o=e.jsx("span",{className:"text-code-comment",children:r});else if(r.match(/^[a-z_]+:/i)&&!r.startsWith("#")){const[l,...m]=r.split(":"),x=m.join(":");o=e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"text-code-property",children:l}),e.jsx("span",{className:"text-code-comment",children:":"}),e.jsx("span",{className:"text-code-string",children:x})]})}else r.startsWith("#")?o=e.jsx("span",{className:"text-code-keyword font-semibold",children:r}):r.startsWith(">")||r.startsWith(":>")?o=e.jsx("span",{className:"text-code-comment italic",children:r}):r.trim().startsWith("![")&&(o=e.jsx("span",{className:"text-code-string",children:r}));return e.jsxs("div",{className:"flex",children:[e.jsx("span",{className:"select-none text-code-comment/50 pr-6 text-right w-12",children:i}),e.jsx("span",{className:"flex-1 whitespace-pre",children:o||" "})]},d)})};return e.jsx("div",{className:"animate-fade-in space-y-8 max-w-4xl mx-auto",children:n.map(t=>e.jsxs("section",{id:t.slug,className:"border border-border rounded-sm overflow-hidden",children:[e.jsx("div",{className:"px-4 py-3 bg-muted border-b border-border",children:e.jsxs("span",{className:"font-mono text-sm text-foreground",children:[t.slug,".md"]})}),e.jsx("div",{className:"bg-code text-code-foreground p-6 font-mono text-sm leading-relaxed overflow-x-auto",children:s(t.rawMarkdown)})]},t.slug))})}function u(){const n=document.querySelector("main");if(!n)return null;let s=n.parentElement;(!s||!s.classList.contains("min-h-screen"))&&(s=document.createElement("div"),s.className="min-h-screen bg-background",n.parentNode&&(n.parentNode.insertBefore(s,n),s.appendChild(n)));const t=s.querySelector(":scope > footer");t&&t.remove();const a=document.createElement("footer");return a.className="border-t border-border mt-16",a.innerHTML=`
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
  `,s.appendChild(a),{main:n,wrapper:s}}function g(n){const s=u();if(!s)return;const{main:t}=s;t.className="container max-w-6xl mx-auto px-4 py-8 md:py-12",t.innerHTML='<div id="raw-root"></div>';const a=t.querySelector("#raw-root");a&&p(a).render(e.jsx(h,{sections:n}))}export{g as renderRawMode};
