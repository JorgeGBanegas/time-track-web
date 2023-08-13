import config from "@/config/config";

export const createZone = async (accessToken, zone) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        const response = await fetch(`${config.apiGeofencingUrl}/geozones`, {
            method: 'POST',
            headers,
            body: JSON.stringify(zone)
        });

        const data = await response.json();
        return response.status === 201 ? {
            error: false,
            data,
            message: 'Zona creada correctamente'
        } : {
            error: true,
            message: data.message
        };
    }catch(error){
        console.log("🚀 ~ file: zone.js:5 ~ createZone ~ error", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const getZoneById = async (accessToken, zoneId) => {
    try{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        const response = await fetch(`${config.apiGeofencingUrl}/geozones/${zoneId}`, {
            method: 'GET',
            headers
        });

        const data = await response.json();
        return response.status === 200 ? {
            error: false,
            data,
            message: 'Zona obtenida correctamente'
        } : {
            error: true,
            message: data.message
        };
    }catch(error){
        console.log("🚀 ~ file: zone.js:5 ~ createZone ~ error", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }

}

export const getAllZones = async (accessToken) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        const response = await fetch(`${config.apiGeofencingUrl}/geozones`, {
            method: 'GET',
            headers
        });

        const data = await response.json();

        return response.status === 200 ? {
            error: false,
            data,
            message: 'Zonas obtenidas correctamente'
        } : {
            error: true,
            message: data.message
        };

    }catch(error){
        console.log("🚀 ~ file: geofencing.js:63 ~ getAllZones ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }

}

export const getZoneByEmployeeEmail = async (accessToken, email) => {
    try {
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        const response = await fetch(`${config.apiGeofencingUrl}/assigned-zones/${email}`, {
            method: 'GET',
            header
        });

        const data = await response.json();
        
        return response.status === 200 ? {
            error: false,
            data,
            message: 'Zonas obtenidas correctamente'
        } : {
            error: true,
            message: data.message
        };
    }catch(error){  
        console.log("🚀 ~ file: geofencing.js:63 ~ getAllZones ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const assignZoneToEmployee = async (accessToken, email, zones) => {
    try{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
        const req = {
            employeeEmail: email,
            dayAndZone: zones
        } 

        const response = await fetch(`${config.apiGeofencingUrl}/assigned-zones`, {
            method: 'POST',
            headers,
            body: JSON.stringify(req)
        });
        
        const data = await response.json();
        return response.status === 201 ? {
            error: false,
            data,
            message: 'Zonas asignadas correctamente'
        } : {
            error: true,
            message: data.message
        };

    }catch(error){
        console.log("🚀 ~ file: geofencing.js:123 ~ assignZoneToEmployee ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}