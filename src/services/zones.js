import config from "@/config/config";

export const getAllZones = async (accessToken, data) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        const response = await fetch(`${config.apiGeofencingUrl}/geozones`, {
            method: 'GET',
            headers,
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.status === 200) {
            return result;
        }

        throw new Error(result.message);
    }catch(error){
        console.error("🚀 ~ file: zones.js:23 ~ getAllZones ~ error:", error)
        throw new Error(error.message || error); 
    }
}