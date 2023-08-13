<template>
    <v-alert v-if="showDisplay" :type="typeMessage" closable @click:close="closeAlert">
        {{ message }}
    </v-alert>
    <v-alert v-if="isLoading" type="warning">
        Cargando datos...
    </v-alert>

    <v-container>
        <v-row>
            <v-col cols="12">
                <div>
                    <h1>{{ pageTitle }}</h1>
                    <v-text-field
                        v-model="name"
                        label="Nombre de la zona"
                        outlined
                    ></v-text-field>

                    <v-btn color="primary" @click="createZone">Crear zona</v-btn>
                    <br/>
                    
                    <GMapMap
                        :center="center"
                        :zoom="zoom"
                        map-type-id="terrain"
                        style=" height: 80vh"
                        @click="click"
                    >
                        <GMapMarker
                            v-for="(m, index) in markers"
                            :key="index"
                            :position="m.position"
                            :clickable="true"
                            :draggable="true"
                            @click="removeMarkers(index)"
                            @dragend="m.position=$event.latLng"
                            @position_changed="center=m.position"
                        ></GMapMarker>

                        <GMapPolygon
                            :paths="paths"
                        ></GMapPolygon>
                    </GMapMap>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { createZone } from '@/services/geofencing';
import config from '@/config/config';
export default {
    emits: ['animation_changed', 'tilt_changed'],
    data() {
        return {
            pageTitle: 'Crear zonas',
            name: '',
            map: null,
            api_key: config.googleMapsApiKey,
            center: { lat: -17.79581, lng:  - 63.18138 },
            markers : [],
            zoom:15,
            paths: [],
            isLoading: false,
            showDisplay: false,
            typeMessage: '',
        };
    },
    methods: {
        closeAlert() {
            this.showDisplay = false;
        },
        removeMarkers(index){
            this.markers.splice(index, 1);
            this.paths.splice(index, 1);
        },
        async createZone(){
            try {
                if(!this.name){
                    this.message = 'El nombre de la zona es requerido';
                    this.typeMessage = 'error';
                    this.showDisplay = true;
                    return;
                }

                this.isLoading = true;
                const token = document.cookie.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
                //add first coordinate to the end of the array
                this.paths.push(this.paths[0]);
                console.log("🚀 ~ file: CreateZone.vue:92 ~ createZone ~ this.paths:", this.paths)

                const coordinates = this.paths.map(coord => {
                    return [coord.lat, coord.lng];
                });
                console.log("🚀 ~ file: CreateZone.vue:94 ~ coordinates ~ coordinates:", coordinates)
                const zone = {
                    name: this.name,
                    coordinates,
                };
                const res = await createZone(token, zone);
                console.log("🚀 ~ file: CreateZone.vue:100 ~ createZone ~ res:", res)
                this.isLoading = false;
                this.showDisplay = true;
                if (res.error) {
                    console.log("🚀 ~ file: CreateZone.vue:102 ~ createZone ~ res.error", res.error)
                    this.message = res.message;
                    this.typeMessage = 'error';
                } else {
                    this.message = res.message;
                    this.typeMessage = 'success';
                    this.$router.push({ name: 'Zones' });
                }
            }catch(error){
                this.message = error.message || 'Error al crear la zona';
                this.typeMessage = 'error';
            }finally{
                this.paths = [];
                this.markers = [];
            }
        },
        async click(event){
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            this.paths.push({ lat, lng });
            this.markers.push({
                position: event.latLng,
            }); 
        }
    }
};
</script>

