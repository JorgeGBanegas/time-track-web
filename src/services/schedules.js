import Config from '@/config/config';
export const getAllSchedules = async (accessToken) => {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + accessToken);
        const response = await fetch(Config.apiEmployerUrl + '/schedule', {
            method: 'GET',
            headers: headers
        });
        const data = await response.json();
        if (response.status === 200) {
            return {
                error: false,
                data: data
            }
        } else {
            return {
                error: true,
                message: data.message
            }
        }
    } catch (error) {
        console.log("🚀 ~ file: schedules.js:23 ~ getAllSchedules ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const createSchedule = async (accessToken, schedule) => {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + accessToken);
        const response = await fetch(Config.apiEmployerUrl + '/schedule', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(schedule)
        });

        const data = await response.json();

        if (response.status === 201) {
            return {
                error: false,
                data: data
            }
        } else {
            return {
                error: true,
                message: data.message
            }
        }
    } catch (error) {
        console.log("🚀 ~ file: schedules.js:23 ~ getAllSchedules ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const getScheduleById = async (accessToken, id) => {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + accessToken);
        const response = await fetch(Config.apiEmployerUrl + '/schedule/' + id, {
            method: 'GET',
            headers: headers
        });

        const data = await response.json();
        if (response.status === 200) {
            return {
                error: false,
                data: data
            }
        } else {
            return {
                error: true,
                message: data.message
            }
        }

    } catch (error) {
        console.log("🚀 ~ file: schedules.js:23 ~ getAllSchedules ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const deleteSchedule = async (accessToken, id) => {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + accessToken);

        const response = await fetch(Config.apiEmployerUrl + '/schedule/' + id, {
            method: 'DELETE',
            headers: headers
        });

        if (response.status === 200) {
            return {
                error: false,
                data: 'Se ha eliminado correctamente'
            }
        } else {
            return {
                error: true,
                message: data.message
            }
        }

    } catch (error) {
        console.log("🚀 ~ file: schedules.js:23 ~ getAllSchedules ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}