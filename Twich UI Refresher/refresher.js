console.info("Fyzoriel's Twitch UI Refresher is running");

const CHANNEL_ROOT_CLASS = "channel-root__info";
const CHANNEL_INFO_CLASS = "channel-info-content";
const CHANNEL_INFO_BUTTON_CLASS = "Layout-sc-1xcs6mc-0 gbBOPT ScTransitionBase-sc-hx4quq-0 gxabAj tw-transition";

const MENU_CLASS_CHAT = "ScTransitionBase-sc-hx4quq-0 dOwqqa channel-root__upper-watch channel-root__upper-watch--with-chat tw-transition";
const MENU_CLASS = "ScTransitionBase-sc-hx4quq-0 dOwqqa channel-root__upper-watch tw-transition";
const PLAYER_LAYOUT_CLASS = "channel-root__player";
const PLAYER = "persistent-player" // InjectLayout-sc-1i43xsx-0 persistent-player

const getChannelRoot = () => {
    return document.getElementsByClassName(CHANNEL_ROOT_CLASS)[0];
}

const getChannelInfo = () => {
    return document.getElementsByClassName(CHANNEL_INFO_CLASS)[0];
}

const getChannelInfoButton = () => {
    return document.getElementsByClassName(CHANNEL_INFO_BUTTON_CLASS)[0];
}

const getMenu = () => {
    const menu = document.getElementsByClassName(MENU_CLASS)[0];
    if (menu) {
        return menu;
    }
    return document.getElementsByClassName(MENU_CLASS_CHAT)[0];
}

const getPlayerLayout = () => {
    return document.getElementsByClassName(PLAYER_LAYOUT_CLASS)[0];
}

const getPlayer = () => {
    return document.getElementsByClassName(PLAYER)[0];
}

// Use to get sum of margin top and translate Y
const getTopTranslationValue = (element) => {

    const inlineStyle = element.style;
    const marginTop = parseFloat(inlineStyle.marginTop) || 0;

    let translateY = 0;
    const transform = inlineStyle.transform;

    if (transform && transform !== 'none') {
        const match = transform.match(/translateY\((-?\d+(\.\d+)?)px\)/);
        if (match) {
            translateY = parseFloat(match[1]);
        }
    }

    return marginTop + translateY;
}

const updateMenu = () => {
    const channelRoot = getChannelRoot();
    const channelInfo = getChannelInfo();
    const menu = getMenu();
    const playerLayout = getPlayerLayout();
    const player = getPlayer();

    if (!channelRoot || !channelInfo || !menu || !playerLayout) {
        return;
    }

    const channelRootMarginTopValue = getTopTranslationValue(channelRoot);

    const channelRootMarginTop = `${channelRootMarginTopValue}px`;

    if (channelRoot.style.transition !== "none") {
        channelRoot.style.setProperty("transition", "none", "important");
    }

    if (menu.style.top !== channelRootMarginTop) {
        menu.style.setProperty("top", channelRootMarginTop, "important");
        menu.style.setProperty("zIndex", "1000", "important");
        menu.children[0].style.setProperty("height", "", "important");
    }

    if (playerLayout.style.top !== "-7rem") {
        playerLayout.style.setProperty("top", "-7rem", "important");
        playerLayout.style.setProperty("position", "relative", "important");
    }

    if (channelInfo.style.top !== `-${channelRootMarginTop}`) {
        channelInfo.style.setProperty("top", `-${channelRootMarginTop}`, "important");
        channelInfo.style.setProperty("position", "relative", "important");
    }

    if (player && player.style.top !== "0px") {
        player.style.setProperty("top", "0", "important");
    }
}

const resetMenu = () => {
    const playerLayout = getPlayerLayout();
    const channelInfo = getChannelInfo();

    if (playerLayout && playerLayout.style.top === "-7rem") {
        playerLayout.style.removeProperty("top");
        playerLayout.style.removeProperty("position");
    }

    if (channelInfo && channelInfo.style.top !== "0px") {
        channelInfo.style.removeProperty("top");
        channelInfo.style.removeProperty("position");
    }
}

const updateButton = () => {
    const channelInfoButton = getChannelInfoButton();
    if (!channelInfoButton) {
        return;
    }

    channelInfoButton.style.setProperty("position", "relative", "important");
}

const isMenuPage = () => {
    return !!document.querySelector('[data-a-target="stream-title"]');
}

const observer = new MutationObserver(function (mutations, mutationInstance) {

    if (isMenuPage()) {
        updateMenu();
        updateButton();
    } else {
        resetMenu();
    }
});

observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
});
