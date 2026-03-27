const FALLBACK_SCROLL_OFFSET = 88;

const parsePixels = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

export const getPortfolioScrollOffset = () => {
  if (typeof window === 'undefined') {
    return FALLBACK_SCROLL_OFFSET;
  }

  const rootStyles = window.getComputedStyle(document.documentElement);
  const computedScrollPadding = rootStyles.scrollPaddingTop.trim();
  const computedPixelValue = parsePixels(computedScrollPadding);

  if (Number.isFinite(computedPixelValue)) {
    return computedPixelValue;
  }

  const tokenValue = rootStyles.getPropertyValue('--portfolio-scroll-offset').trim();
  const pixelValue = parsePixels(tokenValue);

  if (tokenValue.endsWith('rem')) {
    const remBase = parsePixels(rootStyles.fontSize);
    if (Number.isFinite(pixelValue) && Number.isFinite(remBase)) {
      return pixelValue * remBase;
    }
  }

  if (Number.isFinite(pixelValue)) {
    return pixelValue;
  }

  return FALLBACK_SCROLL_OFFSET;
};

export const scrollToPortfolioSection = (sectionId: string) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  const element = document.getElementById(sectionId);
  if (!element) {
    return;
  }

  const targetTop =
    element.getBoundingClientRect().top + window.scrollY - getPortfolioScrollOffset();

  window.history.replaceState(null, '', `#${sectionId}`);
  window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
};
