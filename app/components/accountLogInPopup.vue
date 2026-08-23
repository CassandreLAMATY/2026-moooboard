<script setup lang="ts">
const email = ref("");
const password = ref("");

const emailIsValid = ref("");
const passwordIsValid = ref("");

const emailError = ref("");
const passwordError = ref("");

// Password handling

const isPasswordDisplayed = ref(false);

const hasBeenFocus = ref(false);
const hasBeenBlur = ref(false);

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-])[a-zA-Z0-9_#?!@$%^&*-]+$/;

function focusPassword() {
    hasBeenFocus.value = true;
    passwordError.value = "";
}
</script>

<template>
    <div class="popup-container" @click="$emit('close')">
        <div class="popup" @click.stop>
            <div class="header-container">
                <div class="header">
                    <span class="font04 silk01">Sign in</span>

                    <button type="button" @click="$emit('close')">
                        <img src="/images/xmark.svg" alt="Xmark icon" />
                    </button>
                </div>

                <span class="font02 micro02">
                    Don’t have an account yet ?
                    <span class="login" @click="$emit('openRegister')">Create one here</span>
                </span>
            </div>

            <form>
                <div class="group">
                    <div class="container">
                        <div class="input-container">
                            <label class="font06 silk02" for="email">
                                <span :class="emailError ? 'err' : ''">*</span> Email address
                            </label>

                            <div class="input">
                                <input
                                    class="font07"
                                    type="email"
                                    name="email"
                                    id="email"
                                    v-model="email"
                                    placeholder="john.doe@domain.com"
                                    @focus="emailError = ''"
                                />
                                <img v-if="emailIsValid" src="/images/check.svg" alt="Check icon" />
                                <img v-if="emailError" src="/images/xmark-red.svg" alt="Xmark icon" />
                            </div>
                        </div>

                        <span class="font05">{{ emailError }}</span>
                    </div>

                    <div class="password-container">
                        <div class="container">
                            <div class="input-container">
                                <div class="input-header">
                                    <label class="font06 silk02" for="password">
                                        <span :class="passwordError ? 'err' : ''">*</span> Password
                                    </label>

                                    <button type="button" @click="isPasswordDisplayed = !isPasswordDisplayed">
                                        <img v-if="!isPasswordDisplayed" src="/images/eye.svg" alt="Eye icon" />
                                        <img v-else src="/images/eye-close.svg" alt="Closed eye icon" />
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
                                    <img v-if="passwordIsValid" src="/images/check.svg" alt="Check icon" />
                                    <img v-if="passwordError" src="/images/xmark-red.svg" alt="Xmark icon" />
                                </div>
                            </div>

                            <span class="font05">{{ passwordError }}</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <button class="cancel" type="button">
                        <span class="font02 micro02">Cancel</span>
                    </button>

                    <button class="submit" type="button">
                        <img src="/images/door-open-arrow-in-green.svg" alt="Door open icon" />
                        <span class="font02 micro02">Log in</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/accountSignInPopup.scss";
</style>
