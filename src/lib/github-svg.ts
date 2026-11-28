export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export function generateContributionSvg(
  username: string,
  totalContributions: number,
  contributions: ContributionDay[]
): string {
  const cellSize = 10;
  const cellGap = 3;
  const leftPadding = 32;
  const topPadding = 24;
  const bottomPadding = 22;

  // Modern Cyber Cyan / Obsidian Palette
  const themeColors = [
    '#111422', // Level 0: dark obsidian empty cell
    '#0f2d42', // Level 1: subtle cyan-slate
    '#0369a1', // Level 2: deep cyber cyan
    '#0284c7', // Level 3: radiant sky
    '#38bdf8'  // Level 4: high-voltage cyan
  ];

  // We need 53 weeks, 7 days per week
  const numWeeks = 53;
  const totalDays = numWeeks * 7;
  
  // Normalize days: ensure we have 371 days ending at current week
  let dayList: ContributionDay[] = [...contributions];
  if (dayList.length > 0) {
    const firstDay = new Date(dayList[0].date);
    const startPadCount = isNaN(firstDay.getTime()) ? 0 : firstDay.getUTCDay();
    if (startPadCount > 0) {
      const padding: ContributionDay[] = Array.from({ length: startPadCount }, (_, i) => ({
        date: `pad-start-${i}`,
        count: 0,
        level: 0
      }));
      dayList = [...padding, ...dayList];
    }
  }
  if (dayList.length < totalDays) {
    const endPadCount = totalDays - dayList.length;
    const padding: ContributionDay[] = Array.from({ length: endPadCount }, (_, i) => ({
      date: `pad-end-${i}`,
      count: 0,
      level: 0
    }));
    dayList = [...dayList, ...padding];
  } else if (dayList.length > totalDays) {
    dayList = dayList.slice(dayList.length - totalDays);
  }

  const svgWidth = leftPadding + numWeeks * (cellSize + cellGap) + 28;
  const svgHeight = topPadding + 7 * (cellSize + cellGap) + bottomPadding;

  // Month labels: dynamically placed at the start of each month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabelsList: { text: string; x: number }[] = [];
  let lastMonth = -1;
  let lastLabelWeek = -10;

  for (let week = 0; week < numWeeks; week++) {
    const firstDayOfWeek = dayList[week * 7];
    if (firstDayOfWeek && firstDayOfWeek.date && !firstDayOfWeek.date.startsWith('pad')) {
      const d = new Date(firstDayOfWeek.date);
      if (!isNaN(d.getTime())) {
        const m = d.getUTCMonth();
        if (m !== lastMonth && week - lastLabelWeek >= 3 && week < numWeeks - 2) {
          const x = leftPadding + week * (cellSize + cellGap);
          monthLabelsList.push({ text: monthNames[m], x });
          lastMonth = m;
          lastLabelWeek = week;
        }
      }
    }
  }

  const monthLabelsSvg = monthLabelsList.map(item => 
    `<text x="${item.x}" y="14" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', monospace" font-size="9">${item.text}</text>`
  ).join('\n');

  // Day labels (Mon, Wed, Fri)
  const dayLabels = [
    { label: 'Mon', y: topPadding + 1 * (cellSize + cellGap) + 8 },
    { label: 'Wed', y: topPadding + 3 * (cellSize + cellGap) + 8 },
    { label: 'Fri', y: topPadding + 5 * (cellSize + cellGap) + 8 }
  ];
  const dayLabelsSvg = dayLabels.map(d => 
    `<text x="6" y="${d.y}" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', monospace" font-size="8">${d.label}</text>`
  ).join('\n');

  // Cells
  let cellsSvg = '';
  for (let week = 0; week < numWeeks; week++) {
    for (let day = 0; day < 7; day++) {
      const idx = week * 7 + day;
      const item = dayList[idx] || { count: 0, level: 0, date: '' };
      const x = leftPadding + week * (cellSize + cellGap);
      const y = topPadding + day * (cellSize + cellGap);
      const color = themeColors[Math.min(Math.max(item.level || 0, 0), 4)];
      const title = item.date ? `${item.count} contributions on ${item.date}` : '';
      
      cellsSvg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}" data-count="${item.count}" data-date="${item.date}"><title>${title}</title></rect>\n`;
    }
  }

  // Legend
  const legendX = svgWidth - 110;
  const legendY = svgHeight - 10;
  const legendSvg = `
    <text x="${legendX - 28}" y="${legendY + 7}" fill="#71717a" font-family="monospace" font-size="8">Less</text>
    ${themeColors.map((c, i) => `<rect x="${legendX + i * 11}" y="${legendY}" width="8" height="8" rx="1.5" fill="${c}"/>`).join('')}
    <text x="${legendX + 5 * 11 + 4}" y="${legendY + 7}" fill="#71717a" font-family="monospace" font-size="8">More</text>
  `;

  // Summary header / footer
  const summaryY = svgHeight - 8;
  const summarySvg = `
    <text x="${leftPadding}" y="${summaryY}" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold">
      ${totalContributions} contributions in the last year
    </text>
  `;

  return `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <style>
    rect { transition: transform 0.15s ease, opacity 0.15s ease; }
    rect:hover { opacity: 0.8; stroke: #93c5fd; stroke-width: 1px; }
  </style>
  <rect width="100%" height="100%" fill="transparent"/>
  ${monthLabelsSvg}
  ${dayLabelsSvg}
  ${cellsSvg}
  ${summarySvg}
  ${legendSvg}
</svg>
  `.trim();
}
