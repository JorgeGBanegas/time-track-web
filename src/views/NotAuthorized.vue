<template>
    <v-container fluid>
        <v-row justify="center" align="center" class="ma-5">
            <v-col cols="12" sm="8" md="6">
                <v-card class="pa-5">
                    <h1 class="text-center">Acceso no autorizado</h1>
                    <p class="text-center">Lo siento, no tienes permiso para acceder a esta página.</p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'UnauthorizedPage',
}
</script>

<style scoped>
.text-center {
    text-align: center;
}

.ma-5 {
    margin: 5rem auto;
}
</style>