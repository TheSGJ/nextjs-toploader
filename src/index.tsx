/**
 *
 * NextTopLoader
 *
 */

/* eslint-disable prefer-const */
/* eslint-disable quotes */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as NProgress from 'nprogress';
export interface NextTopLoaderProps {
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
   * The height for the TopLoader.
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
}

const NextTopLoader = (props: NextTopLoaderProps) => {
  const color = '#29d';
  const height = 3;

  const styles = (
    <style>
      {`#nprogress{pointer-events:none}#nprogress .bar{background:${
        props.color ? props.color : color
      };position:fixed;z-index:1031;top:0;left:0;width:100%;height:${
        props.height ? props.height : height
      }px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;box-shadow:0 0 10px ${
        props.color ? props.color : color
      },0 0 5px ${
        props.color ? props.color : color
      };opacity:1;-webkit-transform:rotate(3deg) translate(0px,-4px);-ms-transform:rotate(3deg) translate(0px,-4px);transform:rotate(3deg) translate(0px,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:1031;top:15px;right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:${
        props.color ? props.color : color
      };border-left-color:${
        props.color ? props.color : color
      };border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}
    </style>
  );

  React.useEffect(() => {
    if (props.showSpinner !== undefined) {
      NProgress.configure({ showSpinner: props.showSpinner });
    }
    if (props.crawl !== undefined) {
      NProgress.configure({ trickle: props.crawl });
    }
    if (props.crawlSpeed !== undefined) {
      NProgress.configure({ trickleSpeed: props.crawlSpeed });
    }
    if (props.initialPosition !== undefined) {
      NProgress.configure({ minimum: props.initialPosition });
    }
    if (props.easing !== undefined) {
      NProgress.configure({ easing: props.easing });
    }
    if (props.speed !== undefined) {
      NProgress.configure({ speed: props.speed });
    }
    // eslint-disable-next-line no-var
    var npgclass = document.querySelectorAll('html');
    let navLinks = document.querySelectorAll('a');
    navLinks.forEach((navLink) => {
      navLink.addEventListener('click', (event: MouseEvent) => {
        let currentUrl = window.location.href;
        let newUrl = (event.currentTarget as HTMLAnchorElement).href;
        let isExternalLink = Boolean((event.currentTarget as HTMLAnchorElement).target === "_blank");
        if (isExternalLink) return null;
        function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string) {
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
              currentHash !== newHash &&
              currentUrlObj.href.replace(currentHash, '') === newUrlObj.href.replace(newHash, '')
            );
          }
          return false;
        }
        const isAnchor = isAnchorOfCurrentUrl(currentUrl, newUrl);
        if (newUrl === currentUrl || isAnchor) {
          NProgress.start();
          NProgress.done();
          [].forEach.call(npgclass, function (el: Element) {
            el.classList.remove('nprogress-busy');
          });
        } else {
          NProgress.start();
          (function (history) {
            // eslint-disable-next-line no-var
            var pushState = history.pushState;
            history.pushState = function () {
              NProgress.done();
              [].forEach.call(npgclass, function (el: Element) {
                el.classList.remove('nprogress-busy');
              });
              // eslint-disable-next-line prefer-rest-params
              return pushState.apply(history, arguments);
            };
          })(window.history);
        }
      });
    });
  });

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
};
