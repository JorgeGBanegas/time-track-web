<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card-text>
                    <ZoneTable />
                </v-card-text>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ZoneTable  from '@/components/zones/ZoneTable.vue';

    export default {
        components: {
            ZoneTable
        },
    }
</script>