import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform, Button, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { COLORS, GLOBAL_STYLES } from '../utils/constants';
import {
    FormInput,
    FormSelect,
    FormTextArea,
    PhotoPicker,
    SignaturePad,
    FormDatePicker
} from '../components';
import { criProjetSchema } from '../utils/validation';
import { saveCRI, generateCRINumber } from '../utils/storage';
import { generatePDF } from '../utils/pdfGenerator';

const CRIProjetScreen = ({ navigation }) => {
    const [photos, setPhotos] = useState([]);
    const [techSignature, setTechSignature] = useState(null);
    const [clientSignature, setClientSignature] = useState(null);

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(criProjetSchema),
        defaultValues: {
            date_intervention: new Date(),
            heure_debut: new Date(),
            heure_fin: new Date(),
            type_intervention: 'Installation matériel',
            phase_projet: 'Installation',
            statut_projet: 'En cours',
            numero_cri: '',
        }
    });

    useEffect(() => {
        const loadNumber = async () => {
            const num = await generateCRINumber('projet');
            setValue('numero_cri', num);
        };
        loadNumber();
    }, [setValue]);

    const onSubmit = async (data) => {
        // Basic validation for specialized fields managed outside hook form if needed
        // But here we synced signature via setValue? No, we need to sync manually or use effect.
        // Actually best practice is to register them or handle manually.
        // I added required check in schema for signatures.
        // So I must setValue them.

        if (photos.length > 5) {
            Alert.alert('Erreur', 'Maximum 5 photos autorisées.');
            return;
        }

        const formData = {
            ...data,
            photos,
            signature_technicien: techSignature,
            signature_client: clientSignature,
            type: 'projet'
        };

        console.log('Form Data:', formData);

        const success = await saveCRI(formData);
        if (success) {
            Alert.alert('Succès', 'CRI Projet sauvegardé avec succès', [
                {
                    text: 'Générer PDF', onPress: () => {
                        generatePDF(formData).then(() => navigation.goBack());
                    }
                },
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Erreur', 'Impossible de sauvegarder le CRI');
        }
    };

    // Sync custom components with form state
    const handleTechSigChange = (sig) => {
        setTechSignature(sig);
        setValue('signature_technicien', sig, { shouldValidate: true });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={GLOBAL_STYLES.container}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={GLOBAL_STYLES.title}>CRI Projet</Text>

                {/* Section 1: Général */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Générales</Text>
                    <Controller
                        control={control}
                        name="date_intervention"
                        render={({ field: { onChange, value } }) => (
                            <FormDatePicker label="Date d'intervention" value={value} onChange={onChange} required error={errors.date_intervention?.message} />
                        )}
                    />
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Controller
                                control={control}
                                name="heure_debut"
                                render={({ field: { onChange, value } }) => (
                                    <FormDatePicker label="Heure début" value={value} onChange={onChange} mode="time" required error={errors.heure_debut?.message} />
                                )}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Controller
                                control={control}
                                name="heure_fin"
                                render={({ field: { onChange, value } }) => (
                                    <FormDatePicker label="Heure fin" value={value} onChange={onChange} mode="time" required error={errors.heure_fin?.message} />
                                )}
                            />
                        </View>
                    </View>
                </View>

                {/* Section 2: Client */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Client</Text>
                    <Controller
                        control={control}
                        name="nom_client"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Nom du client" value={value} onChangeText={onChange} required error={errors.nom_client?.message} placeholder="Ex: Entreprise ABC" />
                        )}
                    />
                    <Controller
                        control={control}
                        name="site"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Site" value={value} onChangeText={onChange} required error={errors.site?.message} placeholder="Ex: Siège social Paris" />
                        )}
                    />
                    <Controller
                        control={control}
                        name="adresse"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Adresse" value={value} onChangeText={onChange} required error={errors.adresse?.message} />
                        )}
                    />
                    <Controller
                        control={control}
                        name="contact_client"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Contact client" value={value} onChangeText={onChange} required error={errors.contact_client?.message} placeholder="Nom et prénom" />
                        )}
                    />
                    <Controller
                        control={control}
                        name="telephone_contact"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Téléphone" value={value} onChangeText={onChange} keyboardType="phone-pad" error={errors.telephone_contact?.message} placeholder="XX XX XX XX XX" />
                        )}
                    />
                    <Controller
                        control={control}
                        name="email_contact"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Email" value={value} onChangeText={onChange} keyboardType="email-address" error={errors.email_contact?.message} />
                        )}
                    />
                </View>

                {/* Section 3: Projet */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Projet</Text>
                    <Controller
                        control={control}
                        name="nom_projet"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Nom du projet" value={value} onChangeText={onChange} required error={errors.nom_projet?.message} placeholder="Ex: Migration serveurs" />
                        )}
                    />
                    <Controller
                        control={control}
                        name="numero_projet"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Numéro de projet" value={value} onChangeText={onChange} placeholder="Ex: PRJ-2024-001" />
                        )}
                    />
                    <Controller
                        control={control}
                        name="phase_projet"
                        render={({ field: { onChange, value } }) => (
                            <FormSelect
                                label="Phase du projet"
                                value={value}
                                onValueChange={onChange}
                                required
                                error={errors.phase_projet?.message}
                                options={["Étude", "Installation", "Configuration", "Tests", "Mise en production", "Clôture"]}
                            />
                        )}
                    />
                </View>

                {/* Section 4: Intervention */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Intervention</Text>
                    <Controller
                        control={control}
                        name="type_intervention"
                        render={({ field: { onChange, value } }) => (
                            <FormSelect
                                label="Type d'intervention"
                                value={value}
                                onValueChange={onChange}
                                required
                                error={errors.type_intervention?.message}
                                options={["Installation matériel", "Configuration", "Mise à jour", "Formation", "Audit", "Autre"]}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="description_travaux"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Description des travaux" value={value} onChangeText={onChange} required error={errors.description_travaux?.message} rows={6} placeholder="Détaillez les actions..." />
                        )}
                    />
                    <Controller
                        control={control}
                        name="materiels_utilises"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Matériels utilisés" value={value} onChangeText={onChange} rows={4} />
                        )}
                    />
                    <Controller
                        control={control}
                        name="problemes_rencontres"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Problèmes rencontrés" value={value} onChangeText={onChange} rows={4} />
                        )}
                    />
                    <Controller
                        control={control}
                        name="solutions_apportees"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Solutions apportées" value={value} onChangeText={onChange} rows={4} />
                        )}
                    />
                </View>

                {/* Section 5: Suivi */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Suivi</Text>
                    <Controller
                        control={control}
                        name="actions_a_realiser"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Actions à réaliser" value={value} onChangeText={onChange} rows={4} />
                        )}
                    />
                    <Controller
                        control={control}
                        name="prochaine_intervention"
                        render={({ field: { onChange, value } }) => (
                            <FormDatePicker label="Prochaine intervention" value={value} onChange={onChange} />
                        )}
                    />
                    <Controller
                        control={control}
                        name="statut_projet"
                        render={({ field: { onChange, value } }) => (
                            <FormSelect
                                label="Statut du projet"
                                value={value}
                                onValueChange={onChange}
                                required
                                error={errors.statut_projet?.message}
                                options={["En cours", "En attente validation", "Terminé", "Suspendu"]}
                            />
                        )}
                    />
                </View>

                {/* Section 6: Validation */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Validation</Text>
                    <PhotoPicker photos={photos} onPhotosChange={setPhotos} maxPhotos={5} />

                    <Controller
                        control={control}
                        name="nom_technicien"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Nom du technicien" value={value} onChangeText={onChange} required error={errors.nom_technicien?.message} />
                        )}
                    />

                    <SignaturePad
                        label="Signature Technicien"
                        signature={techSignature}
                        onSignatureChange={handleTechSigChange}
                        required
                    />
                    {errors.signature_technicien && <Text style={styles.errorText}>La signature est requise</Text>}

                    <SignaturePad
                        label="Signature Client"
                        signature={clientSignature}
                        onSignatureChange={setClientSignature}
                    />

                    <Controller
                        control={control}
                        name="commentaires_client"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Commentaires client" value={value} onChangeText={onChange} rows={3} />
                        )}
                    />
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                        <Text style={styles.submitButtonText}>Enregistrer le CRI</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 30,
        backgroundColor: COLORS.lightGray,
        padding: 15,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    submitButton: {
        backgroundColor: COLORS.success,
        padding: 18,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 5,
    },
});

export default CRIProjetScreen;
