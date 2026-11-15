async function checkGhStructure() {
  const res = await fetch('https://ghchart.rshah.org/3b82f6/technosaran');
  const svg = await res.text();
  console.log('SVG viewBox / width:', svg.match(/<svg[^>]+>/)?.[0]);
  const texts = svg.match(/<text[^>]*>.*?<\/text>/g);
  console.log('Texts in ghchart:', texts?.slice(0, 15));
}
checkGhStructure();
