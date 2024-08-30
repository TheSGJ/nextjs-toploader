// deno-ts-ignore-file
// deno-lint-ignore-file
/* eslint-disable no-var */
/* eslint-disable max-len */
/* eslint-disable prefer-const */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as NProgress from 'nprogress';
import { NextTopLoaderProps } from '.';
import Router from 'next/router';
export const PagesTopLoader = ({
  color: propColor,
  height: propHeight,
  showSpinner,
  crawl,
  crawlSpeed,
  initialPosition,
  easing,
  speed,
  shadow,
  template,
  zIndex = 1600,
  showAtBottom = false,
}: NextTopLoaderProps): JSX.Element => {
  const defaultColor = '#29d';
  const defaultHeight = 3;

  const color = propColor ?? defaultColor;
  const height = propHeight ?? defaultHeight;

  // Any falsy (except undefined) will disable the shadow
  const boxShadow =
    !shadow && shadow !== undefined
      ? ''
      : shadow
      ? `box-shadow:${shadow}`
      : `box-shadow:0 0 10px ${color},0 0 5px ${color}`;

  // Check if to show at bottom
  const positionStyle = showAtBottom ? 'bottom: 0;' : 'top: 0;';
  const spinnerPositionStyle = showAtBottom ? 'bottom: 15px;' : 'top: 15px;';

  /**
   * CSS Styles for the NextTopLoader
   */
  const styles = (
    <style>
      {`#nprogress{pointer-events:none}#nprogress .bar{background:${color};position:fixed;z-index:${zIndex};${positionStyle}left:0;width:100%;height:${height}px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;${boxShadow};opacity:1;-webkit-transform:rotate(3deg) translate(0px,-4px);-ms-transform:rotate(3deg) translate(0px,-4px);transform:rotate(3deg) translate(0px,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:${zIndex};${spinnerPositionStyle}right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:${color};border-left-color:${color};border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}
    </style>
  );

  React.useEffect((): ReturnType<React.EffectCallback> => {
    NProgress.configure({
      showSpinner: showSpinner ?? true,
      trickle: crawl ?? true,
      trickleSpeed: crawlSpeed ?? 200,
      minimum: initialPosition ?? 0.08,
      easing: easing ?? 'ease',
      speed: speed ?? 200,
      template:
        template ??
        '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
    });

    const progressStarted = () => NProgress.start();
    const progressComplete = () => NProgress.done(true);

    Router.events.on('routeChangeStart', progressStarted);
    Router.events.on('routeChangeComplete', progressComplete);
    Router.events.on('routeChangeError', progressComplete);

    return () => {
      // Clean up the global click event listener when the component is unmounted
      Router.events.off('routeChangeStart', progressStarted);
      Router.events.off('routeChangeComplete', progressComplete);
      Router.events.off('routeChangeError', progressComplete);
    };
  }, []);

  return styles;
};

PagesTopLoader.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  showSpinner: PropTypes.bool,
  crawl: PropTypes.bool,
  crawlSpeed: PropTypes.number,
  initialPosition: PropTypes.number,
  easing: PropTypes.string,
  speed: PropTypes.number,
  template: PropTypes.string,
  shadow: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  zIndex: PropTypes.number,
  showAtBottom: PropTypes.bool,
};
