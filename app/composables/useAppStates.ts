export default function useAppStates() {
    const isLoggedIn = useState<boolean>("isLoggedIn", () => false);
    const username = useState<string>("username", () => "");

    function resetData() {
        isLoggedIn.value = false;
        username.value = "";
    }

    return {
        isLoggedIn,
        username,
        resetData,
    };
}
