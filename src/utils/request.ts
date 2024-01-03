// fetch('./version.json').then((response) => response.json()).then(res => {
//     const version = res.version
//     console.log('xxx', version, )
    
//     let localVersion = localStorage.getItem('version')
//     const url = `${window.location.origin}${window.location.pathname}${version}.html${location.hash}`
//     if(version != localVersion) {
//       localStorage.setItem('version', version)
//     }
//     // window.location.replace(url)
//   }).catch((e) => {
//     console.log('xxxx发发发xx', e)
//   })