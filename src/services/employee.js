import Config from '@/config/config';
export const getAllEmployees = async (accessToken) => {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + accessToken);
        const response = await fetch(Config.apiEmployerUrl + '/employee', {
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
        console.log("🚀 ~ file: employee.js:5 ~ getAllEmployees ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }

}

export const getEmployeeById = async (accessToken, id) => {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + accessToken);

        const response = await fetch(Config.apiEmployerUrl + '/employee/' + id, {
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
        console.log("🚀 ~ file: employee.js:36 ~ getEmployeeById ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const createEmployee = async (accessToken, employee) => {
    try {
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + accessToken);
        const formData = new FormData();
        formData.append('firstName', employee.firstName);
        formData.append('lastName', employee.lastName);
        formData.append('email', employee.email);
        formData.append('phoneNumber', employee.phoneNumber);
        formData.append('gender', employee.gender);
        formData.append('birthDate', employee.birthDate);
        formData.append('job_id', employee.job_id);
        formData.append('photo', employee.photo);
        formData.append('schedule_id', employee.schedule_id);

        const response = await fetch(Config.apiEmployerUrl + '/employee', {
            method: 'POST',
            headers: headers,
            body: formData
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
        console.log("🚀 ~ file: employee.js:66 ~ createEmployee ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const getSchedule = async (accessToken, id) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        const response = await fetch(`${Config.apiEmployerUrl}/employee/schedule/${id}`, {
            method: 'GET',
            headers
        });

            
        const data = await response.json();
        return response.status === 200 ? {
            error: false,
            data,
            message: 'Horario obtenido correctamente'
        } : {
            error: true,
            message: data.message
        };

    }catch (error) {
        console.log("🚀 ~ file: employee.js:103 ~ getSchedule ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}