<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card-text>
                    <UserTable />
                </v-card-text>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import UserTable from '@/components/job/UserTable.vue';

export default {
    components: {
        UserTable
    }
};
</script>