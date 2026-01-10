export const lazyLoad = (component: string) => {
  return () => import(`@/views/${component}/MainView.vue`)
}
