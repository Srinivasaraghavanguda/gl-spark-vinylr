import api from "./axiosConfig";

export const catalogService = {

    // ==========================
    // ALBUMS
    // ==========================

    getAllAlbums: async () => {
        const response = await api.get("/catalog/albums");
        return response.data;
    },

    getAlbumById: async (id) => {
        const response = await api.get(`/catalog/albums/${id}`);
        return response.data;
    },

    addAlbum: async (album) => {
        const response = await api.post("/catalog/albums", album);
        return response.data;
    },

    // ==========================
    // MERCH
    // ==========================

    getAllMerch: async () => {
        const response = await api.get("/catalog/merch");
        return response.data;
    },

    getMerchById: async (id) => {
    const response = await api.get(`/catalog/merch/${id}`);
    return response.data;
},

    getMerchById: async (id) => {
        const response = await api.get(`/catalog/merch/${id}`);
        return response.data;
    },

    addMerch: async (merch) => {
        const response = await api.post("/catalog/merch", merch);
        return response.data;
    },

    updateMerch: async (id, merch) => {
        const response = await api.put(`/catalog/merch/${id}`, merch);
        return response.data;
    },

    deleteMerch: async (id) => {
        const response = await api.delete(`/catalog/merch/${id}`);
        return response.data;
    }

};