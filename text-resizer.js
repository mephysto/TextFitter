/**
 * TextFitter
 * For best milage, you'll want to set a width/height or max-width/max-height 
 * on the parent container. 
 * 
 * @example: 
 * // Resizes target element to fit in parent container. 
 * // But with a fontsize no smaller than 10px, and no larget than 30px 
 * TextFitter(document.querySelector('#myTextField', { minFontSize: 10, maxFontSize: 30 });
 * @example
 * // Demo here: http://codepen.io/mephysto/pen/BQKejp
 * 
 * @param {HTMLElement} targetEl - The HTML element (ideally a paragraph)
 * @param {Object} options - an object containing settings
 * @param {Number} options.minFontsize - The lowest fontsize the targetelement will resize to
 * @param {Number} options.maxFontsize - The lowest fontsize the targetelement will resize to
 * @param {Number} options.velocity - The speed at which we resize. Smaller is slower, but more precise 
 * @param {String|Boolean} options.onReadyClass - Add ready class to targetEl when resizing has finished 
 */
const TextFitter = (element, options) => {
  const isElementBiggerThanParent = function(_targetEl) {
    let result = false,
      maxHeight = 0,
      maxWidth = 0,
      parentElComputedStyles = window.getComputedStyle(_targetEl.parentElement),
      elComputedStyles = window.getComputedStyle(_targetEl),
      padding = {
        top: parseInt(parentElComputedStyles.paddingTop),
        right: parseInt(parentElComputedStyles.paddingRight),
        bottom: parseInt(parentElComputedStyles.paddingBottom),
        left: parseInt(parentElComputedStyles.paddingLeft)
      };

    // figure out the bounding box for the target el.
    maxHeight = (isNaN(parseInt(parentElComputedStyles.maxHeight)) ? parseInt(parentElComputedStyles.height) : parseInt(parentElComputedStyles.maxHeight)) - padding.top - padding.bottom;
    maxWidth = (isNaN(parseInt(parentElComputedStyles.maxWidth)) ? parseInt(parentElComputedStyles.width) : parseInt(parentElComputedStyles.maxWidth)) - padding.left - padding.right;
    // save some variables into the el, for live debugging  
    _targetEl.dataset.maxHeight = maxHeight;
    _targetEl.dataset.maxWidth = maxWidth;
    _targetEl.dataset.offsetWidth = _targetEl.offsetWidth;
    _targetEl.dataset.offsetHeight = _targetEl.offsetHeight;

    // console.info('================================================================================================');
    // console.info('maxWidth:', maxWidth, ", maxHeight:", maxHeight);
    // console.info('_targetEl.offsetWidth:', _targetEl.offsetWidth, ', _targetEl.offsetHeight:', _targetEl.offsetHeight);
    // console.info('_targetEl.parentElement.offsetWidth:', _targetEl.parentElement.offsetWidth, '_targetEl.parentElement.offsetHeight:', _targetEl.parentElement.offsetHeight);

    // return true if the target el is bigger than the parent el
    if (_targetEl.offsetHeight >= _targetEl.parentElement.offsetHeight) {
      // console.info('> target el is higher than parents height');
      result = true;
    }
    if (_targetEl.offsetWidth > _targetEl.parentElement.offsetWidth) {
      // console.info('> target el is wider than parents width');
      result = true;
    }
    // return true if target el is bigger than calculated bounds
    if (_targetEl.offsetHeight > maxHeight) {
      // console.info('> target el is higher than parents calculated max height');
      result = true;
    }
    if (_targetEl.offsetWidth > maxWidth) {
      // console.info('> target el is wider than parents calculated max width');
      result = true;
    }
    return result;
  }
  const checkFontsize = function(targetEl, options) {
    let minFontSize = options.minFontsize || 10,
      maxFontSize = options.maxFontsize || 24,
      velocity = options.velocity || 1,
      onReadyClass = options.onReadyClass || false,
      computedStyles = window.getComputedStyle(targetEl),
      parentElComputedStyles = window.getComputedStyle(targetEl.parentElement);
    // We'll need to change some CSS values, so store the original values.
    targetEl.dataset.originalMaxwidth = computedStyles.maxWidth;
    targetEl.dataset.originalMaxheight = computedStyles.maxHeight;
    targetEl.style.maxWidth = "none";
    targetEl.style.maxHeight = "none";
    // set display to table in order to allow the content to overflow
    targetEl.dataset.originalDisplay = computedStyles.display;
    targetEl.style.fontSize = computedStyles.fontSize;
    targetEl.style.display = "table";
    // if there's child elements (like spans) with text. We kinda want to take over these as well
    [].slice.call(targetEl.querySelectorAll('span')).map(function(el) {
      el.dataset.originalDisplay = window.getComputedStyle(el).display; // save original display value
      el.style.display = "table";
      el.style.fontSize = "1em";
    });
    // should we grow or shrink fonts?
    let direction = isElementBiggerThanParent(targetEl) ? -velocity : velocity;

    // back to original values
    const resetStyles = function(targetEl) {
        targetEl.style.display = targetEl.dataset.originalDisplay;
        targetEl.style.maxWidth = targetEl.dataset.originalMaxwidth;
        targetEl.style.maxHeight = targetEl.dataset.originalMaxheight;
      }
      // put styles back in original position
    const endAdjustSize = function(targetEl, direction) {
      direction = (direction < 0) ? direction : -direction; // ??? Not sure why I need to do this :|
      var newFontsize = (parseFloat(targetEl.style.fontSize) + direction); // increase/decrease fontsize 
      newFontsize = newFontsize > maxFontSize ? maxFontSize : newFontsize; // make sure we're not too big
      newFontsize = newFontsize < minFontSize ? minFontSize : newFontsize; // make sure we're not too small
      targetEl.style.fontSize = newFontsize + "px"; // update fontsize
      if (onReadyClass != false) {
        targetEl.classList.add(onReadyClass);
      }
      resetStyles(targetEl);
      if (targetEl.querySelectorAll('span').length > 0) {
        [].slice.call(targetEl.querySelectorAll('span')).map(function(el) {
          el.style.display = el.dataset.originalDisplay; // back to original display
        });
      }
      // can listen to 
      targetEl.dispatchEvent(new Event('resizeFinished'));
    }

    /**
     * Resize the targetelement in a direction. 
     * Once it passed the exact fit threshold, 
     * run endAdjustSize to put back the original styles
     * 
     * @param {any} targetEl
     * @param {any} direction
     */
    const adjustFontsize = function(targetEl, direction) {
      // resize font
      targetEl.style.fontSize = (parseFloat(targetEl.style.fontSize) + direction) + "px";
      // stop resizing if we have passed the 'exact fit' threshold.
      if (isElementBiggerThanParent(targetEl) === (direction > 0)) {
        endAdjustSize(targetEl, direction);
      } else {
        // Failsafe to prevent an infinite loop. Limit to font-size.
        if (parseFloat(targetEl.style.fontSize) > minFontSize && parseFloat(targetEl.style.fontSize) < maxFontSize) {
          // adjust font size every 50ms. Could've used a while loop. But Firefox doesn't like that
          setTimeout(adjustFontsize, 50, targetEl, direction);
        } else {
          endAdjustSize(targetEl, direction);
        }
      }
    }
    adjustFontsize(targetEl, direction);
  };

  
  const elements = [].slice.call(document.querySelectorAll(element));
  const count = elements.length;
  let iterations = 0;
  
  elements.map(function(el){
    const onResizeFinished = () => {
      // an element has finished resizing
      iterations++;
      // console.log(`${iterations} out of ${count} done`);
      if (iterations >= count){
        // all elements have finished resizing
        // console.log('Resized text on all elements');
        document.body.dispatchEvent(new Event('TextFitterFinished'));
      }
    }
    el.addEventListener("resizeFinished", onResizeFinished);
    checkFontsize(el, options);
  });
};