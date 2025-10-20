module.exports = {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        bg:'var(--bg)', surface:'var(--surface)', surface2:'var(--surface-2)',
        border:'var(--border)', txt:'var(--txt)', muted:'var(--muted)',
        brand:'var(--brand)', ok:'var(--ok)', warn:'var(--warn)', err:'var(--err)', focus:'var(--focus)'
      },
      borderRadius:{ xl2:'1rem' }
    }
  },
  plugins:[]
}
