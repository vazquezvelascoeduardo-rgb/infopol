export default function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 2 }) {
  const s = size, sw = strokeWidth;
  const common = {
    width: s, height: s, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round',
    display: 'block', flexShrink: 0,
  };
  switch (name) {
    case 'shield': return <svg {...common}><path d="M12 3l8 3v6c0 4.5-3.4 8.5-8 9-4.6-.5-8-4.5-8-9V6l8-3z"/></svg>;
    case 'badge': return <svg {...common}><path d="M12 3l8 3v6c0 4.5-3.4 8.5-8 9-4.6-.5-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'search': return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case 'book': return <svg {...common}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5z"/><path d="M8 7h7M8 11h7"/></svg>;
    case 'route': return <svg {...common}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6 8v4a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4"/></svg>;
    case 'list': return <svg {...common}><path d="M4 6h16M4 12h16M4 18h10"/></svg>;
    case 'flag': return <svg {...common}><path d="M5 3v18"/><path d="M5 4h12l-2 4 2 4H5"/></svg>;
    case 'beaker': return <svg {...common}><path d="M9 3h6"/><path d="M10 3v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3"/></svg>;
    case 'bolt': return <svg {...common}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
    case 'map': return <svg {...common}><path d="M9 3l-6 2v16l6-2 6 2 6-2V3l-6 2z"/><path d="M9 3v16M15 5v16"/></svg>;
    case 'flame': return <svg {...common}><path d="M12 3c2 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4-1 3 1 4 2 4 0-3-1-5 1-9z"/></svg>;
    case 'star': return <svg {...common}><path d="M12 3l2.7 5.7 6.3.9-4.6 4.5 1.1 6.4L12 17.5 6.5 20.5l1.1-6.4L3 9.6l6.3-.9L12 3z"/></svg>;
    case 'trophy': return <svg {...common}><path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M5 5h3M16 5h3M9 14v3h6v-3M8 20h8"/></svg>;
    case 'play': return <svg {...common}><path d="M6 4l14 8-14 8V4z" fill={color} stroke="none"/></svg>;
    case 'check': return <svg {...common}><path d="M5 12l4 4 10-10"/></svg>;
    case 'x': return <svg {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'arrow-right': return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-left': return <svg {...common}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case 'chevron-right': return <svg {...common}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chevron-down': return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case 'plus': return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'home': return <svg {...common}><path d="M3 11l9-8 9 8"/><path d="M5 9v12h14V9"/></svg>;
    case 'graduation': return <svg {...common}><path d="M2 9l10-4 10 4-10 4L2 9z"/><path d="M6 11v5c0 1 3 2 6 2s6-1 6-2v-5"/></svg>;
    case 'user': return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 5-6 8-6s7 2 8 6"/></svg>;
    case 'clock': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'gauge': return <svg {...common}><path d="M12 14l5-5"/><circle cx="12" cy="14" r="1.5" fill={color}/><path d="M3 16a9 9 0 0 1 18 0"/></svg>;
    case 'heart': return <svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>;
    case 'gem': return <svg {...common}><path d="M3 9l4-5h10l4 5-9 12L3 9z"/><path d="M3 9h18M9 4l3 5 3-5M9 9l3 12 3-12"/></svg>;
    case 'cards': return <svg {...common}><rect x="4" y="6" width="12" height="14" rx="2"/><rect x="8" y="3" width="12" height="14" rx="2"/></svg>;
    case 'chart': return <svg {...common}><path d="M4 20V8M10 20v-8M16 20V4M22 20H2"/></svg>;
    case 'medal': return <svg {...common}><circle cx="12" cy="14" r="6"/><path d="M9 14l-3-9M15 14l3-9M9 5h6"/></svg>;
    case 'bell': return <svg {...common}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z"/><path d="M10 21h4"/></svg>;
    case 'siren': return <svg {...common}><path d="M5 17a7 7 0 0 1 14 0v2H5v-2z"/><path d="M12 6V3M5 9L3 7M19 9l2-2"/></svg>;
    case 'pen': return <svg {...common}><path d="M16 3l5 5L8 21H3v-5L16 3z"/></svg>;
    case 'filter': return <svg {...common}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/></svg>;
    case 'mic': return <svg {...common}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>;
    case 'pin': return <svg {...common}><path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'eye': return <svg {...common}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'hash': return <svg {...common}><path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16"/></svg>;
    case 'scale': return <svg {...common}><path d="M12 4v17M4 8h16"/><path d="M7 8l-3 7a3 3 0 0 0 6 0l-3-7zM17 8l-3 7a3 3 0 0 0 6 0l-3-7z"/></svg>;
    case 'car': return <svg {...common}><path d="M5 17h14l-1-6H6l-1 6z"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/><path d="M6 11l1-3a3 3 0 0 1 3-2h4a3 3 0 0 1 3 2l1 3"/></svg>;
    case 'lock': return <svg {...common}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>;
    case 'spark': return <svg {...common}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/></svg>;
    case 'briefcase': return <svg {...common}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>;
    case 'qr': return <svg {...common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M21 14v7M14 21h7M17 17v0"/></svg>;
    case 'wifi': return <svg {...common}><path d="M2 8.5a13 13 0 0 1 20 0"/><path d="M6 12.5a7 7 0 0 1 12 0"/><path d="M10 16.5a3 3 0 0 1 4 0"/><circle cx="12" cy="20" r="1" fill={color}/></svg>;
    case 'battery': return <svg {...common}><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/><rect x="4" y="9" width="12" height="6" rx="1" fill={color} stroke="none"/></svg>;
    case 'signal': return <svg {...common}><rect x="2" y="16" width="3" height="6" rx="1" fill={color} stroke="none"/><rect x="7" y="12" width="3" height="10" rx="1" fill={color} stroke="none"/><rect x="12" y="8" width="3" height="14" rx="1" fill={color} stroke="none"/><rect x="17" y="4" width="3" height="18" rx="1" fill={color} stroke="none"/></svg>;
    case 'newspaper': return <svg {...common}><path d="M4 3h13v18H4V3z"/><path d="M17 8h3v13h-3"/><path d="M7 8h7M7 12h7M7 16h4"/></svg>;
    case 'globe': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 3c-2 3-3 6-3 9s1 6 3 9M12 3c2 3 3 6 3 9s-1 6-3 9M3 12h18"/></svg>;
    default: return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
  }
}
