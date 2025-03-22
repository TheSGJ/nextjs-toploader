import * as NProgress from 'nprogress';

interface TopLoaderActions {
  start: () => NProgress.NProgress;
  done: (force?: boolean) => NProgress.NProgress;
  remove: () => void;
  setProgress: (value: number) => NProgress.NProgress;
  inc: (amount?: number) => NProgress.NProgress;
  trickle: () => NProgress.NProgress;
  isStarted: () => boolean;
  isRendered: () => boolean;
  getPositioningCSS: () => 'translate3d' | 'translate' | 'margin';
}

export const useTopLoader = (): TopLoaderActions => {
  const actions: TopLoaderActions = {
    start: () => NProgress.start(),
    done: (force?: boolean) => NProgress.done(force),
    remove: () => NProgress.remove(),
    setProgress: (value: number) => NProgress.set(value),
    inc: (amount?: number) => NProgress.inc(amount),
    trickle: () => NProgress.trickle(),
    isStarted: () => NProgress.isStarted(),
    isRendered: () => NProgress.isRendered(),
    getPositioningCSS: () => NProgress.getPositioningCSS(),
  };

  return actions;
};
