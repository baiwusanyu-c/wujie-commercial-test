// mock/_util.ts
function resultSuccess(data, { msg = "\u8BF7\u6C42\u6210\u529F" } = {}) {
  return {
    code: 200,
    data,
    msg,
    traceId: Date.now().toString()
  };
}

// mock/sys/menu.ts
var menus = [
  {
    id: "1",
    label: "\u4EBA\u7FA4\u667A\u5E93",
    path: "",
    name: "",
    meta: { title: "\u4EBA\u7FA4\u667A\u5E93" },
    children: [
      {
        id: "1-1",
        label: "\u7528\u6237\u7FA4\u4F53",
        path: "/user-tower",
        name: "user-tower",
        meta: { title: "\u7528\u6237\u7FA4\u4F53" }
      },
      {
        id: "1-2",
        label: "\u4EBA\u7FA4\u6D1E\u5BDF",
        path: "/crowd-insight",
        name: "crowd-insight",
        meta: { title: "\u4EBA\u7FA4\u6D1E\u5BDF" }
      }
    ]
  },
  {
    id: "2",
    label: "\u6807\u7B7E\u7BA1\u7406",
    path: "",
    name: "",
    meta: { title: "\u6807\u7B7E\u7BA1\u7406" },
    children: [
      {
        id: "2-1",
        label: "\u7528\u6237\u6807\u7B7E",
        path: "/user-label",
        name: "user-label",
        meta: { title: "\u7528\u6237\u6807\u7B7E" }
      }
    ]
  }
];
var menu_default = [
  {
    url: "/menus",
    timeout: 200,
    method: "post",
    response: () => {
      return resultSuccess(menus);
    }
  }
];
export {
  menu_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibW9jay9fdXRpbC50cyIsICJtb2NrL3N5cy9tZW51LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXGxpeWFuZzFcXFxcRGVza3RvcFxcXFx0ZXN0XFxcXHZpdGUtdnVlMy4zXFxcXG1vY2tcXFxcX3V0aWwudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcbGl5YW5nMVxcXFxEZXNrdG9wXFxcXHRlc3RcXFxcdml0ZS12dWUzLjNcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vQzovVXNlcnMvbGl5YW5nMS9EZXNrdG9wL3Rlc3Qvdml0ZS12dWUzLjMvbW9jay9fdXRpbC50c1wiO2ltcG9ydCB0eXBlIHsgUmVzcG9uc2VSZXN1bHQgfSBmcm9tICcuL19pbnRlcmZhY2UnXG5cbmV4cG9ydCBmdW5jdGlvbiByZXN1bHRTdWNjZXNzPFQgPSBhbnk+KGRhdGE6IFQsIHsgbXNnID0gJ1x1OEJGN1x1NkM0Mlx1NjIxMFx1NTI5RicgfSA9IHt9KTogUmVzcG9uc2VSZXN1bHQge1xuICByZXR1cm4ge1xuICAgIGNvZGU6IDIwMCxcbiAgICBkYXRhLFxuICAgIG1zZyxcbiAgICB0cmFjZUlkOiBEYXRlLm5vdygpLnRvU3RyaW5nKCksXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc3BvbnNlUmVzdWx0PFQgPSB1bmtub3duPih7XG4gIGNvZGUgPSAyMDAsXG4gIGRhdGEsXG4gIG1zZyA9ICdcdThCRjdcdTZDNDJcdTYyMTBcdTUyOUYnLFxufToge1xuICBjb2RlPzogbnVtYmVyXG4gIGRhdGE/OiBUXG4gIG1zZz86IHN0cmluZ1xufSk6IFJlc3BvbnNlUmVzdWx0IHtcbiAgcmV0dXJuIHtcbiAgICBjb2RlLFxuICAgIGRhdGEsXG4gICAgbXNnLFxuICAgIHRyYWNlSWQ6IERhdGUubm93KCkudG9TdHJpbmcoKSxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzdWx0VXNlclN1Y2Nlc3M8VCA9IGFueSwgSyA9IGFueSwgRSA9IGFueT4ocGVybWlzc2lvbnM6IFQsIHJvbGVzOiBLLCB1c2VyOiBFLCB7IG1zZyA9ICdcdThCRjdcdTZDNDJcdTYyMTBcdTUyOUYnIH0gPSB7fSkge1xuICByZXR1cm4ge1xuICAgIGNvZGU6IDIwMCxcbiAgICBwZXJtaXNzaW9ucyxcbiAgICByb2xlcyxcbiAgICB1c2VyLFxuICAgIG1zZyxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xuICBtaW4gPSBNYXRoLmNlaWwobWluKSAvLyBcdTc4NkVcdTRGRERtaW5cdTY2MkZcdTY1NzRcdTY1NzBcbiAgbWF4ID0gTWF0aC5mbG9vcihtYXgpIC8vIFx1Nzg2RVx1NEZERG1heFx1NjYyRlx1NjU3NFx1NjU3MFxuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbiAvLyBcdThGRDRcdTU2REVcdTRFQ0JcdTRFOEVtaW5cdTU0OENtYXhcdTRFNEJcdTk1RjRcdTc2ODRcdTY1NzRcdTY1NzBcbn1cbiIsICJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXGxpeWFuZzFcXFxcRGVza3RvcFxcXFx0ZXN0XFxcXHZpdGUtdnVlMy4zXFxcXG1vY2tcXFxcc3lzXFxcXG1lbnUudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcbGl5YW5nMVxcXFxEZXNrdG9wXFxcXHRlc3RcXFxcdml0ZS12dWUzLjNcXFxcbW9ja1xcXFxzeXNcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0M6L1VzZXJzL2xpeWFuZzEvRGVza3RvcC90ZXN0L3ZpdGUtdnVlMy4zL21vY2svc3lzL21lbnUudHNcIjsvKlxuICogQEF1dGhvcjogbGl5YW5nMVxuICogQERhdGU6IDIwMjMtMDQtMDcgMTA6NDU6NTFcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjQtMDUtMjggMTU6MjY6MTFcbiAqIEBMYXN0RWRpdG9yczogbGl5YW5nXG4gKiBARGVzY3JpcHRpb246IFx1ODNEQ1x1NTM1NVx1OERFRlx1NzUzMVx1OTE0RFx1N0Y2RVxuICovXG5pbXBvcnQgeyByZXN1bHRTdWNjZXNzIH0gZnJvbSAnLi4vX3V0aWwnXG5pbXBvcnQgdHlwZSB7IE1vY2tNZXRob2QgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xuXG4vKiogXHU4M0RDXHU1MzU1ICovXG5jb25zdCBtZW51cyA9IFtcbiAge1xuICAgIGlkOiAnMScsXG4gICAgbGFiZWw6ICdcdTRFQkFcdTdGQTRcdTY2N0FcdTVFOTMnLFxuICAgIHBhdGg6ICcnLFxuICAgIG5hbWU6ICcnLFxuICAgIG1ldGE6IHsgdGl0bGU6ICdcdTRFQkFcdTdGQTRcdTY2N0FcdTVFOTMnIH0sXG4gICAgY2hpbGRyZW46IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICcxLTEnLFxuICAgICAgICBsYWJlbDogJ1x1NzUyOFx1NjIzN1x1N0ZBNFx1NEY1MycsXG4gICAgICAgIHBhdGg6ICcvdXNlci10b3dlcicsXG4gICAgICAgIG5hbWU6ICd1c2VyLXRvd2VyJyxcbiAgICAgICAgbWV0YTogeyB0aXRsZTogJ1x1NzUyOFx1NjIzN1x1N0ZBNFx1NEY1MycgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnMS0yJyxcbiAgICAgICAgbGFiZWw6ICdcdTRFQkFcdTdGQTRcdTZEMUVcdTVCREYnLFxuICAgICAgICBwYXRoOiAnL2Nyb3dkLWluc2lnaHQnLFxuICAgICAgICBuYW1lOiAnY3Jvd2QtaW5zaWdodCcsXG4gICAgICAgIG1ldGE6IHsgdGl0bGU6ICdcdTRFQkFcdTdGQTRcdTZEMUVcdTVCREYnIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJzInLFxuICAgIGxhYmVsOiAnXHU2ODA3XHU3QjdFXHU3QkExXHU3NDA2JyxcbiAgICBwYXRoOiAnJyxcbiAgICBuYW1lOiAnJyxcbiAgICBtZXRhOiB7IHRpdGxlOiAnXHU2ODA3XHU3QjdFXHU3QkExXHU3NDA2JyB9LFxuICAgIGNoaWxkcmVuOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnMi0xJyxcbiAgICAgICAgbGFiZWw6ICdcdTc1MjhcdTYyMzdcdTY4MDdcdTdCN0UnLFxuICAgICAgICBwYXRoOiAnL3VzZXItbGFiZWwnLFxuICAgICAgICBuYW1lOiAndXNlci1sYWJlbCcsXG4gICAgICAgIG1ldGE6IHsgdGl0bGU6ICdcdTc1MjhcdTYyMzdcdTY4MDdcdTdCN0UnIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5dXG5leHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICB1cmw6ICcvbWVudXMnLFxuICAgIHRpbWVvdXQ6IDIwMCxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICByZXNwb25zZTogKCkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3VsdFN1Y2Nlc3MobWVudXMpXG4gICAgfSxcbiAgfSxcbl0gYXMgTW9ja01ldGhvZFtdXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRU8sU0FBUyxjQUF1QixNQUFTLEVBQUUsTUFBTSwyQkFBTyxJQUFJLENBQUMsR0FBbUI7QUFDckYsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ047QUFBQSxJQUNBO0FBQUEsSUFDQSxTQUFTLEtBQUssSUFBSSxFQUFFLFNBQVM7QUFBQSxFQUMvQjtBQUNGOzs7QUNFQSxJQUFNLFFBQVE7QUFBQSxFQUNaO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNLEVBQUUsT0FBTywyQkFBTztBQUFBLElBQ3RCLFVBQVU7QUFBQSxNQUNSO0FBQUEsUUFDRSxJQUFJO0FBQUEsUUFDSixPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixNQUFNLEVBQUUsT0FBTywyQkFBTztBQUFBLE1BQ3hCO0FBQUEsTUFDQTtBQUFBLFFBQ0UsSUFBSTtBQUFBLFFBQ0osT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sTUFBTSxFQUFFLE9BQU8sMkJBQU87QUFBQSxNQUN4QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTSxFQUFFLE9BQU8sMkJBQU87QUFBQSxJQUN0QixVQUFVO0FBQUEsTUFDUjtBQUFBLFFBQ0UsSUFBSTtBQUFBLFFBQ0osT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sTUFBTSxFQUFFLE9BQU8sMkJBQU87QUFBQSxNQUN4QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFDQSxJQUFPLGVBQVE7QUFBQSxFQUNiO0FBQUEsSUFDRSxLQUFLO0FBQUEsSUFDTCxTQUFTO0FBQUEsSUFDVCxRQUFRO0FBQUEsSUFDUixVQUFVLE1BQU07QUFDZCxhQUFPLGNBQWMsS0FBSztBQUFBLElBQzVCO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
