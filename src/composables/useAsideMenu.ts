// composables/useAsideMenu.js
import { ref } from 'vue'

const isOpen = ref<boolean>(false)

export function useAsideMenu() {
  const toggle = () => (isOpen.value = !isOpen.value)
  const open = () => (isOpen.value = true)
  const close = () => (isOpen.value = false)

  return { isOpen, toggle, open, close }
}
