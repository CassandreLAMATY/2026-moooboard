<script setup lang="ts">
    import { FetchError } from "ofetch";
    import { signInPasswordSchema } from "~/schemas/signInSchemas";

    const emit = defineEmits<{
        (event: "submit"): void;
        (event: "openLogin"): void;
        (event: "close"): void;
    }>();

    const { addNotification } = useNotification();

    const password = ref("");
    const passwordConfirm = ref("");

    const passwordIsValid = ref(false);

    const passwordError = ref("");
    const passwordConfirmError = ref("");

    // Password handling

    const isPasswordDisplayed = ref(false);
    const isPasswordConfirmDisplayed = ref(false);

    const hasBeenFocus = ref(false);
    const hasBeenBlur = ref(false);

    function focusPassword() {
        hasBeenFocus.value = true;
        passwordError.value = "";
    }

    //---
    // Submit

    const submitIsLoading = ref(false);

    async function submit() {
        if (submitIsLoading.value) return;

        if (passwordIsValid.value) {
            if (password.value !== passwordConfirm.value) {
                passwordConfirmError.value = "Password confirmation is different from password";

                checkField(password.value, passwordError, "password");

                return;
            }

            try {
                submitIsLoading.value = true;

                await $fetch("/api/forgottenPasswordUpdateHandler", {
                    method: "PUT",
                    body: {
                        new_password: password.value,
                    },
                });

                useFetchMe();

                addNotification({
                    title: "Password successfully updated",
                    message: "Your password has successfully been updated. All of your sessions have been revoked.",
                    type: "success",
                });

                emit("close");
            } catch (error) {
                submitIsLoading.value = false;

                if (error instanceof FetchError) {
                    const err: {
                        ok: boolean;
                        message: string;
                    } = error.data;

                    addNotification({
                        title: "An error occured",
                        type: "error",
                        message: err.message,
                    });

                    return;
                }

                addNotification({
                    title: "An error occured",
                    type: "error",
                    message: "An error occured while attempting to submit your registration. Please, try again later",
                });

                emit("close");
            }

            return;
        }

        if (password.value !== passwordConfirm.value) {
            passwordConfirmError.value = "Password confirmation is different from password";
        }

        checkField(password.value, passwordError, "password");

        return;
    }

    //---
    // Watch inputs

    watch(password, () => {
        try {
            signInPasswordSchema.parse(password.value);

            passwordIsValid.value = true;
        } catch (error) {
            passwordIsValid.value = false;
        }
    });
</script>

<template>
    <div
        class="popup-container"
        @click="$emit('close')"
    >
        <div
            class="popup"
            @click.stop
        >
            <div class="header-container">
                <div class="header">
                    <span class="font04 silk01">Forgotten password</span>

                    <button
                        type="button"
                        @click="$emit('close')"
                    >
                        <img
                            src="/images/xmark.svg"
                            alt="Xmark icon"
                        />
                    </button>
                </div>

                <span class="font02 micro02">
                    You have 15 minutes to update your password, passed this time, you’ll have to restart the procedure.
                </span>
            </div>

            <form @submit.prevent="submit()">
                <div class="group">
                    <div class="password-container">
                        <div class="container">
                            <div class="input-container">
                                <div class="input-header">
                                    <label
                                        class="font06 silk02"
                                        for="password"
                                    >
                                        <span :class="passwordError ? 'err' : ''">*</span> New password
                                    </label>

                                    <button
                                        type="button"
                                        @click="isPasswordDisplayed = !isPasswordDisplayed"
                                    >
                                        <img
                                            v-if="!isPasswordDisplayed"
                                            src="/images/eye.svg"
                                            alt="Eye icon"
                                        />
                                        <img
                                            v-else
                                            src="/images/eye-close.svg"
                                            alt="Closed eye icon"
                                        />
                                    </button>
                                </div>

                                <div class="input">
                                    <input
                                        class="font07"
                                        :type="isPasswordDisplayed ? 'text' : 'password'"
                                        name="password"
                                        id="password"
                                        v-model="password"
                                        @focus="focusPassword()"
                                        @blur="hasBeenBlur = true"
                                    />
                                    <img
                                        v-if="passwordIsValid"
                                        src="/images/check.svg"
                                        alt="Check icon"
                                    />
                                    <img
                                        v-if="passwordError"
                                        src="/images/xmark-red.svg"
                                        alt="Xmark icon"
                                    />
                                </div>
                            </div>

                            <span class="font05">{{ passwordError }}</span>
                        </div>

                        <ul>
                            <li>
                                <img
                                    v-if="password.length >= 8"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="password.length < 8 && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img
                                    v-else
                                    src="/images/checkbox-grayed.svg"
                                    alt="Checkbox icon"
                                />

                                <span :class="`font03 micro03 ${password.length < 8 && hasBeenBlur ? 'err' : ''}`"
                                    >Minimum of 8 characters</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.length <= 32 && hasBeenFocus"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="password.length >= 32 && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img
                                    v-else
                                    src="/images/checkbox-grayed.svg"
                                    alt="Checkbox icon"
                                />

                                <span :class="`font03 micro03 ${password.length >= 32 && hasBeenBlur ? 'err' : ''}`"
                                    >Maximum of 32 characters</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.match(/[a-z]/)"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="!password.match(/[a-z]/) && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img
                                    v-else
                                    src="/images/checkbox-grayed.svg"
                                    alt="Checkbox icon"
                                />

                                <span :class="`font03 micro03 ${!password.match(/[a-z]/) && hasBeenBlur ? 'err' : ''}`"
                                    >At least 1 lowercase character</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.match(/[A-Z]/)"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="!password.match(/[A-Z]/) && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img
                                    v-else
                                    src="/images/checkbox-grayed.svg"
                                    alt="Checkbox icon"
                                />

                                <span :class="`font03 micro03 ${!password.match(/[A-Z]/) && hasBeenBlur ? 'err' : ''}`"
                                    >At least 1 UPPERCASE character</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.match(/[_#?!@$%^&*-]/)"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="!password.match(/[_#?!@$%^&*-]/) && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img
                                    v-else
                                    src="/images/checkbox-grayed.svg"
                                    alt="Checkbox icon"
                                />

                                <span
                                    :class="`font03 micro03 ${!password.match(/[_#?!@$%^&*-]/) && hasBeenBlur ? 'err' : ''}`"
                                    >At least 1 special character _#?!@$%^&*-</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.match(/\d/)"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="!password.match(/\d/) && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img
                                    v-else
                                    src="/images/checkbox-grayed.svg"
                                    alt="Checkbox icon"
                                />

                                <span :class="`font03 micro03 ${!password.match(/\d/) && hasBeenBlur ? 'err' : ''}`"
                                    >At least 1 number</span
                                >
                            </li>
                        </ul>
                    </div>

                    <div class="container">
                        <div class="input-container">
                            <div class="input-header">
                                <label
                                    class="font06 silk02"
                                    for="passwordConfirm"
                                >
                                    <span :class="passwordConfirmError ? 'err' : ''">*</span> New password confirmation
                                </label>

                                <button
                                    type="button"
                                    @click="isPasswordConfirmDisplayed = !isPasswordConfirmDisplayed"
                                >
                                    <img
                                        v-if="!isPasswordConfirmDisplayed"
                                        src="/images/eye.svg"
                                        alt="Eye icon"
                                    />
                                    <img
                                        v-else
                                        src="/images/eye-close.svg"
                                        alt="Closed eye icon"
                                    />
                                </button>
                            </div>

                            <div class="input">
                                <input
                                    class="font07"
                                    :type="isPasswordConfirmDisplayed ? 'text' : 'password'"
                                    name="passwordConfirm"
                                    id="passwordConfirm"
                                    v-model="passwordConfirm"
                                    @focus="passwordConfirmError = ''"
                                />
                            </div>
                        </div>

                        <span class="font05">{{ passwordConfirmError }}</span>
                    </div>
                </div>

                <div class="footer">
                    <button
                        class="cancel"
                        type="button"
                        @click="$emit('openLogin')"
                    >
                        <span class="font02 micro02">Cancel</span>
                    </button>

                    <button
                        :class="['submit', submitIsLoading ? 'loading' : '']"
                        type="submit"
                    >
                        <svg
                            v-if="submitIsLoading"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                class="dot01"
                                d="M6 10H2V14H6V10Z"
                                fill="#8F8C8F"
                            />
                            <path
                                class="dot02"
                                d="M14 10H10V14H14V10Z"
                                fill="#8F8C8F"
                            />
                            <path
                                class="dot03"
                                d="M22 10H18V14H22V10Z"
                                fill="#8F8C8F"
                            />
                        </svg>
                        <img
                            v-else
                            src="/images/floppy-disk-light-green-24.svg"
                            alt="Save icon"
                        />
                        <span class="font02 micro02">Save</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "~/assets/scss/accountSignInPopup.scss";
</style>
