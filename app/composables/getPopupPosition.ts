export default function getPopupPosition(elm: Ref<HTMLElement | null>, elmX: Ref<number>, elmY: Ref<number>) {
    if (!elm.value) return { x: 0, y: 0 };

    const rect = elm.value.getBoundingClientRect();

    elmX.value = rect.right;
    elmY.value = rect.bottom;
}
