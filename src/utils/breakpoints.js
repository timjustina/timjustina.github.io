/** Viewports below 800px use mobile layout (hidden nav, stacked projects, etc.). */
export const MOBILE_MAX_WIDTH = 799

/** Viewports at or above this width use desktop layout. */
export const DESKTOP_MIN_WIDTH = 800

/** Viewports at or below this width use compact mobile type scale and stacked about layout. */
export const SMALL_MOBILE_MAX_WIDTH = 600

/** Lower bound for mobile layout with desktop text sizes (601px up to desktop). */
export const TABLET_MOBILE_MIN_WIDTH = 601

/** Case studies use mobile layout strictly below 800px. */
export const CASE_STUDY_MOBILE_MAX_WIDTH = 799

/** Viewports at or above this width use desktop case study layout. */
export const CASE_STUDY_DESKTOP_MIN_WIDTH = DESKTOP_MIN_WIDTH

/** Case study compact type (mobile font sizes) at or below 600px. */
export const CASE_STUDY_COMPACT_TYPE_MAX_WIDTH = SMALL_MOBILE_MAX_WIDTH

/** Strictly below desktop — avoids a sub-800px gap where max-width: 799px misses fractional widths. */
export const MOBILE_MEDIA_QUERY = `(width < ${DESKTOP_MIN_WIDTH}px)`
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH}px)`
export const SMALL_MOBILE_MEDIA_QUERY = `(max-width: ${SMALL_MOBILE_MAX_WIDTH}px)`
export const TABLET_MOBILE_MEDIA_QUERY = `(min-width: ${TABLET_MOBILE_MIN_WIDTH}px) and (width < ${DESKTOP_MIN_WIDTH}px)`
export const CASE_STUDY_MOBILE_MEDIA_QUERY = `(width < ${CASE_STUDY_DESKTOP_MIN_WIDTH}px)`
export const CASE_STUDY_DESKTOP_MEDIA_QUERY = `(min-width: ${CASE_STUDY_DESKTOP_MIN_WIDTH}px)`
/** 601px–<800px: case study mobile layout with desktop type. */
export const CASE_STUDY_TABLET_MEDIA_QUERY = TABLET_MOBILE_MEDIA_QUERY
/** ≤600px: case study mobile layout + compact (mobile) type. */
export const CASE_STUDY_COMPACT_TYPE_MEDIA_QUERY = `(max-width: ${CASE_STUDY_COMPACT_TYPE_MAX_WIDTH}px)`

export function isMobileViewport() {
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

export function isDesktopViewport() {
    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
}
