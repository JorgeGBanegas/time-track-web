<template>
    <v-container fluid="fluid">
        <v-row>
            <v-col cols="12" md="6">
                <LoginForm/>
            </v-col>
            <v-col cols="12" md="6">
                <LoginCard/>
            </v-col>
        </v-row>
        <router-view></router-view>
    </v-container>
</template>

<script>
    import LoginForm from '@/components/LoginForm.vue';
    import LoginCard from '@/components/LoginCard.vue';

    export default {
        components: {
            LoginForm,
            LoginCard
        }
    };
</script>