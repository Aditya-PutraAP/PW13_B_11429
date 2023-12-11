import useAxios from ".";

//Mendapatkan semua watch later
export const GetAllWatchLater = async (data) => {
    try {
        const response = await useAxios.get(`/watchlater/${data}`, {
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Membuat watch later baru
export const CreateWatchLater = async (data) => {
    try {
        const response = await useAxios.post("/watchlater", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Menghapus watch later
export const DeleteWatchLater = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    try {
        const response = await useAxios.delete(`/watchlater/${id}`, {
            headers: {
                "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};