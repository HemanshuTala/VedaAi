export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 80 71" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="paint0_linear" x1="39.7142" y1="1.85519" x2="39.7142" y2="41.8552" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E56820"/>
          <stop offset="1" stopColor="#D45E3E"/>
        </linearGradient>
        <linearGradient id="paint1_linear" x1="34.7749" y1="11.2061" x2="34.7749" y2="33.9908" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0"/>
          <stop offset="0.33" stopColor="white" stopOpacity="0"/>
          <stop offset="0.76" stopColor="#0E1513"/>
          <stop offset="1" stopColor="#0E1513"/>
        </linearGradient>
        <filter id="filter0" x="14" y="0" width="66" height="66" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="12.8571"/>
          <feGaussianBlur stdDeviation="12.8571"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="8.57143"/>
          <feGaussianBlur stdDeviation="8.57143"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="4.28571"/>
          <feGaussianBlur stdDeviation="4.28571"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow" result="shape"/>
        </filter>
      </defs>
      <rect x="19.7142" y="1.85519" width="40" height="40" rx="15" fill="url(#paint0_linear)"/>
      <g filter="url(#filter0)">
        <path fillRule="evenodd" clipRule="evenodd" d="M42.4413 30.2153C42.4413 30.2153 43.1688 32.1573 43.8355 32.2789H35.4112C33.7141 32.2789 32.1993 31.3079 31.714 29.487L26.805 14.9207C26.805 14.9207 26.381 13.1606 25.7143 12.8571H34.3204C36.0175 12.9179 37.1691 13.5247 37.8357 15.7706L42.4413 30.2153Z" fill="white"/>
        <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M42.4413 30.2153C42.4413 30.2153 43.1688 32.1573 43.8355 32.2789H35.4112C33.7141 32.2789 32.1993 31.3079 31.714 29.487L26.805 14.9207C26.805 14.9207 26.381 13.1606 25.7143 12.8571H34.3204C36.0175 12.9179 37.1691 13.5247 37.8357 15.7706L42.4413 30.2153Z" fill="url(#paint1_linear)"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M37.0471 30.2149C37.0471 30.2149 36.3196 32.1569 35.6529 32.2784H44.0772C45.7743 32.2784 47.2891 31.3074 47.7744 29.4865L52.6231 14.9207C52.6231 14.9207 53.0471 13.1606 53.7138 12.8571H45.168C43.4709 12.8571 42.3801 13.464 41.7134 15.7098L37.0471 30.2149Z" fill="white"/>
      </g>
    </svg>
  )
}
