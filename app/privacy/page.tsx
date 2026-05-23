export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1.25rem', fontFamily: 'DM Sans, sans-serif', color: '#1a1a18', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: '1rem' }}>Politique de confidentialité</h1>
      <p style={{ color: '#888780', marginBottom: '2rem' }}>Dernière mise à jour : mai 2026</p>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: '1.5rem' }}>1. Données collectées</h2>
      <p>Suivi Tabac ne collecte aucune donnée personnelle. Toutes vos données (consommation journalière, notes, paramètres) sont stockées uniquement sur votre appareil via le stockage local (localStorage). Aucune donnée n'est envoyée vers nos serveurs.</p>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: '1.5rem' }}>2. Paiements</h2>
      <p>Les paiements pour la version Premium sont traités par Gumroad. Nous ne collectons ni ne stockons vos informations de paiement. Consultez la politique de confidentialité de Gumroad pour plus d'informations.</p>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: '1.5rem' }}>3. Partage des données</h2>
      <p>Nous ne partageons aucune donnée avec des tiers. Aucune publicité n'est affichée dans l'application.</p>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: '1.5rem' }}>4. Sécurité</h2>
      <p>Vos données restent sur votre appareil et ne transitent pas par internet. Vous pouvez les supprimer à tout moment depuis les paramètres de l'application.</p>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: '1.5rem' }}>5. Contact</h2>
      <p>Pour toute question : <a href="mailto:karabilamahmoud84@gmail.com" style={{ color: '#378ADD' }}>karabilamahmoud84@gmail.com</a></p>
    </main>
  )
}