declare let window: Window & {
  webkitRequestAnimationFrame?: Function
  mozRequestAnimationFrame?: Function
}
interface customMath extends Math {
  easeInOutQuad: Function
}
const myMath = Math as customMath

myMath.easeInOutQuad = function (t: number, b: number, c: number, d: number) {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t + b

  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()

/**
 * Because it's so fucking difficult to detect the scrolling element, just move them all
 * @param {number} amount
 */
function move(amount: number, element: any) {
  if (element.documentElement) {
    element.documentElement.scrollTop = amount
  } else {
    element.scrollTop = amount
  }

  const parentNode = document.body.parentNode as HTMLBodyElement
  parentNode && (parentNode.scrollTop = amount)
  document.body.scrollTop = amount
}

function position() {
  const parentNode = document.body.parentNode as HTMLBodyElement
  return document.documentElement.scrollTop || parentNode.scrollTop || document.body.scrollTop
}

/**
 * @param {number} to
 * @param {number} duration
 * @param {Function} callback
 */
export function scrollTo(to: number, duration: number, element?: any, callback?: Function) {
  const start = position()
  const change = to - start
  const increment = 20
  let currentTime = 0
  duration = typeof duration === 'undefined' ? 500 : duration
  const animateScroll = function () {
    currentTime += increment
    const val = myMath.easeInOutQuad(currentTime, start, change, duration)
    move(val, element || document)
    if (currentTime < duration) {
      requestAnimFrame(animateScroll)
    } else if (callback && typeof callback === 'function') {
      callback()
    }
  }
  animateScroll()
}
