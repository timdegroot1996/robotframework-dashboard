import { informationMap } from "./constants/information.js";

// function to fill the information icons with the correct data
function setup_information_popups() {
    for (const id in informationMap) {
        const title = informationMap[id];
        const element = document.getElementById(id);
        if (!element) continue;  // safety check if element not found
        element.setAttribute("data-title", title);
    }

    let tooltipEl = null;
    let currentTarget = null;

    function createTooltip(el) {
        if (tooltipEl) removeTooltip();

        const text = el.getAttribute('data-title');
        if (!text) return;

        tooltipEl = document.createElement('div');
        tooltipEl.className = 'tooltip-popup';
        tooltipEl.textContent = text;
        document.body.appendChild(tooltipEl);

        const rect = el.getBoundingClientRect();
        const padding = 8;
        const maxWidth = 440;

        const baseCharWidth = 8;
        const dynamicWidth = Math.min(text.length * baseCharWidth + 26, maxWidth);

        tooltipEl.style.width = dynamicWidth + 'px';
        tooltipEl.style.maxWidth = maxWidth + 'px';

        let left = rect.left + rect.width / 2;
        let top = rect.bottom + 8;

        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top}px`;
        tooltipEl.style.transform = 'translateX(-50%)';

        const tooltipRect = tooltipEl.getBoundingClientRect();

        const overflowLeft = tooltipRect.left < padding;
        const overflowRight = tooltipRect.right > window.innerWidth - padding;

        if (overflowLeft) {
            const shiftAmount = padding - tooltipRect.left;
            tooltipEl.style.transform = `translateX(calc(-50% + ${shiftAmount}px))`;
        } else if (overflowRight) {
            const shiftAmount = tooltipRect.right - (window.innerWidth - padding);
            tooltipEl.style.transform = `translateX(calc(-50% - ${shiftAmount}px))`;
        }
    }

    function removeTooltip() {
        document.querySelectorAll('.tooltip-popup').forEach(el => el.remove());
        tooltipEl = null;
        currentTarget = null;
    }

    function isElementVisible(el) {
        const style = window.getComputedStyle(el);
        return !(style.display === 'none' || style.visibility === 'hidden' || el.offsetParent === null);
    }

    document.querySelectorAll('.information[data-title]').forEach(el => {
        el.onmouseenter = null;
        el.onmouseleave = null;
        el.onclick = null;

        el.addEventListener('mouseenter', () => {
            if (currentTarget !== el) {
                currentTarget = el;
                createTooltip(el);
            }
        });

        el.addEventListener('mouseleave', () => {
            if (currentTarget === el) {
                removeTooltip();
            }
        });

        el.addEventListener('click', () => {
            if (!isElementVisible(el) && currentTarget === el) {
                removeTooltip();
            }
        });
    });

    document.addEventListener('mouseover', e => {
        const target = e.target.closest('.information[data-title]');
        if (target !== currentTarget) {
            removeTooltip();
            if (target) {
                currentTarget = target;
                createTooltip(target);
            }
        }
    });
}

export { setup_information_popups };