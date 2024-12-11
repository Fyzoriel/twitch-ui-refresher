console.info("Fyzoriel's Twitch UI Refresher is running");

const MENU_CLASS = "ScTransitionBase-sc-hx4quq-0 dOwqqa channel-root__upper-watch channel-root__upper-watch--with-chat tw-transition";
const PARENT_CLASS = "channel-info-content";

const observer = new MutationObserver(function (mutations, mutationInstance) {
    const menu = document.getElementsByClassName(MENU_CLASS)[0];
    const parent = document.getElementsByClassName(PARENT_CLASS)[0];

    if (menu && parent) {
        menu.style.width = "100%";
        parent.prepend(menu);

        console.info("Twitch stream menu updated successfully");
        mutationInstance.disconnect();
    }
});

observer.observe(document, {
    childList: true,
    subtree:   true
});
