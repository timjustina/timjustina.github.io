import { createRouter, createWebHistory } from 'vue-router'
import Portfolio from '../views/Portfolio.vue'
import { getAboutScrollTop } from '../utils/scrollToAbout.js'

const routes = [
    {
        path: '/',
        name: 'Portfolio',
        component: Portfolio
    },
    {
        path: '/project/MedicationDashboard',
        name: 'MedicationDashboard',
        component: () => import('../views/MedicationDashboard.vue')
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
                        if (to.hash === '#about') {
                            const top = getAboutScrollTop()
                            if (top !== null) {
                                resolve({ top })
                                return
                            }
                        }

                        resolve({
                            el: to.hash,
                            top: 120,
                        })
                    })
                })
            })
        }

        return { top: 0 }
    },
})

export default router