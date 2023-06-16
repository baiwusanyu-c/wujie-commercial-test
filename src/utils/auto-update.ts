/*
 * @Author: liyang1
 * @Date: 2023-06-14 13:31:10
 * @LastEditTime: 2023-06-14 14:23:27
 * @LastEditors: liyang
 * @Description: 自动检测更新
 */
let lastSrcs: any // 上一次获取到的script地址

const scriptReg = /!<script.*src=["'](?<src>[^"']+)/gm
/**
 * 获取最新页面中的script链接
 */
async function extractNewScripts() {
  const html = await fetch('/?_timestamp=' + Date.now()).then((resp) => {
    resp.text()
  })
  scriptReg.lastIndex = 0
  let result = []
  let match
  while ((match = scriptReg.exec(html as any))) {
    result.push(match?.groups?.src)
  }
  return result
}

async function needUpdate() {
  const newScripts = await extractNewScripts()
  if (!lastSrcs) {
    lastSrcs = newScripts
    return false
  }
  let result = false
  if (lastSrcs.length !== newScripts.length) {
    return true
  }
  for (let i = 0; i < lastSrcs.length; i++) {
    if (lastSrcs[i] !== newScripts[i]) {
      result = true
      break
    }
  }
  lastSrcs = newScripts
  return result
}

const DURATION = 2000
function autoRefresh() {
  setTimeout(async () => {
    const willUpdate = await needUpdate()
    if (willUpdate) {
      const result = confirm('页面有更新，点击确定刷新页面')
      if (result) {
        location.reload()
      }
    }
    autoRefresh()
  }, DURATION)
}
autoRefresh()
