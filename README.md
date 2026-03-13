# StayFloow.com - Plateforme de Réservation en Afrique

Ceci est l'application officielle de StayFloow.com, construite avec NextJS, React, et Firebase.

## Configuration du Domaine (Cloudflare)
Pour que le site fonctionne sur https://www.stayfloow.com, configurez vos enregistrements DNS dans Cloudflare comme suit (Proxy : **Gris / DNS Only**) :

### Records DNS Actuels (Dernière Mise à jour Firebase)

| Type | Nom | Valeur / Cible | Note |
| :--- | :--- | :--- | :--- |
| **A** | `www` | `35.219.200.6` | IP Firebase App Hosting |
| **TXT** | `www` | `fah-claim=002-02-203fc86a-2c35-42bf-a3a2-e11642fd1763` | Validation de propriété |
| **CNAME** | `_acme-challenge_ch6d4t7ytio3ccze` | `8ab470c1-fa77-4130-a395-84ab396ec8be.16.authorize.certificatemanager.goog.` | Certificat SSL (HTTPS) |

### Étapes à suivre :
1. Supprimez tout ancien record CNAME `www`.
2. Ajoutez le record **A** pour `www`.
3. Ajoutez le record **TXT** pour `www`.
4. Ajoutez le record **CNAME** pour le challenge SSL.
5. Cliquez sur **"Valider les enregistrements"** dans la console Firebase.

## Fonctionnalités
- Réservation d'hébergements (Hôtels, Riads, Villas)
- Location de voitures avec synchronisation des dates de recherche
- Circuits touristiques en Algérie et Égypte
- Support client assisté par Intelligence Artificielle (Genkit)
- Portail Partenaire pour la gestion des annonces
