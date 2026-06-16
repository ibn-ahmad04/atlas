<!DOCTYPE html>
<html>
<head>
    <title>Demande de vérification Agent</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Nouvelle demande de vérification</h2>
    <p>L'agent <strong>{{ $user->name }}</strong> a demandé à être certifié sur la plateforme Atlas.</p>
    <ul>
        <li><strong>Nom :</strong> {{ $user->name }}</li>
        <li><strong>Email :</strong> {{ $user->email }}</li>
        <li><strong>ID :</strong> {{ $user->id }}</li>
    </ul>
    <p>Veuillez le contacter à l'adresse <strong>{{ $user->email }}</strong> pour fixer un rendez-vous (visio ou présentiel) afin de valider son profil.</p>
    <p>Cordialement,<br>L'équipe technique Atlas</p>
</body>
</html>
