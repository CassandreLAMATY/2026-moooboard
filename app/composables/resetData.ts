export default function resetData(isLoggedIn: Ref<boolean>, username: Ref<string>, email: Ref<string>) {
    isLoggedIn.value = false;
    username.value = "";
    email.value = "";
}
