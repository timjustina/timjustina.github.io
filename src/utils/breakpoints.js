/** Viewports at or below this width use mobile layout (hidden nav, stacked projects, etc.). */
export const MOBILE_MAX_WIDTH = 799

/** Viewports at or above this width use desktop layout. */
export const DESKTOP_MIN_WIDTH = 800

/** Viewports at or below this width use compact mobile type scale and stacked about layout. */
export const SMALL_MOBILE_MAX_WIDTH = 600

/** Lower bound for mobile layout with desktop text sizes (601–799px). */
export const TABLET_MOBILE_MIN_WIDTH = 601

/** Case studies keep desktop layout (no mobile title/body lines) above this width. */
export const CASE_STUDY_MOBILE_MAX_WIDTH = 799

/** Viewports at or above this width use desktop case study layout. */
export const CASE_STUDY_DESKTOP_MIN_WIDTH = CASE_STUDY_MOBILE_MAX_WIDTH + 1

export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_MAX_WIDTH}px)`
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH}px)`
export const SMALL_MOBILE_MEDIA_QUERY = `(max-width: ${SMALL_MOBILE_MAX_WIDTH}px)`
export const TABLET_MOBILE_MEDIA_QUERY = `(min-width: ${TABLET_MOBILE_MIN_WIDTH}px) and (max-width: ${MOBILE_MAX_WIDTH}px)`
export const CASE_STUDY_MOBILE_MEDIA_QUERY = `(max-width: ${CASE_STUDY_MOBILE_MAX_WIDTH}px)`
export const CASE_STUDY_DESKTOP_MEDIA_QUERY = `(min-width: ${CASE_STUDY_DESKTOP_MIN_WIDTH}px)`

export function isMobileViewport() {
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

export function isDesktopViewport() {
    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
}
