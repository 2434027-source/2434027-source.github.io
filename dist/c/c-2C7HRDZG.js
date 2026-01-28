import{a as o,d as h}from"https://st-p.rmcdn1.net/22ac7430/dist/c/c-SWJUDO6Q.js";import{v as u}from"https://st-p.rmcdn1.net/22ac7430/dist/c/c-UXM5G5D6.js";import{f as r,j as b}from"https://st-p.rmcdn1.net/22ac7430/dist/c/c-SGSVTBPR.js";import{c as l,d as p}from"https://st-p.rmcdn1.net/22ac7430/dist/c/c-N26AKKOB.js";import{D as a,F as c}from"https://st-p.rmcdn1.net/22ac7430/dist/c/c-PBMEOP24.js";import{a as d}from"https://st-p.rmcdn1.net/22ac7430/dist/c/c-DSUHDIPY.js";function f({size:t,bgColor:g,color:e}){let n=typeof t=="number"?`${t}px`:t&&i[t]?i[t]:i.big,m=t==="big"||t==="medium"?"50%":"100%";return a(o,{display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:g||(t==="big"||t==="medium"?"tomato":"transparent"),height:n,width:n,borderRadius:"100%",children:a(o,{height:m,width:m,border:"2px solid",borderRadius:"100%",css:l`
          animation: ${x} 2s infinite linear;
        `,borderColor:e?`${e} ${e} transparent transparent`:t==="big"||t==="medium"||typeof t=="number"?"white white transparent transparent":`${r.light.tomato} ${r.light.tomato} transparent transparent`})})}var x,i,y,s=d(()=>{"use strict";h();u();b();c();x=p`
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
`,i={small:22,medium:48,big:56};f.defaultProps={size:"big"};y=f});var $=d(()=>{"use strict";s();s()});export{y as a,$ as b};
