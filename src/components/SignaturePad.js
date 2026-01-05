import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native';
import Signature from 'react-native-signature-canvas';
import { COLORS } from '../utils/constants';

const SignaturePad = ({ signature, onSignatureChange, label, required }) => {
    const [showPad, setShowPad] = useState(false);
    const signatureRef = React.useRef();

    const handleSignature = (sig) => {
        onSignatureChange(sig);
        setShowPad(false);
    };

    const handleClear = () => {
        onSignatureChange(null);
    };

    const handleEmpty = () => {
        Alert.alert('Erreur', 'Veuillez signer avant de valider');
    };

    const handleConfirm = () => {
        if (signatureRef.current) {
            signatureRef.current.readSignature();
        }
    };

    const handleClearCanvas = () => {
        if (signatureRef.current) {
            signatureRef.current.clearSignature();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>

            {signature ? (
                <View style={styles.previewContainer}>
                    <Image
                        source={{ uri: signature }}
                        style={styles.signatureImage}
                        resizeMode="contain"
                    />
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.modifyButton} onPress={() => setShowPad(true)}>
                            <Text style={styles.modifyText}>Modifier</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                            <Text style={styles.clearText}>Effacer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.signButton}
                    onPress={() => setShowPad(true)}
                >
                    <Text style={styles.signButtonText}>Signer</Text>
                </TouchableOpacity>
            )}

            <Modal visible={showPad} animationType="slide" onRequestClose={() => setShowPad(false)}>
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowPad(false)}>
                            <Text style={styles.closeButton}>Annuler</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{label}</Text>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={styles.confirmButton}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.signatureContainer}>
                        <Signature
                            ref={signatureRef}
                            onOK={handleSignature}
                            onEmpty={handleEmpty}
                            descriptionText="Signez ci-dessous"
                            clearText="Effacer"
                            confirmText="Valider"
                            webStyle={`.m-signature-pad { box-shadow: none; border: none; } 
                         .m-signature-pad--body { border: none; }
                         .m-signature-pad--footer { display: none; }`}
                        />
                    </View>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.clearCanvasButton} onPress={handleClearCanvas}>
                            <Text style={styles.clearCanvasText}>Effacer la signature</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: COLORS.darkGray,
        marginBottom: 10,
        fontWeight: '500',
    },
    required: {
        color: COLORS.error,
    },
    previewContainer: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        padding: 10,
        backgroundColor: COLORS.white,
    },
    signatureImage: {
        width: '100%',
        height: 150,
        marginBottom: 10,
        backgroundColor: COLORS.lightGray,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modifyButton: {
        marginRight: 15,
        padding: 5,
    },
    modifyText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    clearButton: {
        padding: 5,
    },
    clearText: {
        color: COLORS.error,
        fontWeight: '600',
    },
    signButton: {
        backgroundColor: COLORS.lightGray,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: 8,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkGray,
    },
    closeButton: {
        color: COLORS.error,
        fontSize: 16,
    },
    signatureContainer: {
        flex: 1,
        padding: 10,
    },
    confirmButton: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalFooter: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray,
        alignItems: 'center',
    },
    clearCanvasButton: {
        padding: 10,
    },
    clearCanvasText: {
        color: COLORS.error,
        fontSize: 16,
    },
});

export default SignaturePad;
