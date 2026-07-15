const HEADER_OFFSET = 120
const SMALL_SCREEN_QUERY = '(max-width: 767px)'

export function getAboutScrollTop() {
    const aboutSection = document.getElementById('about')
    const aboutBio = document.getElementById('about-bio')
    if (!aboutSection || !aboutBio) return null

    const scrollY = window.scrollY
    const aboutTop = aboutSection.getBoundingClientRect().top + scrollY
    const bioTop = aboutBio.getBoundingClientRect().top + scrollY
    const isSmall = window.matchMedia(SMALL_SCREEN_QUERY).matches

    const colorTop = aboutTop - HEADER_OFFSET
    const bioTopAligned = bioTop - HEADER_OFFSET

    const top = isSmall ? colorTop : bioTopAligned
    return Math.max(0, top)
}

export function scrollToAbout({ behavior = 'smooth' } = {}) {
    const top = getAboutScrollTop()
    if (top === null) return false

    window.scrollTo({ top, behavior })
    return true
}
