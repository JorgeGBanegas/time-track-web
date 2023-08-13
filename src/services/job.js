import Config from '@/config/config';

export const getAllJobs = async (accessToken) => {
    try {
        const response = await fetch(Config.apiEmployerUrl + '/job', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        });

        const data = await response.json();
        if (response.status === 200) {
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.log("🚀 ~ file: job.js:18 ~ getAllJobs ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const createJob = async (accessToken, job) => {
    try {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + accessToken);

        let reqBody = {
            'name': job,
        }

        const response = await fetch(Config.apiEmployerUrl + '/job', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(reqBody)
        });
        if (response.status === 201) {
            return {
                error: false,
                message: 'Se ha creado el trabajo correctamente'
            }
        } else {
            const body = await response.json();
            return {
                error: true,
                message: body.message
            }
        }

    } catch (error) {
        console.log("🚀 ~ file: job.js:18 ~ getAllJobs ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }

}