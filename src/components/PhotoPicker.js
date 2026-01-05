import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

const PhotoPicker = ({ photos = [], onPhotosChange, maxPhotos = 5, required, label }) => {

    const pickImage = async () => {
        if (photos.length >= maxPhotos) {
            Alert.alert('Limite atteinte', `Vous ne pouvez ajouter que ${maxPhotos} photos.`);
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission refusée', 'L\'accès à la galerie est nécessaire pour ajouter des photos.');
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false, // Changed to false to allow multiple selection logic or just simple fit
                quality: 0.8,
                // allowsMultipleSelection: true, // Expo Image Picker 14+ supports this
                // selectionLimit: maxPhotos - photos.length,
            });

            if (!result.canceled) {
                // If multiple selection is enabled in future, handle result.assets array
                // For now take assets[0]
                const newPhoto = result.assets[0];
                onPhotosChange([...photos, newPhoto]);
            }
        } catch (error) {
            console.log('Error picking image: ', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de la photo.');
        }
    };

    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        onPhotosChange(newPhotos);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label || "Photos"} ({photos.length}/{maxPhotos})
                {required && <Text style={styles.required}> *</Text>}
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
                {photos.map((photo, index) => (
                    <View key={index} style={styles.photoWrapper}>
                        <Image source={{ uri: photo.uri }} style={styles.photo} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removePhoto(index)}
                        >
                            <Ionicons name="close-circle" size={24} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                ))}

                {photos.length < maxPhotos && (
                    <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                        <Ionicons name="camera-outline" size={32} color={COLORS.primary} />
                        <Text style={styles.addText}>Ajouter</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
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
    scrollContainer: {
        flexDirection: 'row',
    },
    photoWrapper: {
        marginRight: 10,
        position: 'relative',
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    removeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: COLORS.white,
        borderRadius: 12,
    },
    addButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
    },
    addText: {
        color: COLORS.primary,
        fontSize: 12,
        marginTop: 5,
    },
});

export default PhotoPicker;
