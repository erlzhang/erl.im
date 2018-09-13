import mermaid from 'mermaid'

let codes = document.getElementsByClassName("language-mermaid");

while( codes.length > 0 ) {
  let code = codes[0];
  let content = code.innerText;
  console.log(content)

  let chart = document.createElement("div");
  chart.className = "mermaid";  
  chart.innerHTML = content;

  let p = code.parentNode;
  while( p.tagName != "DIV" ) {
    p = p.parentNode;
  }

  p.replaceChild(chart, code.parentNode);
}

if( codes.length > 0 ) {
  mermaid.initialize({startOnLoad:true});
}
