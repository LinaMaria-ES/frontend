import { isClient } from './client-detection'
import { removeHash } from './remove-hash'
import { showToastNotice } from './show-toast-notice'

// print mode deactivates lazy loading, should work in chrome and firefox
// print-warning.tsx is a fallback now

export const isPrintMode =
  isClient && window.location.hash.startsWith('#print--')

export const setupPrintHacks = () => {
  if (!isPrintMode) {
    window.addEventListener('beforeprint', function () {
      window.location.hash = 'print--now'
      window.location.reload()
    })
  }

  if (window.location.hash === '#print--now') {
    showToastNotice(`⌛  Preparing print!  🖨️`)
    setTimeout(() => {
      window.print()
    }, 2000) //give injections a chance

    removeHash()
  }

  if (window.location.hash === '#print--preview') {
    document.documentElement.classList.add('serlo-print-style')
  }
}
