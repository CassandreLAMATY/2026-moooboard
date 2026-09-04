import type { Shortcut } from "~/types/shortcut";

export default function useAppStates() {
    const isLoggedIn = useState<boolean>("isLoggedIn", () => false);
    const username = useState<string>("username", () => "");
    const shortcuts = useState<Shortcut[]>("shortcuts", () => []);

    function resetData() {
        isLoggedIn.value = false;
        username.value = "";
        shortcuts.value = [];
    }

    return {
        isLoggedIn,
        username,
        shortcuts,
        resetData,
    };
}
