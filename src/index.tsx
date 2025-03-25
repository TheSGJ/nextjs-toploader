'use client';
// deno-ts-ignore-file
// deno-lint-ignore-file
/* eslint-disable no-var */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as NProgress from 'nprogress';
export { useTopLoader } from './hooks/useTopLoader';

// @deno-types ="npm:preact@10.19.6"

// @deno-types ="npm:nprogress@0.2.2"

// @deno-types ="npm:@types/react@18.2.66"

export type NextTopLoaderProps = {
  /**
   * Color for the TopLoader.
   * @default "#29d"
   */
  color?: string;
  /**
   * The initial position for the TopLoader in percentage, 0.08 is 8%.
   * @default 0.08
   */
  initialPosition?: number;
  /**
   * The increament delay speed in milliseconds.
   * @default 200
   */
  crawlSpeed?: number;
  /**
   * The height for the TopLoader in pixels (px).
   * @default 3
   */
  height?: number;
  /**
   * Auto increamenting behaviour for the TopLoader.
   * @default true
   */
  crawl?: boolean;
  /**
   * To show spinner or not.
   * @default true
   */
  showSpinner?: boolean;
  /**
   * Animation settings using easing (a CSS easing string).
   * @default "ease"
   */
  easing?: string;
  /**
   * Animation speed in ms for the TopLoader.
   * @default 200
   */
  speed?: number;
  /**
   * Defines a shadow for the TopLoader.
   * @default "0 0 10px ${color},0 0 5px ${color}"
   *
   * @ you can disable it by setting it to `false`
   */
  shadow?: string | false;
  /**
   * Defines a template for the TopLoader.
   * @default "<div class="bar" role="bar"><div class="peg"></div></div>
   * <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>"
   */
  template?: string;
  /**
   * Defines zIndex for the TopLoader.
   * @default 1600
   *
   */
  zIndex?: number;
  /**
   * To show the TopLoader at bottom.
   * @default false
   *
   */
  showAtBottom?: boolean;
  /**
   * To show the TopLoader for hash anchors.
   * @default true
   *
   */
  showForHashAnchor?: boolean;
};

/**
 *
 * NextTopLoader
 * @license MIT
 * @param {NextTopLoaderProps} props The properties to configure NextTopLoader
 * @returns {React.JSX.Element}
 *
 */

const NextTopLoader = ({
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
  showForHashAnchor = true,
}: NextTopLoaderProps): React.JSX.Element => {
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

  /**
   * Convert the url to Absolute URL based on the current window location.
   * @param url {string}
   * @returns {string}
   */
  const toAbsoluteURL = (url: string): string => {
    return new URL(url, window.location.href).href;
  };

  /**
   * Check if it is hash anchor or same page anchor
   * @param currentUrl {string} Current Url Location
   * @param newUrl {string} New Url detected with each anchor
   * @returns {boolean}
   */
  const isHashAnchor = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return current.href.split('#')[0] === next.href.split('#')[0];
  };

  /**
   * Check if it is Same Host name
   * @param currentUrl {string} Current Url Location
   * @param newUrl {string} New Url detected with each anchor
   * @returns {boolean}
   */
  const isSameHostName = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return current.hostname.replace(/^www\./, '') === next.hostname.replace(/^www\./, '');
  };

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

    /**
     * Check if the Current Url is same as New Url
     * @param currentUrl {string}
     * @param newUrl {string}
     * @returns {boolean}
     */
    function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string): boolean {
      const currentUrlObj = new URL(currentUrl);
      const newUrlObj = new URL(newUrl);
      // Compare hostname, pathname, and search parameters
      if (
        currentUrlObj.hostname === newUrlObj.hostname &&
        currentUrlObj.pathname === newUrlObj.pathname &&
        currentUrlObj.search === newUrlObj.search
      ) {
        // Check if the new URL is just an anchor of the current URL page
        const currentHash = currentUrlObj.hash;
        const newHash = newUrlObj.hash;
        return (
          currentHash !== newHash && currentUrlObj.href.replace(currentHash, '') === newUrlObj.href.replace(newHash, '')
        );
      }
      return false;
    }

    // deno-lint-ignore no-var
    var nProgressClass: NodeListOf<HTMLHtmlElement> = document.querySelectorAll('html');

    const removeNProgressClass = (): void =>
      nProgressClass.forEach((el: Element) => el.classList.remove('nprogress-busy'));

    /**
     * Find the closest anchor to trigger
     * @param element {HTMLElement | null}
     * @returns element {Element}
     */
    function findClosestAnchor(element: HTMLElement | null): HTMLAnchorElement | null {
      while (element && element.tagName.toLowerCase() !== 'a') {
        element = element.parentElement;
      }
      return element as HTMLAnchorElement;
    }

    /**
     *
     * @param event {MouseEvent}
     * @returns {void}
     */
    function handleClick(event: MouseEvent): void {
      try {
        const target = event.target as HTMLElement;
        const anchor = findClosestAnchor(target);
        const newUrl = anchor?.href;
        if (newUrl) {
          const currentUrl = window.location.href;
          // const newUrl = (anchor as HTMLAnchorElement).href;

          // To debug the anchor target:
          // console.log('Given target is', (anchor as HTMLAnchorElement).target);
          const isExternalLink = ((anchor as HTMLAnchorElement).target as React.HTMLAttributeAnchorTarget) !== '' ;

          // Check for Special Schemes
          const isSpecialScheme = ['tel:', 'mailto:', 'sms:', 'blob:', 'download:'].some((scheme) =>
            newUrl.startsWith(scheme)
          );

          const notSameHost = !isSameHostName(window.location.href, anchor.href);
          if (notSameHost) {
            return;
          }

          const isAnchorOrHashAnchor =
            isAnchorOfCurrentUrl(currentUrl, newUrl) || isHashAnchor(window.location.href, anchor.href);
          if (!showForHashAnchor && isAnchorOrHashAnchor) {
            return;
          }

          if (
            newUrl === currentUrl ||
            isExternalLink ||
            isSpecialScheme ||
            isAnchorOrHashAnchor ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            !toAbsoluteURL(anchor.href).startsWith('http')
          ) {
            NProgress.start();
            NProgress.done();
            removeNProgressClass();
          } else {
            NProgress.start();
          }
        }
      } catch (err) {
        // Log the error in development only!
        // console.log('NextTopLoader error: ', err);
        NProgress.start();
        NProgress.done();
      }
    }

    /**
     * Complete TopLoader Progress on adding new entry to history stack
     * @param {History}
     * @returns {void}
     */
    ((history: History): void => {
      const pushState = history.pushState;
      history.pushState = (...args) => {
        NProgress.done();
        removeNProgressClass();
        return pushState.apply(history, args);
      };
    })((window as Window).history);

    /**
     * Complete TopLoader Progress on replacing current entry of history stack
     * @param {History}
     * @returns {void}
     */
    ((history: History): void => {
      const replaceState = history.replaceState;
      history.replaceState = (...args) => {
        NProgress.done();
        removeNProgressClass();
        return replaceState.apply(history, args);
      };
    })((window as Window).history);

    function handlePageHide(): void {
      NProgress.done();
      removeNProgressClass();
    }

    /**
     * Handle Browser Back and Forth Navigation
     * @returns {void}
     */
    function handleBackAndForth(): void {
      NProgress.done();
    }

    // Add the global click event listener
    window.addEventListener('popstate', handleBackAndForth);
    document.addEventListener('click', handleClick);
    window.addEventListener('pagehide', handlePageHide);

    // Clean up the global click event listener when the component is unmounted
    return (): void => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('popstate', handleBackAndForth);
    };
  }, []);

  return styles;
};
export default NextTopLoader;

NextTopLoader.propTypes = {
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
