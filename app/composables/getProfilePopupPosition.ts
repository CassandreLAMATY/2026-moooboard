export default function getProfilePopupPosition(
    profileBtn: Ref<HTMLElement | null>,
    profileBtnX: Ref<number>,
    profileBtnY: Ref<number>,
) {
    if (!profileBtn.value) return { x: 0, y: 0 };

    const rect = profileBtn.value.getBoundingClientRect();

    profileBtnX.value = rect.right;
    profileBtnY.value = rect.bottom;
}
