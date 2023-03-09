/**
 *
 * NextTopLoader
 *
 */

/* eslint-disable no-useless-escape */
/* eslint-disable quotes */

import Script from 'next/script';
import * as PropTypes from 'prop-types';
import * as React from 'react';

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
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `#nprogress{pointer-events:none}#nprogress .bar{background:${
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
          };border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`,
        }}
      />
      <Script id="next-top-loader">
        {`
        var npgclass = document.querySelectorAll("html");
        let currentUrl = window.location.href;
        let navLinks = document.querySelectorAll("a");
        navLinks.forEach(navLink => {
        navLink.addEventListener('click', (event) => {
            ${props.showSpinner === true ? `NProgress.configure({ showSpinner: ${props.showSpinner} });` : ''}
            ${props.showSpinner === false ? `NProgress.configure({ showSpinner: ${props.showSpinner} });` : ''}
            ${props.crawl === true ? `NProgress.configure({ trickle: ${props.crawl} });` : ''}
            ${props.crawl === false ? `NProgress.configure({ trickle: ${props.crawl} });` : ''}
            ${props.crawlSpeed ? `NProgress.configure({ trickleSpeed: ${props.crawlSpeed} });` : ''}
            ${props.initialPosition ? `NProgress.configure({ minimum: ${props.initialPosition} });` : ''}
            ${props.easing ? `NProgress.configure({ easing: ${props.easing} });` : ''}
            ${props.speed ? `NProgress.configure({ speed: ${props.speed} });` : ''}
            let currentUrl = window.location.href;
            let newUrl = event.target.href;
            
            function isAnchorOfCurrentUrl(currentUrl, newUrl) {
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
                  currentUrlObj.href.replace(currentHash, '') ===
                    newUrlObj.href.replace(newHash, '')
                );
              }
              return false;
            }

            const isAnchor = isAnchorOfCurrentUrl(currentUrl, newUrl);

            if (newUrl === currentUrl || isAnchor) {
                NProgress.start();
                let newUrl = event.target.href;
                NProgress.done();
                [].forEach.call(npgclass, function(el) {
                    el.classList.remove("nprogress-busy");
                });
            } else {
                NProgress.start();
                (function(history){
                var pushState = history.pushState;
                history.pushState = function(state) {
                    NProgress.done();
                    let newUrl = event.target.href;
                    [].forEach.call(npgclass, function(el) {
                        el.classList.remove("nprogress-busy");
                    });
                    return pushState.apply(history, arguments);
                };
                })(window.history);
            }
        });
      });
    `}
      </Script>
      <Script id="nprogress.js">
        {`!function(e,n){"function"==typeof define&&define.amd?define(n):"object"==typeof exports?module.exports=n():e.NProgress=n()}(this,(function(){var e,n,t={version:"0.2.0"},r=t.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};function i(e,n,t){return e<n?n:e>t?t:e}function s(e){return 100*(-1+e)}t.configure=function(e){var n,t;for(n in e)void 0!==(t=e[n])&&e.hasOwnProperty(n)&&(r[n]=t);return this},t.status=null,t.set=function(e){var n=t.isStarted();e=i(e,r.minimum,1),t.status=1===e?null:e;var u=t.render(!n),c=u.querySelector(r.barSelector),l=r.speed,f=r.easing;return u.offsetWidth,o((function(n){""===r.positionUsing&&(r.positionUsing=t.getPositioningCSS()),a(c,function(e,n,t){var i;i="translate3d"===r.positionUsing?{transform:"translate3d("+s(e)+"%,0,0)"}:"translate"===r.positionUsing?{transform:"translate("+s(e)+"%,0)"}:{"margin-left":s(e)+"%"};return i.transition="all "+n+"ms "+t,i}(e,l,f)),1===e?(a(u,{transition:"none",opacity:1}),u.offsetWidth,setTimeout((function(){a(u,{transition:"all "+l+"ms linear",opacity:0}),setTimeout((function(){t.remove(),n()}),l)}),l)):setTimeout(n,l)})),this},t.isStarted=function(){return"number"==typeof t.status},t.start=function(){t.status||t.set(0);var e=function(){setTimeout((function(){t.status&&(t.trickle(),e())}),r.trickleSpeed)};return r.trickle&&e(),this},t.done=function(e){return e||t.status?t.inc(.3+.5*Math.random()).set(1):this},t.inc=function(e){var n=t.status;return n?("number"!=typeof e&&(e=(1-n)*i(Math.random()*n,.1,.95)),n=i(n+e,0,.994),t.set(n)):t.start()},t.trickle=function(){return t.inc(Math.random()*r.trickleRate)},e=0,n=0,t.promise=function(r){return r&&"resolved"!==r.state()?(0===n&&t.start(),e++,n++,r.always((function(){0==--n?(e=0,t.done()):t.set((e-n)/e)})),this):this},t.render=function(e){if(t.isRendered())return document.getElementById("nprogress");c(document.documentElement,"nprogress-busy");var n=document.createElement("div");n.id="nprogress",n.innerHTML=r.template;var i,o=n.querySelector(r.barSelector),u=e?"-100":s(t.status||0),l=document.querySelector(r.parent);return a(o,{transition:"all 0 linear",transform:"translate3d("+u+"%,0,0)"}),r.showSpinner||(i=n.querySelector(r.spinnerSelector))&&d(i),l!=document.body&&c(l,"nprogress-custom-parent"),l.appendChild(n),n},t.remove=function(){l(document.documentElement,"nprogress-busy"),l(document.querySelector(r.parent),"nprogress-custom-parent");var e=document.getElementById("nprogress");e&&d(e)},t.isRendered=function(){return!!document.getElementById("nprogress")},t.getPositioningCSS=function(){var e=document.body.style,n="WebkitTransform"in e?"Webkit":"MozTransform"in e?"Moz":"msTransform"in e?"ms":"OTransform"in e?"O":"";return n+"Perspective"in e?"translate3d":n+"Transform"in e?"translate":"margin"};var o=function(){var e=[];function n(){var t=e.shift();t&&t(n)}return function(t){e.push(t),1==e.length&&n()}}(),a=function(){var e=["Webkit","O","Moz","ms"],n={};function t(t){return t=t.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,(function(e,n){return n.toUpperCase()})),n[t]||(n[t]=function(n){var t=document.body.style;if(n in t)return n;for(var r,i=e.length,s=n.charAt(0).toUpperCase()+n.slice(1);i--;)if((r=e[i]+s)in t)return r;return n}(t))}function r(e,n,r){n=t(n),e.style[n]=r}return function(e,n){var t,i,s=arguments;if(2==s.length)for(t in n)void 0!==(i=n[t])&&n.hasOwnProperty(t)&&r(e,t,i);else r(e,s[1],s[2])}}();function u(e,n){return("string"==typeof e?e:f(e)).indexOf(" "+n+" ")>=0}function c(e,n){var t=f(e),r=t+n;u(t,n)||(e.className=r.substring(1))}function l(e,n){var t,r=f(e);u(e,n)&&(t=r.replace(" "+n+" "," "),e.className=t.substring(1,t.length-1))}function f(e){return(" "+(e.className||"")+" ").replace(/\s+/gi," ")}function d(e){e&&e.parentNode&&e.parentNode.removeChild(e)}return t}));`}
      </Script>
    </>
  );
};
export default React.memo(NextTopLoader);

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
