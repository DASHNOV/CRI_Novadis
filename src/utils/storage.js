import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cri_list';

export const getAllCRIs = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erreur récupération CRIs:', error);
        return [];
    }
};

export const saveCRI = async (criData) => {
    try {
        const criList = await getAllCRIs();
        // Generate ID if not present
        if (!criData.id) {
            criData.id = Date.now().toString();
        }
        criList.push(criData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(criList));
        return true;
    } catch (error) {
        console.error('Erreur sauvegarde CRI:', error);
        return false;
    }
};

export const getCRIById = async (id) => {
    try {
        const criList = await getAllCRIs();
        return criList.find(cri => cri.id === id);
    } catch (error) {
        console.error('Erreur récupération CRI:', error);
        return null;
    }
};

export const deleteCRI = async (id) => {
    try {
        const criList = await getAllCRIs();
        const newList = criList.filter(cri => cri.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        return true;
    } catch (error) {
        console.error('Erreur suppression CRI:', error);
        return false;
    }
};

export const generateCRINumber = async (type) => {
    const prefix = type === 'projet' ? 'PROJ' : 'SERV';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    const criList = await getAllCRIs();
    // Filter CRIs of same type and same date to increment sequence
    const todayCRIs = criList.filter(cri =>
        cri.numero_cri && cri.numero_cri.includes(`CRI-${prefix}-${dateStr}`)
    );

    const sequence = String(todayCRIs.length + 1).padStart(3, '0');
    return `CRI-${prefix}-${dateStr}-${sequence}`;
};
