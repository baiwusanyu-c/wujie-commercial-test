<script lang="ts">
  import { onMount, createEventDispatcher, onDestroy } from "svelte";
  import { bus, preloadApp, startApp as rawStartApp, destroyApp, setupApp } from "wujie";
  export let width: string = ''
  export let height: string = ''
  export let name: string = ''
  export let loading: HTMLElement | undefined = undefined
  export let url:  string = ''
  export let sync: boolean = false
  export let prefix: Record<string, any> | undefined = undefined
  export let alive: boolean = false
  export let props: Record<string, any> | undefined = undefined
  export let attrs: Record<string, any> | undefined = undefined
  export let replace: any = undefined
  export let fetch:  any = undefined
  export let fiber: boolean = false
  export let degrade: boolean = false
  export let plugins: Array<any> = []
  export let beforeLoad:  any = undefined
  export let beforeMount:  any = undefined
  export let afterMount:  any = undefined
  export let beforeUnmount:  any = undefined
  export let afterUnmount:  any = undefined
  export let activated:  any = undefined
  export let deactivated:  any = undefined
  export let loadError:  any = undefined

 let startAppQueue = Promise.resolve()
  onMount(() => {
    bus.$onAll(handleEmit);
  })

  const dispatch = createEventDispatcher()
  function handleEmit(event: string, ...args: any[]) {
    dispatch('input', ...args);
  }

  $: {
    execStartApp(name, url)
  }
  let wujie:HTMLElement | string = ''
  async function startApp() {
    try {
      await rawStartApp({
        name: name,
        url: url,
        el: wujie,
        loading: loading,
        alive: alive,
        fetch: fetch,
        props: props,
        attrs: attrs,
        replace: replace,
        sync: sync,
        prefix: prefix,
        fiber: fiber,
        degrade: degrade,
        plugins: plugins,
        beforeLoad: beforeLoad,
        beforeMount: beforeMount,
        afterMount: afterMount,
        beforeUnmount: beforeUnmount,
        afterUnmount: afterUnmount,
        activated: activated,
        deactivated: deactivated,
        loadError: loadError,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function execStartApp(name: string, url: string) {
    console.log("execStartApp", name, url);
    startAppQueue = startAppQueue.then(startApp);
  }

  onDestroy(() => {
    bus.$offAll(handleEmit);
    destroyApp(name);
  })
  // @public
  export function getWujie(){
    return {
      setupApp,
      preloadApp,
      bus,
      destroyApp
    }
  }
</script>

<div bind:this={wujie} style:width={width} style:height={height}>
</div>
