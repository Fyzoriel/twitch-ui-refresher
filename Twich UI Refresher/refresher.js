console.info("Fyzoriel's Twitch UI Refresher is running");

const CHANNEL_ROOT_CLASS = "channel-root__info";
const CHANNEL_INFO_CLASS = "channel-info-content";
const CHANNEL_INFO_BUTTON_CLASS = "Layout-sc-1xcs6mc-0 gbBOPT ScTransitionBase-sc-hx4quq-0 gxabAj tw-transition";

const MENU_CLASS_CHAT_CLASS = "ScTransitionBase-sc-hx4quq-0 dOwqqa channel-root__upper-watch channel-root__upper-watch--with-chat tw-transition";
const MENU_CLASS = "ScTransitionBase-sc-hx4quq-0 dOwqqa channel-root__upper-watch tw-transition";
const PLAYER_LAYOUT_CLASS = "channel-root__player";
const PLAYER_CLASS = "persistent-player"; // InjectLayout-sc-1i43xsx-0 persistent-player

const STREAMER_NAME_CLASS = "CoreText-sc-1txzju1-0 ScTitleText-sc-d9mj2s-0 AAWwv bzDGwQ InjectLayout-sc-1i43xsx-0 dhkijX tw-title";
const STREAMER_PICTURE_CLASS = "Layout-sc-1xcs6mc-0 eXdYpk avatar--t0iT1";

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
    return document.getElementsByClassName(MENU_CLASS_CHAT_CLASS)[0];
}

const getPlayerLayout = () => {
    return document.getElementsByClassName(PLAYER_LAYOUT_CLASS)[0];
}

const getPlayer = () => {
    return document.getElementsByClassName(PLAYER_CLASS)[0];
}

const getStreamerName = () => {
    return document.getElementsByClassName(STREAMER_NAME_CLASS)[0];
}

const getStreamerPicture = () => {
    return document.getElementsByClassName(STREAMER_PICTURE_CLASS)[0];
}

const hasEvent = (element, eventName) => {
    return element.hasAttribute(`on${eventName}`);
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
    const streamerName = getStreamerName();
    const streamerPicture = getStreamerPicture();

    if (!channelRoot || !channelInfo || !menu || !playerLayout) {
        return;
    }

    if (streamerName && !hasEvent(streamerName, "click")) {
        streamerName.addEventListener("click", resetMenu);
    }

    if (streamerPicture && !hasEvent(streamerPicture, "click")) {
        streamerPicture.addEventListener("click", resetMenu);
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
    resetting = true;

    const playerLayout = getPlayerLayout();
    const channelInfo = getChannelInfo();
    const streamerName = getStreamerName();
    const streamerPicture = getStreamerPicture();
    const menu = getMenu();

    if (menu && menu.style.top !== "0px") {
        menu.style.removeProperty("top");
        menu.style.removeProperty("zIndex");
    }

    if (streamerName && hasEvent(streamerName, "click")) {
        streamerName.removeEventListener("click", resetMenu);
    }

    if (streamerPicture && hasEvent(streamerPicture, "click")) {
        streamerPicture.removeEventListener("click", resetMenu);
    }

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
let resetting = false;

const observer = new MutationObserver(function (mutations, mutationInstance) {

    if (isMenuPage() && !resetting) {
        updateMenu();
        updateButton();
    } else {
        resetMenu();
    }

    if (!isMenuPage()) {
        resetting = false;
    }
});

observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
});