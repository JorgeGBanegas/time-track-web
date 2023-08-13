<template>
    <v-container fluid="fluid">
        <v-row>
            <v-col cols="12" md="6">
                <ChangePasswordForm :email="email" :session="session" />
            </v-col>
            <v-col cols="12" md="6">
                <LoginCard />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ChangePasswordForm from '@/components/ChangePasswordForm.vue';
import LoginCard from '@/components/LoginCard.vue';

export default {
    data() {
        return {
            email: null,
            session: null,
        };
    },
    created() {
        this.email = this.$route.query.email;
        this.session = this.$route.query.session;
    },
    components: {
        ChangePasswordForm,
        LoginCard,
    },
};
</script>