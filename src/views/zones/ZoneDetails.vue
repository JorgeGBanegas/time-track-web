<template>
    <v-alert v-if="showDisplay" :type="typeMessage" closable @click:close="closeAlert">
            {{ message }}
    </v-alert>
    <v-alert v-if="isLoading" type="warning">
            Cargando datos...
    </v-alert>

    <v-container>
        <v-card>
            <v-card-title>
                Información de la zona
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6">
                        <strong>Nombre:</strong> {{ zoneName }}
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <GMapMap
        v-if="paths && center" 
            :center="center"
            :zoom="zoom"
            map-type-id="terrain"
            style=" height: 80vh"  
        >
            <GMapMarker
                v-for="(m, index) in markers"
                :key="index"
                :position="m.position"
                @position_changed="center = m.position"
            ></GMapMarker>

            <GMapPolygon
                :paths="paths"
            ></GMapPolygon>
        </GMapMap>
    </v-container>
</template>

<script>
import { getZoneById} from '@/services/geofencing';
export default {
    emits: ['tilt_changed'],
    data: () => ({
        id: null,
        typeMessage: '',
        message: '',
        showDisplay: false,
        isLoading: false,
        zoneName: '',
        zoom: 15,
        markers: null,
        paths: null,
        center: null,
    }),
    async created() {
        this.id = this.$route.params.id;
        await this.initialize(this.id);
    },

    methods: {
        closeAlert() {
            this.showDisplay = false;
        },
        async initialize(id) {
            try {
                this.isLoading = true;
                const token = document.cookie.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
                const response = await getZoneById(token, id);
                this.isLoading = false;
                if(response.error){
                    console.error("🚀 ~ file: ZoneDetails.vue:75 ~ initialize ~ response.error:", response.error)
                    this.showDisplay = true;
                    this.typeMessage = 'error';
                    this.message = response.message;
                }else{
                    this.showDisplay = true;
                    this.typeMessage = 'success';
                    this.message = 'Zona cargada correctamente';
                    this.zoneName = response.data.name;
                    this.paths = response.data.coordinates.map(coord => {
                        return { lat: coord[0], lng: coord[1] };
                    });
                    
                    this.markers = response.data.coordinates.map(coord => {
                        return { position: { lat: coord[0], lng: coord[1] } };
                    }); 
                    this.center = { lat: response.data.coordinates[0][0], lng: response.data.coordinates[0][1] };
                }
                
            } catch (error) {
                console.error("🚀 ~ file: ZoneDetails.vue:91 ~ initialize ~ error:", error)
                this.showDisplay = true;
                this.typeMessage = 'error';
                this.message = 'Error al cargar la zona. Intente nuevamente. O contacte con el administrador del sistema.';
            }finally{
                this.isLoading = false;
                this.showDisplay = false;
            }
        },
        
    },
}
</script>