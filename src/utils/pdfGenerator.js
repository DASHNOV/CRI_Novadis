import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { COLORS } from './constants';

const NOVADIS_LOGO_TEXT = "NOVADIS"; // Placeholder for logo

const convertUriToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return uri; // Return original URI if conversion fails, though it might not load
  }
};

const generateHTML = (criData) => {
  const isProjet = criData.type === 'projet';
  const title = isProjet ? "COMPTE RENDU D'INTERVENTION PROJET" : "COMPTE RENDU D'INTERVENTION SERVICE";

  // Format dates
  const dateIntervention = new Date(criData.date_intervention).toLocaleDateString('fr-FR');
  const heureDebut = new Date(criData.heure_debut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const heureFin = new Date(criData.heure_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid ${COLORS.primary}; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 30px; font-weight: bold; color: ${COLORS.primary}; }
        .title-box { text-align: right; }
        h1 { color: ${COLORS.primary}; font-size: 20px; margin: 0; }
        .cri-number { font-size: 14px; color: #666; margin-top: 5px; }
        
        .section { margin-bottom: 25px; page-break-inside: avoid; }
        .section-header { background-color: ${COLORS.primary}; color: white; padding: 8px 15px; font-size: 16px; font-weight: bold; margin-bottom: 15px; border-radius: 4px; }
        
        .row { display: flex; margin-bottom: 10px; }
        .col { flex: 1; padding-right: 10px; }
        .label { font-weight: bold; font-size: 12px; color: #555; display: block; margin-bottom: 3px; }
        .value { font-size: 14px; }
        
        .full-width { width: 100%; }
        .box { background-color: #f5f5f5; padding: 10px; border-radius: 4px; min-height: 40px; }
        
        .photos-container { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
        .photo { width: 150px; height: 150px; object-fit: cover; border: 1px solid #ddd; }
        
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; page-break-inside: avoid; }
        .signature-box { width: 45%; border: 1px solid #ccc; padding: 15px; text-align: center; height: 150px; display: flex; flex-direction: column; justify-content: space-between; }
        .signature-img { max-height: 80px; max-width: 100%; margin: 10px auto; }
        .sign-title { font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10px; display: block; }
        
        .footer { position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">${NOVADIS_LOGO_TEXT}</div>
        <div class="title-box">
          <h1>${title}</h1>
          <div class="cri-number">N° ${criData.numero_cri || 'Non défini'}</div>
          <div class="cri-number">Date: ${dateIntervention}</div>
        </div>
      </div>

      <!-- General Info -->
      <div class="section">
        <div class="section-header">INFORMATIONS GÉNÉRALES</div>
        <div class="row">
          <div class="col">
            <span class="label">Date</span>
            <span class="value">${dateIntervention}</span>
          </div>
          <div class="col">
            <span class="label">Heures</span>
            <span class="value">${heureDebut} - ${heureFin}</span>
          </div>
          ${isProjet ? `
          <div class="col">
            <span class="label">Statut Projet</span>
            <span class="value">${criData.statut_projet}</span>
          </div>
          ` : `
          <div class="col">
            <span class="label">Ticket</span>
            <span class="value">${criData.numero_ticket || '-'}</span>
          </div>
          `}
        </div>
      </div>

      <!-- Client Info -->
      <div class="section">
        <div class="section-header">CLIENT</div>
        <div class="row">
          <div class="col">
            <span class="label">Client</span>
            <span class="value">${criData.nom_client}</span>
          </div>
          <div class="col">
            <span class="label">Site</span>
            <span class="value">${criData.site}</span>
          </div>
        </div>
        <div class="row">
          <div class="col full-width">
            <span class="label">Adresse</span>
            <span class="value">${criData.adresse}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <span class="label">Contact</span>
            <span class="value">${criData.contact_client}</span>
          </div>
          <div class="col">
            <span class="label">Téléphone</span>
            <span class="value">${criData.telephone_contact || '-'}</span>
          </div>
        </div>
      </div>

      ${isProjet ? `
      <!-- Projet Info -->
      <div class="section">
        <div class="section-header">PROJET</div>
        <div class="row">
          <div class="col">
            <span class="label">Nom Projet</span>
            <span class="value">${criData.nom_projet}</span>
          </div>
          <div class="col">
            <span class="label">N° Projet</span>
            <span class="value">${criData.numero_projet || '-'}</span>
          </div>
          <div class="col">
            <span class="label">Phase</span>
            <span class="value">${criData.phase_projet}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">INTERVENTION</div>
        <div class="row">
           <div class="col">
            <span class="label">Type</span>
            <span class="value">${criData.type_intervention}</span>
          </div>
        </div>
        <div class="row">
          <div class="col full-width">
            <span class="label">Description des travaux</span>
            <div class="value box">${(criData.description_travaux || '').replace(/\n/g, '<br>')}</div>
          </div>
        </div>
         <div class="row">
          <div class="col full-width">
            <span class="label">Matériels utilisés</span>
             <div class="value box">${(criData.materiels_utilises || '-').replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">SUIVI</div>
         <div class="row">
          <div class="col full-width">
            <span class="label">Actions à réaliser</span>
             <div class="value box">${(criData.actions_a_realiser || '-').replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      </div>
      ` : `
      <!-- Service Info -->
      <div class="section">
        <div class="section-header">DEMANDE</div>
        <div class="row">
          <div class="col">
            <span class="label">Type</span>
            <span class="value">${criData.type_demande}</span>
          </div>
          <div class="col">
            <span class="label">Priorité</span>
            <span class="value">${criData.priorite}</span>
          </div>
        </div>
        <div class="row">
          <div class="col full-width">
            <span class="label">Description</span>
            <div class="value box">${(criData.description_demande || '').replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">INTERVENTION</div>
        <div class="row">
          <div class="col full-width">
            <span class="label">Diagnostic</span>
            <div class="value box">${(criData.diagnostic_realise || '').replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="row">
          <div class="col full-width">
            <span class="label">Actions effectuées</span>
            <div class="value box">${(criData.actions_effectuees || '').replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="row">
           <div class="col">
            <span class="label">Temps passé</span>
            <span class="value">${criData.temps_intervention} h</span>
          </div>
           <div class="col">
            <span class="label">Résultat</span>
            <span class="value">${criData.statut_resolution}</span>
          </div>
        </div>
      </div>
      `}

      <!-- Photos -->
      ${criData.photos && criData.photos.length > 0 ? `
      <div class="section">
        <div class="section-header">PHOTOS</div>
        <div class="photos-container">
          ${criData.photos.map(p => `<img src="${p.uri}" class="photo" />`).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Signatures -->
      <div class="signatures">
        <div class="signature-box">
          <span class="sign-title">Technicien</span>
          ${criData.signature_technicien ? `<img src="${criData.signature_technicien}" class="signature-img" />` : ''}
          <div class="value">${criData.nom_technicien}</div>
        </div>
        <div class="signature-box">
          <span class="sign-title">Client</span>
           ${criData.signature_client ? `<img src="${criData.signature_client}" class="signature-img" />` : ''}
           ${criData.satisfaction_client ? `<div class="value" style="margin-top:5px; font-size:12px;">Satisfaction: ${criData.satisfaction_client}</div>` : ''}
        </div>
      </div>

      <div class="footer">
        Novadis CRI - Document généré automatiquement
      </div>
    </body>
    </html>
  `;
};

export const generatePDF = async (criData) => {
  try {
    // Deep copy to avoid mutating original objects
    const minimalData = JSON.parse(JSON.stringify(criData));

    // Convert Photos to Base64
    if (minimalData.photos && minimalData.photos.length > 0) {
      const processedPhotos = await Promise.all(minimalData.photos.map(async (p) => {
        const base64Uri = await convertUriToBase64(p.uri);
        return { ...p, uri: base64Uri };
      }));
      minimalData.photos = processedPhotos;
    }

    // Signatures are already base64 from the signature pad component usually, 
    // but if they were file URIs they would need conversion too. 
    // Assuming SignaturePad returns base64 data URIs directly.

    const html = generateHTML(minimalData);
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });

    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    return uri;
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    return null;
  }
};
