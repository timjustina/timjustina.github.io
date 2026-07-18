<template>
    <footer class="site-footer">
        <a href="mailto:design@timjustina.com" class="footer-email">design@timjustina.com</a>
        <span class="footer-divider" aria-hidden="true" />
        <span class="footer-copy">© 2026 Tim Justina Yeung</span>
    </footer>
</template>

<script>
export default {
    name: 'PortfolioSiteFooter',
}
</script>

<style scoped>
.site-footer {
    --brand: #000aaa;
    --muted: #757575;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    height: 120px;
    min-height: 120px;
    padding-top: 54px;
    padding-bottom: 0;
    box-sizing: border-box;
    background: #fff;
    white-space: nowrap;
}

.footer-email,
.footer-copy {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 14px;
    font-weight: calc(300 * var(--font-weight-scale));
    line-height: 21px;
    color: var(--muted);
    white-space: nowrap;
    flex-shrink: 0;
}

.footer-email {
    text-decoration: none;
}

.footer-email:hover {
    color: var(--brand);
}

.footer-divider {
    flex-shrink: 0;
    width: 1px;
    height: 21px;
    background: var(--muted);
}

@media (max-width: 600px) {
    .site-footer {
        position: relative;
        display: block;
        height: 120px;
        min-height: 120px;
        padding: 0;
    }

    .footer-divider {
        display: none;
    }

    .footer-email {
        position: absolute;
        top: 20px;
        left: 20px;
        font-size: 14px;
        line-height: 21px;
    }

    .footer-copy {
        position: absolute;
        right: 20px;
        bottom: 20px;
        font-size: 14px;
        line-height: 21px;
    }
}
</style>
