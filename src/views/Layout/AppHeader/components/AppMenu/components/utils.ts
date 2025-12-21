const menuUtils = {
  activeClass: 'dark:text-primary font-bold',
  inactiveClass:
    'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white',
  getLinkSelected(routeName: string, currentRouteName: string) {
    return currentRouteName === routeName
      ? `${this.activeClass} hover:bg-slate-50 dark:hover:bg-slate-800`
      : `${this.inactiveClass} hover:bg-slate-50 dark:hover:bg-slate-800`
  },
}

export default menuUtils
