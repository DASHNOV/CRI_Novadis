export const COLORS = {
    primary: '#0066CC',
    secondary: '#004C99',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#CCCCCC',
    lightGray: '#F5F5F5',
    darkGray: '#333333',
};

export const GLOBAL_STYLES = {
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 10,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        marginTop: -10,
        marginBottom: 10,
    }
};

export const CRI_TYPES = {
    PROJET: 'projet',
    SERVICE: 'service',
};
