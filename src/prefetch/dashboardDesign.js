import { dashboardDesignMediaUrls } from '../data/dashboardDesignMedia.js'

function prefetchUrl(url) {
    return new Promise((resolve) => {
        if (/\.(mov|mp4|webm)(\?|$)/i.test(url)) {
            const link = document.createElement('link')
            link.rel = 'prefetch'
            link.as = 'video'
            link.href = url
            link.onload = () => resolve()
            link.onerror = () => resolve()
            document.head.appendChild(link)
            // Prefetch completion events are unreliable; don't block the rest.
            setTimeout(resolve, 0)
            return
        }

        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = url
    })
}

/** Warm the dashboard case-study route chunk + media (low priority). */
export function prefetchDashboardDesign() {
    return Promise.all([
        import('../views/DashboardDesign.vue'),
        ...dashboardDesignMediaUrls.map(prefetchUrl),
    ])
}
