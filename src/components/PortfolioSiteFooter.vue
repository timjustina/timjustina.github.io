<template>
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-contact">
                <strong class="footer-contact-title">Get in touch</strong>
                <a href="mailto:design@timjustina.com" class="footer-email">design@timjustina.com</a>
            </div>
            <span class="footer-copy">© 2026 Tim Justina Yeung</span>
        </div>
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
    --top-bar-height: 120px;
    --top-bar-logo-height: 52px;
    --top-bar-nav-height: 27px;
    --top-bar-edge-pad-left: calc((var(--top-bar-height) - var(--top-bar-logo-height)) / 2);
    --top-bar-edge-pad-right: calc((var(--top-bar-height) - var(--top-bar-nav-height)) / 2);
    --footer-edge-pad-vertical: var(--top-bar-edge-pad-left);

    display: flex;
    align-items: center;
    min-height: 120px;
    padding: var(--footer-edge-pad-vertical) var(--top-bar-edge-pad-right) var(--footer-edge-pad-vertical)
        var(--top-bar-edge-pad-left);
    box-sizing: border-box;
    background: #fff;
}

.footer-inner {
    --footer-item-gap: 4px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
}

.footer-contact {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--footer-item-gap);
}

.footer-contact-title {
    margin: 0;
    font-family: 'Fira Code', monospace;
    font-size: 24px;
    font-style: normal;
    font-weight: calc(600 * var(--font-weight-scale));
    line-height: 36px;
    letter-spacing: -0.02em;
    color: var(--brand);
    font-synthesis: none;
}

.footer-email,
.footer-copy {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 16px;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 27px;
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

@media (max-width: 799px) {
    .site-footer {
        --top-bar-height: 86px;
        --top-bar-edge-pad-left: 20px;
        --top-bar-edge-pad-right: calc((var(--top-bar-height) - var(--top-bar-nav-height)) / 2);
        --footer-edge-pad-vertical: var(--top-bar-edge-pad-left);
        min-height: 0;
        padding: var(--footer-edge-pad-vertical) var(--top-bar-edge-pad-right) var(--footer-edge-pad-vertical)
            var(--top-bar-edge-pad-left);
    }

    .footer-inner {
        --footer-item-gap: 2px;
        flex-direction: column;
        align-items: stretch;
    }

    .footer-copy {
        align-self: flex-end;
        margin-top: 40px;
    }
}

@media (max-width: 600px) {
    .footer-contact-title {
        font-size: 22px;
        line-height: 33px;
    }
}
</style>
