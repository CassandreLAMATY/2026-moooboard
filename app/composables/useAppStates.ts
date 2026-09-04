import type { Buddy } from "~/types/buddy";
import type { Shortcut } from "~/types/shortcut";

export default function useAppStates() {
    const isLoggedIn = useState<boolean>("isLoggedIn", () => false);
    const username = useState<string>("username", () => "");
    const shortcuts = useState<Shortcut[]>("shortcuts", () => []);
    const defaultBuddy = useState<Buddy>("defaultBuddy", () => {
        return {
            id: 1,
            name: "Hungry Cow",
            formatted_name: "hungry-cow",
            image_base_url: "/images/pomodoro/cow",
        };
    });
    const selectedBuddy = useState<Buddy>("selectedBuddy", () => defaultBuddy.value);

    function resetData() {
        isLoggedIn.value = false;
        username.value = "";
        shortcuts.value = [];
        selectedBuddy.value = defaultBuddy.value;
    }

    return {
        isLoggedIn,
        username,
        shortcuts,
        defaultBuddy,
        selectedBuddy,
        resetData,
    };
}
