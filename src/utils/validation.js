import * as yup from 'yup';

const phoneRegExp = /^[0-9]{10}$/;

export const criProjetSchema = yup.object().shape({
    // Informations générales
    date_intervention: yup.date().required('La date est requise'),
    heure_debut: yup.date().required('L\'heure de début est requise'),
    heure_fin: yup.date().required('L\'heure de fin est requise'),

    // Informations client
    nom_client: yup.string().required('Le nom du client est requis'),
    site: yup.string().required('Le site est requis'),
    adresse: yup.string().required('L\'adresse est requise'),
    contact_client: yup.string().required('Le contact client est requis'),
    telephone_contact: yup.string().nullable().matches(phoneRegExp, { message: 'Numéro invalide (10 chiffres)', excludeEmptyString: true }),
    email_contact: yup.string().nullable().email('Email invalide'),

    // Informations projet
    nom_projet: yup.string().required('Le nom du projet est requis'),
    numero_projet: yup.string().nullable(),
    phase_projet: yup.string().required('La phase du projet est requise'),

    // Intervention
    type_intervention: yup.string().required('Le type d\'intervention est requis'),
    description_travaux: yup.string().required('La description est requise'),
    materiels_utilises: yup.string().nullable(),
    problemes_rencontres: yup.string().nullable(),
    solutions_apportees: yup.string().nullable(),

    // Suivi
    actions_a_realiser: yup.string().nullable(),
    prochaine_intervention: yup.date().nullable(),
    statut_projet: yup.string().required('Le statut est requis'),

    // Validation
    nom_technicien: yup.string().required('Le nom du technicien est requis'),
    signature_technicien: yup.string().required('La signature technicien est requise'),
});

export const criServiceSchema = yup.object().shape({
    // Informations générales
    date_intervention: yup.date().required('La date est requise'),
    heure_debut: yup.date().required('L\'heure de début est requise'),
    heure_fin: yup.date().required('L\'heure de fin est requise'),
    numero_ticket: yup.string().nullable(),

    // Informations client
    nom_client: yup.string().required('Le nom du client est requis'),
    site: yup.string().required('Le site est requis'),
    adresse: yup.string().required('L\'adresse est requise'),
    contact_client: yup.string().required('Le contact client est requis'),
    telephone_contact: yup.string().nullable().matches(phoneRegExp, { message: 'Numéro invalide (10 chiffres)', excludeEmptyString: true }),

    // Demande
    type_demande: yup.string().required('Le type de demande est requis'),
    priorite: yup.string().required('La priorité est requise'),
    description_demande: yup.string().required('La description est requise'),

    // Diagnostic
    diagnostic_realise: yup.string().required('Le diagnostic est requis'),
    cause_identifiee: yup.string().nullable(),

    // Intervention
    actions_effectuees: yup.string().required('Les actions effectuées sont requises'),
    pieces_remplacees: yup.string().nullable(),
    temps_intervention: yup.number().min(0, 'Doit être positif').required('Le temps est requis'),

    // Résultat
    statut_resolution: yup.string().required('Le statut est requis'),
    tests_effectues: yup.string().nullable(),
    recommandations: yup.string().nullable(),

    // Suivi
    intervention_supplementaire: yup.boolean().nullable(),
    date_suivi: yup.date().nullable().when('intervention_supplementaire', {
        is: true,
        then: (schema) => schema.required('Date de suivi requise'),
    }),
    commentaires_suivi: yup.string().nullable(),

    // Validation
    nom_technicien: yup.string().required('Le nom du technicien est requis'),
    signature_technicien: yup.string().required('La signature technicien est requise'),
    satisfaction_client: yup.string().nullable(),
});
