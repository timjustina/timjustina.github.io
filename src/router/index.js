import { createRouter, createWebHistory } from 'vue-router'
import Portfolio from '../views/Portfolio.vue'
import { getAboutScrollTop, getHeaderOffset, getWorkScrollTop, smoothScrollTo } from '../utils/scrollToAbout.js'
import {
    cancelImageExpand,
    hasPendingImageExpand,
} from '../utils/imageExpandTransition.js'

function getHashScrollTop(hash) {
    if (hash === '#about') return getAboutScrollTop()
    if (hash === '#work-first' || hash === '#work') return getWorkScrollTop()

    const el = document.querySelector(hash)
    if (!el) return null
    const headerOffset = getHeaderOffset()
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset)
}

function waitForHashTarget(hash, { attempts = 40 } = {}) {
    return new Promise((resolve) => {
        let left = attempts

        const tick = () => {
            const top = getHashScrollTop(hash)
            if (top !== null) {
                resolve(top)
                return
            }

            left -= 1
            if (left <= 0) {
                resolve(null)
                return
            }

            requestAnimationFrame(tick)
        }

        tick()
    })
}

const routes = [
    {
        path: '/',
        name: 'Portfolio',
        component: Portfolio
    },
    {
        path: '/work/DashboardDesign',
        name: 'DashboardDesign',
        component: () => import('../views/DashboardDesign.vue')
    },
    {
        path: '/project/MultiplatformSolution',
        name: 'MultiplatformSolution',
        component: () => import('../views/MultiplatformSolution.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }

        // Home hash targets are scrolled by Portfolio after the page is ready
        // (loading splash / layout). Avoid fighting that with an early scroll.
        if (to.path === '/' && (to.hash === '#about' || to.hash === '#work-first' || to.hash === '#work')) {
            if (from.path === '/' && from.fullPath === to.fullPath) {
                return false
            }
            // Coming from another route: stay at top until Portfolio scrolls.
            return { top: 0 }
        }

        if (to.hash) {
            return waitForHashTarget(to.hash).then((top) => {
                if (top !== null) {
                    smoothScrollTo(top)
                    return false
                }
                return { el: to.hash, top: 120 }
            })
        }

        return { top: 0 }
    },
})

router.afterEach((to) => {
    // Clean up a stranded flyer if we never handed off to a project hero.
    if (to.name === 'Portfolio' && hasPendingImageExpand()) {
        cancelImageExpand()
    }
})

export default router
