export default function setIconTimeout(iconTimeout: Ref<NodeJS.Timeout | undefined>, isFrame1Displayed: Ref<boolean>) {
    iconTimeout.value = setTimeout(
        () => {
            isFrame1Displayed.value = !isFrame1Displayed.value;

            setIconTimeout(iconTimeout, isFrame1Displayed);
        },
        (Math.random() * (3 - 0.5) + 0.5) * 1000,
    );
}
