<template>
    <nav>
        <div class="action-container">
            <button
                class="btn-round"
                type="button"
                title="Undo"
            >
                <img
                    src="/images/arrow-undo.svg"
                    alt="Undo icon"
                />
            </button>
            <button
                class="btn-round"
                type="button"
                title="Redo"
            >
                <img
                    src="/images/arrow-redo.svg"
                    alt="Redo icon"
                />
            </button>
        </div>

        <div class="logo-container">
            <img
                src="/images/cow-face.svg"
                alt="MoooBoard Logo"
            />
            <span class="font01 micro01">MoooBoard</span>
        </div>

        <div class="profile-container">
            <button
                class="btn-icon-only"
                type="button"
            >
                <img
                    src="/images/gear.svg"
                    alt="MoooBoard Logo"
                />
            </button>
            <button
                class="btn"
                type="button"
            >
                <img
                    src="/images/door-open-arrow-in.svg"
                    alt="MoooBoard Logo"
                />
                <span class="font02 micro02"> Sign in </span>
            </button>
        </div>
    </nav>
</template>

<style scoped lang="scss">
@use '~/assets/scss/navbar.scss';
</style>
