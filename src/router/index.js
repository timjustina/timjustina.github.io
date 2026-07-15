import { createRouter, createWebHistory } from 'vue-router'
import Portfolio from '../views/Portfolio.vue'
import { getAboutScrollTop, smoothScrollTo } from '../utils/scrollToAbout.js'

function getElementScrollTop(hash) {
    const el = document.querySelector(hash)
    if (!el) return null
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - 120)
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
    scrollBehavior(to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }

        if (to.hash) {
            return new Promise((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const top =
                            to.hash === '#about'
                                ? getAboutScrollTop()
                                : getElementScrollTop(to.hash)

                        if (top !== null) {
                            smoothScrollTo(top)
                            resolve(false)
                            return
                        }

                        resolve({ el: to.hash, top: 120 })
                    })
                })
            })
        }

        return { top: 0 }
    },
})

export default router