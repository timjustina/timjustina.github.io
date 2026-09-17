/** Viewports below 800px use mobile chrome (hidden nav, mobile hero, etc.). */
export const MOBILE_MAX_WIDTH = 799

/** Viewports at or above this width use desktop layout. */
export const DESKTOP_MIN_WIDTH = 800

/** Viewports at or below this width use compact type and stacked work cards. */
export const SMALL_MOBILE_MAX_WIDTH = 500

/** Lower bound for mobile chrome with desktop work layout + type (501px up to desktop). */
export const TABLET_MOBILE_MIN_WIDTH = 501

/** Viewports at or below this width use the stacked mobile about layout. */
export const MOBILE_ABOUT_MAX_WIDTH = 699

/** Lower bound for side-by-side about on mobile chrome (700px up to desktop). */
export const TABLET_ABOUT_MIN_WIDTH = 700

/** Case studies use mobile layout strictly below 800px. */
export const CASE_STUDY_MOBILE_MAX_WIDTH = 799

/** Viewports at or above this width use desktop case study layout. */
export const CASE_STUDY_DESKTOP_MIN_WIDTH = DESKTOP_MIN_WIDTH

/** Case study compact type (mobile font sizes) at or below 500px. */
export const CASE_STUDY_COMPACT_TYPE_MAX_WIDTH = SMALL_MOBILE_MAX_WIDTH

/** Strictly below desktop — avoids a sub-800px gap where max-width: 799px misses fractional widths. */
export const MOBILE_MEDIA_QUERY = `(width < ${DESKTOP_MIN_WIDTH}px)`
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH}px)`
export const SMALL_MOBILE_MEDIA_QUERY = `(max-width: ${SMALL_MOBILE_MAX_WIDTH}px)`
export const TABLET_MOBILE_MEDIA_QUERY = `(min-width: ${TABLET_MOBILE_MIN_WIDTH}px) and (width < ${DESKTOP_MIN_WIDTH}px)`
export const MOBILE_ABOUT_MEDIA_QUERY = `(max-width: ${MOBILE_ABOUT_MAX_WIDTH}px)`
export const TABLET_ABOUT_MEDIA_QUERY = `(min-width: ${TABLET_ABOUT_MIN_WIDTH}px) and (width < ${DESKTOP_MIN_WIDTH}px)`
/** Desktop work layout + decor line (≥501). On tablet-mobile the line starts at work, not hero. */
export const WORK_DECOR_LINE_MEDIA_QUERY = `(min-width: ${TABLET_MOBILE_MIN_WIDTH}px)`
export const CASE_STUDY_MOBILE_MEDIA_QUERY = `(width < ${CASE_STUDY_DESKTOP_MIN_WIDTH}px)`
export const CASE_STUDY_DESKTOP_MEDIA_QUERY = `(min-width: ${CASE_STUDY_DESKTOP_MIN_WIDTH}px)`
/** 501px–<800px: case study mobile layout with desktop type. */
export const CASE_STUDY_TABLET_MEDIA_QUERY = TABLET_MOBILE_MEDIA_QUERY
/** ≤500px: case study mobile layout + compact (mobile) type. */
export const CASE_STUDY_COMPACT_TYPE_MEDIA_QUERY = `(max-width: ${CASE_STUDY_COMPACT_TYPE_MAX_WIDTH}px)`

export function isMobileViewport() {
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

export function isDesktopViewport() {
    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
}

export function isWorkDecorLineViewport() {
    return window.matchMedia(WORK_DECOR_LINE_MEDIA_QUERY).matches
}

export function isMobileAboutViewport() {
    return window.matchMedia(MOBILE_ABOUT_MEDIA_QUERY).matches
}
