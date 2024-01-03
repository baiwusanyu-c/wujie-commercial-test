<script>
import { createElementVNode } from 'vue'
export default {
  setup(props, { slots }) {
    console.log(props, slots)
    const defaultVNodes = slots.default()
    const slot1VNodes = slots.slot1()
    const slot2VNodes = slots.slot2({ msg: 'hello world!' })
    return () => {
      return createElementVNode('div', null, [...defaultVNodes, ...slot1VNodes, ...slot2VNodes])
    }
  },
}
</script>
