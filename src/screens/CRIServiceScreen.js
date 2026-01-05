import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
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
import { criServiceSchema } from '../utils/validation';
import { saveCRI, generateCRINumber } from '../utils/storage';
import { generatePDF } from '../utils/pdfGenerator';

const CRIServiceScreen = ({ navigation }) => {
    const [photos, setPhotos] = useState([]);
    const [techSignature, setTechSignature] = useState(null);
    const [clientSignature, setClientSignature] = useState(null);

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(criServiceSchema),
        defaultValues: {
            date_intervention: new Date(),
            heure_debut: new Date(),
            heure_fin: new Date(),
            type_demande: 'Maintenance corrective',
            priorite: 'Normale',
            statut_resolution: 'Résolu',
            intervention_supplementaire: false,
            temps_intervention: 0,
            numero_cri: '',
        }
    });

    useEffect(() => {
        const loadNumber = async () => {
            const num = await generateCRINumber('service');
            setValue('numero_cri', num);
        };
        loadNumber();
    }, [setValue]);

    const interventionSupp = watch('intervention_supplementaire');

    // Auto calculate time
    const heureDebut = watch('heure_debut');
    const heureFin = watch('heure_fin');

    useEffect(() => {
        if (heureDebut && heureFin) {
            const diff = (heureFin - heureDebut) / (1000 * 60 * 60); // hours
            const roundedDiff = Math.max(0, Math.round(diff * 2) / 2); // round to 0.5
            setValue('temps_intervention', roundedDiff);
        }
    }, [heureDebut, heureFin, setValue]);


    const onSubmit = async (data) => {
        if (photos.length > 5) {
            Alert.alert('Erreur', 'Maximum 5 photos autorisées.');
            return;
        }

        const formData = {
            ...data,
            photos,
            signature_technicien: techSignature,
            signature_client: clientSignature,
            type: 'service'
        };

        console.log('Form Data:', formData);

        const success = await saveCRI(formData);
        if (success) {
            Alert.alert('Succès', 'CRI Service sauvegardé avec succès', [
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
                <Text style={GLOBAL_STYLES.title}>CRI Service</Text>

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
                    <Controller
                        control={control}
                        name="numero_ticket"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Numéro de ticket" value={value} onChangeText={onChange} placeholder="Ex: TICK-2024-12345" />
                        )}
                    />
                </View>

                {/* Section 2: Client */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Client</Text>
                    <Controller
                        control={control}
                        name="nom_client"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Nom du client" value={value} onChangeText={onChange} required error={errors.nom_client?.message} />
                        )}
                    />
                    <Controller
                        control={control}
                        name="site"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Site" value={value} onChangeText={onChange} required error={errors.site?.message} />
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
                            <FormInput label="Contact client" value={value} onChangeText={onChange} required error={errors.contact_client?.message} />
                        )}
                    />
                    <Controller
                        control={control}
                        name="telephone_contact"
                        render={({ field: { onChange, value } }) => (
                            <FormInput label="Téléphone" value={value} onChangeText={onChange} keyboardType="phone-pad" error={errors.telephone_contact?.message} />
                        )}
                    />
                </View>

                {/* Section 3: Demande */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Demande</Text>
                    <Controller
                        control={control}
                        name="type_demande"
                        render={({ field: { onChange, value } }) => (
                            <FormSelect
                                label="Type de demande"
                                value={value}
                                onValueChange={onChange}
                                required
                                error={errors.type_demande?.message}
                                options={["Maintenance préventive", "Maintenance corrective", "Dépannage", "Support technique", "Assistance utilisateur", "Autre"]}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="priorite"
                        render={({ field: { onChange, value } }) => (
                            <FormSelect
                                label="Priorité"
                                value={value}
                                onValueChange={onChange}
                                required
                                error={errors.priorite?.message}
                                options={["Basse", "Normale", "Haute", "Critique"]}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="description_demande"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Description demande" value={value} onChangeText={onChange} required error={errors.description_demande?.message} rows={4} placeholder="Décrivez le problème..." />
                        )}
                    />
                </View>

                {/* Section 4: Diagnostic */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Diagnostic</Text>
                    <Controller
                        control={control}
                        name="diagnostic_realise"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Diagnostic réalisé" value={value} onChangeText={onChange} required error={errors.diagnostic_realise?.message} rows={5} placeholder="Analyse du problème..." />
                        )}
                    />
                    <Controller
                        control={control}
                        name="cause_identifiee"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Cause identifiée" value={value} onChangeText={onChange} rows={3} placeholder="Origine du problème..." />
                        )}
                    />
                </View>

                {/* Section 5: Intervention */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Intervention</Text>
                    <Controller
                        control={control}
                        name="actions_effectuees"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Actions effectuées" value={value} onChangeText={onChange} required error={errors.actions_effectuees?.message} rows={6} placeholder="Détaillez les actions..." />
                        )}
                    />
                    <Controller
                        control={control}
                        name="pieces_remplacees"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Pièces remplacées" value={value} onChangeText={onChange} rows={3} placeholder="Liste des pièces..." />
                        )}
                    />
                    <Controller
                        control={control}
                        name="temps_intervention"
                        render={({ field: { onChange, value } }) => (
                            <FormInput
                                label="Temps d'intervention (h)"
                                value={String(value)}
                                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                                keyboardType="numeric"
                                required
                                error={errors.temps_intervention?.message}
                            />
                        )}
                    />
                </View>

                {/* Section 6: Résultat */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Résultat</Text>
                    <Controller
                        control={control}
                        name="statut_resolution"
                        render={({ field: { onChange, value } }) => (
                            <FormSelect
                                label="Statut de résolution"
                                value={value}
                                onValueChange={onChange}
                                required
                                error={errors.statut_resolution?.message}
                                options={["Résolu", "Partiellement résolu", "Non résolu", "En attente pièces", "Escaladé niveau 2"]}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="tests_effectues"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Tests effectués" value={value} onChangeText={onChange} rows={3} />
                        )}
                    />
                    <Controller
                        control={control}
                        name="recommandations"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Recommandations" value={value} onChangeText={onChange} rows={4} />
                        )}
                    />
                </View>

                {/* Section 7: Suivi */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Suivi</Text>
                    {/* Checkbox implementation using TouchableOpacity for simplicity or switch */}
                    <Controller
                        control={control}
                        name="intervention_supplementaire"
                        render={({ field: { onChange, value } }) => (
                            <View style={[styles.inputContainer, styles.checkboxContainer]}>
                                <Text style={styles.label}>Intervention supplémentaire nécessaire ?</Text>
                                <TouchableOpacity onPress={() => onChange(!value)} style={[styles.checkbox, value && styles.checkboxChecked]}>
                                    {value && <Text style={styles.checkboxText}>✓</Text>}
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    {interventionSupp && (
                        <Controller
                            control={control}
                            name="date_suivi"
                            render={({ field: { onChange, value } }) => (
                                <FormDatePicker label="Date de suivi prévue" value={value} onChange={onChange} required error={errors.date_suivi?.message} />
                            )}
                        />
                    )}

                    <Controller
                        control={control}
                        name="commentaires_suivi"
                        render={({ field: { onChange, value } }) => (
                            <FormTextArea label="Commentaires de suivi" value={value} onChangeText={onChange} rows={3} />
                        )}
                    />
                </View>

                {/* Section 8: Validation */}
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
                        name="satisfaction_client"
                        render={({ field: { onChange, value } }) => (
                            <FormSelect
                                label="Satisfaction client"
                                value={value}
                                onValueChange={onChange}
                                options={["Très satisfait", "Satisfait", "Neutre", "Insatisfait", "Très insatisfait"]}
                            />
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
    inputContainer: {
        marginBottom: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    checkbox: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
    },
    checkboxText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
});

export default CRIServiceScreen;
